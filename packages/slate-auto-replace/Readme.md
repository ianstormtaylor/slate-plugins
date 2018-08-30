### `slate-auto-replace`

A [**Slate**](https://github.com/ianstormtaylor/slate) plugin to automatically replace text and apply transforms when the user types certain strings. Useful for implementing "auto-markdown" or other hotkey-based replacement behaviors.

[View Demo ⬈](https://ianstormtaylor.github.io/slate-plugins/#/slate-auto-replace)

```js
import AutoReplace from 'slate-auto-replace'
import { Editor } from 'slate-react'

// Add the plugin to your set of plugins...
const plugins = [
  AutoReplace({
    trigger: 'space',
    before: /^(>)$/,
    change: (change, e, matches) => {
      return change.setBlocks({ type: 'quote' })
    }
  })
]

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

| Option        | Type                         | Description                                                                                                                                                                                                                               |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`trigger`** | `String` `RegExp` `Function` | The trigger to match the inputed character against—either a character like `a` or a key name like `enter` or `tab`.                                                                                                                       |
| **`change`**  | `Function`                   | A function to apply the desired change. It will be called with `change, e, matches, editor` from the event handler. The matching (`before` and `after`) text is deleted but are accessible inside `matches.before` and `matches.after`.   |
| **`after`**   | `RegExp`                     | An optional regexp that must match the text after the trigger for the replacement to occur. Any capturing groups in the regexp will be deleted from the text content, but is accessible in `matches` parameter in the `change` function.  |
| **`before`**  | `RegExp`                     | An optional regexp that must match the text before the trigger for the replacement to occur. Any capturing groups in the regexp will be deleted from the text content, but is accessible in `matches` parameter in the `change` function. |
