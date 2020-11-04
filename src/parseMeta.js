// import

import R from 'ramda';

import {markToHtml} from './parseMark';
import {promiseObjAll} from './utils';

// vars

const typeSlugRx = /content\/(?<type>[^/]+)\/(?<slug>.+)\.md$/;

const keyPages = {
  home: '/',
};

// fns

const getLink = (type, slug) => (
  type === 'page' ? keyPages[slug] || `/${slug}` :
  type === 'help' ? `/support/${slug}` :
  `/${type}/${slug}`
);

const traverseAsync = (fn = R.identity) =>
  async function traverse(val, path = []) {
    val = await fn(val, R.last(path) || null, path);

    if (Array.isArray(val)) {
      return Promise.all(val.map((v, i) => traverse(v, [...path, i.toString()])));
    }

    if (val && typeof val === 'object') {
      return promiseObjAll((v, k) => traverse(v, [...path, k]))(val);
    }

    return val;
  };

export const smartenMeta = traverseAsync(async (val, key) => (
  R.isNil(key) ? val :
  key.endsWith('Image') ? (val && val[0]) || null :
  key.endsWith('Mark') ? await markToHtml(val || '') || null :
  val
));

// export

export function flattenMeta(meta) {
  return JSON.parse(JSON.stringify(meta));
}

export function defaultMeta(meta) {
  const {type, slug} = typeSlugRx.exec(meta.file)?.groups ?? {};

  return {
    type,
    slug,
    tags: [],
    bannerImage: [],
    ...meta,
    publishDate: new Date(meta.publishDate || '3000').toISOString(),
    link: getLink(type, meta.slug ?? slug),
  };
}

export async function parseMeta(meta) {
  return defaultMeta(meta) |> await smartenMeta(#) |> flattenMeta(#);
}
