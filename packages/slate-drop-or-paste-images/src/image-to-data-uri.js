/**
 * Convert an <img> source `url` to a data URI and `callback(err, uri)`.
 *
 * @param {String} url
 * @param {Function} callback
 */

function srcToDataUri(url, callback) {
  const canvas = window.document.createElement('canvas')
  const img = window.document.createElement('img')

  if (!canvas.getContext) {
    return setTimeout(callback, 0, new Error('Canvas is not supported.'))
  }

  img.onload = () => {
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const dataUri = canvas.toDataURL('image/png')
    callback(null, dataUri)
  }

  img.onerror = () => {
    callback(new Error('Failed to load image.'))
  }

  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
}

/**
 * Export.
 *
 * @type {Function}
 */

export default srcToDataUri
