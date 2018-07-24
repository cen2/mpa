module.exports = {
  minimize: true,
  proxy: {
    '/api': 'https://api.github.com'
  },
  proxyServer: process.env.npm_config_proxy || '/api'
}
