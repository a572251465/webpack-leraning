const RunPlugin = require('../plugins/RunPlugin')
const DonePlugin = require('../plugins/DonPlugin')
const path = require('path')
const fs = require('fs')
const {SyncHook} = require('tapable')

/**
 * @author lihh
 * @description compose函数解析loader
 * @param resolveLoaders 参数
 */
function compose(resolveLoaders) {
  if (resolveLoaders.length === 0) return x => x
  if (resolveLoaders.length === 1) return x => resolveLoaders[0](x)
  return resolveLoaders.reduce((a, b) => (...args) => a(b(...args)))
}

/**
 * @author lihh
 * @description 开始解析loader
 * @param chunks 每个chunks
 * @param compiler 编译实例
 */
function resolveLoader(chunks, compiler) {
  const {entry, module = {}} = compiler.options
  const {rules} = module
  // 是否配置loader
  if (rules && Array.isArray(rules)) {
    Object.keys(entry).forEach(keyName => {
      const modules = []
      const filePath = entry[keyName]
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      rules.forEach(rule => {
        if (rule.test.test(filePath)) {
          const methods = rule.use.map(methodPath => require(methodPath))
          modules.push(compose(methods)(fileContent))
        }
      })

      // 4 -- 完成编译 通过loader编译结束后 添加到对应的chunks
      chunks[keyName] = modules
    })
  }
}

class Compiler {
  constructor(options) {
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook()
    }
    this.options = options
  }

  // 开始编译的入口
  run() {
    const chunks = {}

    // 2 -- 开始确定编译的入口
    const {context = process.cwd(), entry} = this.options
    if (typeof entry === 'string') {
      this.options.entry = {main: entry}
    }

    // -- 此处开始调用钩子
    this.hooks.run.call('run')
    // 3 -- 开始遍历loader 开始解析文件
    resolveLoader(chunks, this)

    this.hooks.done.call('done')
    // 5 -- 写入文件
    const {path: dirPath, filename} = this.options.output
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    Object.keys(chunks).forEach(fileName => {
      const newPath = path.join(dirPath, `${fileName}.js`)
      chunks[fileName].forEach(content => {
        fs.writeFileSync(newPath, content, {encoding: 'utf-8'})
      })
    })
  }
}

// webpack 编译入口
function webpack(options) {
  // 1 -- 参数合并，将webpack调用传递的options 跟 shell中options进行合并
  const argv = process.argv.slice(2)
  const shellOptions = argv.reduce((shellOptions, curr) => {
    const {key, value} = curr.split('=')
    shellOptions[key.slice(2)] = value
    return shellOptions
  }, {})
  const mergeOptions = {...options, ...shellOptions}

  // 2 -- 开始编译 得到compiler对象
  const compiler = new Compiler(mergeOptions)
  // 2 -- 加载所有配置的插件
  if (mergeOptions.plugins && Array.isArray(mergeOptions.plugins)) {
    mergeOptions.plugins.forEach(plugin => plugin.apply(compiler))
  }
  return compiler
}

module.exports = webpack
