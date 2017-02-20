
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
   * On before input.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onBeforeInput(e, data, state, editor) {
    if (trigger(e, data)) {
      return replace(e, data, state, editor)
    }
  }

  /**
   * On key down.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function onKeyDown(e, data, state, editor) {
    // Don't waste cycles checking regexs or characters, since they should be
    // handled in the `onBeforeInput` handler instead.
    if (typeOf(opts.trigger) == 'regexp') return
    if (typeOf(opts.trigger) == 'string' && opts.trigger.length == 1) return

    if (trigger(e, data, { key: true })) {
      return replace(e, data, state, editor)
    }
  }

  /**
   * Replace a block's properties.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @param {Editor} editor
   * @return {State}
   */

  function replace(e, data, state, editor) {
    if (state.isExpanded) return

    const block = state.startBlock
    const type = block.type
    if (onlyIn && !onlyIn(type)) return
    if (ignoreIn && ignoreIn(type)) return

    const matches = getMatches(state)
    if (!matches) return

    e.preventDefault()

    let startOffset = state.startOffset
    let totalRemoved = 0
    const currentTransform = state.transform()
    const offsets = getOffsets(matches, startOffset)

    offsets.forEach(function (offset) {
      currentTransform
        .moveToOffsets(offset.start, offset.end)
        .delete()
      totalRemoved += offset.total
    });

    startOffset -= totalRemoved
    currentTransform.moveToOffsets(startOffset, startOffset)

    return currentTransform
      .call(transform, e, data, matches, editor)
      .apply()
  }

  /**
   * Try to match the current text of a `state` with the `before` and
   * `after` regexes.
   *
   * @param {State} state
   * @return {Object}
   */

  function getMatches(state) {
    const { startText, startOffset } = state
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

    if(after) after[0] = after[0].replace(/\s+$/,"")
    if(before) before[0] = before[0].replace(/^\s+/,"")

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
    let end = start
    let offsets = []
    let totalRemoved = 0

    if (before && before.length == 3) {
      // Offset to remove first match
      offsets.push({
        start: start - before[0].length,
        end: end - before[0].length + before[1].length,
        total: before[1].length
      })
      totalRemoved += before[1].length

      // Offset to remove last match
      offsets.push({
        start: start - before[2].length - totalRemoved,
        end: end - totalRemoved,
        total: before[2].length
      })

      return offsets
    }

    if (before && before.length == 2) {
      // Offset to remove first match
      offsets.push({
        start: start - before[0].length,
        end: end - before[0].length + before[1].length,
        total: before[1].length
      })
      totalRemoved += before[1].length
    }

    if(after && after.length == 2) {
      // Offset to remove last match
      offsets.push({
        start: start - totalRemoved + after[0].length - after[1].length,
        end: end - totalRemoved + after[0].length,
        total: 0
      })
    }

    return offsets
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onBeforeInput,
    onKeyDown
  }
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
      return (e, data) => {
        return !!(e.data && e.data.match(trigger))
      }
    case 'string':
      return (e, data, opts = {}) => {
        return opts.key
          ? data.key == trigger
          : e.data == trigger
      }
  }
}

/**
 * Normalize a node matching plugin option.
 *
 * @param {Function || Array || String} matchIn
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
