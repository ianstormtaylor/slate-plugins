
import typeOf from 'type-of'

/**
 * A Slate plugin to automatically replace a block when a string of matching
 * text is typed.
 *
 * @param {Object} opts
 * @return {Object}
 */

function AutoReplace(opts) {
  opts.trigger = normalizeTrigger(opts.trigger)
  if (opts.ignoreIn) opts.ignoreIn = normalizeMatcher(opts.ignoreIn)
  if (opts.onlyIn) opts.onlyIn = normalizeMatcher(opts.onlyIn)

  if (!opts.transform) throw new Error('You must provide a `transform` option.')
  if (!opts.trigger) throw new Error('You must provide a `trigger` option.')

  /**
   * On before input.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onBeforeInput(e, data, state) {
    if (opts.trigger(e, data)) {
      return replace(e, data, state)
    }
  }

  /**
   * On key down.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function onKeyDown(e, data, state) {
    if (opts.trigger(e, data)) {
      return replace(e, data, state)
    }
  }

  /**
   * Replace a block's properties.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  function replace(e, data, state) {
    if (state.isExpanded) return

    const block = state.startBlock
    const type = block.type
    if (opts.onlyIn && !opts.onlyIn(type)) return
    if (opts.ignoreIn && opts.ignoreIn(type)) return

    const matches = getMatches(state)
    if (!matches) return

    e.preventDefault()

    const { start, end } = getOffsets(matches, state.startOffset)
    let transform = state
      .transform()
      .moveToOffsets(start, end)
      .delete()

    opts.transform(transform, e, data, matches)
    return transform.apply()
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

    if (before && before[1]) start -= before[1].length
    if (after && after[1]) end += after[1].length

    return { start, end }
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
    case 'regexp':
      return (e, data) => !!(e.data && e.data.match(trigger))
    case 'string':
      return (e, data) => data.key ? data.key == trigger : e.data == trigger
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
