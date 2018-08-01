# salak-curl

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/salak-curl.svg?style=flat-square
[npm-url]: https://npmjs.org/package/salak-curl
[travis-image]: https://img.shields.io/travis/SalakJS/salak-curl.svg?style=flat-square
[travis-url]: https://travis-ci.org/SalakJS/salak-curl
[david-image]: https://img.shields.io/david/SalakJS/salak-curl.svg?style=flat-square
[david-url]: https://david-dm.org/SalakJS/salak-curl
[download-image]: https://img.shields.io/npm/dm/salak-curl.svg?style=flat-square
[download-url]: https://npmjs.org/package/salak-curl

CURL for salak 2.0

## Install

```sh
$ npm install --save salak-curl
```

## Usage

### Config

In plugin:

```javascript
module.exports = {
  plugin: [
    {
      name: 'curl',
      package: 'salak-curl'
    }
  ]
}
```

#### options 

- headers {Object}
- body {Object}
- query {Object}
- contentType {String} json,form
- retry {Integer} default 0
- timeout {Integer}
- method {String} default `GET`
- dataType {String} if set to 'json', it could parse the res.text to json, while error occurred, the output.err would be shown.
- plugins {Array} ref to [superagent plugins](https://github.com/visionmedia/superagent#plugins), [{ plugin: Object, options: {} }]

### app, ctx, Base.prototype

curl (url, options)

- options {Object} the same as above properties except `plugins`. if unset, would use the default properties which provided at above.
- options.stream {Stream} response stream, if set, will run `req.pipe(stream)`
- options.reqStrem {Stream} request stream, if set, will run `reqStream.pipe(req)`
- @return Promise

### Use in Service or Controller

common/service/user.js

```javascript
const { Service } = require('salak')

class Data extends Service {
  async test () {
    const data = await this.curl('http://xxx.xxx')

    return data
  }
}

module.exports = Data
```

## License

[MIT](LICENSE)
