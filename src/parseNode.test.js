// import

import path from 'path';

import {parseNode} from './parseNode';

// vars

const testPost = `---
title: Title
publishDate: 2012-12-21
---
_This_ is the **body**.
`;

// test

describe('parseNode(file, [rawData])', () => {
  it('produces valid output for real data', async () => {
    const res = await parseNode('./content/post/slug.md', testPost);

    expect(res).toMatchInlineSnapshot(`
      Object {
        "body": "<p><em>This</em> is the <strong>body</strong>.</p>",
        "clip": "<p><em>This</em> is the <strong>body</strong>.</p>",
        "meta": Object {
          "bannerImage": null,
          "bodyImages": Array [],
          "description": "This is the body…",
          "file": "./content/post/slug.md",
          "headings": Array [],
          "link": "/post/slug",
          "publishDate": "2012-12-21T00:00:00.000Z",
          "slug": "slug",
          "tags": Array [],
          "title": "Title",
          "type": "post",
        },
        "more": "",
      }
    `);
  });

  it('returns null for non-existent files', async () => {
    const res = await parseNode(path.resolve(__dirname, './missing.md'));

    expect(res).toBeNull();
  });
});
