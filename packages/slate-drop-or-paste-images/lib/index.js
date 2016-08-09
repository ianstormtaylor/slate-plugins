
import isImage from 'is-image'
import isUrl from 'is-url'
import mime from 'mime-types'
import { extname } from 'path'
import loadImageFile from './load-image-file'

/**
 * Insert images on drop or paste.
 *
 * @param {Object} options
 *   @property {Function} applyTransform
 *   @property {Array} extensions (optional)
 * @return {Object} plugin
 */

function DropOrPasteImages({
  applyTransform,
  extensions
}) {
  if (!applyTransform) {
    throw new Error('You must supply an `applyTransform` function.')
  }

  /**
   * On drop or paste.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onInsert(e, data, state, editor) {
    switch (data.type) {
      case 'files': return onInsertFiles(e, data, state, editor)
      case 'html': return onInsertHtml(e, data, state, editor)
      case 'text': return onInsertText(e, data, state, editor)
    }
  }

  /**
   * On drop or paste files.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onInsertFiles(e, data, state, editor) {
    const { target, files } = data
    let transform = state.transform()
    if (target) transform = transform.moveTo(target)

    for (const file of files) {
      if (extensions) {
        const ext = mime.extension(file.type)
        if (!extensions.includes(ext)) continue
      }

      transform = applyTransform(transform, file)
    }

    return transform.apply()
  }

  /**
   * On drop or paste html.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onInsertHtml(e, data, state, editor) {
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
      let transform = editor.getState().transform()
      if (target) transform = transform.moveTo(target)
      transform = applyTransform(transform, file)
      const next = transform.apply()
      editor.onChange(next)
    })

    return state
  }

  /**
   * On drop or paste text.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onInsertText(e, data, state, editor) {
    const { text, target } = data
    if (!isUrl(text)) return
    if (!isImage(text)) return

    loadImageFile(text, (err, file) => {
      if (err) return
      let transform = editor.getState().transform()
      if (target) transform = transform.moveTo(target)
      transform = applyTransform(transform, file)
      const next = transform.apply()
      editor.onChange(next)
    })

    return state
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
