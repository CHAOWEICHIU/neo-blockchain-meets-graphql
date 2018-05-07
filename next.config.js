const webpack = require('webpack')
const { BLOCKCHAIN_ENV } = process.env
const env = require('./config')
module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /moment[\/\\]locale$/,
        /zh-tw/
      ),
      new webpack.DefinePlugin({
        'process.env.CLIENT_HOST': JSON.stringify(env[BLOCKCHAIN_ENV].CLIENT_HOST)
      })
    )
    return config
  }
}
