const {
  exec,
} = require('child_process')
// const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

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

const rename = (oldName, newName) => {
  fs.rename(oldName, newName, err => {
    if (err) console.log(chalk.red('error: ') + err)
  })
}

module.exports = {
  shell,
  rename,
}
