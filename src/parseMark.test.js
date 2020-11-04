// import

import {markToHtml} from './parseMark';

// vars

const mark = '_This_ is the **body**... And I think--if I may--that we can use special text characters too. "I think," said the thinker. Also, some/wbrs/are/due.';

// test

describe('markToHtml(mark)', () => {
  it('produces valid output for real data', async () => {
    const res = await markToHtml(mark);

    expect(res).toMatchInlineSnapshot('"<p><em>This</em> is the <strong>body</strong>… And I think—if I may—that we can use special text characters too. “I think,” said the thinker. Also, some/<wbr />wbrs/<wbr />are/<wbr />due.</p>"');
  });
});
