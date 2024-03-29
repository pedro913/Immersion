import React from 'react'

import Morph from './Morph'

export function InlineMath({ children }) {
  return (
    <Morph inline replace>
      {children}
    </Morph>
  )
}

export function DisplayMath({ children }) {
  return (
    <Morph display replace>
      {children}
    </Morph>
  )
}

export const m = (...args) => <InlineMath>{String.raw(...args)}</InlineMath>
export const M = (...args) => <DisplayMath>{String.raw(...args)}</DisplayMath>
