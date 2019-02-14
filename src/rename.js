const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const {
  log,
} = require('./util')

let newName
let oldName

let oldPath
let newPath

let typePath

const updateAppJson = () => {
  const appJsonPath = `${process.cwd()}/app.json`
  try {
    const appJson = jsonfile.readFileSync(appJsonPath)
    const {
      pages,
      usingComponents,
    } = appJson

    if (typePath === 'pages') {
      pages.some((v, i, a) => {
        if (v === `${typePath}/${oldName}/${oldName}`) {
          a[i] = `${typePath}/${newName}/${newName}`
        }
        return v === `${typePath}/${oldName}/${oldName}`
      })
      appJson.pages = pages
    } else if (typePath === 'components') {
      if (!usingComponents) return
      let usingComponentsStr = JSON.stringify(usingComponents)
      usingComponentsStr = usingComponentsStr.replace(new RegExp(`${oldName}`, 'gm'), `${newName}`)
      appJson.usingComponents = JSON.parse(usingComponentsStr)
    }
    jsonfile.writeFileSync(appJsonPath, appJson, {spaces: 2})
    log.ok('message：重命名更新至app.json')
  } catch (error) {
    log.sysErr(error)
  }
}

// 读取目录内容
const renameFun = path => {
  try {
    const dir = fs.readdirSync(path)
    fs.mkdirsSync(`${newPath}`)
    dir.map(v => {
      const postfix = v.split('.')[1]
      if (v !== 'io.js') {
        fs.copyFileSync(`${path}/${v}`, `${newPath}/${newName}.${postfix}`)
        log.ok(`message：成功重命名 ${v} -> ${newName}.${postfix}`)
      }
    }) 
    updateAppJson()
  } catch (error) {
    log.sysErr(error)    
  }
}

// 判断目录是否存在
const rename = (type, newly, old) => {
  const pagePath = `${process.cwd()}/pages`
  const modPath = `${process.cwd()}/components`

  newName = newly
  oldName = old

  if (type === 'page') {
    oldPath = `${pagePath}/${oldName}`
    newPath = `${pagePath}/${newName}`
    typePath = 'pages'
  } else if (type === 'mod') {
    oldPath = `${modPath}/${oldName}`
    newPath = `${modPath}/${newName}`
    typePath = 'components'
  } else {
    log.error('<type> 字段 只支持 page/mod')
    process.exit(1)
  }
  
  try {
    if (fs.existsSync(oldPath)) {
      renameFun(oldPath)
    } else {
      log.error(`读取 ${oldPath} 失败`)
    }
  } catch (error) {
    log.sysErr(error)
  }
}

module.exports = rename
