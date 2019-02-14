const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const inquirer = require('inquirer')
const {
  log,
} = require('./util')

let curType

// 添加页面
const addTempToPages = (dir, name) => {
  try {
    dir.map(v => {
      const postfix = v.split('.')[1]
      const sourcePath = `${process.cwd()}/_template/page/${v}`
      const targetPath = `${process.cwd()}/pages/${name}/${name}.${postfix}`
      const ioPath = `${process.cwd()}/pages/${name}/${v}`
      
      if (v === 'io.js') {
        fs.copySync(sourcePath, ioPath)
        log.ok(`成功生成 - ${v}`)
      } else {
        fs.copySync(sourcePath, targetPath)
        if (postfix === 'json') {
          const config = jsonfile.readFileSync(targetPath)
          if (config.navigationBarTitleText) config.navigationBarTitleText = name
          if (config.defaultTitle) config.defaultTitle = name
          jsonfile.writeFileSync(targetPath, config, {spaces: 2})
        }
        log.ok(`成功生成 - ${name}.${postfix}`)
      }
    })
  } catch (error) {
    log.sysErr(error)
  }
}

// 添加组件
const addTempToComponents = (dir, name) => {
  try {
    dir.map(v => {
      const postfix = v.split('.')[1]
      const sourcePath = `${process.cwd()}/_template/component/${v}`
      const targetPath = `${process.cwd()}/components/${name}/${name}.${postfix}`
      const ioPath = `${process.cwd()}/components/${name}/${v}`
      
      if (v === 'io.js') {
        fs.copySync(sourcePath, ioPath)
        log.ok(`成功生成 - ${v}`)
      } else {
        fs.copySync(sourcePath, targetPath)
        log.ok(`成功生成 - ${name}.${postfix}`)
      }
    })
  } catch (error) {
    log.sysErr(error)
  }
}

// 微信小程序下添加 组件到app.json
const addToJson = name => {
  try {
    const config = jsonfile.readFileSync(`${process.cwd()}/app.json`)
    if (curType === 'page') {
      config.pages.push(`pages/${name}/${name}`)
    } else if (curType === 'component') {
      if (!config.usingComponents) return
      config.usingComponents[name] = `components/${name}/${name}`
    }
    jsonfile.writeFileSync(`${process.cwd()}/app.json`, config, {spaces: 2})
    log.ok(`成功添加 ${name} 到app.json`)
  } catch (error) {
    log.sysErr(error)
  }
}

// 判断目录是否存在
const dirIsExist = name => {
  try {
    if (curType === 'page') {
      return fs.existsSync(`${process.cwd()}/pages/${name}`)
    } else if (curType === 'component') {
      return fs.existsSync(`${process.cwd()}/components/${name}`)
    }
  } catch (error) {
    log.sysErr(error)
  }
}

// 判断模版目录是否存在
const checkTemplateDir = async name => {
  fs.readdir(`${process.cwd()}/_template/${curType}`, (err, dir) => {
    if (err && err.code !== 'ENOENT') {
      log.error(`读取_template/${curType}目录失败`)
      process.exit(1)
    }

    if (!!dir) {
      if (dir.length > 0) {
        if (dirIsExist(name)) {
          inquirer.prompt({
            message: '检测到已存在该文件夹，确定要覆盖吗？',
            type: 'confirm',
            name: 'cover',
            default: false,
          }).then(answers => {
            if (answers.cover) {
              if (curType === 'page') {
                addTempToPages(dir, name)
              } else if (curType === 'component') {
                addTempToComponents(dir, name)
              }
            } else {
              log.warn('操作已中止')
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
        log.error(` _template/${curType}目录为空`)
      }
    } else {
      log.err(`不存在_template/${curType}目录`)
    }
  })
}

const fun = (name, type) => {
  curType = type
  checkTemplateDir(name)
}

module.exports = fun
