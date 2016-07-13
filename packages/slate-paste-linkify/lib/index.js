
import isUrl from 'is-url'
import toPascal from 'to-pascal-case'

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 * @return {Object}
 */

function PasteLinkify(options = {}) {
  return {
    onPaste(e, paste, state, editor) {
      if (state.isCollapsed) return
      if (paste.type != 'text' && paste.type != 'html') return
      if (!isUrl(paste.text)) return

      const type = options.type
      const data = {
        [options.hrefProperty || 'href']: paste.text
      }

      let transform = state
        .transform()
        .wrapInline(type, data)

      if (options.collapseTo) {
        transform = transform[`collapseTo${toPascal(options.collapseTo)}`]()
      }

      return transform.apply()
    }
  }
}

/**
 * Export.
 */

export default PasteLinkify
