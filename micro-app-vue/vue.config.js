const path = require('path');
const packageName = require('./package.json').name;

module.exports = {
  publicPath: "http://vue.micro-front.com/",
  devServer: {
    port: 8901,
    disableHostCheck: true,
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@src': path.resolve(__dirname, 'src'),
        '@pages': path.resolve(__dirname, 'src/pages'),
      }
    },
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`,
    }
  }

}