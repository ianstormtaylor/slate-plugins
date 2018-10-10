export default function SoftBreak(options = {}) {
  return {
    onKeyDown(event, change, next) {
      if (event.key !== 'Enter') return next()
      if (options.shift && event.shiftKey === false) return next()
      return change.insertText('\n')
    },
  }
}
