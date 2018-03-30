
import Promise from 'es6-promise'
import isImage from 'is-image'
import isUrl from 'is-url'
import logger from 'slate-dev-logger'
import loadImageFile from './load-image-file'
import { extname } from 'path'
import { getEventTransfer } from 'slate-react'

/**
 * Insert images on drop or paste.
 *
 * @param {Object} options
 *   @property {Function} insertImage
 *   @property {Array} extensions (optional)
 * @return {Object} plugin
 */

function DropOrPasteImages(options = {}) {
  let {
    insertImage,
    extensions,
  } = options

  if (options.applyTransform) {
    logger.deprecate('0.6.0', 'The `applyTransform` argument to `slate-drop-or-paste-images` has been renamed to `insertImage` instead.')
    insertImage = options.applyTransform
  }

  if (!insertImage) {
    throw new Error('You must supply an `insertImage` function.')
  }

  /**
   * Check file extension against user-defined options.
   *
   * @param {Type} string
   * @return {Boolean}
   */

  function matchExt(type) {
    let accepted = false
    for (const ext of extensions) {
      if (type.includes(ext)) accepted = true
    }
    return accepted
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
      .resolve(insertImage(change, file, editor))
      .then(() => {
        editor.onChange(change)
      })
  }


  /**
   * On drop or paste.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @return {State}
   */

  function onInsert(event, change, editor) {
    const transfer = getEventTransfer(event)
    switch (transfer.type) {
      case 'files': return onInsertFiles(event, change, editor, transfer)
      case 'html': return onInsertHtml(event, change, editor, transfer)
      case 'text': return onInsertText(event, change, editor, transfer)
    }
  }

  /**
   * On drop or paste files.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @param {Object} transfer
   * @return {Boolean}
   */

  function onInsertFiles(event, change, editor, transfer) {
    const { target, files } = transfer

    for (const file of files) {
      if (extensions) {
        const type = file.type
        if(!matchExt(type)) continue
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
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @param {Object} transfer
   * @return {Boolean}
   */

  function onInsertHtml(event, change, editor, transfer) {
    console.log(2);
    const { html, target } = transfer
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const body = doc.body
    const firstChild = body.firstChild
    if (firstChild.nodeName.toLowerCase() != 'img') return

    const src = firstChild.src

    if (extensions) {
      const ext = extname(src).slice(1)
        if(!matchExt(ext)) return
    }

    loadImageFile(src, (err, file) => {
      if (err) return
      const c = editor.value.change()
      if (target) c.select(target)
      asyncApplyChange(c, editor, file)
    })

    return true
  }

  /**
   * On drop or paste text.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @param {Object} transfer
   * @return {Boolean}
   */

  function onInsertText(event, change, editor, transfer) {
    const { text, target } = transfer
    if (!isUrl(text)) return
    if (!isImage(text)) return

    loadImageFile(text, (err, file) => {
      if (err) return
      const c = editor.value.change()
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
