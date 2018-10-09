/**
 * A Slate plugin that wraps another `plugin` to make it only trigger when a
 * `when` function returns true.
 *
 * @param {Object} options
 * @return {Object}
 */

function SlateListBehavior(options = {}) {
  const { getActiveListItem, indentListItem, outdentListItem } = options

  return {
    onKeyDown(event, change, editor) {
      const { value } = change
      const { selection } = value
      const { isCollapsed, start } = selection

      if (event.key === 'enter' && !event.shiftKey) {
        const listItem = getActiveListItem(value)

        if (listItem) {
          if (
            isCollapsed &&
            start.offset === 0 &&
            value.startBlock.text === ''
          ) {
            let size = change.operations.size

            while (size != change.operations.size) {
              size = change.operations.size
              change.call(outdentListItem)
            }
          } else {
            change.splitBlock(2)
          }
        }
      }

      if (
        event.key === 'backspace' &&
        isCollapsed &&
        start.offset === 0 &&
        getActiveListItem(value)
      ) {
        change.call(outdentListItem)
      }

      if (event.key === 'tab' && getActiveListItem(value)) {
        event.preventDefault()

        if (event.shiftKey) {
          change.call(outdentListItem)
        } else {
          change.call(indentListItem)
        }
      }
    },
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default SlateListBehavior
