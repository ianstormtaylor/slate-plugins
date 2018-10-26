### `slate-drop-or-paste-images`

A Slate plugin that inserts images on drop or paste.

When trying to add support for inserting images, there are many ways that a user can do it. In total, this plugin enables six ways of inserting images. The user can choose between:

- dragging and dropping an image file from their computer.
- dragging and dropping an HTML fragment that contains an image.
- dragging and dropping a URL to an image on the web.
- pasting an HTML fragment that contains an image.
- pasting an image file from their clipboard.
- pasting a URL to an image on the web.

It does not handle dragging and dropping Slate nodes or fragments, which is handled internally by Slate by default. And it does not handle insert images via an image chooser, which you'd want to implement with your own UI components.

[View Demo ⬈](https://ianstormtaylor.github.io/slate-plugins/#/slate-drop-or-paste-images)

```js
import InsertImages from 'slate-drop-or-paste-images'
import { Editor } from 'slate-react'

// Add the plugin to your set of plugins...
const plugins = [
  InsertImages({
    extensions: ['png'],
    insertImage: (change, file) => {
      return change.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      })
    }
  })
]

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

| Option            | Type       | Description                                                                                                                                                                                                                                                         |
| ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`insertImage`** | `Function` | A transforming function that is passed a Slate `Change` and a `File` object representing an image. It should apply the proper transform that inserts the image into Slate based on your schema. It can return a promise resolved with the resulting Slate `Change`. |
| **`extensions`**  | `Array`    | An array of allowed extensions.                                                                                                                                                                                                                                     |
