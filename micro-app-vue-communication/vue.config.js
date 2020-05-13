const path = require('path');
const packageName = require('./package.json').name;

module.exports = {
  devServer: {
    port: 10200,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
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
      library: "VueMicroApp",
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`,
    }
  }

}