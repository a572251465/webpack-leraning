const webpack = require('../src/flow')
const config = require('../build/webpack.config')

const compiler = webpack(config)
compiler.run()
