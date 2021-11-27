const {SyncHook} = require('tapable')

const hook = new SyncHook()
hook.tap('name', () => {
  console.log('打印名称')
})

hook.tap('age', () => {
  console.log('打印年龄')
})
