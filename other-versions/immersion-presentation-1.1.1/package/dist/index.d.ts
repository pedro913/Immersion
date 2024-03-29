import './external/tailwind.min.css';
import './index.css';
import * as modern from './themes/modern';
declare const themes: {
    modern: typeof modern;
};
export { default as AnimateSVG } from './AnimateSVG';
export { default as Show } from './Show';
export { InlineMath, DisplayMath, m, M } from './LaTeX';
export { default as MObject } from './MObject';
export { default as Portal } from './Portal';
export { default as Notes } from './PresenterNotes';
export { range } from './utils';
export { default as timeline } from './timeline';
export { default as Morph } from './Morph';
export { themes };
