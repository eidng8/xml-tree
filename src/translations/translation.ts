/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const texts = {
  attribute: 'attribute',
  attributes: 'attributes',
  cdata: 'cdata',
  comment: 'comment',
  declaration: 'declaration',
  doctype: 'doctype',
  element: 'element',
  instruction: 'instruction',
  raw: 'raw',
  text: 'text',
  // UI elements
  addAttribute: 'Add Attribute',
  close: 'close',
  save: 'save',
  insertWhat: 'insert %s',
  appendWhat: 'append %s',
  prependWhat: 'prepend %s',
  menuEdit: 'edit',
  menuInsertBefore: 'insert before',
  menuInsertAfter: 'insert after',
  menuAppend: 'append child',
  menuPrepend: 'prepend child',
  menuRemove: 'remove',
  // Errors
  errNotEditing: 'There is no node being edited.',
  errNodeParent: 'Invalid node parent',
} as { [key: string]: string };

export function interpolate(key: string, ...args: any[]): string {
  let arg = '%s';
  let text = texts[key];
  let i = text.indexOf('%s');
  while (i >= 0) {
    arg = args.shift() || arg;
    text = text.replace('%s', arg);
    i = text.indexOf('%s');
  }
  return text;
}

export function getTexts(): { [key: string]: string } {
  return texts;
}

export function setTranslation(translation: { [key: string]: string }): void {
  Object.assign(texts, translation);
}
