// import

const visit = require('unist-util-visit');

// vars

const wbrRx = /(\/+)/g;

// export

module.exports = function breaks() {
  return (tree) => (
    visit(tree, 'text', (node) => {
      node.type = 'html';
      node.value = node.value.replace(wbrRx, '$1<wbr />');
    })
  );
};

