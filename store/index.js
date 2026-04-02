import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		login: {
			staff: null,
			company: null,
			unit: null,
			ykClientId: ''
		},
		units: [],
		language: 'zh'
	},
	mutations: {
		setLogin(state, data) {
			state.login = data
			if (data && data.ykClientId) state.login.ykClientId = data.ykClientId
		},
		setUnits(state, data) {
			state.units = data
		},
		setLanguage(state, lang) {
			state.language = lang
		}
	},
	actions: {},
	getters: {
		compId(state) {
			return state.login.company ? state.login.company.id : ''
		},
		unitId(state) {
			return state.login.unit ? state.login.unit.id : ''
		},
		empId(state) {
			return state.login.staff ? state.login.staff.id : ''
		}
	}
})
