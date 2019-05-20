const rp = require('request-promise-native')

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
   * @returns {Promise} response
   */
  async getProjects () {
    let ids = new Set()
    let keepGoing = true
    let records = []

    let qs = {
      page: 1
    }
    if (this.opts.search_params) {
      qs = Object.assign(this.opts.search_params, qs)
    }

    while (keepGoing) {
      let resp = JSON.parse(await rp({
        uri: `${this.api_url}/projects.json`,
        qs
      }))
      let features = resp.features
      for (let i = 0; i < features.length; i++) {
        let feature = features[i]
        let id = feature.id

        /*
        As soon as there is a repeated id, we should
        stop grabbing data
        */
        if (ids.has(id)) {
          keepGoing = false
          break
        } else {
          ids.add(id)
          records.push(feature)
        }
      }
      qs.page += 1
    }
    return records
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
