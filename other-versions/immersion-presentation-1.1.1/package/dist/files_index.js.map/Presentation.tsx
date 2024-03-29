import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  useLayoutEffect
} from 'react'

import { getSlidesInfo, SlidesInfo } from './staticAnalysis'

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
import { LaTeX, fetchLaTeXSvg } from './utils'

type PresentationRenderFunction = (arg: {
  slideIndex: number
  stepIndex: number
  slidesInfo: SlidesInfo
  slides: React.ReactChild[]
}) => React.ReactNode

export interface PresentationProps {
  children: React.ReactNode
  bibUrl?: string
  compileHost?: string
  preamble?: string
}

interface InternalPresentationProps extends PresentationProps {
  render: PresentationRenderFunction
  presenter?: boolean
  fullscreen?: boolean
}

/* global localStorage */
export function RenderPresentation({
  children,
  ...props
}: InternalPresentationProps): React.ReactElement {
  return (
    <Router>
      <Switch>
        <Route exact path='/storage'>
          <Storage />
        </Route>

        <Route path='/presenter/:slideIndex?/:stepIndex?'>
          <PresentationUI presenter {...props}>
            {children}
          </PresentationUI>
        </Route>
        <Route path='/fullscreen/:slideIndex?/:stepIndex?'>
          <PresentationUI fullscreen {...props}>
            {children}
          </PresentationUI>
        </Route>
        <Route path='/overview'>
          <PresentationOverview {...props}>{children}</PresentationOverview>
        </Route>
        <Route path='/:slideIndex?/:stepIndex?' exact={false}>
          <PresentationUI {...props}>{children}</PresentationUI>
        </Route>
      </Switch>
    </Router>
  )
}

export const PresentationContext = React.createContext<PresentationContextInterface | null>(
  null
)

export interface PresentationContextInterface {
  slideIndex: number
  stepIndex: number
  i: number
  slidesInfo: SlidesInfo
  setTransitions: (arg: any) => void
  transition: Transition
}

type RouteParams = { slideIndex: string; stepIndex: string }

type Transition = {
  before?: React.CSSProperties
  after?: React.CSSProperties
}

export type Transitions = {
  [key: number]: Transition
}

