import './external/tailwind.min.css'
import './index.css'
import * as modern from './themes/modern'

const themes = {
  modern
}

export { default as AnimateSVG } from './AnimateSVG'
export { Show } from './animations.js'
export { InlineMath, DisplayMath, m, M } from './LaTeX.js'
export { default as MObject } from './MObject.js'
export { default as Portal } from './Portal.js'
// Presentation.js
export { default as Notes } from './PresenterNotes.js'
export { timeline, range } from './utils.js'
export { default as Morph } from './Morph'
export { themes }
