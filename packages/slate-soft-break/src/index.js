
/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 *   @property {Array} onlyIn
 *   @property {Array} ignoreIn
 * @return {Object}
 */

function SoftBreak(options = {}) {
  return {
    onKeyDown(event, change) {
      if (event.key !== 'Enter') return
      if (options.shift && event.shiftKey === false) return
      return change.insertText('\n')
    }
  }
}

/**
 * Export.
 */

export default SoftBreak
