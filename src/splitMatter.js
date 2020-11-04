// import

import gm from 'gray-matter';

// vars

const opts = {excerpt: false};

// fns

const pluckKeys = ({content, data}) => ({content, data});

// export

export function splitMatter(raw) {
  try {
    return pluckKeys(gm(raw, opts));
  } catch (err) {
    return null;
  }
}
