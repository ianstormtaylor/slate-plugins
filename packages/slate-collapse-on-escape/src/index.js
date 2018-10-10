import toPascal from 'to-pascal-case'

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 * @return {Object}
 */

function CollapseOnEscape(options = {}) {
  return {
    onKeyDown(event, change, next) {
      const { value } = change
      const { selection } = value
      if (event.key != 'Escape') return next()
      if (selection.isCollapsed) return next()
      const edge = toPascal(options.toEdge || 'start')
      change[`moveTo${edge}`]()
    },
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default CollapseOnEscape
