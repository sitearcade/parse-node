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

#> An error!
`;

// test

describe('parseBody(mark)', () => {
  it('produces valid output for real data', async () => {
    const res = await parseBody(mark);

    expect(res).toMatchInlineSnapshot(
      '"<p><em>This</em> is the <strong>body</strong>… And I think—if I may—that we can use special text characters too. “I think,” said the thinker. Also, some/<wbr />wbrs/<wbr />are/<wbr />due.</p>"'
    );
  });

  it('supports hints', async () => {
    expect(await parseBody(hints)).toMatchInlineSnapshot(`
      "<p>This is a paragraph.</p>
      <p class=\\"hint bonus\\">A bonus!</p>
      <p class=\\"hint info\\">An <em>info</em>.</p>
      <p class=\\"hint warning\\">A warning.</p>
      <p class=\\"hint error\\">An error!</p>"
    `);
  });
});
