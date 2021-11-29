function test() {
  console.log('main2244')
}

import("./branch").then(res => {
  res()
})
import("./branch1").then(res => {
  res()
})
test()
