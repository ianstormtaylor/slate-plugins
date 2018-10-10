/**
 * Handlers to wrap.
 *
 * @type {Array}
 */

const PLUGIN_HANDLERS = [
  'onBeforeInput',
  'onBlur',
  'onCopy',
  'onCut',
  'onDrop',
  'onInput',
  'onKeyDown',
  'onKeyUp',
  'onPaste',
  'onSelect',
]

/**
 * A Slate plugin that wraps another `plugin` to make it only trigger when a
 * `when` function returns true.
 *
 * @param {Object} options
 * @return {Object}
 */

function SlateWhen(options = {}) {
  const { when, plugin } = options
  if (!when) throw new Error('You must provide a `when` option.')
  if (!plugin) throw new Error('You must provide a `plugin` option.')

  const wrapped = {}

  for (const handler of PLUGIN_HANDLERS) {
    if (plugin[handler]) {
      wrapped[handler] = (event, change, next) => {
        if (!when(change.value)) return next()
        return plugin[handler](event, change, next)
      }
    }
  }

  return wrapped
}

/**
 * Export.
 *
 * @type {Function}
 */

export default SlateWhen