function PresentationUI({
  children,
  render,
  bibUrl,
  preamble = '',
  compileHost = '',
  presenter,
  fullscreen
}: InternalPresentationProps) {
  const reactSlides = React.Children.toArray(children) as React.ReactElement[]
  const { slidesInfo, citationMap } = useMemo(
    () => getSlidesInfo(reactSlides),
    [children]
  )

  // TODO: this is used multiple times.
  // Extract this.
  useLayoutEffect(() => {
    LaTeX.setPreamble(preamble)
    if (compileHost) {
      console.log('setting host to', compileHost)
      LaTeX.setHost(compileHost)
    }

    // TODO: only in non-dev mode
    /* console.log('COMPILING ALL TEX')
    const latex = Array.from(
      new Set(slidesInfo.flatMap((slide) => slide.allLaTeX))
    )
    const allStart = Date.now()
    Promise.all(
      latex.map(async (tex, i) => {
        const start = Date.now()
        await fetchLaTeXSvg(tex)
        const end = Date.now()
        const seconds = (end - start) / 1000
        console.log(`[${i + 1}/${latex.length}] compiled ${tex} (${seconds})`)
        return seconds
      })
    ).then((seconds) => {
      const allEnd = Date.now()
      const mean = seconds.reduce((a, b) => a + b, 0) / seconds.length
      console.log(
        'Done with compilation. Mean time:',
        mean,
        'Total time: ',
        (allEnd - allStart) / 1000
      )
      }) */
  }, [preamble, compileHost])

  const match = useRouteMatch()
  const history = useHistory()

  const {
    slideIndex: slideIndexString = '0',
    stepIndex: stepIndexString = '0'
  } = useParams<RouteParams>()
  const slideIndex = parseInt(slideIndexString)
  const stepIndex = parseInt(stepIndexString)

  const [transitions, setTransitions] = useState<Transitions>({})

  const bc = useMemo(() => new BroadcastChannel('presentation'), [])
  bc.onmessage = useCallback((event) => {
    setSlideAndStep(event.data.slideIndex, event.data.stepIndex, false)
  }, [])

  const setSlideAndStep = (
    slideIndex: number,
    stepIndex: number,
    notify = true
  ) => {
    history.push(generatePath(match.path, { slideIndex, stepIndex }))
    if (notify) {
      bc.postMessage({ slideIndex, stepIndex })
    }
  }

  const getNext = (slideIndex: number, stepIndex: number): [number, number] => {
    if (stepIndex < slidesInfo[slideIndex].steps.length - 1) {
      return [slideIndex, stepIndex + 1]
    }
    if (slideIndex < slidesInfo.length - 1) {
      return [slideIndex + 1, 0]
    }
    return [slideIndex, stepIndex]
  }

  const getPrev = (slideIndex: number, stepIndex: number): [number, number] => {
    if (stepIndex > 0) {
      return [slideIndex, stepIndex - 1]
    }
    if (slideIndex > 0) {
      return [slideIndex - 1, slidesInfo[slideIndex - 1].steps.length - 1]
    }
    return [slideIndex, stepIndex]
  }

  const prev = useCallback(
    (dontStepButGoToPrevSlide) => {
      if (dontStepButGoToPrevSlide) {
        if (slideIndex > 0) {
          setSlideAndStep(slideIndex - 1, 0)
        }
        return
      }
      setSlideAndStep(...getPrev(slideIndex, stepIndex))
    },
    [slideIndex, stepIndex, setSlideAndStep]
  )

  const next = useCallback(
    (dontStepButGoToNextSlide) => {
      if (dontStepButGoToNextSlide) {
        if (slideIndex < slidesInfo.length - 1) {
          setSlideAndStep(slideIndex + 1, 0)
        }
      } else {
        setSlideAndStep(...getNext(slideIndex, stepIndex))
      }
    },
    [slideIndex, stepIndex, setSlideAndStep]
  )

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        next(true)
      }
      if (e.key === 'ArrowUp') {
        prev(true)
      }

      if (e.key === 'PageDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        next(false)
      } else if (e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        prev(false)
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

  if (slideIndex > slidesInfo.length) {
    return <div>Too high slide number!</div>
  }

  if (presenter) {
    const slides = [
      [slideIndex, stepIndex],
      getNext(slideIndex, stepIndex)
    ].map(([slideIndex, stepIndex], index) =>
      render({
        slideIndex,
        stepIndex,
        slidesInfo,
        slides: [
          <PresentationContext.Provider
            key={index}
            value={{
              i: slideIndex,
              slideIndex,
              slidesInfo,
              stepIndex,
              setTransitions: () => undefined,
              transition: {
                after: { transform: '' },
                before: { transform: '' }
              }
            }}
          >
            {reactSlides[slideIndex]}
          </PresentationContext.Provider>
        ]
      })
    )

    return (
      <div className='flex'>
        <CitationProvider citationMap={citationMap} bibUrl={bibUrl}>
          <div className='flex justify-around'>
            <div className='flex flex-col'>
              <div>{slides[0]}</div>
              <div className='text-lg'>
                <Clock />
              </div>
            </div>
            <div className='flex flex-col'>
              <div
                style={{
                  transform: 'scale(0.5)',
                  transformOrigin: 'top left',
                  marginBottom: -450
                }}
              >
                {slides[1]}
              </div>
              <div>{slidesInfo[slideIndex].presenterNotes}</div>
            </div>
          </div>
        </CitationProvider>
      </div>
    )
  }

  const wrappedSlides = reactSlides.map((slide, i) => {
    return (
      <PresentationContext.Provider
        key={i}
        value={{
          i,
          slideIndex,
          slidesInfo: slidesInfo,
          stepIndex:
            i === slideIndex
              ? stepIndex
              : i < slideIndex && slidesInfo[i].steps.length
              ? slidesInfo[i].steps.length - 1
              : 0,
          setTransitions,
          transition: transitions[i]
        }}
      >
        {slide}
      </PresentationContext.Provider>
    )
  })

  const threeSlides = wrappedSlides.slice(
    Math.max(0, slideIndex - 1),
    Math.min(wrappedSlides.length, slideIndex + 2)
  )

  if (fullscreen) {
    return (
      <div className='flex justify-center items-center bg-blue h-screen'>
        <CitationProvider citationMap={citationMap} bibUrl={bibUrl}>
          {render({
            slideIndex,
            stepIndex,
            slidesInfo,
            slides: threeSlides
          })}
        </CitationProvider>
      </div>
    )
  }

  return (
    <CitationProvider citationMap={citationMap} bibUrl={bibUrl}>
      <div className='flex h-screen bg-blue'>
        {render({
          slideIndex,
          stepIndex,
          slidesInfo,
          slides: threeSlides
        })}
        <Tabs>
          <Tab label='Presenter notes'>
            {slidesInfo[slideIndex].presenterNotes ? (
              <div className='text-sm p-2'>
                {slidesInfo[slideIndex].presenterNotes}
              </div>
            ) : null}
          </Tab>
          <Tab label='Animation editor'>
            {slidesInfo[slideIndex].animations.length ? (
              <AnimationEditor animations={slidesInfo[slideIndex].animations} />
            ) : null}
          </Tab>
        </Tabs>
      </div>
    </CitationProvider>
  )
}

