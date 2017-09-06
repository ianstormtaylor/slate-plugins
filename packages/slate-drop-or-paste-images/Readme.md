
# `slate-drop-or-paste-images`

A Slate plugin that inserts images on drop or paste.

When trying to add support for inserting images, there are many ways that a user can do it. In total, this plugin enables six ways of inserting images. The user can choose between:

- dragging and dropping an image file from their computer.
- dragging and dropping an HTML fragment that contains an image.
- dragging and dropping a URL to an image on the web.
- pasting an HTML fragment that contains an image.
- pasting an image file from their clipboard.
- pasting a URL to an image on the web.

It does not handle dragging and dropping Slate nodes or fragments, which is handled internally by Slate by default. And it does not handle insert images via an image chooser, which you'd want to implement with your own UI components.


## Demo

https://ianstormtaylor.github.io/slate-drop-or-paste-images/


## Install

```
npm install slate-drop-or-paste-images
```


## Usage

```js
import InsertImages from 'slate-drop-or-paste-images'

const plugins = [
  InsertImages({
    extensions: ['png'],
    applyTransform: (transform, file) => {
      return transform.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      })
    }
  })
]
```

#### Arguments
- `insertImage: Function` — a transforming function that is passed a Slate `Change` and a `File` object representing an image. It should apply the proper transform that inserts the image into Slate based on your schema. It can return a promise resolved with the resulting Slate `Change`.
- `[extensions: Array]` — an array of allowed extensions.


## Development

Clone the repository and then run:

```
npm install
npm watch
```

And open the example page in your browser:

```
http://localhost:8888/
```


## License

The MIT License

Copyright &copy; 2016, [Ian Storm Taylor](https://ianstormtaylor.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
