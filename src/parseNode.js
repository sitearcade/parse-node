// import

import R from 'ramda';
import striptags from 'striptags';

import {parseBody} from './parseBody';
import {parseMeta} from './parseMeta';
import {splitMark} from './splitMark';
import {splitMatter} from './splitMatter';
import {promiseObjAll} from './utils';

// vars

const imageRx = /<img.*?src="(.*?)"[^>]+>/g;
const headRx = /<h(?<level>[1-6]).*id="(?<id>.+)".*><a.+>(?<text>.+)<\/a><\/h[1-6]>/g;

const spaceRx = /\s+/g;
const lastRx = / ([\w-]+)$/;
const puncRx = /[!.?]+$/;

// fns

const makeDesc = (clip) =>
  striptags(clip).trim()
    .replace(spaceRx, ' ')
    .slice(0, 150)
    .replace(lastRx, '')
    .replace(puncRx, '…');

const extractImages = ({body}) => {
  let match = null;
  let res = [];

  // eslint-disable-next-line fp/no-loops
  while ((match = imageRx.exec(body))) {
    res = [...res, match[1]];
  }

  return res;
};

const extractHeadings = ({body}) => {
  let match = null;
  let res = [];

  // eslint-disable-next-line fp/no-loops
  while ((match = headRx.exec(body))) {
    res = [
      ...res, {
        ...match.groups,
        level: parseInt(match.groups.level),
      },
    ];
  }

  return res;
};

// export

export async function parseNode(file, raw) {
  const matter = splitMatter(raw);

  if (R.isNil(matter)) {
    return null;
  }

  const [meta, body] = await Promise.all([
    parseMeta({...matter.data, file}, matter.content),
    splitMark(matter.content).then(promiseObjAll(parseBody)),
  ]);

  return {
    meta: {
      description: makeDesc(body.clip),
      bodyImages: extractImages(body),
      headings: extractHeadings(body),
      ...meta,
    },
    ...body,
  };
}
