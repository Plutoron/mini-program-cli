const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const download = require('download-git-repo')
const shell = require('./util').shell
const git = 'direct:https://github.com/suyunlongsy/mini-template.git'
const tempFileName = '___templates___'
const curFileName = process.cwd().split('\/').pop()

// 判断目录是否为空
const checkDirectory = async (path, name, fn) => {
  let cover = false
  const folder = name || path

  fs.readdir(folder, (err, files) => {
    if (err && err.code !== 'ENOENT') {
      console.log(chalk.red('error：读取文件夹失败'))
      process.exit(1)
    }
    // 确认是否覆盖
    if (!(!files || !files.length)) {
      inquirer.prompt({
        message: '检测到该文件夹下有文件，确定要覆盖吗？',
        type: 'confirm',
        name: 'confirmCover',
        default: false,
      }).then(aws => {
        cover = aws.confirmCover
        if (cover) {
          name ? fs.emptyDirSync(`${process.cwd()}/${name}`) : fs.emptyDirSync(`${process.cwd()}`)
          if (fn) fn(name) 
        } else {
          console.log(chalk.yellow('message：操作已终止'))
        }
      })
    } else {
      if (fn) fn(name)
    }
  })

  return cover
}

const fileRename = (oldName, newName) => {
  fs.rename(oldName, newName, err => {
    if (err) console.log(chalk.red('error: ') + err)
  })
}

const downloadGit = name => {
  const loading = ora('初始化ing').start()
  const folder = name || tempFileName
  download(`${git}`, folder, {clone: true}, error => {
    if (!error) {
      if (name) {
        loading.stop()
        console.log(chalk.green(`message：初始化完毕 - ${folder}`))
        process.exit(1) 
      }
      try {
        fs.copySync(folder, process.cwd())
        shell(`rm -rf ${folder}`)
        loading.stop()
        console.log(chalk.green('message：初始化完毕'))
      } catch (err) {
        loading.stop()
        console.log(chalk.red('error: ') + err)
      }
    } else {
      loading.stop()
      console.log(chalk.red('error: ') + error)
    }
  })
}

const init = name => {
  checkDirectory(process.cwd(), name, downloadGit)
}

module.exports = init
