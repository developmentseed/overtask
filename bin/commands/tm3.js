const { TM } = require('../../lib')
const pump = require('pump')

function command (args, flags) {
  const { endpoint } = args
  if (!endpoint) {
    console.error("Argument `endpoint` is required")
    return process.exit(1)
  }

  let tm = new TM('tm3', endpoint, flags)
  pump(tm.getProjects(), process.stdout, (err) => {
    if (err) {
      console.error("Error getting projects", err)
      return process.exit(1)
    }
    return process.exit()
  })
}

const args = [
  {
    name: 'endpoint',
    type: 'string',
    description: 'The URL of the tasking manager',
    required: 'true'
  }
]

const flags = [
  {
    name: 'proxy',
    alias: 'p',
    description: 'Proxy URL in case of firewall',
    type: 'string'
  }
]

const options = {
  description: 'Get tasks from TM3',
  longDescription: 'This command gets tasks from a Tasking Manager 3 compatible API.',
  examples: [
    {
      cmd: 'overtask tm2 http://tasks.openstreetmap.us',
      description: 'Gets tasks from the US tasking manager'
    },
  ]
}

module.exports = { command, args, flags, options }
