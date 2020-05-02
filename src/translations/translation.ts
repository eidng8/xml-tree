const texts = {
  attribute: 'attribute',
  declaration: 'declaration',
  cdata: 'cdata',
  comment: 'comment',
  doctype: 'doctype',
  element: 'element',
  instruction: 'instruction',
  text: 'text',
  // UI elements
  addAttribute: 'Add Attribute',
  close: 'close',
  save: 'save',
  // Errors
  errNotEditing: 'There is no node being edited.',
  errNodeParent: 'Invalid node parent',
};

export function getTexts(): { [key: string]: string } {
  return texts;
}

export function setTranslation(translation: { [key: string]: string }): void {
  Object.assign(texts, translation);
}
