// import

import visit from 'unist-util-visit';

// vars

const wbrRx = /(\/+)/g;

// export

export default function breaks() {
  return (tree) => (
    visit(tree, 'text', (node) => {
      node.type = 'html';
      node.value = node.value.replace(wbrRx, '$1<wbr />');
    })
  );
}

