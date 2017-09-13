
### `slate-soft-break`

A Slate plugin to add soft breaks on <kbd>enter</kbd>.

[View Demo ⬈](https://ianstormtaylor.github.io/slate-plugins/#/slate-soft-break)

```js
import SoftBreak from 'slate-soft-break'
import { Editor } from 'slate-react'

// Add the plugin to your set of plugins...
const plugins = [
  SoftBreak({
    onlyIn: ['code']
  })
]

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

Option | Type | Description
--- | --- | ---
**`shift`** | `Boolean` | Require the <kbd>shift</kbd> key to be pressed as well.
**`ignoreIn`** | `Array` | An array of block types to not soft break inside.
**`onlyIn`** | `Array` | An array of block types to only soft break inside.
