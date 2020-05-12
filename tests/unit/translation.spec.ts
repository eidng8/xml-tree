/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { getTexts, setTranslation } from '../../src/translations/translation';

describe('Set translation', () => {
  it('replaces translation text', () => {
    expect.assertions(1);
    setTranslation({ save: 'abc' });
    expect(getTexts().save).toBe('abc');
  });
});
