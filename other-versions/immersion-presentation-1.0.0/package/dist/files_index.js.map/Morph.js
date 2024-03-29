import React from 'react'

import { useEffect, useState, useRef, useContext } from 'react'

import { animate } from './lib/morph.js'
import { lookupAnimationGroups } from './AnimationEditor'

import { usePrevious } from './utils.js'

// DONE: if viewbox of 'after' state is smaller, only change it after the animation!
// DONE: don't transition if replace imediately
function Morph({
  children,
  display,
  inline,
  debug,
  useAnimationDatabase = true,
  replace,
  TIMING = 0.6
}) {
  const svgEl = useRef(null)
  const [
    {
      viewBox: [vx, vy, vw, vh],
      width,
      height
    },
    setSvgData
  ] = useState({
    viewBox: [0, 0, 0, 0],
    width: 0,
    height: 0
  })

  const [transition, setTransition] = useState(false)

  const wrapMath = (s) => {
    if (display) {
      return '$\\displaystyle ' + s + '$'
    } else if (inline) {
      return '$' + s + '$'
    }
    return s
  }

  const { min, max, abs } = Math

  const FONT_SCALING_FACTOR = 2

  const updateSvgData = ({ viewBox, width, height }) => {
    setSvgData({
      viewBox,
      width: FONT_SCALING_FACTOR * width,
      height: FONT_SCALING_FACTOR * height
    })
  }

  const previousChildren = usePrevious(children)

  useEffect(() => {
    ;(async () => {
      const svg = svgEl.current
      const anim = (text, replaceImediately) => {
        // should probably tick animationframe?
        setTransition(!replaceImediately)
        return animate(
          svg,
          text,
          replaceImediately,
          TIMING,
          updateSvgData,
          debug
        )
      }

      if (!children) {
        await anim('', false)
        return
      }

      if (typeof children !== 'string') {
        console.error("Trying to compile something that is'nt text:", children)
        return
      }

      if (!previousChildren) {
        await anim(wrapMath(children), false)
        return
      }

      if (replace) {
        await anim(wrapMath(children), true)
        return
      }

      if (useAnimationDatabase) {
        const [before, after] = lookupAnimationGroups(
          previousChildren || '',
          children
        )

        await anim(wrapMath(before), true)
        await anim(wrapMath(after), false)
      } else {
        await anim(wrapMath(children), false)
      }
    })()
  }, [children])

  const inner = (
    <div
      style={{
        ...(display
          ? {
              left: '50%',
              transform: `translate(${-width / 2}pt, 0)`
            }
          : {}),
        width: 0,
        height: 0,
        marginTop: `${-vy * FONT_SCALING_FACTOR}pt`,
        marginRight: `${width}pt`,
        verticalAlign: 'baseline',
        position: 'relative',
        display: 'inline-block',
        ...(transition
          ? {
              transition: `${TIMING}s margin-right, ${TIMING}s margin-top, ${TIMING}s transform`
            }
          : {}),
        ...(debug ? { outline: '1px solid lightblue' } : {})
      }}
    >
      <svg
        width={width + 'pt'}
        height={height + 'pt'}
        viewBox={[vx, vy, vw, vh].join(' ')}
        style={{
          display: 'inline-block',
          position: 'absolute',
          top: `${FONT_SCALING_FACTOR * vy}pt`,
          verticalAlign: 'baseline',
          ...(debug ? { outline: '1px solid yellow' } : {})
        }}
        ref={svgEl}
      ></svg>
    </div>
  )

  if (display) {
    return (
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          height: height + 'pt',
          margin: '0.5em 0',
          ...(transition ? { transition: `${TIMING}s height` } : {}),
          ...(debug ? { outline: '1px solid red' } : {})
        }}
      >
        {inner}
      </div>
    )
  } else {
    return (
      <>
        {/* strut*/}
        <div
          style={{
            display: 'inline-block',
            width: 0,
            verticalAlign: 'text-top',
            marginTop: '0.9em',
            height: height + vy + 'pt',
            ...(transition
              ? { transition: `${TIMING}s height, ${TIMING}s margin-bottom` }
              : {}),
            ...(debug ? { width: '2px', background: 'limegreen' } : {})
          }}
        />
        {inner}
      </>
    )
  }
}

export default Morph
