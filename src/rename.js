const fs = require('fs-extra')
const jsonfile = require('jsonfile')
const {
  log,
  shell,
} = require('./util')

let newName
let oldName

let oldPath
let newPath

let pathType

const updateAppJson = () => {
  const appJsonPath = `${process.cwd()}/app.json`
  try {
    const appJson = jsonfile.readFileSync(appJsonPath)
    const {
      pages,
      usingComponents,
    } = appJson

    if (pathType === 'pages') {
      pages.some((v, i, a) => {
        if (v === `${pathType}/${oldName}/${oldName}`) {
          a[i] = `${pathType}/${newName}/${newName}`
        }
        return v === `${pathType}/${oldName}/${oldName}`
      })
      appJson.pages = pages
    } else if (pathType === 'components') {
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
  const tempPath = `${process.cwd()}/${pathType}/_temp`
  try {
    fs.mkdirSync(tempPath)
    const dir = fs.readdirSync(path)

    dir.map(v => {
      const name = v.split('.')[0]
      const postfix = v.split('.')[1]
      if (oldName === name) {
        fs.copyFileSync(`${path}/${v}`, `${tempPath}/${newName}.${postfix}`)
        log.ok(`message：成功重命名 ${v} -> _temp/${newName}.${postfix}`)
      } else {
        fs.copyFileSync(`${path}/${v}`, `${tempPath}/${v}`)
        log.ok(`message：成功复制 ${v} -> _temp/${v}`)
      }
    }) 

    shell(`rm -rf ${path}`).then(res => {
      log.ok(`message：成功删除 ${path}`)
      fs.copySync(tempPath, newPath)
      log.ok(`message：成功复制 ${tempPath} -> ${newPath}`)
      shell(`rm -rf ${tempPath}`).then(res => {
        log.ok(`message：成功删除 ${tempPath}`)
        updateAppJson()
      })
    })
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
    pathType = 'pages'
  } else if (type === 'mod') {
    oldPath = `${modPath}/${oldName}`
    newPath = `${modPath}/${newName}`
    pathType = 'components'
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
