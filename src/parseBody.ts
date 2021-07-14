// import

import rmA11yEmoji from '@fec/remark-a11y-emoji';
import rh2html from 'rehype-stringify';
import rmLinkHead from 'remark-autolink-headings';
import rmBreaks from 'remark-breaks';
import rmEmoji from 'remark-emoji';
import rmExtLinks from 'remark-external-links';
import rmImages from 'remark-images';
import rmOembed from 'remark-oembed';
import md2rm from 'remark-parse';
import rm2rh from 'remark-rehype';
import rmSlug from 'remark-slug';
import rmSqueeze from 'remark-squeeze-paragraphs';
import rmTextr from 'remark-textr';
import rmUnwrapImages from 'remark-unwrap-images';
import textrApostrophes from 'typographic-apostrophes';
import textrApostrophesForPlurals from 'typographic-apostrophes-for-possessive-plurals';
import textrArrows from 'typographic-arrows';
import textrCopyright from 'typographic-copyright';
import textrEllipses from 'typographic-ellipses';
import textrEmDashes from 'typographic-em-dashes';
import textrEnDashes from 'typographic-en-dashes';
import textrMathSymbols from 'typographic-math-symbols';
import textrQuotes from 'typographic-quotes';
import textrRegisteredTrademark from 'typographic-registered-trademark';
import textrSingleSpaces from 'typographic-single-spaces';
import textrTrademark from 'typographic-trademark';
import unified from 'unified';

import rmHint from './unified/remarkHint';
import rmWbr from './unified/remarkWbr';

// config

const mark2html = unified()
  .use(md2rm)
  .use(rmEmoji)
  .use(rmA11yEmoji)
  .use(rmExtLinks, {
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
    protocols: ['http', 'https', 'mailto'],
  })
  .use(rmHint)
  .use(rmImages)
  .use(rmUnwrapImages)
  .use(rmOembed, {syncWidget: true})
  .use(rmBreaks)
  .use(rmSqueeze)
  .use(rmSlug)
  .use(rmLinkHead, {
    behavior: 'wrap',
    linkProperties: {ariaHidden: true, tabIndex: -1, className: 'anchor'},
  })
  .use(rmTextr, {
    options: {locale: 'en-us'},
    plugins: [
      textrApostrophes,
      textrQuotes,
      textrApostrophesForPlurals,
      textrArrows,
      textrCopyright,
      textrEllipses,
      textrEmDashes,
      textrEnDashes,
      textrMathSymbols,
      textrRegisteredTrademark,
      textrSingleSpaces,
      textrTrademark,
    ],
  })
  .use(rmWbr)
  .use(rm2rh, {allowDangerousHtml: true})
  .use(rh2html, {allowDangerousHtml: true});

// export

export async function parseBody(mark: string) {
  return mark2html.process(mark).then(String);
}
