// import

import {parseBody} from './parseBody';

// vars

const mark =
  '_This_ is the **body**... And I think--if I may--that we can use special text characters too. "I think," said the thinker. Also, some/wbrs/are/due.';

const hints = `
This is a paragraph.

+> A bonus!

!> An _info_.

?> A warning.

#> An **error**.

<aside class="hint error">

**What we missed:** 
* Presets for Reddit. 
* Presets for YouTube channels (cover photo and profile picture). 
* More detailed presets for different Pinterest's pins, profile picture, and cover photo. 
* Presets for Linkdin (this platform might not be attractive to fiction authors, but is part of many non-fiction writers' strategy).

</aside>
`;

// test

describe('parseBody(mark)', () => {
  it('produces valid output for real data', async () => {
    const res = await parseBody(mark);

    expect(res).toMatchInlineSnapshot(
      '"<p><em>This</em> is the <strong>body</strong>… And I think—if I may—that we can use special text characters too. “I think,” said the thinker. Also, some/<wbr />wbrs/<wbr />are/<wbr />due.</p>"',
    );
  });

  it('supports hints', async () => {
    expect(await parseBody(hints)).toMatchInlineSnapshot(`
      "<p>This is a paragraph.</p>
      <aside class=\\"hint bonus\\">A bonus!</aside>
      <aside class=\\"hint info\\">An <em>info</em>.</aside>
      <aside class=\\"hint warning\\">A warning.</aside>
      <aside class=\\"hint error\\">An <strong>error</strong>.</aside>
      <aside class=\\"hint error\\">
      <p><strong>What we missed:</strong></p>
      <ul>
      <li>Presets for Reddit.</li>
      <li>Presets for YouTube channels (cover photo and profile picture).</li>
      <li>More detailed presets for different Pinterest’s pins, profile picture, and cover photo.</li>
      <li>Presets for Linkdin (this platform might not be attractive to fiction authors, but is part of many non-fiction writers’ strategy).</li>
      </ul>
      </aside>"
    `);
  });
});
