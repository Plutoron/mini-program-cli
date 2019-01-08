const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')

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

module.exports = {
  shell,
}
