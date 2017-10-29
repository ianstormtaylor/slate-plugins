
import isUrl from 'is-url'
import toPascal from 'to-pascal-case'
import { getEventTransfer } from 'slate-react'

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 *   @property {String} type
 *   @property {String} hrefProperty
 *   @property {String} collapseTo
 * @return {Object}
 */

function PasteLinkify(options = {}) {
  const {
    type = 'link',
    hrefProperty = 'href',
  } = options

  function hasLinks(value) {
    return value.inlines.some(inline => inline.type == type)
  }

  function unwrapLink(change) {
    change.unwrapInline(type)
  }

  function wrapLink(change, href) {
    change.wrapInline({
      type,
      data: { [hrefProperty]: href },
    })
  }

  return {
    onPaste(event, change) {
      const transfer = getEventTransfer(event)
      const { value } = change
      const { text } = transfer
      if (transfer.type !== 'text' && transfer.type !== 'html') return
      if (!isUrl(text)) return

      if (value.isCollapsed) {
        const { startOffset } = value
        change.insertText(text).moveOffsetsTo(startOffset, startOffset + text.length)
      }

      else if (hasLinks(value)) {
        change.call(unwrapLink)
      }

      change.call(wrapLink, text)

      if (options.collapseTo) {
        change[`collapseTo${toPascal(options.collapseTo)}`]()
      }

      return change
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default PasteLinkify
