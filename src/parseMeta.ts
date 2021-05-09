// import

import * as R from 'ramda';

import {parseBody} from './parseBody';
import {promiseObjAll} from './utils';

// types

type Json =
  | Json[]
  | boolean
  | number
  | string
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  | {[key: string]: Json}
  | null;

export type NodeMeta<T = unknown> = Record<string, unknown> & T;

type InputMeta = NodeMeta<{
  file: string;
  publishDate?: string;
  slug?: string;
}>;

type BasicMeta = NodeMeta<{
  type: string;
  slug: string;
  file: string;
  link: string;
  publishDate: string;
}>;

// vars

const typeSlugRx = /content\/(?<type>[^/]+)\/(?<slug>.+)\.md$/;

const keyPages = {
  home: '/',
};

// fns

const noop = async (
  val: Json,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _key: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _path: string[],
): Promise<Json> => val;

export const getLink = (type: string, slug: string) => (
  type === 'page' ? keyPages[slug] || `/${slug}` :
  type === 'person' ? keyPages[slug] || `/blog/author/${slug}` :
  type === 'post' ? keyPages[slug] || `/post/${slug}` :
  type === 'postTag' ? keyPages[slug] || `/blog/tag/${slug}` :
  type === 'series' ? keyPages[slug] || `/blog/series/${slug}` :
  type === 'support' ? `/support/${slug}` :
  type === 'supportTag' ? `/support/tag/${slug}` :
  undefined
);

const traverseAsync = (fn = noop) =>
  async function traverse(val: Json, path: string[] = []) {
    val = await fn(val, R.last(path) || null, path);

    if (Array.isArray(val)) {
      return Promise.all(
        val.map(
          (v, i) => traverse(v, [...path, i.toString()]),
        ),
      );
    }

    if (R.type(val) === 'Object') {
      return promiseObjAll(
        (v: Json, k) => traverse(v, [...path, k]),
      )(val as Record<string, Json>);
    }

    return val;
  };

function flattenMeta(meta: BasicMeta): BasicMeta {
  return JSON.parse(JSON.stringify(meta));
}

function defaultMeta(meta: InputMeta): BasicMeta {
  const {type, slug} = typeSlugRx.exec(meta.file.toString())?.groups ?? {};

  return {
    type,
    slug,
    ...meta,
    publishDate: new Date(meta.publishDate?.toString() || '1984').toISOString(),
    link: getLink(type, meta.slug?.toString() ?? slug),
  };
}

// export

export const smartenMeta: (meta: any) => any =
  traverseAsync(async (val, key) => (
    R.isNil(key) ? val :
    key.endsWith('Image') ? (val && val[0]) || null :
    key.endsWith('Mark') || key === 'bodyTpl' ?
      await parseBody(val?.toString() ?? '') || null :
      ['headline', 'subhead'].includes(key) ?
        await parseBody(val?.toString() ?? '')
          .then((res) => res.slice(3, -4)) || null :
        val
  ));

export async function parseMeta(meta: InputMeta) {
  return smartenMeta(flattenMeta(defaultMeta(meta)));
}
