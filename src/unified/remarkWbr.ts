// import

import visit from 'unist-util-visit';

import type {Node, Text} from './utils';
import type {Plugin} from 'unified';

// vars

const wbrRx = /(\/+)/g;

// export

const breaks: Plugin = () => {
  return (tree: Node) => (
    visit(tree, 'text', (node: Text) => {
      node.type = 'html';
      node.value = node.value.replace(wbrRx, '$1<wbr />');
    })
  );
};

export default breaks;

