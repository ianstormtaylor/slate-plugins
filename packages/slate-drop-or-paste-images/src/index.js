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
  let { insertImage, extensions, acceptableTransferTypes } = options

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
   * On drop or paste.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @return {State}
   */

  function onInsert(event, editor, next) {
    const transfer = getEventTransfer(event)
    const range = getEventRange(event, editor)

    if (
      !acceptableTransferTypes ||
      acceptableTransferTypes.includes(transfer.type)
    ) {
      switch (transfer.type) {
        case 'files':
          return onInsertFiles(event, editor, next, transfer, range)
        case 'html':
          return onInsertHtml(event, editor, next, transfer, range)
        case 'text':
          return onInsertText(event, editor, next, transfer, range)
        default:
          return next()
      }
    } else {
      return next()
    }
  }

  /**
   * On drop or paste files.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertFiles(event, editor, next, transfer, range) {
    const { files } = transfer

    for (const file of files) {
      const type = file.type
      const [, ext] = type.split('/')

      if (extensions) {
        if (!matchExt(ext)) continue
      }

      if (range) {
        editor.select(range)
      }

      insertImage(event, editor, file, { source: 'files', ext })
    }
  }

  /**
   * On drop or paste html.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertHtml(event, editor, next, transfer, range) {
    const { html } = transfer
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const body = doc.body
    const firstChild = body.firstChild
    if (firstChild.nodeName.toLowerCase() != 'img') return next()

    const src = firstChild.src
    const ext = extname(src).slice(1)

    if (extensions) {
      if (!matchExt(ext)) return next()
    }

    loadImageFile(src, (err, file) => {
      if (err) return

      if (range) {
        editor.select(range)
      }

      insertImage(event, editor, file, { source: 'html', src, ext })
    })
  }

  /**
   * On drop or paste text.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertText(event, editor, next, transfer, range) {
    const { text } = transfer
    if (!isUrl(text)) return next()
    if (!isImage(text)) return next()

    loadImageFile(text, (err, file) => {
      if (err) return

      if (range) {
        editor.select(range)
      }

      insertImage(event, editor, file, {
        source: 'text',
        text,
        ext: extname(text).slice(1),
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
