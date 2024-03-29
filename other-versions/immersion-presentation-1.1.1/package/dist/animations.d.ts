import React from 'react';
declare type ShowProps = {
    when: boolean;
    children: React.ReactNode;
    text?: boolean;
    block?: boolean;
    opacity?: number;
    style?: React.CSSProperties;
    className?: string;
};
export declare function Show({ when, children, text, block, opacity, style, className }: ShowProps): React.ReactElement;
export {};
