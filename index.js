const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

let nodeFetch, fs
if (isNode) {
  nodeFetch = (await import('node-fetch')).default
  fs = await import('fs/promises')
}

async function fetchHTTP(uri, options = {}) {
  const fetchFn = isBrowser ? window.fetch : nodeFetch
  const headers = options.headers || {}
  const response = await fetchFn(uri, { headers })
  return response.text()
}

async function fetchFile(uri) {
  if (isBrowser) {
    throw new Error('file:// protocol is not supported in browsers')
  }
  const path = uri.replace(/^file:\/\/\/?/, '/')
  return fs.readFile(path, 'utf-8')
}

function fetchDataURI(uri) {
  const matches = uri.match(/^data:([^;]+)?(;base64)?,(.*)$/)
  if (!matches) throw new Error('Invalid data URI')

  const [, mediaType, isBase64, data] = matches

  if (isBase64) {
    if (isBrowser) {
      return atob(data)
    } else {
      return Buffer.from(data, 'base64').toString('utf-8')
    }
  }
  return decodeURIComponent(data)
}

export default async function fetchj(uri, options = {}) {
  if (!uri) throw new Error('URI is required')

  if (uri.startsWith('data:')) {
    return fetchDataURI(uri)
  }

  if (uri.startsWith('file://')) {
    return fetchFile(uri)
  }

  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return fetchHTTP(uri, options)
  }

  if (!uri.includes('://')) {
    return fetchHTTP('https://' + uri, options)
  }

  throw new Error(`Unsupported URI protocol: ${uri}`)
}