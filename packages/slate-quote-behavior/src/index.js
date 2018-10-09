/**
 * A Slate plugin that wraps another `plugin` to make it only trigger when a
 * `when` function returns true.
 *
 * @param {Object} options
 * @return {Object}
 */

function SlateQuoteBehavior(options = {}) {
  const { queries = {}, commands = {} } = options
  const { activeQuote = 'active_quote' } = queries
  const { unwrapQuote = 'unwrap_quote' } = commands

  return {
    onKeyDown(event, change, editor) {
      const { value } = change
      const { selection } = value
      const { isCollapsed, start } = selection

      if (
        event.key === 'enter' &&
        !event.shiftKey &&
        isCollapsed &&
        start.offset === 0 &&
        value.startBlock.text === '' &&
        editor.query(activeQuote)
      ) {
        editor.command(unwrapQuote)
      }

      if (
        event.key === 'backspace' &&
        isCollapsed &&
        start.offset === 0 &&
        editor.query(activeQuote)
      ) {
        editor.command(unwrapQuote)
      }
    },
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default SlateQuoteBehavior
