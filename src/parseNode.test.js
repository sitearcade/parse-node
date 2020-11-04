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
    const res = await parseNode('./content/post/2012-02/slug.md', testPost);

    expect(res).toMatchInlineSnapshot(`
      Object {
        "body": "<p><em>This</em> is the <strong>body</strong>.</p>",
        "clip": "<p><em>This</em> is the <strong>body</strong>.</p>",
        "meta": Object {
          "bannerImage": null,
          "bodyImages": Array [],
          "description": "This is the body.…",
          "file": "./content/post/2012-02/slug.md",
          "headings": Array [],
          "link": "/post/2012-02/slug",
          "publishDate": "2012-12-21T00:00:00.000Z",
          "slug": "2012-02/slug",
          "tags": Array [],
          "title": "Title",
          "type": "post",
        },
      }
    `);
  });

  it('returns null for non-existent files', async () => {
    const res = await parseNode(path.resolve(__dirname, './missing.md'));

    expect(res).toBeNull();
  });
});
