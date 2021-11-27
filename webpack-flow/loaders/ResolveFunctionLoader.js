const babel = require('@babel/core')

function resolveFunctionLoader(source) {
  if (!source) return source

  const result = babel.transform(source, {
    plugins: ['babel-plugin-transform-es2015-arrow-functions']
  })
  return result.code
}

module.exports = resolveFunctionLoader
