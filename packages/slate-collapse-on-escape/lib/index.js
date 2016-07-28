
import toPascal from 'to-pascal-case'

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 *   @property {Boolean} toStart (boolean)
 * @return {Object}
 */

function CollapseOnEscape(options = {}) {
  return {
    onKeyDown(e, data, state) {
      if (data.key != 'esc') return
      if (state.isCollapsed) return

      const edge = toPascal(options.toEdge || 'start')

      return state
        .transform()
        [`collapseTo${edge}`]()
        .apply()
    }
  }
}

/**
 * Export.
 */

export default CollapseOnEscape
