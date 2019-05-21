const rp = require('request-promise-native')
const from = require('from2')

/**
 * Methods to grab data from tasking manager version 2
 */
class TM2API {
  constructor (url, api_url, opts) {
    this.url = url
    this.api_url = api_url
    this.opts = opts || {}
  }

  getUrlForProject (id) {
    return `${this.url}/project/${id}`
  }

  /* Get all projects from the tasking manager
   *
   * @returns {Stream} response
   */
  getProjects () {
    const self = this
    let ids = new Set()

    let qs = {
      page: 1
    }
    if (self.opts.search_params) {
      qs = Object.assign(self.opts.search_params, qs)
    }

    return from(async function (size, next) {
      try {
        let resp = JSON.parse(await rp({
          uri: `${self.api_url}/projects.json`, qs
        }))
        let features = resp.features
        const lastFeature = features.pop()
        features.forEach(feature => {
          if (ids.has(feature.id)) {
            // Repeated id, we're done
            return next(null, null)
          } else {
            ids.add(feature.id)
            this.push(JSON.stringify(feature))
          }
        })
        qs.page += 1
        return next(null, JSON.stringify(lastFeature))
      } catch (error) {
        return next(error)
      }
    })
  }

  getProject (id) {
    return rp(`${this.api_url}/project/${id}.json`)
  }

  getLastUpdated (id) {
    return this.getProject(id).then(data => {
      return JSON.parse(data)
    }).then(parsed => {
      return parsed.properties.last_update
    })
  }

  getTasks (id) {
    return rp(`${this.api_url}/project/${id}/tasks.json`)
  }
}

module.exports = TM2API
