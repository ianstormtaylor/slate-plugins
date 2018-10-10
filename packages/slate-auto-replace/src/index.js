import isHotkey from 'is-hotkey'
import typeOf from 'type-of'

/**
 * A Slate plugin to automatically replace a block when a string of matching
 * text is typed.
 *
 * @param {Object} opts
 * @return {Object}
 */

function AutoReplace(opts = {}) {
  if (!opts.change) throw new Error('You must provide a `change` option.')
  if (!opts.trigger) throw new Error('You must provide a `trigger` option.')

  const trigger = normalizeTrigger(opts.trigger)

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Function} next
   * @return {Value}
   */

  function onKeyDown(event, change, next) {
    if (!trigger(event, change, next)) return next()

    const { value } = change
    const { selection } = value
    if (selection.isExpanded) return next()

    const { startBlock } = value
    if (!startBlock) return next()

    const matches = getMatches(value)
    if (!matches) return next()

    event.preventDefault()

    const { start } = selection
    let startOffset = start.offset
    let totalRemoved = 0
    const offsets = getOffsets(matches, startOffset)

    offsets.forEach(offset => {
      change
        .moveAnchorTo(offset.start)
        .moveFocusTo(offset.end)
        .delete()
      totalRemoved += offset.total
    })

    startOffset -= totalRemoved
    change.moveTo(startOffset)
    change.call(opts.change, event, matches)
  }

  /**
   * Try to match the current text of a `value` with the `before` and
   * `after` regexes.
   *
   * @param {Value} value
   * @return {Object}
   */

  function getMatches(value) {
    const { selection, startText } = value
    const { start } = selection
    const { text } = startText
    let after = null
    let before = null

    if (opts.after) {
      const string = text.slice(start.offset)
      after = string.match(opts.after)
    }

    if (opts.before) {
      const string = text.slice(0, start.offset)
      before = string.match(opts.before)
    }

    // If both sides, require that both are matched, otherwise null.
    if (opts.before && opts.after && !before) after = null
    if (opts.before && opts.after && !after) before = null

    // Return null unless we have a match.
    if (!before && !after) return null

    if (after) after[0] = after[0].replace(/\s+$/, '')
    if (before) before[0] = before[0].replace(/^\s+/, '')

    return { before, after }
  }

  /**
   * Return the offsets for `matches` with `start` offset.
   *
   * @param {Object} matches
   * @param {Number} start
   * @return {Object}
   */

  function getOffsets(matches, start) {
    const { before, after } = matches
    const offsets = []
    let totalRemoved = 0

    if (before) {
      const match = before[0]
      let startOffset = 0
      let matchIndex = 0

      before.slice(1, before.length).forEach(current => {
        if (current === undefined) return

        matchIndex = match.indexOf(current, matchIndex)
        startOffset = start - totalRemoved + matchIndex - match.length

        offsets.push({
          start: startOffset,
          end: startOffset + current.length,
          total: current.length,
        })

        totalRemoved += current.length
        matchIndex += current.length
      })
    }

    if (after) {
      const match = after[0]
      let startOffset = 0
      let matchIndex = 0

      after.slice(1, after.length).forEach(current => {
        if (current === undefined) return

        matchIndex = match.indexOf(current, matchIndex)
        startOffset = start - totalRemoved + matchIndex

        offsets.push({
          start: startOffset,
          end: startOffset + current.length,
          total: 0,
        })

        totalRemoved += current.length
        matchIndex += current.length
      })
    }

    return offsets
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return { onKeyDown }
}

/**
 * Normalize a `trigger` option to a matching function.
 *
 * @param {Mixed} trigger
 * @return {Function}
 */

function normalizeTrigger(trigger) {
  switch (typeOf(trigger)) {
    case 'function':
      return trigger
    case 'regexp':
      return event => !!(event.key && event.key.match(trigger))
    case 'string':
      return isHotkey(trigger)
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default AutoReplace
