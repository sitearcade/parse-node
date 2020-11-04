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
// import rmUnderline from 'remark-underline';
import rmTextr from 'remark-textr';
import rmUnwrapImages from 'remark-unwrap-images';
import typographicBase from 'typographic-base';
import unified from 'unified';

import rmWbr from './unified/remarkWbr';

// config

const mark2html = unified()
  .use(md2rm)
  .use(rmEmoji)
  .use(rmA11yEmoji)
  // FIXME: https://github.com/Darkhax/remark-underline/issues/2
  // .use(rmUnderline, {tagType: 'u', classNames: []})
  .use(rmExtLinks, {
    target: '_blank',
    rel: ['nofollow', 'noopener', 'noreferrer'],
    protocols: ['http', 'https', 'mailto'],
  })
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
    plugins: [typographicBase],
  })
  .use(rmWbr)
  .use(rm2rh, {allowDangerousHtml: true})
  .use(rh2html, {allowDangerousHtml: true});

// export

export async function markToHtml(mark) {
  return mark2html.process(mark).then(String);
}
