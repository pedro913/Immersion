import React from 'react'
import { useEffect, useState, useContext } from 'react'

function measureText(text, style = {}) {
  const div = document.createElement('div')

  document.body.appendChild(div)
  div.style.position = 'absolute'
  div.style.left = -1000
  div.style.top = -1000
  for (let key in style) {
    div.style[key] = style[key]
  }

  // TODO: this assumes text!
  div.innerHTML = text

  const result = {
    width: div.clientWidth,
    height: div.clientHeight
  }

  document.body.removeChild(div)

  return result
}

function MObject({ children }) {
  const [child, setChild] = useState(null)
  const [opacity, setOpacity] = useState(1)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setOpacity(0)
    setWidth(measureText(children).width)
    setTimeout(() => setChild(children), 500)
    setTimeout(() => setOpacity(1), 500)
  }, [children])

  return (
    <div
      style={{
        opacity,
        display: 'inline-block',
        transition: '0.5s opacity, 0.7s width',
        width: width,
        overflow: 'hidden',
        verticalAlign: 'top'
      }}
    >
      {child}
    </div>
  )
}

export default MObject
