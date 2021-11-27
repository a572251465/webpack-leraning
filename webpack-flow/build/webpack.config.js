const path = require('path')
const RunPlugin = require('../plugins/RunPlugin')
const DonePlugin = require('../plugins/DonPlugin')

const resolvePath = url => path.resolve(__dirname, url)

module.exports = {
  context: process.cwd(),
  mode: 'development',
  entry: {
    'teacher': resolvePath('../src/doc/teacher.js'),
    'student': resolvePath('../src/doc/student.js')
  },
  output: {
    path: resolvePath('../dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          resolvePath('../loaders/LoggerLoader'),
          resolvePath('../loaders/ResolveFunctionLoader')
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin()
  ]
}
