const chalk = require('chalk')
const {
  exec,
} = require('child_process')

const shell = (order, option = {}) => {
  const pro = new Promise((reslove, reject) => {
    exec(order, option, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        reslove(stdout)
      }
    })
  })
  return pro
}

const log = {
  ok: text => {
    console.log(`${chalk.green('success: ')}${chalk.cyan(text)}`)
  },
  error: text => {
    console.log(`${chalk.red(`error: ${text}`)}`)
  },
  warn: text => {
    console.log(`${chalk.yellow(`message: ${text}`)}`)
  },
  sysErr: error => {
    console.error(error)
  },
}

module.exports = {
  shell,
  log,
}
