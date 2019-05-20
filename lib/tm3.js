const rp = require('request-promise-native')
const limit = require('p-limit')(5)

/**
 * Methods to grab data from tasking manager version 3
 */
class TM3API {
  constructor (url, api_url, opts) {
    this.url = url
    this.api_url = api_url
    this.opts = opts || {}
  }

  getUrlForProject (id) {
    return `${this.url}/project/${id}`
  }

  getLastUpdated (id) {
    return this.getProject(id).then(data => {
      return JSON.parse(data)
    }).then(parsed => {
      return parsed.lastUpdated
    })
  }

  /* Get all projects from the tasking manager
   *
   * @returns {Promise} response
   */
  async getProjects () {
    let qs = {
      page: 1
    }
    if (this.opts.search_params) {
      qs = Object.assign(this.opts.search_params, qs)
    }

    let firstResp = await rp({
      uri: `${this.api_url}/api/v1/project/search`,
      qs,
      headers: { 'Accept-Language': 'en-US,en;q=0.9' }
    })
    let json = JSON.parse(firstResp)

    let projects = json.results

    let numPages = json.pagination.pages
    let promises = []
    for (let i = 2; i <= numPages; i++) {
      qs.page = i
      promises.push(limit(() => rp({
        uri: `${this.api_url}/api/v1/project/search`,
        qs,
        headers: { 'Accept-Language': 'en-US,en;q=0.9' }
      })))
    }

    return Promise.all(promises).then(responses => {
      responses.forEach(response => {
        let results = JSON.parse(response).results
        results.forEach(project => {
          projects.push(project)
        })
      })

      return projects
    })
  }

  getProject (id) {
    return rp({
      uri: `${this.api_url}/api/v1/project/${id}?as_file=false`,
      headers: { 'Accept-Language': 'en-US,en;q=0.9' }
    })
  }

  getProjectAoi (id) {
    return rp({
      uri: `${this.api_url}/api/v1/project/${id}/aoi?as_file=false`
    })
  }

  getTasks (id) {
    return rp({
      uri: `${this.api_url}/api/v1/project/${id}/tasks`
    })
  }
}

module.exports = TM3API
