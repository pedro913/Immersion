import React from 'react'

export function Show({
  when,
  children,
  text,
  block,
  opacity,
  style,
  className = ''
}) {
  const realStyle = {
    opacity: opacity !== undefined ? opacity : when ? 1 : 0,
    transition: '0.5s opacity ease-in-out',
    ...style
  }

  // Div elements inside inline elements don't work as expected when opacity is 0.
  // <span opacity=1><div>Hello</div></span> is visible in Chrome, not in firefox ...
  if (text) {
    return (
      <span className='inline' style={{ ...realStyle }}>
        {children}
      </span>
    )
  }

  if (block) {
    return (
      <div style={realStyle} className={className}>
        {children}
      </div>
    )
  }

  return (
    <React.Fragment>
      {React.Children.map(children, (c) =>
        React.cloneElement(c, {
          ...(c.props && c.props.style ? c.props.style : {}),
          style: realStyle
        })
      )}
    </React.Fragment>
  )
}

// TODO: Animate height of an element
// export function Grow({when, children, opacity}) {
