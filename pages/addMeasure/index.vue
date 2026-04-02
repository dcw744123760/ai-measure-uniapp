<template>
	<view class="page">
		<view class="topbar">
			<view class="topbar-back" @click="goBack">
				<text>← {{ $t('measure.back') }}</text>
			</view>
			<text class="topbar-title">{{ $t('measure.addMeasure') }}</text>
			<view style="width: 60px;"></view>
		</view>

		<view class="content">
			<text style="color: #94a3b8; padding: 60px; text-align: center; display: block;">
				TODO: Add measurement page - will integrate with face-discern-uniapp measurement flow
			</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'AddMeasure',
	methods: {
		goBack() {
			uni.navigateBack()
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
.content {
	padding: 20px;
}
</style>
