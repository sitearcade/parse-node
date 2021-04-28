// import

import type {Plugin} from 'unified';
import type {Node} from 'unist';
import visit from 'unist-util-visit';

// vars

const wbrRx = /(\/+)/g;

// export

const breaks: Plugin = () => {
  return (tree: Node) => (
    visit(tree, 'text', (node) => {
      node.type = 'html';
      node.value = (node.value as string).replace(wbrRx, '$1<wbr />');
    })
  );
};

export default breaks;

