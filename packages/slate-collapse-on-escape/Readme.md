### `slate-collapse-on-escape`

A Slate plugin that simply collapses the selection on escape.

[View Demo ⬈](https://ianstormtaylor.github.io/slate-plugins/#/slate-collapse-on-escape)

```js
import CollapseOnEscape from 'slate-collapse-on-escape'
import { Editor } from 'slate-react'

// Add the plugin to your set of plugins...
const plugins = [
  CollapseOnEscape()
]

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

| Option       | Type     | Description                                                                                          |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------- |
| **`toEdge`** | `String` | The edge to collapse to, either: `'start'`, `'end'`, `'anchor'` or `'focus'`. Defaults to `'start'`. |
