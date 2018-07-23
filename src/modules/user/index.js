import 'babel-polyfill'
import 'normalize.css'
import user from './user'
import inject from '../../assets/scripts/inject'

Vue.use(inject)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: {user},
  template: '<user/>'
})
