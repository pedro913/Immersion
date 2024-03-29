import React from 'react';
declare type AnimateSVGStep = {
    css?: React.CSSProperties;
    [key: string]: any;
};
declare type AnimateSVGProps = {
    src: string;
    step: AnimateSVGStep;
    width: string | number;
    height: string | number;
};
declare function AnimateSVG({ src, step, width, height }: AnimateSVGProps): React.ReactNode;
export default AnimateSVG;
