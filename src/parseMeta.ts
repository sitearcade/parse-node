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

export type NodeMeta<T = unknown> = Record<string, Json> & T;

type InputMeta = NodeMeta<{file: string}>;

type DefaultMeta = NodeMeta<{
  type: string;
  slug: string;
  file: string;
  link: string;
  tags: string[];
  bannerImage: string[];
  publishDate: string;
}>;

type BasicMeta = NodeMeta<{
  type: string;
  slug: string;
  file: string;
  link: string;
  tags: string[];
  bannerImage: string | null;
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

const getLink = (type: string, slug: string) => (
  type === 'page' ? keyPages[slug] || `/${slug}` :
  type === 'help' ? `/support/${slug}` :
  `/${type}/${slug}`
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

const smartenMeta: (meta: NodeMeta) => Promise<BasicMeta> =
  traverseAsync(async (val, key) => (
    R.isNil(key) ? val :
    key.endsWith('Image') ? (val && val[0]) || null :
    key.endsWith('Mark') ? await parseBody(val?.toString() ?? '') || null :
    val
  ));

function flattenMeta(meta: DefaultMeta): NodeMeta {
  return JSON.parse(JSON.stringify(meta));
}

function defaultMeta(meta: InputMeta): DefaultMeta {
  const {type, slug} = typeSlugRx.exec(meta.file.toString())?.groups ?? {};

  return {
    type,
    slug,
    tags: [],
    bannerImage: [],
    ...meta,
    publishDate: new Date(meta.publishDate?.toString() || '1984').toISOString(),
    link: getLink(type, meta.slug?.toString() ?? slug),
  };
}

// export

export async function parseMeta(meta: InputMeta) {
  return smartenMeta(flattenMeta(defaultMeta(meta)));
}
