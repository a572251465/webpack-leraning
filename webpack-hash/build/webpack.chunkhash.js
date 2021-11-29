const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const resolvePath = url => path.resolve(__dirname, url)

module.exports = {
  mode: 'production',
  entry: {
    main: resolvePath("../src/main.js"),
    main1: resolvePath("../src/main1.js")
  },
  output: {
    path: resolvePath("../dist"),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
