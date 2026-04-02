import Vue from 'vue'
import App from './App'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	i18n,
	...App
})
app.$mount()
