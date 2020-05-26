# g8-xml-edit

> Presents an XML document in tree view for editing.

## Installation

```bash
npm i -S g8-xml-edit
```

## Usage

```html
<g8-xml-edit :xml="xml" />
```

## Props

| Prop name | Description | Type | Values | Default |
| --- | --- | --- | --- | --- |
| showAttrValue | Whether to show attribute value in tree item badges. | boolean | `true`, `false` | false |
| piUseAttribute | Set to `false` to treat processing instruction as text;<br>or `true` to facilitate attributes. | boolean | `true`, `false` | false |
| xml | Input XML content. This component doesn't mutate the input XML content. | string | `XML string` |  |

## Events

| Event name | Type | Description |
| --- | --- | --- |
| menu-open | MenuOpenEvent | A menu item has been selected. |
| default-declaration | DefaultDeclarationEvent | Emitted when the input XML document doesn't have declaration. |
| xml-reload | XmlReloadEvent | Emits when XML document has been reloaded. The `detail.document` field<br>holds the newly loaded XML object.<br>Please note that this event is fired only when {@see reloadXml} is<br>called. Changing the {@see xml} property will _not_ trigger this event. |
| select-node | SelectNodeEvent | Emitted when a node in the tree view has been selected. |
| edit-node | EditNodeEvent | A node is about to be edited. |
| save-node | SaveNodeEvent | A node is about to be saved. |
| declaration-changed | DeclarationChangedEvent | The XML declaration has been changed. |
| node-changed | NodeChangedEvent | An XML node has been changed. |
| node-created | NodeCreatedEvent | A new XML node has been created. |
| edit-attribute | EditAttributeEvent | An attribute is about to be edited. |
| save-attribute | SaveAttributeEvent | An attribute is about to be saved. |
| attribute-changed | AttributeChangedEvent | A XML node attribute has been changed. |
| delete-node | DeleteNodeEvent | A node is about to be deleted. |
| node-removed | NodeRemovedEvent | A new XML node has been deleted. |
