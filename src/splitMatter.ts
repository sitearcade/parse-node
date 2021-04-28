// import

import gm from 'gray-matter';

import type {GenericMeta} from './parseMeta';

// types

type Result = {data: GenericMeta; content: string} | null;

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
