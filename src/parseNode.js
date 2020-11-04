// import

import {startOfDay} from 'date-fns';
import gm from 'gray-matter';
import R from 'ramda';
import striptags from 'striptags';

import {markAsHtml} from './parseBody';

// vars

const typeSlugRx = /content\/(?<type>[^/]+)\/(?<slug>.+)\.md$/;
const paraRx = /^(?![#<>|]|[ `]{2}|\* |\d+\. )/;
const imageRx = /<img.*?src="(.*?)"[^>]+>/g;
const headRx = /<h(?<level>[1-6]).*id="(?<id>.+)".*><a.+>(?<text>.+)<\/a><\/h[1-6]>/g;

const keyPages = {
  home: '/',
};

// fns

const getPath = ({type, slug}) => (
  type === 'page' ? keyPages[slug] || `/${slug}` :
  type === 'help' ? `/support/${slug}` :
  `/${type}/${slug}`
);

const parseFile = (file, raw) => {
  try {
    return R.assocPath(['data', 'file'], file, gm(raw, {excerpt: false}));
  } catch {
    return null;
  }
};

const traverseAsync = (fn = R.identity) => {
  return async function traverse(val, path = []) {
    // eslint-disable-next-line require-atomic-updates
    val = await fn(val, R.last(path) || null, path);

    if (Array.isArray(val)) {
      return Promise.all(val.map((v, i) => traverse(v, [...path, i.toString()])));
    }

    if (R.type(val) === 'Object') {
      return R.zipObj(
        R.keys(val),
        await Promise.all(R.keys(val).map((k) => traverse(val[k], [...path, k]))),
      );
    }

    return val;
  };
};

export const smartMeta = traverseAsync(async (val, key) => (
  R.isNil(key) ? val :
  key.endsWith('Image') ? (val && val[0]) || null :
  key.endsWith('Mark') ? await markAsHtml(val || '') || null :
  val
));

const parseMeta = R.pipe(
  R.converge(R.mergeDeepRight, [
    R.pipe(
      R.prop('file'),
      R.match(typeSlugRx),
      R.propOr([], 'groups'),
      R.reject(R.isNil),
      R.converge(R.mergeDeepRight, [
        R.applySpec({
          bannerImage: R.always([]),
          publishDate: () => startOfDay(new Date()),
          tags: R.always([]),
          link: getPath,
        }),
        R.identity,
      ]),
    ),
    R.identity,
  ]),

  JSON.stringify,
  JSON.parse,
  smartMeta,
);

const getKey = R.pipe(
  R.converge(Array.of, [
    R.pipe(
      R.prop('line'),
      R.match(/^<!-- *(?<key>[\dA-Za-z]+) *--> *$/),
      R.path(['groups', 'key']),
    ),
    ({$key, clip, line}) => (
      $key === 'clip' ?
        clip.length >= 150 ?
          'more' :
          paraRx.test(line) ? 'clip' : 'more' :
        null
    ),
    R.prop('$key'),
    R.always('clip'),
  ]),
  R.find(R.is(String)),
);

const bodyReducer = (acc, line) => {
  const $key = getKey({...acc, line});

  return {...acc, $key, [$key]: `${(acc[$key] || '') + line}\n`};
};

const parseBody = R.pipe(
  R.split(/(?:\\\s*)?\n/g),
  R.reduce(bodyReducer, {}),
  R.omit(['$key']),
  async (obj) => R.zipObj(
    R.keys(obj),
    await Promise.all(R.values(obj).map(markAsHtml)),
  ),
  R.andThen(R.converge(R.assoc('body'), [
    ({clip, more = ''}) => clip + more,
    R.identity,
  ])),
);

const railNull = (fn, res) => (
  res && !R.isEmpty(res) ? fn(res) : null
);

const makeDesc = R.pipeWith(railNull, [
  R.prop('clip'),
  striptags,
  R.trim,
  R.replace(/\s+/g, ' '),
  R.slice(0, 150),
  R.replace(/ ([\w-]+)$/, ''),
  R.concat(R.__, '…'),
]);

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

export async function parseNode(loc, raw) {
  const file = parseFile(loc, raw);

  if (R.isNil(file)) {
    return null;
  }

  const meta = await parseMeta(file.data);
  const body = await parseBody(file.content);

  return {
    meta: {
      description: makeDesc(body),
      bodyImages: extractImages(body),
      headings: extractHeadings(body),
      ...meta,
    },
    ...body,
  };
}
