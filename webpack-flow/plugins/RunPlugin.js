class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('run', () => {
      console.log('已经开始执行了.............')
    })
  }
}

module.exports = RunPlugin
