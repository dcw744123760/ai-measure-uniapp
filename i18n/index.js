import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'
import zhHK from './zh-HK'

Vue.use(VueI18n)

const i18n = new VueI18n({
	locale: 'zh-CN',
	messages: {
		'zh-CN': zhCN,
		'en-US': enUS,
		'zh-HK': zhHK
	}
})

export default i18n
