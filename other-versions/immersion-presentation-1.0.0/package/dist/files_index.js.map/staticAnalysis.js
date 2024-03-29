import React from 'react'
import { PresentationContext, RenderSlide } from './Presentation'
import { CitationContext, RenderCite } from './Citations'
import Notes from './PresenterNotes'

import flattenDeep from 'lodash/flattenDeep'
import Morph from './Morph'

window.React = React

const withFakeDispatcher = (ctx, cb) => {
  // I'll guess I'll be fired then ;)
  const {
    ReactCurrentDispatcher
  } = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  const original = ReactCurrentDispatcher.current

  ReactCurrentDispatcher.current = {
    useContext: (context) => {
      const result = ctx.find(([c, v]) => c == context)
      if (result) {
        return result[1]
      }
      return {}
    },
    readContext: () => null,
    useCallback: (x) => x,
    useEffect: () => null,
    useImperativeHandle: () => null,
    useLayoutEffect: () => null,
    useMemo: (x) => x,
    useReducer: (_, initialState) => initialState,
    useRef: (initial) => {
      const ref = { current: initial }
      return ref
    },
    useState: (initial) => [initial, (x) => x],
    useDebugValue: () => null,
    useResponder: () => null,
    useDeferredValue: () => null,
    useTransition: () => null
  }

  let result
  try {
    result = cb()
  } finally {
    ReactCurrentDispatcher.current = original
  }
  return result
}

const ignore = [Morph, RenderCite]
const findElementsInTree = (node, predicate) => {
  const found = []

  const handleTree = (node) => {
    if (predicate(node)) {
      found.push(node)
      return
    }

    if (node.type && typeof node.type === 'function') {
      // Do not go deeper into Morphs, ...
      if (ignore.includes(node.type)) {
        return
      }

      const resolved = node.type(node.props)
      return handleTree(resolved)
    }

    if (node.props && node.props.children) {
      const childs = flattenDeep(
        Array.isArray(node.props.children)
          ? node.props.children
          : [node.props.children]
      )
      childs.forEach((child) => {
        if (child) {
          handleTree(child)
        }
      })
    }
  }

  handleTree(node)
  return found
}

// Does as it says. e.g.
// <ProofSlide color='false'>
//   resolves to -> <Slide header='test' />
//
//   the resulting props are {color: false, header: test, slide: the <Slide> component}
const getPropsRecursiveUntilSlideComponentIsEncountered = (node) => {
  const props = node.props
  const type = node.type

  if (type == RenderSlide) {
    return { ...props, slide: node }
  }

  const resolved = type({ ...props })
  const rest = getPropsRecursiveUntilSlideComponentIsEncountered(resolved)
  return {
    ...props,
    ...rest
  }
}

export function getSlideInfo(slides) {
  const mockContextes = [
    [
      PresentationContext,
      {
        slideIndex: 0,
        infos: [],
        info: {},
        numSlides: 0
      }
    ],
    [
      CitationContext,
      {
        bibliography: [],
        citationMap: {}
      }
    ]
  ]

  let slideWithProps

  // note that the steps prop is not yet okay: because the table of contents doesn't know yet how many sections there are, it cannot determine the number of steps ...
  withFakeDispatcher(mockContextes, () => {
    slideWithProps = slides.map(
      getPropsRecursiveUntilSlideComponentIsEncountered
    )
  })

  // this adds the current section to each of the slides
  //
  // slide:   1234567
  // section: A   B
  //
  // gets transformed to
  //
  // slide:        1234567
  // section:      AAAABBB
  // sectionSlide: tffftff

  const infos = []
  for (let { slide, ...props } of slideWithProps) {
    const accumulatedInfo = infos[infos.length - 1]
    const newInfo = {
      ...accumulatedInfo
    }

    newInfo.sectionSlide = !!props.section
    newInfo.hideNavigation = !!props.hideNavigation

    if (props.section) {
      newInfo.section = props.section
    }

    if (props.header) {
      newInfo.header = props.header
    } else {
      newInfo.header = null
    }

    infos.push(newInfo)
  }

  // Now we add this info to the presentation context
  // Now the <TableOfContentsSlide /> knows how many sections there are, so it can calculate how many steps the slide is based on this.

  const citationMap = withFakeDispatcher(mockContextes, () => {
    return getCitations(slideWithProps.map((x) => x.slide))
  })

  mockContextes.find(([c, _]) => c == PresentationContext)[1].infos = infos
  mockContextes.find(
    ([c, _]) => c == CitationContext
  )[1].citationMap = citationMap

  return withFakeDispatcher(mockContextes, () => {
    slideWithProps = slides.map(
      getPropsRecursiveUntilSlideComponentIsEncountered
    )
    const slideInfo = slideWithProps.map(({ slide, ...props }, index) => ({
      slide,
      info: infos[index],
      steps: props.steps || [null],
      animations: animations(slide),
      presenterNotes: presenterNotes(slide)
    }))
    console.log('slideInfo is', slideInfo)
    return { slideInfo, citationMap }
  })
}

const presenterNotes = (slide) => {
  let tree
  if (!slide.props.steps || typeof slide.props.children !== 'function') {
    tree = slide
  } else {
    tree = slide.props.children(slide.props.steps[0])
  }

  const notes = findElementsInTree(
    tree,
    (node) => typeof node.type === 'function' && node.type === Notes
  )
  if (notes.length > 1) {
    console.error('On slide ', slide, 'you have more than one <Notes>!')
  }
  const note = notes[0]
  if (!note) return null
  return note.props.children
}

const animations = (slide) => {
  const morphs = {}

  if (!slide.props.steps) return []

  if (typeof slide.props.children !== 'function') {
    // If type is not a function, we have no animations.
    return []
  }

  slide.props.steps.forEach((step) => {
    const tree = slide.props.children(step)

    findElementsInTree(
      tree,
      (node) => typeof node.type === 'function' && node.type === Morph
    ).forEach((node) => {
      if (node.props.replace) {
        // No animations to consider, is replaced immediately
        // Is used for plain LaTeX (<Morph replace />)
        return
      }
      const id = JSON.stringify(node._source)
      const contents = node.props.children
      morphs[id] = morphs[id] ? [...morphs[id], contents] : [contents]
    })
  })

  const anim = []
  for (let key in morphs) {
    const formulas = morphs[key]
    formulas.forEach((formula, i) => {
      const start = formula
      const end = formulas[i + 1]
      if (i < formulas.length - 1 && start !== end) {
        anim.push({ start, end })
      }
    })
  }

  return anim
}

function getCitations(slides) {
  const citationMap = {}

  slides.forEach((slide) => {
    let trees = [slide]
    if (typeof slide.props.children == 'function' && !!slide.props.steps) {
      trees = slide.props.steps.map((step) => slide.props.children(step))
    }

    trees.forEach((tree) => {
      findElementsInTree(
        tree,
        (node) => typeof node.type === 'function' && node.type == RenderCite
      ).forEach((cite) => {
        const id = cite.props.id
        if (!citationMap[id]) {
          const number = Math.max(0, ...Object.values(citationMap)) + 1
          citationMap[id] = number
        }
      })
    })
  })
  return citationMap
}
