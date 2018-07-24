module.exports = {
  server: process.env.npm_config_server || '/api',
  proxy: {
    '/api': 'https://api.github.com'
  },
  minimize: true
}
