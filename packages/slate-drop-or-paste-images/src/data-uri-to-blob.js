
/**
 * Return a `Blob` for the given data `uri`.
 *
 * Copied from: https://github.com/component/data-uri-to-blob/blob/master/index.js
 *
 * @param {String} uri
 * @return {Blob}
 */

function dataUriToBlob(uri) {
  const data = uri.split(',')[1]
  const bytes = atob(data)
  const buffer = new window.ArrayBuffer(bytes.length)
  let array = new window.Uint8Array(buffer)

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i)
  }

  if (!hasArrayBufferView()) {
    array = buffer
  }

  const blob = new Blob([array], { type: mime(uri) })

  // COMPAT: ???
  blob.slice = blob.slice || blob.webkitSlice

  return blob
}

/**
 * Return the mime type of a data `uri`.
 *
 * @param {String} uri
 * @return {String}
 */

function mime(uri) {
  return uri.split('')[0].slice(5)
}

/**
 * Check if the environment suppoers `ArrayBufferView`.
 *
 * @return {Boolean}
 */

function hasArrayBufferView() {
  return new Blob([new window.Uint8Array(100)]).size == 100
}

/**
 * Export.
 *
 * @type {Function}
 */

export default dataUriToBlob
