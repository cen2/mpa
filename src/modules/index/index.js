import 'babel-polyfill'
import 'normalize.css'
import '../../assets/styles/style.less'
import index from './index.vue'
import inject from '../../assets/scripts/inject'

Vue.use(inject)

console.log(process.env.SERVER_URL)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: {index},
  template: '<index/>'
})
