### `slate-when`

A Slate plugin that wraps another plugin to make it only trigger when the `value` of the editor is in a certain state.

[View Demo ⬈](https://ianstormtaylor.github.io/slate-plugins/#/slate-when)

```js
import SoftBreak from 'slate-soft-break'
import When from 'slate-when'
import { Editor } from 'slate-react'

const plugins = [
  When({
    when: value => value.blocks.some(b => b.type === 'code'),
    plugin: SoftBreak(),
  })
]

<Editor
  ...
  plugins={plugins}
/>
```

| Option       | Type                                       | Description                            |
| ------------ | ------------------------------------------ | -------------------------------------- |
| **`when`**   | `Function` `when(value: Value) => Boolean` | The constraint to check.               |
| **`plugin`** | `Object`                                   | An instance of the plugin to contrain. |
