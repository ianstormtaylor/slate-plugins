
import Promise from 'es6-promise'
import isImage from 'is-image'
import isUrl from 'is-url'
import logger from 'slate-dev-logger'
import mime from 'mime-types'
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
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @param {Object} transfer
   * @return {Boolean}
   */

  function onInsertHtml(event, change, editor, transfer) {
    const { html, target } = transfer
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
      const c = editor.getState().change()
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
