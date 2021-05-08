const superagent = require('superagent')

const emptyFn = () => {}

class HttpClient {
  constructor ({
    timeout = 0,
    headers,
    contentType,
    dataType,
    retry = 0,
    redirects,
    beforeRequest = emptyFn,
    afterResponse = emptyFn,
    plugins
  } = {}) {
    this.timeout = timeout
    this.headers = headers
    this.contentType = contentType
    this.dataType = dataType
    this.retry = retry
    this.redirects = redirects
    this.beforeRequest = beforeRequest
    this.afterResponse = afterResponse

    this.handler = this._initHandler(plugins)
  }

  // [{ plguin: '', options: {} }]
  _initHandler (plugins) {
    if (Array.isArray(plugins)) {
      plugins.forEach((item) => {
        superagent(item.plugin, item.options)
      })
    }

    return superagent
  }

  request (url, {
    method = 'GET',
    timeout = this.timeout,
    body,
    query,
    headers,
    contentType = this.contentType,
    dataType = this.dataType,
    retry = this.retry,
    redirects = this.redirects,
    stream,
    reqStream
  } = {}) {
    let req = this.handler(method, url)

    if (this.headers || (headers && typeof headers === 'object')) {
      req = req.set(Object.assign({}, this.headers, headers))
    }

    if (contentType && ['form', 'json'].indexOf(contentType) !== -1) {
      req = req.type(contentType)
    }

    if (query) {
      req = req.query(query)
    }

    if (body) {
      req = req.send(body)
    }

    if (retry) {
      req = req.retry(retry)
    }

    if (redirects !== undefined) {
      req = req.redirects(redirects)
    }

    if (timeout) {
      req = req.timeout(timeout)
    }

    this.beforeRequest(req)

    return new Promise((resolve, reject) => {
      if (stream) {
        req.pipe(stream).on('error', (err) => {
          this.afterResponse(err)
          reject(err)
        }).on('finish', () => {
          this.afterResponse()
          resolve(true)
        })

        return
      }

      if (reqStream) {
        reqStream.pipe(req).on('error', (err) => {
          this.afterResponse(err)
          reject(err)
        }).on('finish', () => {
          this.afterResponse()
          resolve(true)
        })

        return
      }

      req.end(async (err, res) => {
        this.afterResponse(err, res)

        let jsonErr
        let status = res && res.statusCode
        let data = res && res.text

        // fix: octet-stream
        const contentType = res && res.headers && res.headers['content-type'] || ''

        if (contentType.indexOf('octet-stream') !== -1) {
          data = await new Promise((resolve, reject) => {
            const buffer = []

            res.on('data', (chunk) => {
              buffer.push(chunk)
            })

            res.once('end', () => {
               resolve(Buffer.concat(buffer).toString())
            })
          })
        }

        if (dataType === 'json') {
          try {
            data = JSON.parse(data)
          } catch (err) {
            jsonErr = err
          }
        }

        resolve({
          status,
          data,
          err: err || jsonErr,
          headers: (res && res.headers) || {}
        })
      })
    })
  }
}

module.exports = HttpClient
