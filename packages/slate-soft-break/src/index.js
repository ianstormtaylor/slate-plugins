
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
      const { state } = change
      if (event.key != 'Enter') return
      if (options.shift && event.shiftKey == false) return

      const { startBlock } = state
      const { type } = startBlock
      if (options.onlyIn && !options.onlyIn.includes(type)) return
      if (options.ignoreIn && options.ignoreIn.includes(type)) return

      return change.insertText('\n')
    }
  }
}

/**
 * Export.
 */

export default SoftBreak
