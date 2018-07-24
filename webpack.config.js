const config = require('./config')
const views = require('./src/views')
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ip = require('ip')
const portfinder = require('portfinder')
const chalk = require('chalk')

function generatePluginsByMode() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return [
        new webpack.HotModuleReplacementPlugin()
      ]
    case 'production':
      return [
        new CleanWebpackPlugin(['dist/'])
      ]
  }
}

const entries = Object.keys(views)

function getEntry() {
  let entryMap = {}
  entries.forEach(key => entryMap[key] = `./src/views/${key}/index.js`)
  return entryMap
}

const HtmlWebpackPluginMap = entries.map((key) => {
  return new HtmlWebpackPlugin({
    filename: `./${key}.html`,
    template: `./src/index.html`,
    chunks: [`${key}`, 'common'],
    title: views[key]
  })
})

const ExtractTextPluginMap = entries.map((key) => {
  return new ExtractTextPlugin('./css/[name].[hash].css')
})

function devServerProxy() {
  let proxy = {}
  let keys = Object.keys(config.proxy)
  keys.forEach(key => {
    proxy[key] = {
      target: config.proxy[key],
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [`^${key}`]: ''
      }
    }
  })
  return proxy
}

const webpackConfig = {
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname),
    host: ip.address(),
    port: '',
    open: false,
    hot: false,
    overlay: true,
    stats: 'errors-only',
    proxy: devServerProxy()
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    },
    extensions: ['.js', '.vue', '.json']
  },
  entry: getEntry(),
  output: {
    filename: `./js/[name].[hash].js`,
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    ...generatePluginsByMode(),
    ...HtmlWebpackPluginMap,
    ...ExtractTextPluginMap,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SERVER_URL': JSON.stringify(config.proxy[config.proxyServer])
    }),
    new webpack.ProvidePlugin({
      Vue: 'vue'
    }),
    new VueLoaderPlugin()
  ],
  optimization: {
    minimize: config.minimize && process.env.NODE_ENV === 'production',
    splitChunks: {
      chunks: 'all',
      name: 'common'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ],
          publicPath: '../'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader'
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[hash:8].[name].[ext]',
              limit: 3072,
              outputPath: 'images'
            }
          }
        ]
      }
    ]
  }
}

module.exports = new Promise((resolve, reject) => {
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      !webpackConfig.devServer.port && (webpackConfig.devServer.port = port)

      console.log(chalk.green('  Build mode : ' + process.env.NODE_ENV + '.\n'))

      console.log(chalk.green('  Build server : ' + config.proxy[config.proxyServer] + '.\n'))

      resolve(webpackConfig)
    }
  })
})
