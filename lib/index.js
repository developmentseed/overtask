const TM2API = require('./tm2')
const TM3API = require('./tm3')

class TM {
  constructor (type, url, opts) {
    if (!type) {
      throw new Error('TM needs type')
    }

    if (!url) {
      throw new Error('TM needs URL')
    }

    this.url = url.replace(/\/+$/, '') // Ensure no trailing slashes in URL
    this.api_url = (opts && opts.proxy) || this.url
    this.api_url = this.api_url.replace(/\/+$/, '')

    this.type = type

    switch (type) {
      case 'tm2': {
        return new TM2API(this.url, this.api_url, opts)
      }
      case 'tm3': {
        return new TM3API(this.url, this.api_url, opts)
      }
    }
  }
}

module.exports.TM = TM
