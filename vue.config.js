const port='8080'
module.exports = {
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  lintOnSave: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
		proxy: {
		  '/api': {
		    target: 'https://test.jinzhiyuns.com/',
		    logLevel: 'debug',
		    changeOrigin: true,
		    // ws: true,
		    pathRewrite: {
		      '^/api': ''
		    }
		  }
		},
    // before: require('./mock/mock-server.js')
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'), // This line must in sass option
      }
    }
  },

  transpileDependencies: [
    'monaco-editor',
    '@jiaminghi/data-view'
  ],
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
  }
}
