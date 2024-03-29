import React from 'react'
import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from './utils'

import { hashString } from './utils'
import { getSlideInfo } from './staticAnalysis'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
  generatePath,
  useRouteMatch,
  useHistory
} from 'react-router-dom'

import { CitationProvider } from './Citations'
import AnimationEditor from './AnimationEditor'
import { Show } from './animations'

import { range, usePrevious } from './utils'

export function RenderPresentation({ children, bibUrl, renderSlide }) {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Redirect to='/0/0' />
        </Route>
        <Route exact path='/storage'>
          <Storage />
        </Route>

        <Route path='/overview'>
          <PresentationOverview renderSlide={renderSlide} bibUrl={bibUrl}>
            {children}
          </PresentationOverview>
        </Route>
        <Route path='/:slideIndex/:stepIndex' exact={false}>
          <PresentationUI renderSlide={renderSlide} bibUrl={bibUrl}>
            {children}
          </PresentationUI>
        </Route>
      </Switch>
    </Router>
  )
}

export const PresentationContext = React.createContext(null)

function PresentationUI({ children, renderSlide, bibUrl }) {
  const reactSlides = React.Children.toArray(children)
  const { slideInfo, citationMap } = useMemo(() => getSlideInfo(children), [
    children
  ])

  const match = useRouteMatch()
  const history = useHistory()

  let { slideIndex = 0, stepIndex = 0 } = useParams()
  slideIndex = parseInt(slideIndex)
  stepIndex = parseInt(stepIndex)

  const [transitions, setTransitions] = useState({})
  const [fullScreen, setFullScreen] = useState(false)

  const setSlideAndStep = (slideIndex, stepIndex) => {
    history.push(generatePath(match.path, { slideIndex, stepIndex }))
  }

  const prev = useCallback(
    (dontStepButGoToPrevSlide) => {
      if (dontStepButGoToPrevSlide) {
        if (slideIndex > 0) {
          setSlideAndStep(slideIndex - 1, 0)
        }
        return
      }
      if (stepIndex > 0) {
        setSlideAndStep(slideIndex, stepIndex - 1)
        return
      }
      if (slideIndex > 0) {
        setSlideAndStep(
          slideIndex - 1,
          slideInfo[slideIndex - 1].steps.length - 1
        )
      }
    },
    [slideIndex, stepIndex, setSlideAndStep]
  )

  const next = useCallback(
    (dontStepButGoToNextSlide) => {
      if (dontStepButGoToNextSlide) {
        if (slideIndex < slideInfo.length - 1) {
          setSlideAndStep(slideIndex + 1, 0)
        }
        return
      }
      if (stepIndex < slideInfo[slideIndex].steps.length - 1) {
        setSlideAndStep(slideIndex, stepIndex + 1)
        return
      }
      if (slideIndex < slideInfo.length - 1) {
        setSlideAndStep(slideIndex + 1, 0)
      }
    },
    [slideIndex, stepIndex, setSlideAndStep]
  )

  const handleKey = useCallback(
    (e) => {
      if (e.key == 'ArrowDown') {
        next(true)
      }
      if (e.key == 'ArrowUp') {
        prev(true)
      }

      if (e.key == 'PageDown' || e.key == 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key == 'PageUp' || e.key == 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key == '.') {
        e.preventDefault()
        setFullScreen((f) => !f)
      }
    },
    [next, prev, stepIndex, slideIndex]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [handleKey])

  if (slideIndex > slideInfo.length) {
    return <div>Too high slide number!</div>
  }
  return (
    <div>
      <CitationProvider citationMap={citationMap} bibUrl={bibUrl}>
        {renderSlide({
          fullScreen,
          slideInfo,
          info: slideInfo[slideIndex].info,
          slideIndex,
          stepIndex,
          numSlides: reactSlides.length,
          slides: reactSlides.map((slide, i) => {
            return (
              <PresentationContext.Provider
                key={i}
                value={{
                  i,
                  slideIndex,
                  infos: slideInfo.map((i) => i.info),
                  info: slideInfo[i].info,
                  setTransitions,
                  stepIndex:
                    i === slideIndex
                      ? stepIndex
                      : i < slideIndex && slideInfo[i].steps.length
                      ? slideInfo[i].steps.length - 1
                      : 0,
                  numSlides: reactSlides.length,
                  transition: transitions[i]
                }}
              >
                {slide}
              </PresentationContext.Provider>
            )
          })
        })}
        <div>{slideInfo[slideIndex].presenterNotes}</div>
        <AnimationEditor animations={slideInfo[slideIndex].animations} />
      </CitationProvider>
    </div>
  )
}

function PresentationOverview({ children, renderSlide, bibUrl }) {
  const reactSlides = React.Children.toArray(children)
  const { slideInfo, citationMap } = useMemo(() => getSlideInfo(children), [
    children
  ])

  // console.log(citationMap);
  // TODO: find better name
  return (
    <div>
      <CitationProvider citationMap={citationMap} bibUrl={bibUrl}>
        {slideInfo.flatMap((info, slideIndex) => {
          return info.steps.map((step, stepIndex) => {
            return renderSlide({
              fullScreen: false,
              info: info.info,
              // todo: renderSlide picks slides[slideIndex], but also uses slideIndex to show the slide number ...
              slideIndex: 0,
              stepIndex,
              numSlides: reactSlides.length,
              slides: [
                <PresentationContext.Provider
                  value={{
                    infos: slideInfo.map((i) => i.info),
                    info: info.info,
                    i: slideIndex,
                    slideIndex,
                    stepIndex: stepIndex,
                    numSlides: reactSlides.length,
                    setTransitions: () => null,
                    transition: {}
                  }}
                >
                  {reactSlides[slideIndex]}
                </PresentationContext.Provider>
              ]
            })
          })
        })}
      </CitationProvider>
    </div>
  )
}

// Add timeline ={{ ... }} shorthand
export function RenderSlide({ children, steps = [], render }) {
  const TIMING = 0.5
  const { stepIndex, info, i, slideIndex, transition } = useContext(
    PresentationContext
  )

  const [style, setStyle] = useState({
    transition: `${TIMING}s transform, ${TIMING}s opacity`,
    transform: 'scale(1) translate3d(0px, 0px, 0px)',
    opacity: 0
  })

  const updateStyle = (style) => setStyle((s) => ({ ...s, ...style }))

  // delay rendering
  // const [shouldRender, setRender] = useState(false)
  // useEffect(() => {
  //   setTimeout(() => setRender(true), 500)
  // }, [])

  useEffect(() => {
    const {
      after = {
        transform: `translate3d(-100%, 0px, 0px)`,
        opacity: 0,
        zIndex: 0
      },
      before = {
        transform: `translate3d(100%, 0px, 0px)`,
        opacity: 0,
        zIndex: 0
      }
    } = transition || {}

    if (i > slideIndex) {
      updateStyle({ ...before })
    }
    if (i < slideIndex) {
      updateStyle({ ...after })
    }
    if (i == slideIndex) {
      updateStyle({
        zIndex: 10,
        opacity: 1,
        transform: `scale(1) translate3d(0px,0px,0px)`
      })
    }
  }, [slideIndex, i, transition])

  // if (shouldRender) {
  const content =
    children && (children.call ? children(steps[stepIndex]) : children)
  return render({ info, content, i, slideIndex, style })
  // }
  // return render({info, content: <div />, i, slideIndex, style});
}

function Storage() {
  return (
    <pre
      style={{
        whiteSpace: 'break-spaces'
      }}
    >
      {localStorage.animationGroups}
    </pre>
  )
}
