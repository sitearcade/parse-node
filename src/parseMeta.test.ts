// import

import {getLink} from './parseMeta';

// test

describe('getLink(type, slug)', () => {
  it('resolves links correctly', () => {
    expect([
      getLink('page', 'slug'),
      getLink('person', 'slug'),
      getLink('post', 'slug'),
      getLink('postTag', 'slug'),
      getLink('series', 'slug'),
      getLink('support', 'slug'),
      getLink('supportTag', 'slug'),
      getLink('unknown', 'slug'),
    ]).toMatchInlineSnapshot(`
      Array [
        "/slug",
        "/blog/author/slug",
        "/post/slug",
        "/blog/tag/slug",
        "/blog/series/slug",
        "/support/slug",
        "/support/tag/slug",
        undefined,
      ]
    `);
  });
});
