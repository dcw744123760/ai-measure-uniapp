<template>
	<view class="page">
		<!-- 顶部栏 -->
		<view class="topbar">
			<view class="topbar-back" @click="goBack">
				<text>← {{ $t('measure.back') }}</text>
			</view>
			<text class="topbar-title">{{ $t('measure.detail') }}</text>
			<view style="width: 60px;"></view>
		</view>

		<view v-if="loading" class="loading-wrap">
			<text>{{ $t('measure.loading') }}</text>
		</view>

		<scroll-view v-else scroll-y class="detail-content">
			<!-- 图片区 -->
			<view class="img-section">
				<view class="img-item" v-if="item.capImgSrc">
					<image :src="item.capImgSrc" mode="aspectFit" @click="previewImage(item.capImgSrc)" />
					<text class="img-label">原图</text>
				</view>
				<view class="img-item" v-if="item.dataImgSrc">
					<image :src="item.dataImgSrc" mode="aspectFit" @click="previewImage(item.dataImgSrc)" />
					<text class="img-label">数据图</text>
				</view>
				<view class="img-item" v-if="item.side_capImgSrc">
					<image :src="item.side_capImgSrc" mode="aspectFit" @click="previewImage(item.side_capImgSrc)" />
					<text class="img-label">侧脸</text>
				</view>
			</view>

			<!-- 客户信息 -->
			<view class="info-card">
				<view class="info-row">
					<text class="info-name">{{ item.clientName || '--' }}</text>
					<text class="info-gender" :class="item.gender === '1' ? 'male' : 'female'">{{ item.gender === '1' ? '♂' : '♀' }}</text>
					<text class="info-age">{{ item.age }}{{ $t('measure.years') }}</text>
					<text class="info-type" :class="item.checkTypeClass">{{ item.checkTypeName }}</text>
				</view>
				<text class="info-frame">{{ item.mirrorFrame || '--' }}</text>
				<text class="info-time">{{ item.createTime }}</text>
			</view>

			<!-- 瞳距参数 -->
			<view class="param-card">
				<text class="param-card-title">{{ $t('measure.pdParams') }}</text>
				<view class="param-grid">
					<view class="param-item">
						<text class="param-value">{{ item.cnSpace || '--' }}</text>
						<text class="param-label">{{ $t('measure.nearPd') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.fnSpace || '--' }}</text>
						<text class="param-label">{{ $t('measure.farPd') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.rhSpace || '--' }}</text>
						<text class="param-label">{{ $t('measure.rHeight') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.lhSpace || '--' }}</text>
						<text class="param-label">{{ $t('measure.lHeight') }}</text>
					</view>
				</view>
			</view>

			<!-- 配镜参数 -->
			<view class="param-card">
				<text class="param-card-title">{{ $t('measure.fittingParams') }}</text>
				<view class="param-grid">
					<view class="param-item">
						<text class="param-value">{{ item.vd || '--' }}</text>
						<text class="param-label">{{ $t('measure.lensEyeDist') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.pa || '--' }}</text>
						<text class="param-label">{{ $t('measure.tiltAngle') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.wrap || '--' }}</text>
						<text class="param-label">{{ $t('measure.faceBend') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.fw || '--' }}</text>
						<text class="param-label">{{ $t('measure.frameWidth') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.frame_high || '--' }}</text>
						<text class="param-label">{{ $t('measure.frameHeight') }}</text>
					</view>
					<view class="param-item">
						<text class="param-value">{{ item.tilt_max || '--' }}</text>
						<text class="param-label">{{ $t('measure.maxTiltAngle') }}</text>
					</view>
				</view>
			</view>

			<!-- 其他参数 -->
			<view class="param-card" v-if="item.frameNose || item.frameHighAll || item.frameType">
				<text class="param-card-title">{{ $t('measure.otherParams') }}</text>
				<view class="param-grid">
					<view class="param-item" v-if="item.frameNose">
						<text class="param-value">{{ item.frameNose }}</text>
						<text class="param-label">{{ $t('measure.frameNose') }}</text>
					</view>
					<view class="param-item" v-if="item.frameHighAll">
						<text class="param-value">{{ item.frameHighAll }}</text>
						<text class="param-label">{{ $t('measure.frameTotalHeight') }}</text>
					</view>
					<view class="param-item" v-if="item.frameType">
						<text class="param-value">{{ item.frameType }}</text>
						<text class="param-label">{{ $t('measure.frameType') }}</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="action-row">
				<view class="action-btn" @click="shareMeasure">
					<text>{{ $t('measure.share') }}</text>
				</view>
				<view class="action-btn" @click="printMeasure">
					<text>{{ $t('measure.print') }}</text>
				</view>
				<view class="action-btn danger" @click="deleteMeasure">
					<text>{{ $t('measure.delete') }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { postData } from '@/api/request'
import { DEFAULT_IMG, buildImgUrl } from '@/utils/common'

export default {
	name: 'MeasureDetail',
	data() {
		return {
			id: '',
			item: {},
			loading: true
		}
	},
	onLoad(options) {
		this.id = options.id
		this.loadDetail()
	},
	methods: {
		loadDetail() {
			var that = this
			this.loading = true
			postData('/aiPuPil/getAiPuPilById.json', { id: this.id }).then(function(res) {
				var data = res.data || res
				if (data && data.returnCode === 'SUCCESS') {
					var detail = data.data || data.aiPuPil || data
					that.item = detail
				}
			}).catch(function(e) {
				console.error('Load detail failed', e)
			}).finally(function() {
				that.loading = false
			})
		},

		goBack() {
			uni.navigateBack()
		},

		previewImage(src) {
			if (!src) return
			uni.previewImage({
				urls: [src],
				current: src
			})
		},

		shareMeasure() {
			var url = 'https://www.e0123.cn/uploadImgAi/index.html#/data-count?aiPuPilId=' + this.id
			// #ifdef H5
			if (navigator.clipboard) {
				navigator.clipboard.writeText(url)
				uni.showToast({ title: this.$t('measure.linkCopied'), icon: 'success' })
			}
			// #endif
			// #ifdef APP-PLUS
			uni.setClipboardData({
				data: url,
				success: function() {
					uni.showToast({ title: this.$t('measure.linkCopied'), icon: 'success' })
				}
			})
			// #endif
		},

		printMeasure() {
			// #ifdef H5
			var url = '/crm/comm/commHandSignListView_page.xhtml?type=108&aiId=' + this.id
			window.open(url, '_blank')
			// #endif
		},

		deleteMeasure() {
			var that = this
			uni.showModal({
				title: '',
				content: this.$t('measure.confirmDelete'),
				success: function(res) {
					if (res.confirm) {
						postData('/aiPuPil/deleteAiPuPilInfo.json', { id: that.id }).then(function(res) {
							var data = res.data || res
							uni.showToast({ title: that.$t('measure.deleteSuccess'), icon: 'success' })
							setTimeout(function() {
								uni.navigateBack()
							}, 500)
						}).catch(function() {
							uni.showToast({ title: that.$t('measure.deleteFailed'), icon: 'none' })
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f1f5f9;
}
.topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 20px;
	background: #fff;
	border-bottom: 1px solid #e2e8f0;
}
.topbar-back {
	font-size: 14px;
	color: #6366f1;
	cursor: pointer;
}
.topbar-title {
	font-size: 16px;
	font-weight: 600;
}
.loading-wrap {
	padding: 40px;
	text-align: center;
	color: #94a3b8;
}
.detail-content {
	height: calc(100vh - 50px);
	padding: 16px 20px;
}
.img-section {
	display: flex;
	gap: 10px;
	margin-bottom: 16px;
	overflow-x: auto;
}
.img-item {
	flex-shrink: 0;
	width: 160px;
	text-align: center;
	image {
		width: 160px;
		height: 120px;
		border-radius: 8px;
		background: #e2e8f0;
	}
}
.img-label {
	font-size: 11px;
	color: #94a3b8;
	margin-top: 4px;
	display: block;
}
.info-card {
	background: #fff;
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 12px;
}
.info-row {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
}
.info-name {
	font-size: 16px;
	font-weight: 600;
	color: #1e293b;
}
.info-gender {
	font-size: 14px;
	&.male { color: #6366f1; }
	&.female { color: #ec4899; }
}
.info-age { font-size: 12px; color: #94a3b8; }
.info-type {
	font-size: 10px;
	padding: 2px 8px;
	border-radius: 4px;
	&.type-far { background: #eef2ff; color: #6366f1; }
	&.type-near { background: #fef3c7; color: #d97706; }
	&.type-multi { background: #f0fdf4; color: #16a34a; }
}
.info-frame { font-size: 13px; color: #64748b; display: block; margin-bottom: 4px; }
.info-time { font-size: 12px; color: #94a3b8; display: block; }

.param-card {
	background: #fff;
	border-radius: 12px;
	padding: 16px;
	margin-bottom: 12px;
}
.param-card-title {
	font-size: 14px;
	font-weight: 600;
	color: #1e293b;
	margin-bottom: 12px;
	display: block;
}
.param-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}
.param-item {
	flex: 0 0 calc(33.33% - 8px);
	text-align: center;
	padding: 8px;
	background: #f8fafc;
	border-radius: 8px;
}
.param-value {
	font-size: 16px;
	font-weight: 700;
	color: #1e293b;
	display: block;
}
.param-label {
	font-size: 11px;
	color: #94a3b8;
	display: block;
	margin-top: 2px;
}
.action-row {
	display: flex;
	gap: 10px;
	padding: 16px 0;
}
.action-btn {
	flex: 1;
	padding: 12px;
	text-align: center;
	background: #fff;
	border-radius: 10px;
	font-size: 14px;
	color: #475569;
	cursor: pointer;
	border: 1px solid #e2e8f0;
	&.danger {
		color: #ef4444;
		border-color: #fecaca;
	}
	&:active {
		background: #f8fafc;
	}
}
</style>
