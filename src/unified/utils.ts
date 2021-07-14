// import

import type {Parent, Node, Literal} from 'unist';

// types

export type {Node, Parent, Literal};
export interface Text extends Literal {
  value: string;
}

// fns

export const isParent = (x: Node): x is Parent =>
  'children' in x;

export const isLiteral = (x: Node): x is Literal =>
  'value' in x;

export const isText = (x: Node): x is Text =>
  isLiteral(x) && typeof x.value === 'string';
