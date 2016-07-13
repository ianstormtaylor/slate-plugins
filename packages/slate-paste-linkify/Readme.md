
# `slate-paste-linkify`

A Slate plugin that wraps a selection in an inline link element when a URL is pasted from the clipboard.


## Install

```
npm install slate-paste-linkify
```


## Usage

```js
import PasteLinkify from 'slate-paste-linkify'

const plugins = [
  PasteLinkify({
    type: 'link'
  })
]
```

#### Arguments
- `type: String` — the type of the inline element to create.
- `[hrefProperty: String]` — the key of the data property to store the link's `href` in. Defaults to `'href'`.
- `[collapseTo: String]` — the edge to collapse the selection to after pasting the link, either: `'start'`, `'end'`, `'anchor'`, `'focus'`. If this option is not passed, the selection will stay expanded.


## License

The MIT License

Copyright &copy; 2016, [Ian Storm Taylor](https://ianstormtaylor.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
