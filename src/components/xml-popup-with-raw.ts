import { XmlNodeTypes, XmlTreeElement } from './types';
import {
  objXml,
  rectifyNodeAttributes,
  removeHierarchyFromNode,
  xmlJs,
} from '../utils';
import G8XmlPopupClass from './xml-popup-class';

export default abstract class G8XmlPopupWithRaw extends G8XmlPopupClass {
  raw = '';

  updateRaw(): void {
    removeHierarchyFromNode(this.node);
    rectifyNodeAttributes(this.node);
    this.raw = objXml({ nodes: [this.node] });
  }

  rawChanged(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const obj = (xmlJs(this.raw) as XmlTreeElement).nodes![0] as XmlNodeTypes;
    removeHierarchyFromNode(obj);
    rectifyNodeAttributes(obj);
    Object.assign(this.node, obj);
  }
}
