// import

import type {Plugin} from 'unified';
import type {Parent, Node, Literal} from 'unist';
import u from 'unist-builder';

// types

type Iter = (
  node: Literal | Node | Parent,
  i?: number,
  parent?: Literal | Node | Parent,
) => Literal | Node | Parent;

// vars

const hintRx = /^[!#+?](>|&gt;)\s/;
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

    if (Array.isArray(newNode.children)) {
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

      const [child, ...siblings] =
        Array.isArray(node.children) ? node.children : [];

      if (child.type !== 'text' || !hintRx.test(child.value)) {
        return node;
      }

      const [typeClass, typeRx] = Object.entries(typeMap)
        .find(([, r]) => r.test(child.value?.toString?.() ?? '')) ?? [];

      const newChild = {
        type: child.type,
        value: child.value.replace(typeRx, ''),
      };

      const props = {
        data: {
          class: typeClass,
          hProperties: {
            class: typeClass,
          },
        },
      };

      return u('paragraph', props, [newChild, ...siblings]);
    })
  );
};

export default hint;

