const fn1 = x => x + 3
const fn2 = x => x * 2
const fn3 = y => y / 5

function compose(resolveLoaders) {
  if (resolveLoaders.length === 0) return x => x
  if (resolveLoaders.length === 1) return x => resolveLoaders[0](x)

  return resolveLoaders.reduce((pre, cur) => {
    return content => pre(cur(content))
  })
  // return resolveLoaders.reduce((a, b) => (...args) => a(b(...args)))
}

const res = compose([fn1, fn2, fn3])
console.log(res(4))
