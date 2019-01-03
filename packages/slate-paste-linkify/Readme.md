### `slate-paste-linkify`

A Slate plugin that wraps a selection in an inline link element when a URL is pasted from the clipboard.

[View Demo ⬈](https://slate-plugins.netlify.com/#/slate-paste-linkify)

```js
import PasteLinkify from 'slate-paste-linkify'
import { Editor } from 'slate-react'

// Add the plugin to your set of plugins...
const plugins = [
  PasteLinkify()
]

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

This plugin works by taking in options that specify link-related commands and queries to execute when it detects that the user is trying to insert a link (by pasting or drag-dropping). This way you can define the exact behavior you want in the commands, but delegate the detection of links being inserted to the plugin.

| Option                                          | Type     | Description                                                                                                          |
| ----------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| **`isActiveQuery`** (default: `'isLinkActive'`) | `String` | The name of the query that checks whether the current selection has a link in it to unwrap.                          |
| **`wrapCommand`** (default: `'wrapLink'`)       | `String` | The name of the command that wraps the selection in a link. It will be passed the `url` of the link as its argument. |
| **`unwrapCommand`** (default: `'unwrapLink'`)   | `String` | The name of the command that unwraps a link in the current selection.                                                |
