import React from 'react'
import { useRef, useEffect, useContext } from 'react'
import { PresentationContext } from './Presentation'

function getRect(element) {
  let el = element
  let offsetLeft = 0
  let offsetTop = 0

  do {
    offsetLeft += el.offsetLeft // + el.clientLeft;
    offsetTop += el.offsetTop // + el.clientTop;

    el = el.offsetParent
  } while (!el.classList.contains('slide'))
  return {
    left: offsetLeft,
    top: offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight,
    parentWidth: el.offsetWidth,
    parentHeight: el.offsetHeight
  }
}

const addPortal = ({ i, setTransitions }, portal) => {
  const {
    rect: { width, height, left, top, parentWidth, parentHeight }
  } = portal
  const sx = parentWidth / width
  const sy = parentHeight / height

  const s = Math.max(sx, sy)

  const x = left
  const y = top

  const enlarge = {
    transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
    transform: `translate3d(${-(x + width / 2) + parentWidth / 2}px, ${
      -(y + height / 2) + parentHeight / 2
    }px, 0px) scaleX(${s}) scaleY(${s})`,
    opacity: 0
  }

  const shrink = {
    transformOrigin: `${parentWidth / 2}px ${parentHeight / 2}px`,
    transform: `translate3d(${-parentWidth / 2 + x + width / 2}px, ${
      -parentHeight / 2 + y + height / 2
    }px, 0px) scaleX(${1 / s}) scaleY(${1 / s})`,
    opacity: 0
  }

  setTransitions((transitions) => {
    const newTransitions = { ...transitions }
    if (portal.zoom === 'in') {
      newTransitions[i] = {
        ...(newTransitions[i] || {}),
        after: enlarge
      }
      newTransitions[i + 1] = {
        ...(newTransitions[i + 1] || {}),
        before: shrink
      }
    }

    // Problem: if out and in: current transformOrigin gets set twice!
    // FIXME
    if (portal.zoom === 'out') {
      newTransitions[i - 1] = {
        ...(newTransitions[i - 1] || {}),
        after: shrink
      }
      newTransitions[i] = {
        ...(newTransitions[i] || {}),
        before: enlarge
      }
    }
    return newTransitions
  })
}

export default function Portal({ children, zoomin, zoomout, ...props }) {
  const context = useContext(PresentationContext)
  const zoom = zoomin ? 'in' : zoomout ? 'out' : null

  const domEle = useRef()
  useEffect(() => {
    if (!zoom) return
    setTimeout(() => {
      if (!domEle.current) return
      const rect = getRect(domEle.current)
      addPortal(context, { zoom, rect })
    }, 200)
  }, [domEle])
  return (
    <div ref={domEle} {...props}>
      {children}
    </div>
  )
}
