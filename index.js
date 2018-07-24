const HttpClient = require('./lib/http_client')

module.exports = (options, app) => {
  const client = new HttpClient(options)

  return {
    app: {
      curl (url, options) {
        return client.request(url, options)
      }
    },
    context: {
      curl (url, options) {
        return this.app.curl(url, options)
      }
    },
    base: {
      curl (url, options) {
        return this.app.curl(url, options)
      }
    }
  }
}
