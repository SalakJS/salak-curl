const { Controller } = require('salak')

class Index extends Controller {
  async actionIndex () {
    const appData = await this.app.curl('http://app.com', { dataType: 'json' })
    const content = await this.app.curl('http://controller.com', { dataType: 'json' })

    this.send({
      app: appData.data,
      content: content.data
    }, 200)
  }
}

module.exports = Index
