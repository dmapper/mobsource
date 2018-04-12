const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const alias = {
  'components': path.resolve('./src/components'),
  'consts': path.resolve('./src/consts'),
  'utils': path.resolve('./src/utils')
}
module.exports = () => {
  let outputCSS = 'bundle.css'
  let outputJS = 'bundle.js'
  return ({
    entry: './src/app.js',
    output: {
      path: path.resolve(__dirname, 'public', './'),
      filename: outputJS
    },
    devtool: false,
    module: {
      rules: [
        {
          test: /\.(js|jsx?)$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [['env', {'modules': false}], 'stage-0', 'react']
              }
            }
          ]
        },
        {
          test: /\.styl$/,
          use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'stylus-loader']
          }))
        },
        {
          test: /\.css/,
          use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader']
          }))
        },
        {
          test: /\.(img|png|svg)$/,
          use: 'url-loader'
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      contentBase: path.join(__dirname, 'public'),
      stats: {
        version: false,
        modules: false,
        assets: false,
        hash: false
      },
      port: '3001'
    },
    plugins: [
      new ExtractTextPlugin(outputCSS)
    ],
    resolve: {
      alias: alias
    }
  })
}
