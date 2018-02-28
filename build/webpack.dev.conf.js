var config = require('../config');
var webpack = require('webpack');
var merge = require('webpack-merge');
var utils = require('./utils');
var baseWebpackConfig = require('./webpack.base.conf');
// html-webpack-plugin 服务于webpack包的简化html文件创建的插件
var HtmlWebpackPlugin = require('html-webpack-plugin');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
// { app: [ './build/dev-client', './src/main.js' ] }

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
    })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
  // 上线后的devtool要配置为source-map,有时候为了性能考虑，一定要配置这个插件
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin (),
    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),
    // NoErrorsPlugin插件，用来跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
})