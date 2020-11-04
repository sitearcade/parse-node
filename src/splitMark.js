// vars

const newlineRx = /(?:\\\s*)?\n/g;
const moreRx = /\s*<--\s*more\s*-->\s*/i;
const paraRx = /^(?![#<>|]|[ `]{2}|\* |\d+\. )/;

// fns

const getKey = ({clip, more}, line) => (
  more.length ? 'more' :
  clip.length >= 150 ? 'more' :
  moreRx.test(line) ? 'more' :
  paraRx.test(line) ? 'clip' :
  'more'
);

const bodyReducer = (acc, line) => {
  const key = getKey(acc, line);

  return {
    ...acc, [key]: `${acc[key] + line}\n`,
  };
};

// export

export async function splitMark(mark) {
  const {clip, more} = mark.split(newlineRx)
    .reduce(bodyReducer, {clip: '', more: ''});

  return {clip, more, body: clip + more};
}
