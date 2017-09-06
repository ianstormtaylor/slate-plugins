
import Promise from 'es6-promise'
import isImage from 'is-image'
import isUrl from 'is-url'
import mime from 'mime-types'
import { extname } from 'path'
import loadImageFile from './load-image-file'

/**
 * Insert images on drop or paste.
 *
 * @param {Object} options
 *   @property {Function} insertImage
 *   @property {Array} extensions (optional)
 * @return {Object} plugin
 */

function DropOrPasteImages(options = {}) {
  const {
    insertImage,
    extensions,
  } = options

  if (options.applyTransform && typeof console != 'undefined') {
    console.log('Deprecation (v0.6.0): The `applyTransform` argument to `slate-drop-or-paste-images` has been renamed to `insertImage` instead.')
  }

  if (!insertImage) {
    throw new Error('You must supply an `insertImage` function.')
  }

  /**
   * Apply the change for a given file and update the editor with the result.
   *
   * @param {Change} change
   * @param {Editor} editor
   * @param {Blob} file
   * @return {Promise}
   */

  function asyncApplyChange(change, editor, file) {
    return Promise
      .resolve(insertImage(change, file))
      .then(() => {
        editor.onChange(change)
      })
  }


  /**
   * On drop or paste.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   * @return {State}
   */

  function onInsert(e, data, change, editor) {
    switch (data.type) {
      case 'files': return onInsertFiles(e, data, change, editor)
      case 'html': return onInsertHtml(e, data, change, editor)
      case 'text': return onInsertText(e, data, change, editor)
    }
  }

  /**
   * On drop or paste files.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   * @return {Boolean}
   */

  function onInsertFiles(e, data, change, editor) {
    const { state } = change
    const { target, files } = data

    for (const file of files) {
      if (extensions) {
        const ext = mime.extension(file.type)
        if (!extensions.includes(ext)) continue
      }

      if (target) {
        change.select(target)
      }

      asyncApplyChange(change, editor, file)
    }

    return true
  }

  /**
   * On drop or paste html.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   * @return {Boolean}
   */

  function onInsertHtml(e, data, change, editor) {
    const { state } = change
    const { html, target } = data
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const body = doc.body
    const firstChild = body.firstChild
    if (firstChild.nodeName.toLowerCase() != 'img') return

    const src = firstChild.src

    if (extensions) {
      const ext = extname(src).slice(1)
      if (!extensions.includes(ext)) return
    }

    loadImageFile(src, (err, file) => {
      if (err) return
      let c = editor.getState().change()
      if (target) c.select(target)
      asyncApplyChange(c, editor, file)
    })

    return true
  }

  /**
   * On drop or paste text.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   * @param {Editor} editor
   * @return {Boolean}
   */

  function onInsertText(e, data, change, editor) {
    const { state } = change
    const { text, target } = data
    if (!isUrl(text)) return
    if (!isImage(text)) return

    loadImageFile(text, (err, file) => {
      if (err) return
      const c = editor.getState().change()
      if (target) c.select(target)
      asyncApplyChange(c, editor, file)
    })

    return true
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onDrop: onInsert,
    onPaste: onInsert,
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default DropOrPasteImages
