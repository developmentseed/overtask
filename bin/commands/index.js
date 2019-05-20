function command (args, flags, context) {
  console.log("usage: overtask <command> [parameters]\n")
  console.log("To see help, you can run:\n")
  console.log("  overtask --help")
  console.log("  overtask <command> --help")
}

const args = []
const flags = []

const options = {
  description: '',
  longDescription: 'Displays usage',
  examples: []
}

module.exports = { command, args, flags, options }
