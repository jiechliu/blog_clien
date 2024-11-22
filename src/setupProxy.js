const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://0.0.0.0:8080',
      pathRewrite: {
        '^/api': '',
      },
      changeOrigin: true,
      secure: false, // 是否验证证书
    })
  )
}
