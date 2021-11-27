class DonPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('done', () => {
      console.log('执行结束了..............')
    })
  }
}

module.exports = DonPlugin
