<template>
	<view class="login-page">
		<view class="login-container">
			<!-- Logo -->
			<view class="login-logo">
				<view class="login-logo-icon">AI</view>
				<text class="login-logo-text">AI Vision</text>
			</view>

			<!-- 标题 -->
			<text class="login-title">{{ T({zh:'欢迎登录', en:'Welcome', hk:'歡迎登錄'}) }}</text>
			<text class="login-subtitle">{{ T({zh:'选择您偏好的登录方式', en:'Choose your preferred login method', hk:'選擇您偏好的登錄方式'}) }}</text>

			<!-- 登录方式切换 -->
			<view class="auth-method-tabs">
				<view class="auth-method-tab" :class="{ active: method === 'account' }" @click="switchMethod('account')">
					<text style="font-size:18px;">📱</text>
					<text>{{ T({zh:'账号密码', en:'Account', hk:'賬號密碼'}) }}</text>
				</view>
				<view class="auth-method-tab" :class="{ active: method === 'wechat' }" @click="switchMethod('wechat')">
					<text style="font-size:18px;">📷</text>
					<text>{{ T({zh:'微信扫码', en:'WeChat Scan', hk:'微信掃碼'}) }}</text>
				</view>
			</view>

			<!-- 账号密码面板 -->
			<view v-if="method === 'account'">

			<!-- 登录/注册切换 -->
			<view class="auth-tabs">
				<view class="auth-tab" :class="{ active: tab === 'login' }" @click="tab = 'login'">
					<text>{{ T({zh:'登录', en:'Login', hk:'登錄'}) }}</text>
				</view>
				<view class="auth-tab" :class="{ active: tab === 'register' }" @click="tab = 'register'">
					<text>{{ T({zh:'注册', en:'Register', hk:'註冊'}) }}</text>
				</view>
			</view>

			<!-- 登录表单 -->
			<view v-if="tab === 'login'" class="auth-form">
				<view class="form-group">
					<text class="form-label">{{ T({zh:'手机号', en:'Phone', hk:'手機號'}) }}</text>
					<input class="form-input" type="text" v-model="loginPhone" :placeholder="T({zh:'请输入手机号/邮箱/用户名', en:'Phone / Email / Username', hk:'請輸入手機號/郵箱/用戶名'})" />
				</view>
				<view class="form-group">
					<text class="form-label">{{ T({zh:'密码', en:'Password', hk:'密碼'}) }}</text>
					<input class="form-input" type="password" v-model="loginPwd" :placeholder="T({zh:'请输入密码', en:'Enter password', hk:'請輸入密碼'})" />
				</view>
				<view class="btn btn-primary btn-lg btn-block" @click="handleLogin">
					<text>{{ T({zh:'登录', en:'Login', hk:'登錄'}) }}</text>
				</view>
				<view class="auth-footer">
					<text class="auth-link" @click="forgotPwd">{{ T({zh:'忘记密码？', en:'Forgot password?', hk:'忘記密碼？'}) }}</text>
				</view>
			</view>

			<!-- 注册表单 -->
			<view v-if="tab === 'register'" class="auth-form">
				<view class="form-group">
					<text class="form-label">{{ T({zh:'姓名', en:'Name', hk:'姓名'}) }} <text class="required">*</text></text>
					<input class="form-input" type="text" v-model="regName" :placeholder="T({zh:'请输入您的姓名', en:'Enter your name', hk:'請輸入您的姓名'})" />
				</view>
				<view class="form-group">
					<text class="form-label">{{ T({zh:'手机号', en:'Phone', hk:'手機號'}) }} <text class="required">*</text></text>
					<input class="form-input" type="tel" v-model="regPhone" :placeholder="T({zh:'请输入手机号', en:'Enter phone number', hk:'請輸入手機號'})" />
				</view>
				<view class="form-group">
					<text class="form-label">{{ T({zh:'邮箱', en:'Email', hk:'郵箱'}) }}</text>
					<input class="form-input" type="text" v-model="regEmail" :placeholder="T({zh:'请输入邮箱（选填）', en:'Email (optional)', hk:'請輸入郵箱（選填）'})" />
				</view>
				<view class="form-group">
					<text class="form-label">{{ T({zh:'门店/公司名称', en:'Store/Company Name', hk:'門店/公司名稱'}) }} <text class="required">*</text></text>
					<input class="form-input" type="text" v-model="regShop" :placeholder="T({zh:'请输入门店或公司名称', en:'Enter store or company name', hk:'請輸入門店或公司名稱'})" />
				</view>
				<view class="form-group">
					<text class="form-label">{{ T({zh:'设置密码', en:'Set Password', hk:'設置密碼'}) }} <text class="required">*</text></text>
					<input class="form-input" type="password" v-model="regPwd" :placeholder="T({zh:'设置登录密码', en:'Set login password', hk:'設置登錄密碼'})" />
				</view>
				<view class="btn btn-primary btn-lg btn-block" @click="handleRegister">
					<text>{{ T({zh:'注册并登录', en:'Register & Login', hk:'註冊並登錄'}) }}</text>
				</view>
			</view>

			</view>

			<!-- 微信扫码面板 -->
			<view v-if="method === 'wechat'" class="wechat-panel">
				<view class="qr-placeholder">
					<text v-if="qrLoading" style="color:#94A3B8;font-size:14px;">{{ T({zh:'加载中...', en:'Loading...', hk:'加載中...'}) }}</text>
					<image v-else-if="qrCodeImg && !qrExpired" :src="qrCodeImg" mode="aspectFit" style="width:180px;height:180px;" />
					<view v-else style="text-align:center;">
						<text style="font-size:48px;display:block;">📱</text>
						<text v-if="qrExpired" style="color:#EF4444;font-size:13px;margin-top:8px;display:block;">{{ T({zh:'二维码已过期', en:'QR code expired', hk:'二維碼已過期'}) }}</text>
					</view>
				</view>
				<text class="wechat-tip">{{ T({zh:'使用微信扫描二维码登录', en:'Scan with WeChat to login', hk:'使用微信掃描二維碼登錄'}) }}</text>
				<view class="btn" style="margin-top:12px;" @click="getQrCode">
					<text>{{ T({zh:'刷新二维码', en:'Refresh QR', hk:'刷新二維碼'}) }}</text>
				</view>
			</view>

			<!-- 语言切换 -->
			<view class="login-lang">
				<text class="lang-btn" :class="{ active: lang === 'zh' }" @click="setLang('zh')">简</text>
				<text class="lang-btn" :class="{ active: lang === 'hk' }" @click="setLang('hk')">繁</text>
				<text class="lang-btn" :class="{ active: lang === 'en' }" @click="setLang('en')">EN</text>
			</view>
		</view>

		<!-- 门店选择弹窗 -->
		<view class="modal-overlay" v-if="storePickerShow" @click="storePickerShow = false">
			<view class="modal sp-modal" @click.stop>
				<view class="sp-header">
					<view class="sp-header-icon"><text style="color:#fff;font-weight:700;">🏪</text></view>
					<view>
						<text class="sp-title">{{ T({zh:'选择门店', en:'Select Store', hk:'選擇門店'}) }}</text>
						<text class="sp-subtitle">{{ T({zh:'选择您要进入的门店', en:'Select store to enter', hk:'選擇您要進入的門店'}) }}</text>
					</view>
				</view>
				<view class="sp-list">
					<view v-for="(s, idx) in storeList" :key="idx" class="sp-card" :class="{ active: selectedStoreId === s.id }" @click="selectStore(s)">
						<view class="sp-card-icon"><text>🏪</text></view>
						<view class="sp-card-info">
							<text class="sp-card-name">{{ s.name }}</text>
							<view class="sp-card-meta">
								<text class="sp-badge" :class="s.type === 0 ? 'direct' : 'franchise'">{{ s.type === 0 ? T({zh:'直营', en:'Direct', hk:'直營'}) : T({zh:'加盟', en:'Franchise', hk:'加盟'}) }}</text>
							</view>
						</view>
						<text v-if="selectedStoreId === s.id" class="sp-card-check">✓</text>
					</view>
					<view v-if="storeList.length === 0" class="sp-empty">
						<text>{{ T({zh:'暂无门店数据', en:'No store data', hk:'暫無門店數據'}) }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { postData, getData } from '@/api/request'

export default {
	name: 'Login',
	data() {
		return {
			lang: 'zh',
			tab: 'login',
			method: 'wechat',
			qrCodeImg: '',
			qrRandomNum: '',
			qrLoading: false,
			qrExpired: false,
			qrCheckTimer: null,
			qrCheckCount: 0,
			// 登录
			loginPhone: '',
			loginPwd: '',
			// 注册
			regName: '',
			regPhone: '',
			regEmail: '',
			regShop: '',
			regPwd: '',
			// 门店
			storePickerShow: false,
			storeList: [],
			selectedStoreId: ''
		}
	},
	beforeDestroy() {
		this.stopQrCheck()
	},
	onLoad() {
		var savedLang = ''
		try { savedLang = localStorage.getItem('aivision_lang') || '' } catch(e) {}
		if (savedLang) this.lang = savedLang
		// 检查是否已登录
		this.checkLogin()
	},
	methods: {
		T(texts) {
			return texts[this.lang] || texts.hk || texts.zh
		},

		setLang(lang) {
			this.lang = lang
			var localeMap = { zh: 'zh-CN', en: 'en-US', hk: 'zh-HK' }
			this.$i18n.locale = localeMap[lang] || 'zh-CN'
			try { localStorage.setItem('aivision_lang', lang) } catch(e) {}
		},

		switchMethod(m) {
			this.method = m
			if (m === 'wechat') {
				this.getQrCode()
			} else {
				this.stopQrCheck()
			}
		},
		getQrCode() {
			var that = this
			this.qrLoading = true
			this.qrExpired = false
			this.qrCodeImg = ''
			this.stopQrCheck()
			fetch('/crm/login/login3.json', { method: 'POST' })
				.then(function(r) { return r.json() })
				.then(function(data) {
					if (data.randomNum) {
						that.qrRandomNum = data.randomNum
						that.qrCodeImg = '/crm/login/crmLoginQrCode.xhtml?randomNum=' + data.randomNum + '&fromWhere=2'
						that.startQrCheck()
					}
				}).catch(function(e) {
					console.error('get qr failed', e)
					that.qrExpired = true
				}).finally(function() {
					that.qrLoading = false
				})
		},
		startQrCheck() {
			var that = this
			this.stopQrCheck()
			this.qrCheckCount = 0
			this.qrCheckTimer = setInterval(function() {
				that.checkQrLogin()
				that.qrCheckCount++
				if (that.qrCheckCount > 100) {
					that.stopQrCheck()
					that.qrExpired = true
					that.qrCodeImg = ''
				}
			}, 5000)
		},
		stopQrCheck() {
			if (this.qrCheckTimer) {
				clearInterval(this.qrCheckTimer)
				this.qrCheckTimer = null
			}
		},
		checkQrLogin() {
			var that = this
			var formData = new FormData()
			formData.append('randomNum', this.qrRandomNum)
			fetch('/crm/login/crmCheckLogin.xhtml', { method: 'POST', body: formData })
				.then(function(r) { return r.json() })
				.then(function(data) {
					if (data && data.code == '1') {
						that.stopQrCheck()
						that.doQrLoginFinish()
					} else if (data && data.code == '0') {
						that.stopQrCheck()
						that.qrExpired = true
						that.qrCodeImg = ''
					}
				}).catch(function() {})
		},
		doQrLoginFinish() {
			var that = this
			fetch('/crm/employee/initAfterCheck.xhtml', { method: 'POST' })
				.then(function() {
					return fetch('/crm/employee/checkCurrentLogin.json')
				})
				.then(function(r) { return r.json() })
				.then(function(data) {
					if (data && data.returnCode === 'SUCCESS' && data.staff) {
						that.saveLoginInfo(data)
						uni.showToast({ title: that.T({zh:'login success', en:'Login successful!', hk:'login success'}), icon: 'success' })
						that.afterLogin(data)
					} else {
						that.goMeasure()
					}
				}).catch(function() {
					that.goMeasure()
				})
		},
		checkLogin() {
			this.getQrCode();
			var that = this
			// 尝试从后台获取登录状态
			getData('/crm/employee/checkCurrentLogin.json').then(function(res) {
				var data = res.data || res
				if (data && data.returnCode === 'SUCCESS' && data.staff) {
					// 已登录，保存信息并跳转
					that.saveLoginInfo(data)
					that.goMeasure()
				}
			}).catch(function() {
				// 未登录，停在登录页
			})
		},

		handleLogin() {
			var that = this
			if (!this.loginPhone) {
				uni.showToast({ title: this.T({zh:'请输入手机号', en:'Please enter phone number', hk:'請輸入手機號'}), icon: 'none' })
				return
			}
			if (!this.loginPwd) {
				uni.showToast({ title: this.T({zh:'请输入密码', en:'Please enter password', hk:'請輸入密碼'}), icon: 'none' })
				return
			}

			var fd = new FormData()
			fd.append('phoneNum', this.loginPhone)
			fd.append('passWord', this.loginPwd)

			uni.showLoading({ title: that.T({zh:'登录中...', en:'Logging in...', hk:'登錄中...'}) })
			fetch('/crm/employee/preLoginCheck.json', { method: 'POST', body: fd })
				.then(function(r) { return r.json() })
				.then(function(preRes) {
					console.log('preLoginCheck result:', preRes)
					if (preRes.returnCode !== 'SUCCESS') {
						uni.hideLoading()
						uni.showToast({ title: preRes.errCodeDes || that.T({zh:'登录失败，请检查手机号和密码', en:'Login failed, please check credentials', hk:'登錄失敗'}), icon: 'none', duration: 3000 })
						return
					}
					// preCheck通过，执行登录
					that.doAccountLogin()
				})
				.catch(function(e) {
					console.error('preLoginCheck error:', e)
					uni.showToast({ title: that.T({zh:'网络异常', en:'Network error', hk:'網絡異常'}), icon: 'none' })
				})
		},
		doAccountLogin() {
			var that = this
			var formData = new FormData()
			formData.append('phoneNum', this.loginPhone)
			formData.append('passWord', this.loginPwd)

			fetch('/crm/employee/getLoginEmployee.json', { method: 'POST', body: formData })
				.then(function(r) { return r.json() })
				.then(function(data) {
					console.log('getLoginEmployee result:', data)
					if (data.returnCode === 'SUCCESS') {
						// 登录成功，获取完整信息
						that.fetchFullLoginInfo()
					} else {
						uni.showToast({ title: data.errCodeDes || that.T({zh:'登录失败', en:'Login failed', hk:'登錄失敗'}), icon: 'none', duration: 3000 })
					}
				})
				.catch(function(e) {
					console.error('getLoginEmployee error:', e)
					uni.showToast({ title: that.T({zh:'网络异常', en:'Network error', hk:'網絡異常'}), icon: 'none' })
				})
		},
		fetchFullLoginInfo() {
			var that = this
			var formData = new FormData()
			fetch('/crm/auth/getMiniProgramEmpInfoNew_wxyVue.xhtml', { method: 'POST', body: formData })
				.then(function(r) { return r.json() })
				.then(function(data) {
					console.log('getMiniProgramEmpInfo result:', data)
					if (data.returnCode === 'SUCCESS') {
						var loginData = {
							staff: data.loginedEmp ? { id: data.loginedEmp.id, name: data.loginedEmp.nameCn, img: data.loginedEmp.wechatImgUrl || '' } : null,
							company: data.companyInfo ? { id: data.companyInfo.id, name: data.companyInfo.nameCn } : null,
							ykClientId: data.ykClientId || '',
						unit: data.loginedUnit ? { id: data.loginedUnit.id, name: data.loginedUnit.name } : null
						}
						that.$store.commit('setLogin', loginData)
						if (data.units) {
							that.$store.commit('setUnits', data.units)
						try { sessionStorage.setItem('aivision_units', JSON.stringify(data.units)) } catch(e) {}
						}
						try { sessionStorage.setItem('aivision_login', JSON.stringify(loginData)) } catch(e) {}

						uni.showToast({ title: that.T({zh:'登录成功！', en:'Login successful!', hk:'登錄成功！'}), icon: 'success' })

						// 检查门店
						var units = data.units || []
						if (units.length === 0) {
							that.goMeasure()
						} else if (units.length === 1) {
							that.switchUnit(units[0])
						} else if (loginData.unit && loginData.unit.id) {
							// 已有默认门店
							that.goMeasure()
						} else {
							that.storeList = units.map(function(u) {
								var item = Array.isArray(u) ? u : [u.id, u.name, '', '', u.type || 0]
								return { id: item[0], name: item[1], type: item[4] || 0 }
							})
							that.storePickerShow = true
						}
					} else {
						uni.showToast({ title: that.T({zh:'获取登录信息失败', en:'Failed to get login info', hk:'獲取登錄信息失敗'}), icon: 'none' })
					}
				})
				.catch(function(e) {
					uni.hideLoading()
					console.error('fetchFullLoginInfo error:', e)
					// 即使失败也尝试进入
					that.goMeasure()
				})
		},

		handleRegister() {
			uni.showToast({ title: this.T({zh:'注册功能开发中', en:'Registration coming soon', hk:'註冊功能開發中'}), icon: 'none' })
		},

		forgotPwd() {
			uni.showToast({ title: this.T({zh:'请联系管理员重置密码', en:'Contact admin to reset password', hk:'請聯繫管理員重置密碼'}), icon: 'none' })
		},

		saveLoginInfo(data) {
			var loginData = {
				staff: data.staff || data.employee || null,
				company: data.company || data.comp || null,
				unit: data.unit || null
			}
			this.$store.commit('setLogin', loginData)
			if (data.units) {
				this.$store.commit('setUnits', data.units)
			}
			try {
				sessionStorage.setItem('aivision_login', JSON.stringify(loginData))
			} catch(e) {}
		},

		afterLogin(data) {
			var units = data.units || this.$store.state.units || []
			if (units.length === 0) {
				// 没有门店，直接进入
				this.goMeasure()
			} else if (units.length === 1) {
				// 只有一个门店，自动选中
				this.switchUnit(units[0])
			} else {
				// 多个门店，弹出选择
				this.storeList = units.map(function(u) {
					var item = Array.isArray(u) ? u : [u.id, u.name, '', '', u.type || 0]
					return { id: item[0], name: item[1], type: item[4] || 0 }
				})
				this.storePickerShow = true
			}
		},

		selectStore(store) {
			this.selectedStoreId = store.id
			var that = this
			// 找到原始数据
			var units = this.$store.state.units || []
			var found = units.find(function(u) {
				return (Array.isArray(u) ? u[0] : u.id) == store.id
			})
			if (found) {
				this.switchUnit(found)
			}
		},

		switchUnit(unitData) {
			var that = this
			var unitId = Array.isArray(unitData) ? unitData[0] : unitData.id
			var unitName = Array.isArray(unitData) ? unitData[1] : unitData.name

			fetch('/crm/httpmine/initUnitGet.json?unitId=' + unitId)
				.then(function(r) { return r.json() })
				.then(function(data) {
					console.log('initUnitGet result:', data)
					var loginInfo = that.$store.state.login || {}
					loginInfo.unit = { id: unitId, name: unitName }
					that.$store.commit('setLogin', loginInfo)
					try { sessionStorage.setItem('aivision_login', JSON.stringify(loginInfo)) } catch(e) {}
					that.storePickerShow = false
					that.goMeasure()
				})
				.catch(function(e) {
					console.error('initUnitGet error:', e)
					// 即使接口失败也设置门店并进入
					var loginInfo = that.$store.state.login || {}
					loginInfo.unit = { id: unitId, name: unitName }
					that.$store.commit('setLogin', loginInfo)
					try { sessionStorage.setItem('aivision_login', JSON.stringify(loginInfo)) } catch(e2) {}
					that.storePickerShow = false
					that.goMeasure()
				})
		},

		goMeasure() {
			uni.redirectTo({ url: '/pages/measure/index' })
		}
	}
}
</script>

<style lang="scss" scoped>
.login-page {
	min-height: 100vh;
	background: linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	font-family: 'Inter', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.login-container {
	background: white;
	border-radius: 24px;
	padding: 40px;
	width: 90%;
	max-width: 720px;
	position: relative;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.login-logo {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 28px;
	justify-content: center;
}
.login-logo-icon {
	width: 42px;
	height: 42px;
	border-radius: 12px;
	background: linear-gradient(135deg, #6366F1, #818CF8);
	color: #fff;
	font-weight: 800;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.login-logo-text {
	font-size: 20px;
	font-weight: 700;
	color: #0F172A;
}

.login-title {
	font-size: 22px;
	font-weight: 700;
	color: #0F172A;
	display: block;
	margin-bottom: 8px;
}
.login-subtitle {
	font-size: 15px;
	color: #64748B;
	display: block;
	margin-bottom: 32px;
}

/* Auth Tabs - 原版样式 */
.auth-tabs {
	display: flex;
	border-bottom: 2px solid #F1F5F9;
	margin-bottom: 24px;
}
.auth-tab {
	flex: 1;
	padding: 12px;
	text-align: center;
	font-size: 15px;
	font-weight: 600;
	color: #94A3B8;
	cursor: pointer;
	border-bottom: 2px solid transparent;
	margin-bottom: -2px;
	transition: all 0.15s ease;
	background: none;
	&.active {
		color: #6366F1;
		border-bottom-color: #6366F1;
	}
}

/* Form - 原版样式 */
.auth-form {
	display: flex;
	flex-direction: column;
}
.form-group {
	margin-bottom: 16px;
}
.form-label {
	display: block;
	font-size: 14px;
	font-weight: 600;
	color: #334155;
	margin-bottom: 6px;
}
.required {
	color: #EF4444;
}
.form-input {
	width: 100%;
	height: 35px;
	line-height: 35px;
	border: 1px solid #E2E8F0;
	border-radius: 12px;
	font-size: 15px;
	font-family: inherit;
	color: #0F172A;
	outline: none;
	transition: all 0.15s ease;
	box-sizing: border-box;
	background: transparent;
}

/* Button - 原版样式 */
.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px 24px;
	border-radius: 12px;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.15s ease;
	border: none;
	font-family: inherit;
}
.btn-primary {
	background: linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
.btn-primary:active {
	box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
	transform: translateY(-2px);
}
.btn-lg {
	padding: 16px 32px;
	font-size: 16px;
	border-radius: 16px;
}
.btn-block {
	width: 100%;
}

.auth-footer {
	text-align: center;
	font-size: 13px;
	color: #94A3B8;
	margin-top: 16px;
}
.auth-link {
	color: #6366F1;
	font-weight: 600;
	cursor: pointer;
}

.login-lang {
	display: flex;
	justify-content: center;
	gap: 6px;
	margin-top: 24px;
}
.lang-btn {
	padding: 5px 12px;
	font-size: 12px;
	border-radius: 8px;
	background: #F1F5F9;
	color: #64748B;
	cursor: pointer;
	transition: all 0.15s;
	&.active {
		background: #6366F1;
		color: #fff;
	}
}

/* 门店选择弹窗 - 原版样式 */
.modal-overlay {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(15, 23, 42, 0.6);
	backdrop-filter: blur(4px);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
}
.modal {
	background: white;
	border-radius: 24px;
	padding: 40px;
	max-width: 480px;
	width: 90%;
	position: relative;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}
.sp-modal {
	padding: 28px 28px 24px;
}
.sp-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}
.sp-header-icon {
	width: 42px; height: 42px;
	border-radius: 12px;
	background: linear-gradient(135deg, #6366f1, #818cf8);
	color: white;
	display: flex; align-items: center; justify-content: center;
	flex-shrink: 0;
}
.sp-title {
	font-size: 18px;
	font-weight: 700;
	color: #1e293b;
	display: block;
	margin: 0 0 2px;
}
.sp-subtitle {
	font-size: 12px;
	color: #94a3b8;
	display: block;
	margin: 0;
}
.sp-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-height: 360px;
	overflow-y: auto;
}
.sp-card {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 14px;
	border: 1.5px solid #e2e8f0;
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.15s;
	background: white;
	&:active {
		border-color: #a5b4fc;
		background: #fafafe;
	}
	&.active {
		border-color: #6366f1;
		background: #eef2ff;
		.sp-card-icon { background: #6366f1; color: white; }
		.sp-card-name { color: #4f46e5; font-weight: 600; }
		.sp-card-check { color: #6366f1; }
	}
}
.sp-card-icon {
	width: 38px; height: 38px;
	border-radius: 10px;
	background: #f1f5f9;
	color: #64748b;
	display: flex; align-items: center; justify-content: center;
	flex-shrink: 0;
	transition: all 0.15s;
	font-size: 18px;
}
.sp-card-info { flex: 1; min-width: 0; }
.sp-card-name {
	font-size: 14px;
	font-weight: 500;
	color: #1e293b;
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: all 0.15s;
}
.sp-card-meta {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-top: 4px;
}
.sp-badge {
	display: inline-block;
	font-size: 11px;
	padding: 1px 7px;
	border-radius: 10px;
	font-weight: 500;
	&.direct { background: #dbeafe; color: #2563eb; }
	&.franchise { background: #fef9c3; color: #ca8a04; }
}
.sp-card-check {
	flex-shrink: 0;
	color: #6366f1;
	font-size: 18px;
	font-weight: 700;
}
.sp-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	padding: 40px 0;
	color: #94a3b8;
	font-size: 13px;
}

/* 登录方式切换 - 原版样式 */
.auth-method-tabs {
	display: flex;
	gap: 8px;
	margin-bottom: 24px;
	padding: 4px;
	background: #F8FAFC;
	border-radius: 16px;
}
.auth-method-tab {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px 16px;
	font-size: 14px;
	font-weight: 600;
	color: #64748B;
	background: none;
	border: none;
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.15s ease;
	&.active {
		background: white;
		color: #6366F1;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
}

/* 微信扫码面板 */
.wechat-panel {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px 0;
}
.qr-placeholder {
	display: flex;
	justify-content: center;
	padding: 16px;
	background: #F8FAFC;
	border: 2px dashed rgba(99, 102, 241, 0.2);
	border-radius: 12px;
	margin-bottom: 12px;
}
.wechat-tip {
	font-size: 13px;
	color: #64748B;
}

</style>
<style>
.login-page .uni-input-wrapper,
.login-page .uni-input-input {
	height: 35px !important;
	line-height: 35px !important;
}

.login-page .form-input:focus,
.login-page .uni-input-wrapper:focus-within {
	border-color: #6366F1 !important;
	box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
}

.login-page .form-input {
	background: transparent !important;
}
.login-page .form-input:focus {
	border-color: #6366f1 !important;
	box-shadow: 0 0 0 3px #6366f11a !important;
}

.login-page input:-webkit-autofill,
.login-page input:-webkit-autofill:hover,
.login-page input:-webkit-autofill:focus,
.login-page input:-webkit-autofill:active {
	-webkit-box-shadow: 0 0 0 30px white inset !important;
	box-shadow: 0 0 0 30px white inset !important;
	background-color: white !important;
	-webkit-text-fill-color: #0F172A !important;
}

.login-page .uni-input-input {
	padding: 0 16px !important;
}
</style>