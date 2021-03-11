// import

import u from 'unist-builder';

// vars

const hintRx = /^[!#+?](>|&gt;)\s/;
const typeMap = {
  'hint bonus': /^\+(>|&gt;)\s/,
  'hint info': /^!(>|&gt;)\s/,
  'hint warning': /^\?(>|&gt;)\s/,
  'hint error': /^#(>|&gt;)\s/,
};

// fns

const map = (tree, iteratee) => {
  const preorder = (node, i, parent) => {
    const newNode = iteratee(node, i, parent);

    if (Array.isArray(newNode.children)) {
      newNode.children = newNode.children.map((child, k) => {
        return preorder(child, k, node);
      });
    }

    return newNode;
  };

  return preorder(tree, null, null);
};

// export

export default function hint() {
  return (tree) => (
    map(tree, (node) => {
      const {children = []} = node;

      if (node.type !== 'paragraph') {
        return node;
      }

      const [{value, type}, ...siblings] = children;

      if (type !== 'text' || !hintRx.test(value)) {
        return node;
      }

      const [typeClass, typeRx] = Object.entries(typeMap)
        .find(([, r]) => r.test(value));

      const newChild = {
        type, value: value.replace(typeRx, ''),
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
}

