
import isUrl from 'is-url'
import toPascal from 'to-pascal-case'

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 * @return {Object}
 */

function PasteLinkify(options = {}) {
  function hasLinks(state) {
    return state.inlines.some(inline => inline.type == 'link')
  }

  return {
    onPaste(e, paste, state) {
      if (state.isCollapsed) return
      if (paste.type !== 'text' && paste.type !== 'html') return
      if (!isUrl(paste.text)) return


      const type = options.type
      const data = {
        [options.hrefProperty || 'href']: paste.text
      }

      let transform = state
        .transform()

      if (hasLinks(state)) {
        transform = transform.unwrapInline('link')
      }

      transform = transform.wrapInline({type, data})

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
