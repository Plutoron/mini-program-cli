const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const inquirer = require('inquirer')
const chalk = require('chalk')
const shell = require('./util').shell

let curType = undefined

const addTempToPages = (dir, name) => {
  dir.map(v => {
    const postfix = v.split('.')[1]
    try {
      if (v === 'io.js') {
        fs.copySync(`${process.cwd()}/_template/page/${v}`, `${process.cwd()}/pages/${name}/${v}`)
        console.log(chalk.green(`message：成功生成 - ${v}`))
      } else {
        fs.copySync(`${process.cwd()}/_template/page/${v}`, `${process.cwd()}/pages/${name}/${name}.${postfix}`)
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

const addTempToComponents = (dir, name) => {
  dir.map(v => {
    const postfix = v.split('.')[1]
    try {
      if (v === 'io.js') {
        fs.copySync(`${process.cwd()}/_template/component/${v}`, `${process.cwd()}/componennts/${name}/${v}`)
        console.log(chalk.green(`message：成功生成 - ${v}`))
      } else {
        fs.copySync(`${process.cwd()}/_template/component/${v}`, `${process.cwd()}/componennts/${name}/${name}.${postfix}`)
        console.log(chalk.green(`message：成功生成 - ${name}.${postfix}`))
      }
    } catch (err) {
      console.error(err)
    }
  })
}

const addToJson = name => {
  const config = jsonfile.readFileSync(`${process.cwd()}/app.json`)
  if (curType === 'page') {
    config.pages.push(`pages/${name}/${name}`)
  } else if (curType === 'component') {
    config.usingComponents[name] = `components/${name}/${name}`
  }
  jsonfile.writeFileSync(`${process.cwd()}/app.json`, config, {spaces: 2})
  console.log(chalk.green(`message：成功添加 ${name} 到app.json`))
}

const dirIsExist = name => {
  if (curType === 'page') {
    return fs.pathExistsSync(`${process.cwd()}/pages/${name}`)
  } else if (curType === 'component') {
    return fs.pathExistsSync(`${process.cwd()}/components/${name}`)
  }
  return false
}

const checkTemplateDir = async name => {
  fs.readdir(`${process.cwd()}/_template/${curType}`, (err, dir) => {
    if (err && err.code !== 'ENOENT') {
      console.log(chalk.red(`error: 读取_template/${curType}目录失败`))
      process.exit(1)
    }

    if (!!dir) {
      if (dir.length > 0) {
        if (dirIsExist(name)) {
          inquirer.prompt({
            message: '检测到已存在该文件夹，确定要覆盖吗？',
            type: 'confirm',
            name: 'confirmCover',
            default: false,
          }).then(aws => {
            const cover = aws.confirmCover
            if (cover) {
              if (curType === 'page') {
                addTempToPages(dir, name)
              } else if (curType === 'component') {
                addTempToComponents(dir, name)
              }
              addToJson(name)
            } else {
              console.log(chalk.yellow('message: 操作已中止'))
            }
          })
        } else {
          if (curType === 'page') {
            addTempToPages(dir, name)
          } else if (curType === 'component') {
            addTempToComponents(dir, name)
          }
          addToJson(name)
        }
      } else {
        console.log(chalk.red(`error: _template/${curType}目录为空`))
      }
    } else {
      console.log(chalk.red(`error: 不存在_template/${curType}目录`))
    }
  })
}

const fun = (name, type) => {
  curType = type
  checkTemplateDir(name)
}

module.exports = fun
