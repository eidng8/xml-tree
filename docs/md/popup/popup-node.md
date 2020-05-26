# popup-node

> Popup box for editing XML node.

## Props

| Prop name | Description            | Type    | Values | Default |
| --------- | ---------------------- | ------- | ------ | ------- |
| node      | The node to be edited. | XmlNode | -      |         |

## Events

| Event name | Type | Description |
| --- | --- | --- |
| save | SaveNodePopupEvent | The node passed in the `data` field shall be saved. |
| close | UIEvent | The popup has been closed. |
