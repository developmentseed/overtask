const { TM } = require('../../lib')

async function command (args, flags, context) {
  const { endpoint } = flags
  if (!endpoint) {
    console.error("endpoint is required")
    return process.exit(1)
  }

  let tm = new TM('tm2', endpoint, flags)
  let projects = await tm.getProjects()
  projects.forEach(project => {
    process.stdout(project)
  })
  return process.exit()
}

const args = []

const flags = [
  {
    name: 'endpoint',
    alias: 'e',
    type: 'string',
  },
  {
    name: 'proxy',
    alias: 'p',
    type: 'string'
  }
]

const options = {
  description: 'Get tasks from TM2',
  longDescription: 'This command gets tasks from a Tasking Manager 2 compatible API.',
  examples: [
    {
      cmd: 'overtask tm2 --endpoint http://tasks.openstreetmap.id',
      description: 'Gets tasks from the Indonesia tasking manager'
    },
  ]
}

module.exports = { command, args, flags, options }
