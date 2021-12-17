const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath:
    '/dist/',
  outputDir: 'dist',
  assetsDir: 'dist',
  lintOnSave: true, // 是否开启 esLint
  productionSourceMap: false, // 默认是开启的，关闭后打包的代码易读易线上调式，也可加快打包速度
  devServer: {
    port: 8002,
    open: true,
    proxy: {
      '/api': {
        target: 'http://xatjtest.olcourt.cn/api',
        pathRewrite: {
          '^/api': '/'
        },
        secure: true, // 如果是https接口，需要配置这个参数为true
        changeOrigin: true // 如果接口跨域，需要进行这个参数配置为true
      },
      '/mock': {
        target: 'http://192.168.86.62:3001/mock',
        pathRewrite: {
          '^/mock': '/'
        },
        secure: true, // 如果是https接口，需要配置这个参数为true
        changeOrigin: true // 如果接口跨域，需要进行这个参数配置为true
      },
      '/upload': {
        target: 'http://xatjtest.olcourt.cn/upload',
        pathRewrite: {
          '^/upload': ''
        },
        secure: true, // 如果是https接口，需要配置这个参数为true
        changeOrigin: true // 如果接口跨域，需要进行这个参数配置为true
      }
      // '/mzt': {
      //   target: 'https://mztapp.fujian.gov.cn:8304',
      //   pathRewrite: {
      //     '^/mzt': '/'
      //   },
      //   secure: true, // 如果是https接口，需要配置这个参数为true
      //   changeOrigin: true // 如果接口跨域，需要进行这个参数配置为true
      // }
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000
      // 只给出 js 文件的性能提示
      // assetFilter: function(assetFilename) {
      //   return assetFilename.endsWith(".js");
      // }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .uses.clear()
    config.module
      .rule('svg1')
      .test(/\.svg$/)
      .include.add(resolve('src/svgIcon/svg'))
      .end()
      .use('svg-sprite')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/style/index.less')]
    }
  }
}
