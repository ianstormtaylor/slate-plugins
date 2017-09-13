
### `slate-paste-linkify`

A Slate plugin that wraps a selection in an inline link element when a URL is pasted from the clipboard.

[View Demo ⬈](https://ianstormtaylor.github.io/slate-plugins/#/slate-paste-linkify)

```js
import PasteLinkify from 'slate-paste-linkify'
import { Editor } from 'slate-react'

// Add the plugin to your set of plugins...
const plugins = [
  PasteLinkify({
    type: 'link'
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
**`type`** (required) | `String` | The type of the inline element to create.
**`hrefProperty`** | `String` | The key of the data property to store the link's `href` in. Defaults to `'href'`.
**`collapseTo`** | `String` | The edge to collapse the selection to after pasting the link, either: `'start'`, `'end'`, `'anchor'`, `'focus'`. If this option is not passed, the selection will stay expanded.
