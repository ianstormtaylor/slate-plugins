
/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 *   @property {Array} onlyIn (optional)
 *   @property {Array} ignoreIn (optional)
 * @return {Object}
 */

function SoftBreak(options = {}) {
  return {
    onKeyDown(e, state, editor) {
      if (e.which != 13) return

      const { startBlock } = state
      const { type } = startBlock
      if (options.onlyIn && !options.onlyIn.includes(type)) return
      if (options.ignoreIn && options.ignoreIn.includes(type)) return

      return state
        .transform()
        .insertText('\n')
        .apply()
    }
  }
}

/**
 * Export.
 */

export default SoftBreak