function Tabs({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-gray-900 w-full h-screen overflow-y-scroll'>
      {children}
    </div>
  )
}

function Tab({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  const [show, setShow] = useState(true)
  if (!children) return null
  return (
    <div className='w-full'>
      <div
        className='p-1 px-2 text-xs uppercase cursor-pointer sticky top-0 z-50 bg-gray-700'
        onClick={() => setShow((s) => !s)}
      >
        {label}
      </div>
      {show && <div>{children}</div>}
    </div>
  )
}

function Clock(): React.ReactElement {
  return <div className='flex justify-center items-center'>20:00</div>
}

function PresentationOverview({
  children,
  render,
  bibUrl,
  preamble = '',
  compileHost
}: InternalPresentationProps): React.ReactElement {
  useLayoutEffect(() => {
    LaTeX.setPreamble(preamble)
    if (compileHost) {
      LaTeX.setHost(compileHost)
    }
  }, [preamble])

  const reactSlides = React.Children.toArray(children) as React.ReactElement[]

  const { slidesInfo, citationMap } = useMemo(
    () => getSlidesInfo(reactSlides),
    [children]
  )

  return (
    <div>
      <CitationProvider citationMap={citationMap} bibUrl={bibUrl}>
        {slidesInfo.flatMap((info, slideIndex) => {
          return info.steps.map((_step: any, stepIndex) => {
            return (
              <div key={`${slideIndex}-${stepIndex}`}>
                {render({
                  slidesInfo,
                  slideIndex,
                  stepIndex,
                  slides: [
                    <PresentationContext.Provider
                      key={slideIndex}
                      value={{
                        slidesInfo,
                        stepIndex,
                        slideIndex,
                        i: slideIndex,
                        setTransitions: () => null,
                        transition: {
                          before: {},
                          after: {}
                        }
                      }}
                    >
                      {reactSlides[slideIndex]}
                    </PresentationContext.Provider>
                  ]
                })}
              </div>
            )
          })
        })}
      </CitationProvider>
    </div>
  )
}

type SlideProps = {
  render: SlideRenderFunction
  steps?: any[]
  children: React.ReactNode
}

type SlideRenderFunction = (arg: {
  slidesInfo: SlidesInfo
  children: React.ReactNode | ((step: any) => React.ReactNode)
  slideIndex: number
  i: number
  style: React.CSSProperties
}) => React.ReactElement

const hasSteps = (node: any): node is (step: any) => React.ReactNode =>
  node.call

// Add timeline ={{ ... }} shorthand
export function RenderSlide({
  children,
  steps = [],
  render
}: SlideProps): React.ReactElement {
  const TIMING = 0.5
  const { stepIndex = 0, i = 0, slideIndex = 0, transition, slidesInfo = [] } =
    useContext(PresentationContext) || {}

  const [style, setStyle] = useState<React.CSSProperties>({
    transition: `${TIMING}s transform, ${TIMING}s opacity`,
    transform: 'scale(1) translate3d(0px, 0px, 0px)',
    opacity: 0
  })

  const updateStyle = (style: React.CSSProperties) =>
    setStyle((s) => ({ ...s, ...style }))

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
    if (i === slideIndex) {
      updateStyle({
        zIndex: 10,
        opacity: 1,
        transform: `scale(1) translate3d(0px,0px,0px)`
      })
    }
  }, [slideIndex, i, transition])

  // if (shouldRender) {
  const content =
    children && (hasSteps(children) ? children(steps[stepIndex]) : children)
  return render({ slidesInfo, children: content, i, slideIndex, style })
  // }
  // return render({info, content: <div />, i, slideIndex, style});
}

function Storage(): React.ReactElement {
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
