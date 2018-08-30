### `slate-soft-break`

A Slate plugin to add soft breaks on <kbd>enter</kbd>.

[View Demo ⬈](https://ianstormtaylor.github.io/slate-plugins/#/slate-soft-break)

```js
import SoftBreak from 'slate-soft-break'
import { Editor } from 'slate-react'

const plugins = [
  SoftBreak()
]

<Editor
  ...
  plugins={plugins}
/>
```

| Option      | Type      | Description                                             |
| ----------- | --------- | ------------------------------------------------------- |
| **`shift`** | `Boolean` | Require the <kbd>shift</kbd> key to be pressed as well. |
