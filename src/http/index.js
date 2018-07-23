import axios from 'axios'
import qs from 'qs'

const server_url = process.env.SERVER_URL

axios.defaults.baseURL = server_url
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

axios.interceptors.request.use(
  config => {

    // TODO

    config.data = qs.stringify(config.data)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {

    // TODO

    return response.data
  },
  error => {
    error.message = ''
    if (error.response) {
      switch (error.response.status) {
        case 401:
          error.message = '未经授权'
          break
        case 404:
          error.message = `请求地址出错：${error.response.config.url}`
          break
        case 502:
          error.message = '网关错误'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
          error.message = '很抱歉！服务器可能遇到一些临时问题。刷新重试？'
      }
    }
    error.message && console.log(error.message)
    return Promise.reject(error.response)
  }
)

export default axios
