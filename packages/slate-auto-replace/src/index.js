
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
  const { transform } = opts
  const trigger = normalizeTrigger(opts.trigger)
  let ignoreIn
  let onlyIn

  if (opts.ignoreIn) ignoreIn = normalizeMatcher(opts.ignoreIn)
  if (opts.onlyIn) onlyIn = normalizeMatcher(opts.onlyIn)

  if (!transform) throw new Error('You must provide a `transform` option.')
  if (!trigger) throw new Error('You must provide a `trigger` option.')

  /**
   * On key down.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @return {Value}
   */

  function onKeyDown(event, change, editor) {
    if (trigger(event)) {
      return replace(event, change, editor)
    }
  }

  /**
   * Replace a block's properties.
   *
   * @param {Event} event
   * @param {Change} change
   * @param {Editor} editor
   * @return {Value}
   */

  function replace(event, change, editor) {
    const { value } = change
    if (value.isExpanded) return

    const { startBlock } = value
    if (!startBlock) return

    const type = startBlock.type
    if (onlyIn && !onlyIn(type)) return
    if (ignoreIn && ignoreIn(type)) return

    const matches = getMatches(value)
    if (!matches) return

    event.preventDefault()

    let startOffset = value.startOffset
    let totalRemoved = 0
    const offsets = getOffsets(matches, startOffset)

    offsets.forEach((offset) => {
      change
        .moveOffsetsTo(offset.start, offset.end)
        .delete()
      totalRemoved += offset.total
    })

    startOffset -= totalRemoved
    change.moveOffsetsTo(startOffset, startOffset)

    return change.call(transform, event, matches, editor)
  }

  /**
   * Try to match the current text of a `value` with the `before` and
   * `after` regexes.
   *
   * @param {Value} value
   * @return {Object}
   */

  function getMatches(value) {
    const { startText, startOffset } = value
    const { text } = startText
    let after = null
    let before = null

    if (opts.after) {
      const string = text.slice(startOffset)
      after = string.match(opts.after)
    }

    if (opts.before) {
      const string = text.slice(0, startOffset)
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

      before.slice(1, before.length).forEach((current) => {
        if (current === undefined) return

        matchIndex = match.indexOf(current, matchIndex)
        startOffset = start - totalRemoved + matchIndex - match.length

        offsets.push({
          start: startOffset,
          end: startOffset + current.length,
          total: current.length
        })

        totalRemoved += current.length
        matchIndex += current.length
      })
    }

    if (after) {
      const match = after[0]
      let startOffset = 0
      let matchIndex = 0

      after.slice(1, after.length).forEach((current) => {
        if (current === undefined) return

        matchIndex = match.indexOf(current, matchIndex)
        startOffset = start - totalRemoved + matchIndex

        offsets.push({
          start: startOffset,
          end: startOffset + current.length,
          total: 0
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
 * Normalize a node matching plugin option.
 *
 * @param {Function|Array|String} matchIn
 * @return {Function}
 */

function normalizeMatcher(matcher) {
  switch (typeOf(matcher)) {
    case 'function':
      return matcher
    case 'array':
      return node => matcher.includes(node)
    case 'string':
      return node => node == matcher
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default AutoReplace
