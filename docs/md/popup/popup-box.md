# popup-box

> Popup box

## Props

| Prop name | Description | Type | Values | Default |
| --- | --- | --- | --- | --- |
| message | Message to be shown in the popup box. | string | - |  |
| messageHint | Message tooltip to the popup box message. | string | - |  |

## Events

| Event name | Type               | Description                         |
| ---------- | ------------------ | ----------------------------------- |
| close      | UIEvent            | The popup has been closed.          |
| save       | SaveNodePopupEvent | The `save` button has been pressed. |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| title   |             |          |
| default |             |          |
| footer  |             |          |
