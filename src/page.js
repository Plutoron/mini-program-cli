const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const inquirer = require('inquirer')
const chalk = require('chalk')
const shell = require('./util').shell

const addTempToPages = (dir, name) => {
  dir.map(v => {
    const postfix = v.split('.')[1]
    try {
      if (v === 'io.js') {
        fs.copySync(`${process.cwd()}/_template/${v}`, `${process.cwd()}/pages/${name}/${v}`)
        console.log(chalk.green(`message：成功生成 - ${v}`))
      } else {
        fs.copySync(`${process.cwd()}/_template/${v}`, `${process.cwd()}/pages/${name}/${name}.${postfix}`)
        if (postfix === 'json') {
          const config = jsonfile.readFileSync(`${process.cwd()}/pages/${name}/${name}.${postfix}`)
          config.navigationBarTitleText = name
          jsonfile.writeFileSync(`${process.cwd()}/pages/${name}/${name}.${postfix}`, config, {spaces: 2})
        }
        console.log(chalk.green(`message：成功生成 - ${name}.${postfix}`))
      }
    } catch (err) {
      console.error(err)
    }
  })
}

const addPageToJson = name => {
  const config = jsonfile.readFileSync(`${process.cwd()}/app.json`)
  config.pages.push(`pages/${name}/${name}`)
  jsonfile.writeFileSync(`${process.cwd()}/app.json`, config, {spaces: 2})
}

const dirIsExist = name => fs.pathExistsSync(`${process.cwd()}/pages/${name}`)

const checkTemplateDir = async name => {
  fs.readdir(`${process.cwd()}/_template`, (err, dir) => {
    if (err && err.code !== 'ENOENT') {
      console.log(chalk.red('error: 读取_template目录失败'))
      process.exit(1)
    }

    if (!!dir) {
      if(dir.length > 0) {
        if (dirIsExist(name)) {
          inquirer.prompt({
            message: '检测到已存在该文件夹，确定要覆盖吗？',
            type: 'confirm',
            name: 'confirmCover',
            default: false,
          }).then(aws => {
            const cover = aws.confirmCover
            if (cover) {
              addTempToPages(dir, name)
              addPageToJson(name)
            } else {
              console.log(chalk.yellow('message: 操作已中止'))
            }
          })
        } else {
          addTempToPages(dir, name)
        }
      } else {
        console.log(chalk.red('error: _template目录为空'))
      }
    } else {
      console.log(chalk.red('error: 不存在_template目录'))
    }
  })
}

const page = name => checkTemplateDir(name)

module.exports = page
