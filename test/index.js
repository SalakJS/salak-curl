jest.doMock('superagent', () => {
  const getResponse = function (data) {
    return {
      statusCode: 200,
      text: JSON.stringify(data)
    }
  }

  const responses = {
    'http://app.com': getResponse({ name: 'app' }),
    'http://controller.com': getResponse({ name: 'controller' })
  }

  const superagent = jest.fn((method, url) => {
    return {
      set: jest.fn().mockReturnThis(),
      query: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      timeout: jest.fn().mockReturnThis(),
      end: jest.fn().mockImplementation((cb) => {
        cb(null, responses[url])
      })
    }
  })

  return superagent
})

const request = require('supertest')
const app = require('./fixture')

describe('test salak-curl', () => {
  describe('test app.curl, Base.prototype.curl', () => {
    it('test /', async () => {
      const res = await request(await app.callback()).get('/')

      expect(JSON.parse(res.text)).toEqual({
        app: {
          name: 'app'
        },
        content: {
          name: 'controller'
        }
      })
    })
  })
})
