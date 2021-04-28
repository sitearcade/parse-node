// import

import gm from 'gray-matter';

import type {NodeMeta} from './parseMeta';

// types

type Result = {data: NodeMeta; content: string} | null;

// vars

const opts = {excerpt: false};

// fns

const pluckKeys = ({content, data}) => ({content, data});

// export

export function splitMatter(raw: string): Result {
  try {
    return pluckKeys(gm(raw, opts));
  } catch (err) {
    return null;
  }
}
