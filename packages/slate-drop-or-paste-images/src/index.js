import Promise from 'es6-promise'
import isImage from 'is-image'
import isUrl from 'is-url'
import logger from 'slate-dev-logger'
import loadImageFile from './load-image-file'
import { extname } from 'path'
import { getEventTransfer, getEventRange } from 'slate-react'

/**
 * Insert images on drop or paste.
 *
 * @param {Object} options
 *   @property {Function} insertImage
 *   @property {Array} extensions (optional)
 * @return {Object} plugin
 */

function DropOrPasteImages(options = {}) {
  let { insertImage, extensions } = options

  if (options.applyTransform) {
    logger.deprecate(
      '0.6.0',
      'The `applyTransform` argument to `slate-drop-or-paste-images` has been renamed to `insertImage` instead.'
    )
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
   * @param {Blob} file
   * @return {Promise}
   */

  function asyncApplyChange(change, file) {
    const { editor } = change

    return Promise.resolve(insertImage(change, file)).then(() => {
      editor.onChange(change)
    })
  }

  /**
   * On drop or paste.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {State}
   */

  function onInsert(event, change, next) {
    const { editor } = change
    const transfer = getEventTransfer(event)
    const range = getEventRange(event, editor)

    switch (transfer.type) {
      case 'files':
        return onInsertFiles(event, change, next, transfer, range)
      case 'html':
        return onInsertHtml(event, change, next, transfer, range)
      case 'text':
        return onInsertText(event, change, next, transfer, range)
    }
  }

  /**
   * On drop or paste files.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertFiles(event, change, next, transfer, range) {
    const { files } = transfer

    for (const file of files) {
      if (extensions) {
        const type = file.type
        const [, ext] = type.split('/')
        if (!matchExt(ext)) continue
      }

      if (range) {
        change.select(range)
      }

      asyncApplyChange(change, file)
    }
  }

  /**
   * On drop or paste html.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertHtml(event, change, next, transfer, range) {
    const { editor } = change
    const { html } = transfer
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const body = doc.body
    const firstChild = body.firstChild
    if (firstChild.nodeName.toLowerCase() != 'img') return next()

    const src = firstChild.src

    if (extensions) {
      const ext = extname(src).slice(1)
      if (!matchExt(ext)) return next()
    }

    loadImageFile(src, (err, file) => {
      if (err) return

      editor.change(c => {
        if (range) {
          c.select(range)
        }

        asyncApplyChange(c, file)
      })
    })
  }

  /**
   * On drop or paste text.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertText(event, change, next, transfer, range) {
    const { editor } = change
    const { text } = transfer
    if (!isUrl(text)) return next()
    if (!isImage(text)) return next()

    loadImageFile(text, (err, file) => {
      if (err) return

      editor.change(c => {
        if (range) {
          c.select(range)
        }

        asyncApplyChange(c, editor, file)
      })
    })
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
