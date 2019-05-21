const rp = require('request-promise-native')
const from = require('from2')

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
   * @returns {Stream} response
   */
  getProjects () {
    const self = this
    let qs = {
      page: 1
    }
    if (self.opts.search_params) {
      qs = Object.assign(self.opts.search_params, qs)
    }

    return from(async function (size, next) {
      try {
        let resp = await rp({
          uri: `${self.api_url}/api/v1/project/search`,
          qs,
          headers: { 'Accept-Language': 'en-US,en;q=0.9' }
        })
        let json = JSON.parse(resp)

        let projects = json.results
        const lastProject = projects.pop()
        projects.forEach(project => {
         this.push(JSON.stringify(project))
        })

        if (!json.pagination.hasNext) {
          return next(null, null)
        }
        qs.page += 1
        return next(null, JSON.stringify(lastProject))
      } catch (error) {
        console.log(error)
        return next(error)
      }
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
