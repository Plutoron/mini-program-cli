const fs = require('fs-extra')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const download = require('download-git-repo')
const shell = require('./util').shell
const wechatGit = 'direct:https://github.com/suyunlongsy/wechat-mini-template.git'
const alipayGit = 'direct:https://github.com/suyunlongsy/alipay-mini-template.git'
const tempFileName = '___templates___'
const curFileName = process.cwd().split('\/').pop()

const promptList = [{
  type: 'list',
  message: '请选择平台:',
  name: 'platform',
  choices: [
    "wechat",
    "alipay",
  ],
}]

const choosePlatform = name => {
  inquirer
    .prompt(promptList)
    .then(answers => {
      if (answers.platform === 'wechat') {
        downloadGit(name, 'wechat')
      } else if (answers.platform === 'alipay') {
        downloadGit(name, 'alipay')
      }
    })
}

// 判断目录是否为空
const checkDirectory = async (path, name) => {
  fs.readdir(name || path, (err, files) => {
    if (err && err.code !== 'ENOENT') {
      console.log(chalk.red('error：读取文件夹失败'))
      process.exit(1)
    }
    // 确认是否覆盖
    if (!(!files || !files.length)) {
      inquirer.prompt({
        message: '检测到该文件夹下有文件，确定要覆盖吗？',
        type: 'confirm',
        name: 'cover',
        default: false,
      }).then(answers => {
        if (answers.cover) {
          name ? fs.emptyDirSync(`${process.cwd()}/${name}`) : fs.emptyDirSync(`${process.cwd()}`)
          choosePlatform(name) 
        } else {
          console.log(chalk.yellow('message：操作已终止'))
        }
      })
    } else {
      choosePlatform(name)
    }
  })
}

const downloadGit = (name, platform) => {
  const loading = ora('初始化ing').start()
  const folder = name || tempFileName
  const git = platform === 'wechat' ? wechatGit : alipayGit

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
  checkDirectory(process.cwd(), name)
}

module.exports = init
