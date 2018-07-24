import http from '../../http'
import vLink from '../../components/link'

export default {
  install: (Vue, options) => {
    Vue.prototype.$http = http
    Vue.component('vLink', vLink)
  }
}
