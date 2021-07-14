// import

import u from 'unist-builder';

import {isParent, isText} from './utils';

import type {Node} from './utils';
import type {Plugin} from 'unified';

// types

type Iter = (
  node: Node,
  i?: number,
  parent?: Node,
) => Node;

// vars

const typeMap = {
  'hint bonus': /^\+(>|&gt;)\s/,
  'hint info': /^!(>|&gt;)\s/,
  'hint warning': /^\?(>|&gt;)\s/,
  'hint error': /^#(>|&gt;)\s/,
};

// fns

const map = (tree: Node, iteratee: Iter) => {
  const preorder: Iter = (node, i, parent) => {
    const newNode = iteratee(node, i, parent);

    if (isParent(newNode)) {
      newNode.children = newNode.children.map((child: Node, k: number) => {
        return preorder(child, k, node);
      });
    }

    return newNode;
  };

  return preorder(tree);
};

// export

const hint: Plugin = () => {
  return (tree: Node) => (
    map(tree, (node) => {
      if (node.type !== 'paragraph') {
        return node;
      }

      const [child, ...siblings] = isParent(node) ? node.children : [];

      if (!isText(child)) {
        return node;
      }

      const match = Object.entries(typeMap)
        .find(([, rx]) => rx.test(child.value));

      if (!match) {
        return node;
      }

      const newChild = {
        type: child.type,
        value: child.value.replace(match[1], ''),
      };

      const props = {
        data: {
          hName: 'aside',
          class: match[0],
          hProperties: {
            class: match[0],
          },
        },
      };

      return u('paragraph', props, [newChild, ...siblings]);
    })
  );
};

export default hint;

