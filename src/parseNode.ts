// import

import striptags from 'striptags';

import {parseBody} from './parseBody';
import type {NodeMeta} from './parseMeta';
import {parseMeta} from './parseMeta';
import {splitMark} from './splitMark';
import {splitMatter} from './splitMatter';
import {promiseObjAll} from './utils';

// types

type Heading = {level: number; id: string; text: string};

export type ContentNode<T> = {
  meta: NodeMeta<T>;
  clip: string;
  more: string;
  body: string;
};

// vars

const imageRx = /<img.*?src="(.*?)"[^>]+>/g;
const headRx = /<h(?<level>[1-6]).*id="(?<id>.+)".*><a.+>(?<text>.+)<\/a><\/h[1-6]>/g;

const spaceRx = /\s+/g;
const lastRx = / ([\w-]+)$/;
const puncRx = /[!.?]+$/;

// fns

const makeDesc = (clip: string) =>
  striptags(clip).trim()
    .replace(spaceRx, ' ')
    .slice(0, 150)
    .replace(lastRx, '')
    .replace(puncRx, '…');

const extractImages = ({body}) => {
  let match: RegExpExecArray | null = null;
  let res: string[] = [];

  // eslint-disable-next-line fp/no-loops
  while ((match = imageRx.exec(body))) {
    res = [...res, match[1]];
  }

  return res;
};

const extractHeadings = ({body}) => {
  let match: RegExpExecArray | null = null;
  let res: Heading[] = [];

  // eslint-disable-next-line fp/no-loops
  while ((match = headRx.exec(body))) {
    res = [
      ...res, {
        id: match.groups?.id as string,
        text: match.groups?.text as string,
        level: parseInt(match.groups?.level as string),
      },
    ];
  }

  return res;
};

// export

export async function parseNode(file: string, raw: string) {
  const matter = splitMatter(raw);

  if (!matter) {
    return null;
  }

  const [meta, body] = await Promise.all([
    parseMeta({...matter.data, file}),
    splitMark(matter.content).then(promiseObjAll(parseBody)),
  ]);

  return {
    meta: {
      seoDescription: makeDesc(body.clip),
      bodyImages: extractImages(body),
      headings: extractHeadings(body),
      ...meta,
    },
    ...body,
  };
}
