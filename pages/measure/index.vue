<template>

	<view class="db-panel">

		<!-- 顶部栏 -->
		<view class="db-topbar">
			<view class="db-topbar-left">
				<view class="db-topbar-menu">
					<text style="font-weight:bold;font-size:16px;color:#6366f1">AI</text>
				</view>
				<text class="db-topbar-title">{{ $t('measure.title') }}</text>
			</view>
			<view class="db-topbar-right">
				<view class="db-topbar-store" @click="openStorePicker">
					<view class="db-topbar-store-info">
						<text class="db-topbar-company">{{ loginInfo.company ? loginInfo.company.name : $t('measure.company') }}</text>
						<text class="db-topbar-unit">{{ loginInfo.unit ? loginInfo.unit.name : $t('measure.noStore') }} <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:2px;flex-shrink:0"><path d="m6 9 6 6 6-6"></path></svg></text>
					</view>
				</view>
				<view class="db-topbar-lang">
					<text class="db-topbar-lang-btn" :class="{ active: lang === 'zh' }" @click="setLang('zh')">简</text>
					<text class="db-topbar-lang-btn" :class="{ active: lang === 'hk' }" @click="setLang('hk')">繁</text>
					<text class="db-topbar-lang-btn" :class="{ active: lang === 'en' }" @click="setLang('en')">EN</text>
				</view>
				<view class="db-topbar-logout-btn" @click="logoutFun"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg></view>
			</view>
		</view>

		<!-- 工具栏 -->
		<view class="am-toolbar">
			<view class="am-toolbar-left">
				<!-- 客户选择器 -->
				<view class="am-client-chip" @click="openClientSearch">
					<view class="am-client-chip-avatar" :class="clientInfo.gender === '男' || clientInfo.gender === '男' || clientInfo.gender === '1' ? 'male' : 'female'">
						{{ clientInfo.name ? clientInfo.name.charAt(0) : $t('measure.clientInitial') }}
					</view>
					<view class="am-client-chip-info">
						<text class="am-client-chip-name">{{ clientInfo.name || $t('measure.selectClient') }}</text>
						<text class="am-client-chip-sub">{{ clientInfo.tel ? maskPhone(clientInfo.tel) : $t('measure.switchClient') }}</text>
					</view>
					<text v-if="clientInfo.id" @click.stop="clearClient"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;color:#94a3b8;flex-shrink:0;margin-left:2px"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></text>
				</view>
				<!-- 设备 -->
				<view class="am-device-chip" @click="openDeviceModal">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;color:#6366f1"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>
					<text>{{ deviceInfo.name || $t('measure.selectDevice') }}</text>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;color:#94a3b8"><path d="m6 9 6 6 6-6"></path></svg>
				</view>
				<view class="am-toolbar-divider"></view>
				<!-- 全部门店 -->
				<view class="am-btn am-btn-filter-toggle" :class="{ active: allUnits }" @click="allUnits = !allUnits; doSearch()">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><circle cx="9" cy="12" r="3"></circle><rect width="20" height="14" x="2" y="5" rx="7"></rect></svg> {{ $t('measure.allStores') }}
				</view>
				<view class="am-btn" @click="setGuestMode"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> {{ $t('measure.guest') }}</view>
				<view class="am-toolbar-divider"></view>
				<view class="am-btn" :class="{ active: showFilter }" @click="showFilter = !showFilter"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M10 5H3"></path><path d="M12 19H3"></path><path d="M14 3v4"></path><path d="M16 17v4"></path><path d="M21 12h-9"></path><path d="M21 19h-5"></path><path d="M21 5h-7"></path><path d="M8 10v4"></path><path d="M8 12H3"></path></svg> {{ $t('measure.filter') }}</view>
				<view class="am-btn" @click="refreshData"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg> {{ $t('measure.refresh') }}</view>
			</view>
			<view class="am-toolbar-right">
				<view class="am-btn" @click="openEmpCode"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg> {{ $t('measure.staffCode') }}</view>
				<view class="am-btn am-btn-add" @click="openAddMeasure"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> {{ $t('measure.addMeasure') }}</view>
			</view>
		</view>

		<!-- 筛选栏 -->
		<view class="am-filter-bar" :class="{ active: showFilter }">
			<view class="am-filter-group">
				<text class="am-filter-label">{{ $t('measure.date') }}:</text>
				<uni-datetime-picker type="daterange" v-model="dateRange" @change="onDateRangeChange" :start-placeholder="$t('measure.startDate')" :end-placeholder="$t('measure.endDate')" :clear-icon="false" />
			</view>
			<view class="am-filter-group">
				<text class="am-filter-label">{{ $t('measure.keyword') }}:</text>
				<input class="am-filter-input" type="text" v-model="tj.frameKeyword" :placeholder="$t('measure.keywordPlaceholder')" @confirm="doSearch" />
			</view>
			<view class="am-filter-group">
				<text class="am-filter-label">{{ $t('measure.checkType') }}:</text>
				<picker :value="0" :range="checkTypeNames" @change="onCheckTypeChange">
					<view class="am-filter-select">
						<text>{{ currentCheckTypeName }}</text>
					</view>
				</picker>
			</view>
			<view class="am-filter-group">
				<view class="am-btn am-btn-primary" @click="doSearch">{{ $t('measure.search') }}</view>
			</view>
		</view>

		<!-- 统计栏 -->
		<view class="db-stat-row">
			<view class="db-stat-card">
				<text class="db-stat-value">{{ stats.total }}</text>
				<text class="db-stat-label">{{ $t('measure.total') }}</text>
			</view>
			<view class="db-stat-card">
				<text class="db-stat-value">{{ stats.month }}</text>
				<text class="db-stat-label">{{ $t('measure.thisMonth') }}</text>
			</view>
			<view class="db-stat-card">
				<text class="db-stat-value">{{ stats.today }}</text>
				<text class="db-stat-label">{{ $t('measure.today') }}</text>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="am-empty">
			<text class="am-empty-text">{{ $t('measure.loading') }}</text>
		</view>

		<!-- 列表 -->
		<scroll-view scroll-y class="am-card-list" @scrolltolower="loadMore">
			<view class="am-measure-card" v-for="(item, index) in list" :key="item.id || index" @click="openDetail(item)" style="position:relative">
				<text v-if="item.checked == 1" class="am-bound-badge">已绑单</text>
				<view class="am-card-thumb">
					<image :src="item.capImgSrc || defaultImg" mode="aspectFill" @error="onImgError(item, $event)" />
				</view>
				<view class="am-card-body">
					<view class="am-card-header">
						<text class="am-card-name">{{ item.clientName || $t('measure.unknown') }}</text>
						<text class="am-card-gender" :class="item.gender === '男' || item.gender === '1' ? 'male' : 'female'">{{ item.gender === '男' || item.gender === '1' ? '♂' : '♀' }}</text>
						<text class="am-card-age" v-if="item.age !== undefined">{{ item.age }}岁</text>
						<text class="am-check-type" :class="item.checkTypeClass || 'type-far'">{{ item.checkTypeName || '' }}</text>
					</view>
					<view class="am-card-frame">{{ item.mirrorFrame || '--' }}</view>
					<view class="am-card-meta">
						<text class="am-card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> {{ item.createTime || '' }}</text>
						<text class="am-card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg> {{ item.unitName || '--' }}</text>
					</view>
				</view>
				<view class="am-card-params">
					<view class="am-card-param" v-if="item.cn_space || item.cnSpace">
						<text class="am-card-param-value">{{ item.cn_space || item.cnSpace }}</text>
						<text class="am-card-param-label">远瞳距</text>
					</view>
					<view class="am-card-param" v-if="item.fn_space || item.fnSpace">
						<text class="am-card-param-value">{{ item.fn_space || item.fnSpace }}</text>
						<text class="am-card-param-label">近瞳距</text>
					</view>
					<view class="am-card-param" v-if="item.vd">
						<text class="am-card-param-value">{{ item.vd }}</text>
						<text class="am-card-param-label">镜眼距离</text>
					</view>
					<view class="am-card-param" v-if="item.pa">
						<text class="am-card-param-value">{{ item.pa }}</text>
						<text class="am-card-param-label">倾斜角</text>
					</view>
					<view class="am-card-param" v-if="item.tilt_max">
						<text class="am-card-param-value">{{ item.tilt_max }}</text>
						<text class="am-card-param-label">最大斜角</text>
					</view>
					<view class="am-card-param" v-if="item.frame_high">
						<text class="am-card-param-value">{{ item.frame_high }}</text>
						<text class="am-card-param-label">镜圈高</text>
					</view>
					<view class="am-card-param" v-if="item.fw || item.frameWide">
						<text class="am-card-param-value">{{ item.fw || item.frameWide }}</text>
						<text class="am-card-param-label">镜圈宽</text>
					</view>
					<view class="am-card-param" v-if="item.frameNose">
						<text class="am-card-param-value">{{ item.frameNose }}</text>
						<text class="am-card-param-label">镜框鼻托</text>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="loadingMore" class="am-load-more">
				<text>{{ $t('measure.loadingMore') }}</text>
			</view>
			<view v-if="!hasMore && list.length > 0" class="am-load-more">
				<text>{{ $t('measure.noMore') }}</text>
			</view>
			<view v-if="!loading && list.length === 0" class="am-empty">
				<text class="am-empty-icon">📋</text>
				<text class="am-empty-text">{{ $t('measure.empty') }}</text>
			</view>
		</scroll-view>


		<!-- ========== 详情弹窗 ========== -->
		<view class="aam-overlay" v-if="detailShow" @click="closeDetail">
			<view class="aam-modal aam-modal-md" @click.stop="">
				<view class="MV_header">
					<text class="MV_title">{{ $t('measure.detail') }}</text>
					<view class="MV_close" @click="closeDetail">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#fff"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
					</view>
				</view>
				<scroll-view scroll-y class="aam-body">
					<view v-if="detailLoading" class="am-loading-spinner"><view class="spinner"></view><text class="am-loading-text">{{ $t('measure.loading') }}</text></view>
					<view v-else class="am-detail-body">
						<view class="am-detail-left">
							<view class="am-detail-img-wrap" v-if="detailItem.dataImgSrc"><image :src="detailItem.dataImgSrc" mode="widthFix" /></view>
							<view class="am-detail-img-wrap" v-if="detailItem.capImgSrc"><image :src="detailItem.capImgSrc" mode="widthFix" /></view>
							<view class="am-detail-img-wrap" v-if="detailItem.jxcTarkImgSrc"><image :src="detailItem.jxcTarkImgSrc" mode="widthFix" /></view>
							<view class="am-detail-img-wrap" v-if="detailItem.tarkImgSrc"><image :src="detailItem.tarkImgSrc" mode="widthFix" /></view>
							<view class="am-detail-img-wrap" v-if="detailItem.skImgSrc"><image :src="detailItem.skImgSrc" mode="widthFix" /></view>
							<view class="am-detail-img-wrap" v-if="detailItem.imgSrc"><image :src="detailItem.imgSrc" mode="widthFix" /></view>
						</view>
						<view class="am-detail-right">
							<view class="am-detail-client">
								<view class="am-detail-client-row">
									<text class="am-detail-client-name">{{ detailItem.clientName }}</text>
									<text class="am-card-gender" :class="detailItem.gender === '男' || detailItem.gender === '1' ? 'male' : 'female'">{{ detailItem.gender === '男' || detailItem.gender === '1' ? '♂' : '♀' }}</text>
									<text class="am-card-age">{{ detailItem.age }}岁</text>
									<text class="am-check-type" :class="detailItem.checkTypeClass">{{ detailItem.checkTypeName }}</text>
								</view>
								<view class="am-detail-client-meta">
									<view class="am-detail-client-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg><text>{{ detailItem.createTime }}</text></view>
									<view class="am-detail-client-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><circle cx="6" cy="15" r="4"></circle><circle cx="18" cy="15" r="4"></circle><path d="M14 15a2 2 0 0 0-4 0"></path><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"></path><path d="M21.5 13 19 7c-.7-1.3-1.4-2-3-2"></path></svg><text>{{ detailItem.mirrorFrame || '--' }}</text></view>
									<view class="am-detail-client-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg><text>{{ detailItem.unitName || '--' }}</text></view>
								</view>
							</view>
							<!-- 瞳距参数 -->
							<view class="am-detail-section">
								<text class="am-detail-section-title">{{ $t('measure.pdParams') || '瞳距参数' }}</text>
								<view class="am-param-grid">
									<view class="am-param-cell"><text class="am-param-label">近瞳距</text><text class="am-param-value">{{ detailItem.cnSpace || detailItem.cn_space || '-' }}<text class="am-param-unit">mm</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">远瞳距</text><text class="am-param-value">{{ detailItem.fnSpace || detailItem.fn_space || '-' }}<text class="am-param-unit">mm</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">R瞳距</text><text class="am-param-value">{{ detailItem.fnRspace || '-' }}<text class="am-param-unit">mm</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">L瞳距</text><text class="am-param-value">{{ detailItem.fnLspace || '-' }}<text class="am-param-unit">mm</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">R瞳高</text><text class="am-param-value">{{ detailItem.rhSpace || '-' }}<text class="am-param-unit">mm</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">L瞳高</text><text class="am-param-value">{{ detailItem.lhSpace || '-' }}<text class="am-param-unit">mm</text></text></view>
								</view>
							</view>
							<!-- 配镜参数 -->
							<view class="am-detail-section">
								<text class="am-detail-section-title">{{ $t('measure.fittingParams') || '配镜参数' }}</text>
								<view class="am-param-grid">
									<view class="am-param-cell"><text class="am-param-label">镜眼距(VD)</text><text class="am-param-value">{{ detailItem.vd || '-' }}<text class="am-param-unit">mm</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">前倾角(PA)</text><text class="am-param-value">{{ detailItem.pa || '-' }}<text class="am-param-unit">°</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">面弯</text><text class="am-param-value">{{ detailItem.wrap || '-' }}<text class="am-param-unit">°</text></text></view>
									<view class="am-param-cell"><text class="am-param-label">镜框宽(FW)</text><text class="am-param-value">{{ detailItem.fw || detailItem.frameWide || '-' }}<text class="am-param-unit">mm</text></text></view>
								</view>
							</view>
							<!-- 其他参数 -->
							<view class="am-detail-section" v-if="detailItem.readingDis || detailItem.frameType">
								<text class="am-detail-section-title">{{ $t('measure.otherParams') || '其他参数' }}</text>
								<view class="am-param-grid">
									<view class="am-param-cell" v-if="detailItem.readingDis"><text class="am-param-label">阅读距离</text><text class="am-param-value">{{ detailItem.readingDis }}<text class="am-param-unit">cm</text></text></view>
									<view class="am-param-cell" v-if="detailItem.frameType"><text class="am-param-label">镜框类型</text><text class="am-param-value">{{ detailItem.frameType == 1 ? '全框' : detailItem.frameType == 2 ? '半框' : detailItem.frameType == 3 ? '无框' : detailItem.frameType }}</text></view>
									<view class="am-param-cell" v-if="detailItem.frameHighAll"><text class="am-param-label">镜框高度</text><text class="am-param-value">{{ detailItem.frameHighAll }}<text class="am-param-unit">mm</text></text></view>
									<view class="am-param-cell" v-if="detailItem.frameNose"><text class="am-param-label">鼻梁宽</text><text class="am-param-value">{{ detailItem.frameNose }}<text class="am-param-unit">mm</text></text></view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="am-detail-footer">
					<view class="am-btn am-btn-success" @click="selectMeasure(detailItem)">{{ $t('measure.select') }}</view>
					<view class="am-btn am-btn-primary" @click="editMeasure(detailItem)">{{ $t('measure.edit') }}</view>
					<view class="am-btn" @click="changeDetailClient(detailItem)">{{ $t('measure.changeClient') || '换客户' }}</view>
					<view class="am-btn" @click="shareMeasure(detailItem)">{{ $t('measure.share') }}</view>
					<view class="am-btn" @click="printMeasure(detailItem)">{{ $t('measure.print') }}</view>
					<view class="am-btn am-btn-danger" @click="deleteMeasure(detailItem)">{{ $t('measure.delete') }}</view>
				</view>
			</view>
		</view>


		<!-- ========== 客户搜索弹窗 ========== -->
		<view class="modal-overlay" v-if="clientModalShow" @click="clientModalShow = false">
			<view class="aam-modal client-search-modal" @click.stop="">
				<view class="aam-header">
					<text class="aam-title">{{ $t('measure.searchClient') }}</text>
					<text class="aam-close" @click="clientModalShow = false">×</text>
				</view>
				<view class="CSU_upCon">
					<view class="CSU_searchRow">
						<view class="CSU_searchInputWrap">
							<input class="CSU_searchInput" type="text" v-model="clientSearchKeyword"
								:placeholder="$t('measure.searchClientPlaceholder')"
								@confirm="searchClient" />
						</view>
						<view class="am-btn am-btn-primary" @click="searchClient">{{ $t('measure.search') }}</view>
						<view class="am-btn am-btn-success" @click="openEmpCode">{{ $t('measure.staffCode') }}</view>
						<view class="am-btn am-btn-success" @click="openAddClient">{{ $t('measure.addClient') }}</view>
					</view>
				</view>
				<scroll-view scroll-y class="aam-body clientSearchCon">
					<view v-if="clientSearchLoading" class="am-loading-spinner"><view class="spinner"></view><text class="am-loading-text">{{ $t('measure.loading') }}</text></view>
					<view class="clientSearchUl">
						<view class="clientSearchLi" v-for="(item, idx) in clientSearchList" :key="item.id || idx"
							@click="pickClient(item)">
							<view class="CSU_avatar">
								<image v-if="item.imgurl && item.imgurl !== 'null'" :src="item.imgurl" class="CSU_avatar_img" mode="aspectFill" />
								<text v-else class="CSU_avatar_name">{{ (item.name || '').charAt(0) || '?' }}</text>
								<view class="gender_icon" :class="(item.gender || '男') === '男' ? 'gender_male' : 'gender_female'">
									<text>{{ (item.gender || '男') === '男' ? '♂' : '♀' }}</text>
								</view>
							</view>
							<view class="CSU_info">
								<view class="CSU_info_row1">
									<text class="customer_name">{{ item.name }}</text>
									<text v-if="item.birthday" class="customer_age">{{ item.birthday }}</text>
									<text v-if="item.level" class="customer_level level_vip">♛ {{ item.level }}</text>
								
									<text class="customer_editBtn" @click.stop="viewClientDetail(item)">{{ $t('measure.viewDetail') }}</text>
								</view>
								<view class="CSU_info_row2">
									<text v-if="item.tel" class="info_item">{{ maskPhone(item.tel) }}</text>
									<text v-if="item.medicalNo" class="info_item">{{ $t('measure.medicalNo') }}：{{ item.medicalNo }}</text>
								</view>
							</view>
						</view>
					</view>
					<view v-if="!clientSearchLoading && clientSearchList.length === 0" class="am-empty">
						<text class="am-empty-text">{{ $t('measure.noClient') }}</text>
					</view>
				</scroll-view>
			</view>
		</view>


		<!-- ========== 新增客户弹窗 ========== -->
		<view class="modal-overlay" v-if="addClientShow" @click="addClientShow = false">
			<view class="aam-modal add-client-modal" @click.stop="">
				<view class="aam-header">
					<text class="aam-title">{{ $t('measure.addClient') }}</text>
					<text class="aam-close" @click="addClientShow = false">×</text>
				</view>
				<scroll-view scroll-y class="aam-body add-client-body">
					<view class="CAC_row">
						<view class="CAC_item">
							<text class="CAC_tip"><text class="mustCss">*</text>{{ $t('measure.clientName') }}:</text>
							<input class="CAC_input" type="text" v-model="newClient.clientName" :placeholder="$t('measure.pleaseInput')" />
						</view>
						<view class="CAC_item">
							<text class="CAC_tip"><text class="mustCss">*</text>{{ $t('measure.gender') }}:</text>
							<view class="CAC_genderRow">
								<text class="CAC_genderBtn" :class="{ active: newClient.gender === '男', 'CAC_genderBtn-male': true }" @click="newClient.gender = '男'"><text class="gender-icon-male">♂</text> {{ $t('measure.male') }}</text>
								<text class="CAC_genderBtn" :class="{ active: newClient.gender === '女', 'CAC_genderBtn-female': true }" @click="newClient.gender = '女'"><text class="gender-icon-female">♀</text> {{ $t('measure.female') }}</text>
							</view>
						</view>
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.birthday') }}:</text>
							<view class="CAC_input" @click="datePickerShow = true">
								<text :class="{ 'has-value': newClient.birthDay }">{{ newClient.birthDay || $t('measure.pleaseSelect') }}</text>
							</view>
						</view>
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.phone') }}:</text>
							<input class="CAC_input" type="number" v-model="newClient.mobile" :placeholder="$t('measure.pleaseInput')" />
						</view>
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.email') }}:</text>
							<input class="CAC_input" type="text" v-model="newClient.email" :placeholder="$t('measure.pleaseInput')" />
						</view>
					</view>
					<view class="CAC_divider"></view>
					<view class="CAC_row">
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.idCard') }}:</text>
							<input class="CAC_input" type="text" v-model="newClient.idCard" :placeholder="$t('measure.pleaseInput')" />
						</view>
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.landline') }}:</text>
							<input class="CAC_input" type="number" v-model="newClient.telephone" :placeholder="$t('measure.pleaseInput')" />
						</view>
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.occupation') }}:</text>
							<input class="CAC_input" type="text" v-model="newClient.vocation" :placeholder="$t('measure.pleaseInput')" />
						</view>
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.school') }}:</text>
							<input class="CAC_input" type="text" v-model="newClient.schoolId" :placeholder="$t('measure.pleaseInput')" />
						</view>
						<view class="CAC_item">
							<text class="CAC_tip">{{ $t('measure.address') }}:</text>
							<input class="CAC_input" type="text" v-model="newClient.address" :placeholder="$t('measure.pleaseInput')" />
						</view>
						<view class="CAC_item CAC_item_full">
							<text class="CAC_tip">{{ $t('measure.remark') }}:</text>
							<textarea class="CAC_textarea" v-model="newClient.comment" :placeholder="$t('measure.pleaseInput')"></textarea>
						</view>
					</view>
				</scroll-view>
				<view class="aam-footer add-client-footer">
					<view class="am-btn" @click="addClientShow = false">{{ $t('measure.cancel') }}</view>
					<view class="am-btn am-btn-primary" @click="saveNewClient">{{ $t('measure.save') }}</view>
				</view>
			</view>
		</view>


		<!-- ========== 门店选择弹窗 ========== -->
		<view class="modal-overlay" v-if="storePickerShow" @click="storePickerShow = false">
			<view class="modal sp-modal" @click.stop="">
				<view class="modal-close" @click="storePickerShow = false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></view>
				<view class="sp-header">
					<view class="sp-header-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"></path><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"></path><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"></path></svg></view>
					<view>
						<text class="sp-title">{{ $t('measure.selectStore') }}</text>
						<text class="sp-subtitle">{{ $t('measure.selectStoreSubtitle') }}</text>
					</view>
				</view>
				<view class="sp-current-tip" v-if="loginInfo.unit">
					<text class="sp-current-dot">●</text>
					<text> 当前：</text><text style="font-weight:bold">{{ loginInfo.unit.name }}</text>
				</view>
				<scroll-view scroll-y class="sp-list">
					<view class="sp-card" v-for="(item, idx) in ($store.state.units || [])" :key="item[0] || idx"
						:class="{ active: loginInfo.unit && loginInfo.unit && loginInfo.unit.id == item[0] }"
						@click="selectStore({id: item[0], name: item[1]})">
						<view class="sp-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"></path><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"></path><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"></path></svg></view>
						<view class="sp-card-info">
							<text class="sp-card-name">{{ item[1] }}</text>
							<view class="sp-card-meta">
								<text class="sp-badge franchise">{{ '其他' }}</text>
							</view>
						</view>
						<view class="sp-card-check" v-if="loginInfo.unit && loginInfo.unit && loginInfo.unit.id == item[0]">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;color:#6366f1"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
						</view>
					</view>
					<view v-if="!$store.state.units || $store.state.units.length === 0" class="sp-empty">
						<text>{{ $t('measure.noStore') }}</text>
					</view>
				</scroll-view>
			</view>
		</view>


		<!-- ========== 设备选择弹窗 ========== -->
		<view class="modal-overlay" v-if="deviceModalShow" @click="deviceModalShow = false">
			<view class="modal device-modal" @click.stop="">
				<view class="modal-close" @click="deviceModalShow = false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></view>
				<text class="modal-title">{{ $t('measure.selectDevice') }}</text>
				<!-- 品牌 tabs -->
				<view class="device-brand-tabs">
					<text class="device-brand-tab" :class="{ active: selectedBrandId === '' }" @click="selectedBrandId = ''">{{ $t('measure.all') }}</text>
					<text class="device-brand-tab" v-for="item in deviceBrandList" :key="item.id"
						v-if="item.id"
						:class="{ active: selectedBrandId === item.id }"
						@click="selectedBrandId = item.id">{{ item.name }}</text>
				</view>
				<!-- 设备列表 -->
				<scroll-view scroll-y class="device-list">
					<view class="device-card" v-for="(item, idx) in filteredDeviceList" :key="item.id || idx"
						:class="{ active: deviceInfo.id === item.id }"
						@click="selectDevice(item)">
						<view class="device-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#6366f1"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg></view>
						<view class="device-card-info">
							<text class="device-card-name">{{ item.name }}</text>
							<text class="device-card-sub">{{ item.brandName || '' }} · {{ $t('measure.angle') }} {{ item.angle || '-' }}°</text>
						</view>
						<text v-if="deviceInfo.id === item.id" class="device-card-check">✓</text>
					</view>
					<view v-if="filteredDeviceList.length === 0" style="padding:30px;text-align:center;color:#94a3b8;font-size:13px">
						<text>{{ $t('measure.noDevice') }}</text>
					</view>
				</scroll-view>
				<view class="modal-footer">
					<view class="am-btn" @click="deviceModalShow = false">{{ $t('measure.close') }}</view>
				</view>
			</view>
		</view>


		<!-- ========== 新增测量弹窗 ========== -->
		<view class="aam-overlay" v-if="addMeasureShow" @click="addMeasure_close">
			<view class="aam-modal aam-modal-md" @click.stop="">
				<view class="MV_header">
					<text class="MV_title">{{ $t('measure.addMeasure') }}</text>
					<view class="MV_close" @click="addMeasure_close">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#fff"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
					</view>
				</view>
				<scroll-view scroll-y class="aam-body">
					<view class="addAiMeasureCon">
						<!-- 客户 -->
						<view class="AAM_row">
							<text class="AAM_tip">{{ $t('measure.client') }}:</text>
							<view class="AAM_info">
								<view class="AN_wrap" @click="openClientForMeasure">
									<image class="AN_avatar" :src="addMeasure.client.img || '/static/personimg.jpg'" mode="aspectFill" />
									<text class="AN_name">{{ addMeasure.client.name || $t('measure.selectClient') }}</text>
								</view>
								<text class="AAM_link" @click="openAddClientForMeasure">{{ $t('measure.newClient') }}</text>
								<view class="composeBoxCss" style="margin-left:20px">
									<text :class="{'active': addMeasure.support == '1'}" @click="supportChange('1')">{{ $t('measure.withFrame') }}</text>
									<text :class="{'active': addMeasure.support == '0'}" @click="supportChange('0')">{{ $t('measure.noFrame') }}</text>
								</view>
							</view>
						</view>
						<!-- 无支架参数 -->
						<view class="AAM_row" v-if="addMeasure.support == '0'">
							<text class="AAM_tip"><text class="mustCss">*</text>{{ $t('measure.frameWidth') }}:</text>
							<view class="AAM_info">
								<input class="aam-input-sm" type="digit" v-model="addMeasure.jkW" />
								<text class="AAM_tip" style="margin-left:20px"><text class="mustCss">*</text>{{ $t('measure.bridge') }}:</text>
								<input class="aam-input-sm" type="digit" v-model="addMeasure.bl" />
								<text class="AAM_tip" style="margin-left:20px">{{ $t('measure.frameHeight') }}:</text>
								<input class="aam-input-sm" type="digit" v-model="addMeasure.jkOutH" />
							</view>
						</view>
						<!-- 镜架搜索 -->
						<view class="AAM_row">
							<text class="AAM_tip">{{ $t('measure.frame') }}:</text>
							<view class="AAM_info">
								<view class="cartCmdName_con">
									<input class="aam-input-lg" type="text" v-model="addMeasure.intDom"
										:placeholder="$t('measure.framePlaceholder')"
										@input="intDomSearch" @focus="intDomSearch" @blur="intDomBlur" />
									<view class="cartCmdName_ul" v-if="addMeasure.intDomList.length > 0">
										<view class="cartCmdName_li" v-for="(item, idx) in addMeasure.intDomList" :key="idx"
											@click="intDomLiFun(item)">
											<text>{{ item[1] }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 验光 -->
						<view class="AAM_row">
							<text class="AAM_tip">{{ $t('measure.optometry') }}:</text>
							<view class="AAM_info">
								<view v-if="addMeasure.ygObj.id" class="AAM_ygRow">
									<view class="AAM_ygRow_item"><text>ID：{{ addMeasure.ygObj.id }}</text></view>
									<view class="AAM_ygRow_item"><text>类型：{{ addMeasure.ygObj.obj.checkText == '标准' ? '远用' : addMeasure.ygObj.obj.checkText }}</text></view>
									<view class="AAM_ygRow_item"><text>远瞳距R/L：{{ (addMeasure.ygObj.obj.rspace||'') + '/' + (addMeasure.ygObj.obj.lspace||'') }}</text></view>
									<view class="AAM_ygRow_item"><text>规格R/L：{{ (addMeasure.ygObj.obj.rSpecs||'') + '/' + (addMeasure.ygObj.obj.lSpecs||'') }}</text></view>
									<view class="AAM_ygRow_item"><text>瞳高：{{ rlHspaceFun(addMeasure.ygObj.obj.rhspace, addMeasure.ygObj.obj.lhspace) }}</text></view>
									<view class="AAM_ygRow_item"><text :class="addMeasure.ygObj.obj.aiImage == null ? 'ai-tag-unbound' : 'ai-tag-bound'">{{ addMeasure.ygObj.obj.aiImage == null ? '未绑定Ai' : '已绑定Ai' }}</text></view>
								</view>
								<view>
									<text class="AAM_link" @click="addMeasure_selectYg">{{ $t('measure.select') }}</text>
									<text class="AAM_link" @click="addMeasure_newOpt">{{ $t('measure.newClient') || '新建' }}</text>
									<text class="AAM_link" v-if="addMeasure.ygObj.id" @click="ygObjClearFun">{{ $t('measure.clear') }}</text>
								</view>
							</view>
						</view>
						<!-- 验光类型 + 场景（同一行） -->
						<view class="AAM_row">
							<text class="AAM_tip">{{ $t('measure.optType') }}:</text>
							<view class="AAM_info">
								<view class="composeBoxCss">
									<text :class="{'active': addMeasure.optTyle == 'yy'}" @click="optTyleChange('yy')">{{ $t('measure.distance') }}</text>
									<text :class="{'active': addMeasure.optTyle == 'djd'}" @click="optTyleChange('djd')">{{ $t('measure.typeProgressive') }}</text>
									<text :class="{'active': addMeasure.optTyle == 'jy'}" @click="optTyleChange('jy')">{{ $t('measure.near') }}</text>
								</view>
								<text class="AAM_tip" style="min-width:auto;margin-left:20px">{{ $t('measure.distanceScene') }}</text>
								<view class="composeBoxCss">
									<text :class="{'active': addMeasure.scene == '1'}" @click="sceneChange('1')">{{ $t('measure.sceneNear') }}</text>
									<text :class="{'active': addMeasure.scene == '2'}" @click="sceneChange('2')">{{ $t('measure.sceneMid') }}</text>
									<text :class="{'active': addMeasure.scene == '3'}" @click="sceneChange('3')">{{ $t('measure.sceneFar') }}</text>
								</view>
								<text class="AAM_sceneTip" v-show="addMeasure.scene == '1'">{{ $t('measure.sceneTip1') }}</text>
								<text class="AAM_sceneTip" v-show="addMeasure.scene == '2'">{{ $t('measure.sceneTip2') }}</text>
								<text class="AAM_sceneTip" v-show="addMeasure.scene == '3'">{{ $t('measure.sceneTip3') }}</text>
							</view>
						</view>
						<!-- 阅读距离 -->
						<view class="AAM_row" v-if="['djd','jy'].includes(addMeasure.optTyle)">
							<text class="AAM_tip">{{ $t('measure.readingDistance') }}:</text>
							<view class="AAM_info">
								<view class="composeBoxCss">
									<text :class="{'active': addMeasure.readingDis == '30'}" @click="readingDisChange('30')">30cm</text>
									<text :class="{'active': addMeasure.readingDis == '35'}" @click="readingDisChange('35')">35cm</text>
									<text :class="{'active': addMeasure.readingDis == '40'}" @click="readingDisChange('40')">40cm</text>
									<text :class="{'active': addMeasure.readingDis == '45'}" @click="readingDisChange('45')">45cm</text>
									<text :class="{'active': addMeasure.readingDis == '50'}" @click="readingDisChange('50')">50cm</text>
								</view>
							</view>
						</view>
						<!-- 方式 + 摄像头高度 -->
						<view class="AAM_row">
							<text class="AAM_tip">{{ $t('measure.method') }}</text>
							<view class="AAM_info">
								<view class="composeBoxCss">
									<text v-if="addMeasure.support == '1'" :class="{'active': addMeasure.type == '0'}" @click="typeChange('0')">{{ $t('measure.typePhoto') }}</text>
									<text :class="{'active': addMeasure.type == '1'}" @click="typeChange('1')">{{ $t('measure.typeUpload') }}</text>
								</view>
								<text class="AAM_tip" style="min-width:auto;margin-left:20px">{{ $t('measure.cameraHeight') }}</text>
								<input class="aam-input-sm" type="digit" v-model="addMeasure.intAngle" placeholder="" />
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="aam-footer">
					<view class="am-btn" @click="addMeasure_close">{{ $t('measure.cancel') }}</view>
					<view class="am-btn am-btn-primary" @click="addMeasure_yes">{{ $t('measure.confirm') }}</view>
				</view>
			</view>
		</view>


		<!-- ========== 选择验光弹窗 ========== -->
		<view class="aam-overlay" v-if="selectYgShow" @click="selectYgShow = false">
			<view class="aam-modal selectYg-modal" @click.stop="">
				<view class="MV_header">
					<text class="MV_title">{{ $t('measure.selectOptometry') }}</text>
					<view class="MV_close" @click="selectYgShow = false">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#fff"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
					</view>
				</view>
				<view class="selectYg-body">
					<view style="margin-bottom:10px">
						<view class="composeBoxCss">
							<text :class="{'active': selectYgType == '0'}" @click="selectYgTypeChange('0')">{{ $t('measure.all') }}</text>
							<text :class="{'active': selectYgType == '1'}" @click="selectYgTypeChange('1')">{{ $t('measure.unbound') }}</text>
							<text :class="{'active': selectYgType == '2'}" @click="selectYgTypeChange('2')">{{ $t('measure.bound') }}</text>
						</view>
					</view>
					<scroll-view scroll-y class="selectYg-scroll">
						<view v-if="selectYgLoading" class="am-loading-spinner"><view class="spinner"></view><text class="am-loading-text">{{ $t('measure.loading') }}</text></view>
						<view class="AAM_ul">
							<view class="AAM_ul_li" v-for="(item, idx) in filteredYgList" :key="item.optId || idx"
								@click="selectYgItem(item)">
								<view class="AAM_ul_row1">
									<view class="AAM_ul_item" style="width:130px"><text>ID：{{ item.id }}</text></view>
									<view class="AAM_ul_item" style="width:100px"><text>类型：{{ item.checkText == '标准' ? '远用' : item.checkText }}</text></view>
									<view class="AAM_ul_item" style="width:160px"><text>远瞳距R/L：{{ (item.rspace||'') + '/' + (item.lspace||'') }}</text></view>
									<view class="AAM_ul_item" style="width:85px"><text>瞳高：{{ rlHspaceFun(item.rhspace, item.lhspace) }}</text></view>
									<view class="AAM_ul_item" style="width:80px"><text :class="item.aiImage == null ? 'ai-tag-unbound' : 'ai-tag-bound'">{{ item.aiImage == null ? '未绑定Ai' : '已绑定Ai' }}</text></view>
								</view>
								<view class="AAM_ul_row2">
									<view class="AAM_ul_item" style="width:100%"><text>规格R/L：{{ (item.rSpecs||'') + '/' + (item.lSpecs||'') }}</text></view>
								</view>
							</view>
						</view>
						<view v-if="!selectYgLoading && filteredYgList.length === 0" class="am-empty">
							<text class="am-empty-text">{{ $t('measure.empty') }}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>


		<!-- ========== Add Optometry modal START ========== -->
		<view class="addOpt-overlay" v-if="addOptShow" @click="addOptClose">
			<view class="addOpt-modal" @click.stop="">
				<view class="MV_header">
					<text class="MV_title">{{ addOptView.type == 'add' ? $t('measure.addOptometry') : ($t('measure.editOptometry') || '编辑验光') }}</text>
					<view class="MV_close" @click="addOptClose">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#fff"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
					</view>
				</view>
				<!-- 固定顶栏：验光人员 + 时间 + 客户 -->
				<view class="addOpt-topbar">
					<view class="addOpt-topbar-left">
						<text class="addOpt-label">{{ $t('measure.optometrist') }}：</text>
						<image class="addOpt-avatar" :src="addOptView.emp.img || (loginInfo.staff && loginInfo.staff.img) || ($store.state.login && $store.state.login.staff && $store.state.login.staff.img) || '/static/personimg.jpg'" mode="aspectFill" />
						<text class="addOpt-emp-name">{{ addOptView.emp.name || (loginInfo.staff && loginInfo.staff.name) || ($store.state.login && $store.state.login.staff && $store.state.login.staff.name) || '' }}</text>
						<text class="addOpt-label" style="margin-left:30px">{{ $t('measure.optDate') }}：</text>
						<view class="addOpt-date-chip" @click="addOptDatePickerShow = true">
							<text>{{ addOptView.ygTime || $t('measure.today') }}</text>
						</view>
					</view>
					<view class="addOpt-topbar-right">
						<view class="addOpt-client-box">
							<text v-if="!addOptView.client.id">{{ $t('measure.guest') || '游客' }}</text>
							<view v-else style="display:flex;align-items:center;gap:4px">
								<text>{{ $t('measure.client') }}：</text>
								<image class="addOpt-avatar" :src="addOptView.client.img || '/static/personimg.jpg'" mode="aspectFill" />
								<text>{{ addOptView.client.name }}</text>
							</view>
						</view>
					</view>
				</view>
				<scroll-view scroll-y class="addOpt-body">
					<view class="addOptCon">
						<!-- 验光类型 -->
						<view class="addOpt-type-row">
							<view class="composeBoxCss">
								<text :class="{'active': addOptView.ygType == 'default'}" @click="opt_typeChange('default')">远用</text>
								<text :class="{'active': addOptView.ygType == 'djd'}" @click="opt_typeChange('djd')">多焦点</text>
								<text :class="{'active': addOptView.ygType == 'jycf'}" @click="opt_typeChange('jycf')">近用</text>
							</view>
						</view>


						<!-- 主验光数据表 -->
						<view class="optRecordBar">
							<view class="optRecordBar-li optRecordBar-li-label">
								<view class="optRecordBar-cell optRecordBar-header"><text></text></view>
								<view class="optRecordBar-cell optRecordBar-sub"></view>
								<view class="optRecordBar-cell optRecordBar-val"><text>R</text></view>
								<view class="optRecordBar-cell optRecordBar-val"><text>L</text></view>
							</view>
							<view class="optRecordBar-li" v-for="(col, colIdx) in addOptView.mainTab" :key="'main_'+colIdx">
								<view class="optRecordBar-cell optRecordBar-header"><text>{{ col.tip }}</text></view>
								<view class="optRecordBar-cell optRecordBar-sub" :class="{ red: col.red }"><text>{{ col.ms }}</text></view>
								<view class="optRecordBar-cell optRecordBar-val" @click="opt_showPopup($event, 'main', colIdx, col.itemType, col.r, 'R')">
									<input type="text" class="optRecordBar-input" :value="col.r || ''" disabled  />
								</view>
								<view class="optRecordBar-cell optRecordBar-val" @click="opt_showPopup($event, 'main', colIdx, col.itemType, col.l, 'L')">
									<input type="text" class="optRecordBar-input" :value="col.l || ''" disabled  />
								</view>
							</view>
						</view>

						
<!-- 备注 -->
						<view class="addOpt-remark">
							<text class="addOpt-label">{{ $t('measure.remark') }}：</text>
							<input class="addOpt-remark-input" type="text" v-model="addOptView.mainKcomment" :placeholder="$t('measure.pleaseInput')" />
						</view>
					</view>

						<!-- 原镜 + 电脑验光 并排 -->
						<view class="addOpt-bottom-tables">
							<!-- 原镜 -->
							<view class="addOpt-bottom-left">
								<view class="AOUO_box">
									<view class="optRecordBar">
										<view class="optRecordBar-li optRecordBar-li-label">
											<view class="optRecordBar-cell optRecordBar-header"><text style="color:#2196f3">原镜</text></view>
											<view class="optRecordBar-cell optRecordBar-sub"></view>
											<view class="optRecordBar-cell optRecordBar-val"><text>R</text></view>
											<view class="optRecordBar-cell optRecordBar-val"><text>L</text></view>
										</view>
										<view class="optRecordBar-li" v-for="(col, colIdx) in addOptView.originalTab" :key="'orig_'+colIdx">
											<view class="optRecordBar-cell optRecordBar-header"><text>{{ col.tip }}</text></view>
											<view class="optRecordBar-cell optRecordBar-sub" :class="{ red: col.red }"><text>{{ col.ms }}</text></view>
											<view class="optRecordBar-cell optRecordBar-val" @click="opt_showPopup($event, 'original', colIdx, col.itemType, col.r, 'R')">
												<input type="text" class="optRecordBar-input" :value="col.r || ''" disabled  />
											</view>
											<view class="optRecordBar-cell optRecordBar-val" @click="opt_showPopup($event, 'original', colIdx, col.itemType, col.l, 'L')">
												<input type="text" class="optRecordBar-input" :value="col.l || ''" disabled  />
											</view>
										</view>
									</view>
								</view>
							</view>
							<!-- 电脑验光 -->
							<view class="addOpt-bottom-right">
								<view class="AOUO_box">
									<view class="optRecordBar">
										<view class="optRecordBar-li optRecordBar-li-label">
											<view class="optRecordBar-cell optRecordBar-header"><text style="color:#2196f3">电脑验光</text></view>
											<view class="optRecordBar-cell optRecordBar-sub"></view>
											<view class="optRecordBar-cell optRecordBar-val"><text>R</text></view>
											<view class="optRecordBar-cell optRecordBar-val"><text>L</text></view>
										</view>
										<view class="optRecordBar-li" v-for="(col, colIdx) in addOptView.autoTab" :key="'auto_'+colIdx">
											<view class="optRecordBar-cell optRecordBar-header"><text>{{ col.tip }}</text></view>
											<view class="optRecordBar-cell optRecordBar-sub" :class="{ red: col.red }"><text>{{ col.ms }}</text></view>
											<view class="optRecordBar-cell optRecordBar-val" @click="opt_showPopup($event, 'auto', colIdx, col.itemType, col.r, 'R')">
												<input type="text" class="optRecordBar-input" :value="col.r || ''" disabled  />
											</view>
											<view class="optRecordBar-cell optRecordBar-val" @click="opt_showPopup($event, 'auto', colIdx, col.itemType, col.l, 'L')">
												<input type="text" class="optRecordBar-input" :value="col.l || ''" disabled  />
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>

										</scroll-view>
				<view class="addOpt-footer">
					<view class="am-btn" @click="addOptClose">{{ $t('measure.cancel') }}</view>
					<view class="am-btn am-btn-primary" @click="opt_saveFun">{{ addOptView.type == 'add' ? $t('measure.save') : ($t('measure.confirmEdit') || '确认修改') }}</view>
				</view>
			</view>
		</view>
		<!-- ========== Add Optometry modal END ========== -->


		<!-- OptInput 预选值弹窗 -->
		<view class="ygSetBox" v-if="optPopup.show" @click="opt_closePopup">
			<view class="ygSetInfo" :style="{ top: optPopup.y + 'px', left: optPopup.x + 'px' }" @click.stop="">
				<view class="ygSetTj">
					<text class="ygSetTj-span" @click="opt_manualInput">手动输入</text>
					<text class="ygSetTj-span" @click="opt_manualInput">虚拟键盘</text>
					<text v-if="optPopup.itemType == 'sign' || optPopup.itemType == 'check'" class="ygSetTj-font" :class="{ active: optPopup.lastStr === '+' }" @click="opt_toggleSign('+')">+</text>
					<text v-if="optPopup.itemType == 'sign' || optPopup.itemType == 'check'" class="ygSetTj-font" :class="{ active: optPopup.lastStr === '-' }" @click="opt_toggleSign('-')">-</text>
				</view>
				<view :class="optPopup.list.length === 2 ? 'ygSetUl twoRow' : 'ygSetUl'" v-if="optPopup.mode !== 'manual'">
					<view class="ygSetUl-li" v-for="(ygli, liIdx) in optPopup.list" :key="'pl'+liIdx">
						<text class="ygSetUl-td" :class="{ 'oldValue': !!ygli.gray }"
							v-for="(ygtd, tdIdx) in ygli.td" :key="'pt'+tdIdx"
							@click="opt_selectPreset(ygtd)">{{ ygtd }}</text>
					</view>
				</view>
			</view>
		</view>


		<!-- ========== 员工码弹窗 ========== -->
		<view class="modal-overlay" v-if="empCodeShow" @click="closeEmpCode">
			<view class="modal empCode-modal" @click.stop="">
				<view class="empCode-header">
					<text class="empCode-title">{{ $t('measure.staffCode') }}</text>
					<view class="modal-close" @click="closeEmpCode">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
					</view>
				</view>
				<view class="empCode-body">
					<view class="empCode-img">
						<image v-if="empCodeQrcode" :src="empCodeQrcode" mode="aspectFit" style="width:100%;height:100%" />
						<text v-else style="color:#999;font-size:14px">暂无二维码</text>
					</view>
					<text class="empCode-name">{{ empCodeEmpName || '-' }}</text>
					<view class="empCode-tabs">
						<view class="composeBoxCss">
							<text :class="{'active': empCodeType === 'gzh'}" @click="empCodeTypeChange('gzh')">公众号</text>
							<text :class="{'active': empCodeType === 'wxy'}" @click="empCodeTypeChange('wxy')">微小易</text>
							<text :class="{'active': empCodeType === 'qyh'}" @click="empCodeTypeChange('qyh')">企业号</text>
						</view>
					</view>
				</view>
			</view>
		</view>


		


		<!-- Date Pickers -->
		<DatePicker :visible="filterDateShow" :date="filterDateType === 'start' ? tj.startDate : tj.endDate"
			@confirm="onFilterDateConfirm" @close="filterDateShow = false" />

		<DatePicker :visible="datePickerShow" :date="newClient.birthDay"
			@confirm="onDateConfirm" @close="datePickerShow = false" />

		<!-- Optometry date picker -->
		<DatePicker :visible="addOptDatePickerShow" :date="addOptView.ygTime"
			@confirm="onOptDateConfirm" @close="addOptDatePickerShow = false" />


	</view>

</template>


<script>

import { postData, getData } from '@/api/request'

import DatePicker from '@/components/DatePicker.vue'

import { CHECK_TYPES, DEFAULT_IMG, parseListItem } from '@/utils/common'



export default {

	name: 'MeasureIndex',

	components: {

		DatePicker },

	data() {

		return {

			// 语言

			lang: 'zh',

			// 登录信息

			loginInfo: {

				staff: null,

				company: null,

				unit: null

			},

			// 客户信息

			clientInfo: {

				id: '', name: '', tel: '', gender: '1', age: ''

			},

			// 设备信息

			deviceInfo: {

				id: '', name: '', angle: '', addmm: '', cameraid: '', brandId: ''

			},

			// 列表数据

			list: [],

			rawList: [],

			loading: false,

			loadingMore: false,

			hasMore: false,

			pageNo: 1,

			pageSize: 20,

			// 统计

			stats: { total: 0, month: 0, today: 0 },

			// 筛选

			showFilter: false,

			allUnits: false,

			bindStatus: '',

			tj: {

				startDate: '',

				endDate: '',

				frameKeyword: '',

				checkType: ''

			},

			// 弹窗

			clientModalShow: false,

			deviceModalShow: false,

			clientSearchKeyword: '',

			clientSearchList: [],

			clientSearchLoading: false,

			addClientShow: false,

			datePickerShow: false,

			filterDateShow: false,

			dateRange: [],

			filterDateType: '',

			newClient: {

				clientName: '',

				gender: '',

				birthDay: '',

				mobile: '',

				email: '',

				idCard: '',

				telephone: '',

				vocation: '',

				schoolId: '',

				address: '',

				comment: ''

			},

			storePickerShow: false,

			// 新增测量弹窗

			addMeasureShow: false,

			addMeasure: {

				client: { id: '', name: '', img: '' },

				support: '1',

				jkW: '',

				bl: '',

				jkOutH: '',

				intDom: '',

				intDomList: [],

				intDomId: '',

				ygObj: { id: '', obj: {} },

				optTyle: 'yy',

				scene: '3',

				readingDis: '40',

				type: '0',

				intAngle: ''

			},

			// 添加验光弹窗

			addOptShow: false,

			addOptDatePickerShow: false,
			// 验光预选值弹窗
			optPopup: {
				show: false,
				mode: 'preset', // 'preset' or 'manual'
				itemType: '',
				sign: '',
				LR: '',
				tabName: '',
				index: -1,
				x: 0,
				y: 0,
				lastStr: '',
				list: [],
				manualInputSection: '',
				manualInputIndex: -1,
				manualInputLR: '',
				manualInputValue: '',
				manualInputActive: false
			},

			addOptView: {

				emp: { id: '', name: '', img: '' },

				client: { id: '', name: '', img: '' },

				type: 'add',

				optId: '',

				ygTime: '',

				ygType: 'default',

				optMainId: '',

				optOriginalId: '',

				optAutoId: '',

				main_recordList: [],

				main_recordList_active: '',

				original_recordList: [],

				original_recordList_active: '',

				auto_recordList: [],

				auto_recordList_active: '',

				mainTab: [],

				originalTab: [],

				autoTab: [],

				old_mainTab: [],

				old_originalTab: [],

				old_autoTab: [],

				mainKcomment: ''

			},

			// 详情弹窗

			detailShow: false,

			detailItem: {},

			detailLoading: false,

			// 选择验光弹窗

			selectYgShow: false,

			selectYgType: '0',

			selectYgList: [],

			selectYgLoading: false,

			// 设备

			deviceBrandList: [],

			deviceList: [],

			selectedBrandId: '',

			// 员工码弹窗

			empCodeShow: false,

			empCodeType: 'gzh',

			empCodeQrcode: '',

			empCodeWxQrcode: '',

			empCodeWxyQrcode: '',

			empCodeQyQrcode: '',

			empCodeEmpName: '',

			empCodeTimer: null,

			empCodeYMdHms: '',

			// 常量

			defaultImg: DEFAULT_IMG,

			checkTypes: CHECK_TYPES

		}

	},

	computed: {

		checkTypeNames() {

			var names = [this.$t('measure.all')]

			this.checkTypes.forEach(function(t) {

				names.push(t.name)

			})

			return names

		},

		currentCheckTypeName() {

			if (!this.tj.checkType) return this.$t('measure.all')

			var found = this.checkTypes.find(function(t) { return t.value === this.tj.checkType }.bind(this))

			return found ? found.name : this.$t('measure.all')

		},

		filteredYgList() {

			var list = this.selectYgList

			var type = this.selectYgType

			if (type === '1') {

				return list.filter(function(item) { return item.aiImage == null })

			} else if (type === '2') {

				return list.filter(function(item) { return item.aiImage != null })

			}

			return list

		},

		filteredDeviceList() {

			if (!this.selectedBrandId) return this.deviceList

			var brandId = this.selectedBrandId

			return this.deviceList.filter(function(d) { return d.brandId === brandId })

		}

	},

	onLoad() {

		this.initData()

	},

	methods: {

		openEmpCode() {

			this.empCodeShow = true

			this.empCodeType = 'gzh'

			var empId = (this.loginInfo.staff && this.loginInfo.staff.id) || (this.$store.state.login && this.$store.state.login.staff && this.$store.state.login.staff.id) || ''

			console.log('empCode empId:', empId, 'loginInfo:', JSON.stringify(this.loginInfo))

			if (empId) { this.getEmpQrCode(empId) } else { uni.showToast({ title: '未获取到员工ID', icon: 'none' }) }

		},

		getEmpQrCode(empId) {

			var that = this

			uni.showLoading({ title: ''})

			postData('/employee/getEmpQrCode.json', { empId: empId, needWxy: 1 }).then(function(res) {

				var data = res.data || res

				uni.hideLoading()

				if (data.pal) {

					that.empCodeEmpName = data.pal.empName || '-'

					that.empCodeWxQrcode = data.pal.longQrCode || ''

					that.empCodeQyQrcode = data.weQrCode || ''

					that.empCodeWxyQrcode = data.wxyQrCode || ''

				}

				if (that.empCodeWxQrcode) {

					that.empCodeType = 'gzh'

					that.empCodeQrcode = that.empCodeWxQrcode

				} else {

					that.empCodeType = 'wxy'

					that.empCodeQrcode = that.empCodeWxyQrcode

				}

				that.empCodeYMdHms = data.yMdHms || ''

				// 清旧定时器

				if (that.empCodeTimer) clearInterval(that.empCodeTimer)

				if (that.empCodeYMdHms) {

					that.empCodeTimer = setInterval(function() {

						that.scanEmpQrCode(empId, that.empCodeYMdHms)

					}, 3000)

				}

			}).catch(function() {

				uni.hideLoading()

				uni.showToast({ title: that.$t('measure.loadFailed') || '加载失败', icon: 'none' })

			})

		},

		empCodeTypeChange(type) {

			this.empCodeType = type

			if (type === 'gzh') this.empCodeQrcode = this.empCodeWxQrcode

			else if (type === 'wxy') this.empCodeQrcode = this.empCodeWxyQrcode

			else if (type === 'qyh') this.empCodeQrcode = this.empCodeQyQrcode

		},

		closeEmpCode() {

			this.empCodeShow = false

			if (this.empCodeTimer) {

				clearInterval(this.empCodeTimer)

				this.empCodeTimer = null

			}

		},

		scanEmpQrCode(empId, yMdHms) {

			var that = this

			postData('/employee/getScanSubClientInfos.json', {

				empId: empId,

				yMdHms: yMdHms,

				type: that.empCodeType

			}).then(function(res) {

				var data = res.data || res

				if (data.returnCode === 'SUCCESS') {

					if (that.empCodeTimer) clearInterval(that.empCodeTimer)

					that.empCodeTimer = null

					var clientId = data.clientId

					var client = data.client

					that.clientInfo.id = clientId

					that.clientInfo.name = client ? client.clientName : ''

					that.clientInfo.tel = client ? client.mobile : ''

					that.closeEmpCode()

				}

			})

		},

		openAddClient() {

			this.addClientShow = true

			this.newClient = { clientName: '', gender: '', birthDay: '', mobile: '', email: '', idCard: '', telephone: '', vocation: '', schoolId: '', address: '', comment: '' }

		},

		openClientSearch() {

			this.clientModalShow = true

			this.clientSearchKeyword = ''

			this.searchClient()

		},

		saveNewClient() {

			var that = this

			if (!this.newClient.clientName) {

				uni.showToast({ title: this.$t('measure.pleaseInputName'), icon: 'none' })

				return

			}

			if (!this.newClient.gender) {

				uni.showToast({ title: this.$t('measure.pleaseInputGender'), icon: 'none' })

				return

			}

			uni.showLoading({ title: '' })

			var params = {

				clientName: this.newClient.clientName,

				gender: this.newClient.gender,

				birthDay: this.newClient.birthDay,

				mobile: this.newClient.mobile,

				email: this.newClient.email,

				idCard: this.newClient.idCard,

				telephone: this.newClient.telephone,

				vocation: this.newClient.vocation || '保密',

				address: this.newClient.address,

				comment: this.newClient.comment,

				clientLvId: this.$store.state.login.company ? this.$store.state.login.company.id : ''

			}

			console.log('===== store.login =====', JSON.stringify(that.$store.state.login))

			console.log('===== clientLvId =====', params.clientLvId)

			postData('/frntend/createorder/saveClient.json', params).then(function(res) {

				uni.hideLoading()

				var data = res.data || res

				uni.showToast({ title: that.$t('measure.addClientSuccess'), icon: 'success' })

				that.addClientShow = false

				// 保留搜索弹窗，刷新列表

				

				// 如果新增测量弹窗打开，自动选中新客户

				if (that.addMeasureShow) {

					that.addMeasure.client.id = data.data || data

					that.addMeasure.client.name = that.newClient.clientName

					that.addMeasure.client.img = ''

					that.clientInfo.id = data.data || data

					that.clientInfo.name = that.newClient.clientName

					that.clientModalShow = false

				}

that.searchClient()

			}).catch(function(e) {

				uni.hideLoading()

				uni.showToast({ title: that.$t('measure.addClientFailed'), icon: 'none' })

			})

		},

		maskPhone(phone) {

			if (!phone || phone.length < 7) return phone

			return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4)

		},

		viewClientDetail(item) {

			uni.showToast({ title: 'TODO: Client Detail', icon: 'none' })

		},

		openFilterDate(type) {

			this.filterDateType = type

			this.filterDateShow = true

		},

		onFilterDateConfirm(date) {

			if (this.filterDateType === 'start') {

				this.tj.startDate = date

			} else {

				this.tj.endDate = date

			}

			this.filterDateShow = false

		},

		onDateConfirm(date) {

			this.newClient.birthDay = date

			this.datePickerShow = false

		},

		openDeviceModal() {

			this.deviceModalShow = true

			if (this.deviceList.length === 0) {

				this.loadDeviceList()

			}

		},

		onDateRangeChange(e) {

			if (e && e.length === 2) {

				this.tj.startDate = e[0]

				this.tj.endDate = e[1]

			} else {

				this.tj.startDate = ''

				this.tj.endDate = ''

			}

			this.doSearch()

		},

		openSelectYg() {

			this.selectYgShow = true

			this.selectYgType = '0'

			this.selectYgList = []

			this.loadOptList()

		},

		selectYgTypeChange(type) {

			this.selectYgType = type

		},

		selectYgItem(item) {

			this.addMeasure.ygObj.obj = item

			this.addMeasure.ygObj.id = item.id

			this.selectYgShow = false

		},

		loadOptList() {

			var that = this

			var clientId = this.addMeasure.client.id || this.clientInfo.id || ''

			if (!clientId) return

			that.selectYgLoading = true

			postData('/optometre/getOptInfos.json', {

				clientId: clientId,

				checkType: 'default,djd,jycf',

				pageNo: 0

			}).then(function(res) {

				var data = res.data || res

				if (data && data.list) {

					that.selectYgList = data.list

				} else {

					that.selectYgList = []

				}

			}).catch(function(e) {

				console.error('loadOptList failed', e)

				that.selectYgLoading = false

				that.selectYgList = []

			}).finally(function() {

				that.selectYgLoading = false

			})

		},

		// ========== Add Optometry methods START ==========

		opt_openAddModal(type, client) {

			var that = this

			var view = this.addOptView

			view.emp = { id: '', name: '', img: '' }

			view.client = {

				id: (client && client.id) || '',

				name: (client && client.name) || '',

				img: (client && client.img) || ''

			}

			view.type = type || 'add'

			view.optId = ''

			// Set current date as YYYY-MM-DD

			var now = new Date()

			var y = now.getFullYear()

			var m = ('0' + (now.getMonth() + 1)).slice(-2)

			var d = ('0' + now.getDate()).slice(-2)

			view.ygTime = y + '-' + m + '-' + d

			view.ygType = 'default'

			view.mainTab = this.opt_typeChange('default')

			view.originalTab = this.opt_typeChange('original')

			view.autoTab = this.opt_typeChange('auto')

			view.main_recordList = []

			view.main_recordList_active = ''

			view.original_recordList = []

			view.original_recordList_active = ''

			view.auto_recordList = []

			view.auto_recordList_active = ''

			view.optMainId = ''

			view.optOriginalId = ''

			view.optAutoId = ''

			view.mainKcomment = ''

			// Deep clone old data

			view.old_mainTab = JSON.parse(JSON.stringify(view.mainTab))

			view.old_originalTab = JSON.parse(JSON.stringify(view.originalTab))

			view.old_autoTab = JSON.parse(JSON.stringify(view.autoTab))

			this.addOptShow = true

			var that2 = this

			this.$nextTick(function() {

				that2.addOptView.ygType = 'default'

				that2.addOptView.mainTab = that2.opt_typeChange('default')

			})

		},

		addOptClose() {

			this.addOptShow = false

		},

		addOpt_selectEmp() {

			// For now, use the logged-in staff as the optometrist

			var login = this.$store.state.login || {}

			if (login.staff && login.staff.id) {

				this.addOptView.emp.id = login.staff.id

				this.addOptView.emp.name = login.staff.name || login.staff.loginName || ''

				this.addOptView.emp.img = ''

				uni.showToast({ title: this.$t('measure.optEmpSet'), icon: 'none' })

			} else {

				uni.showToast({ title: this.$t('measure.optNoEmp'), icon: 'none' })

			}

		},

		onOptDateConfirm(date) {

			this.addOptView.ygTime = date

			this.addOptDatePickerShow = false

		},

		opt_switchType(type) {

			this.addOptView.ygType = type

			this.addOptView.mainTab = this.opt_typeChange(type)

		},

		opt_onInput(tabName, index, lr, e) {

			var val = e.detail ? e.detail.value : (e.target ? e.target.value : '')

			this.addOptView[tabName][index][lr] = val

		},

		opt_recordList_li(optId, optType) {

			if (optType === 'main') {

				this.addOptView.main_recordList_active = optId

			} else if (optType === 'original') {

				this.addOptView.original_recordList_active = optId

			} else if (optType === 'auto') {

				this.addOptView.auto_recordList_active = optId

			}

			if (!optId) {

				this.opt_clearOptInfo(optType)

				return

			}

			this.opt_findOptInfo(optId, optType)

		},

		opt_clearOptInfo(optType) {

			var view = this.addOptView

			if (optType === 'original') {

				view.original_recordList_active = ''

				view.originalTab.forEach(function(item) { item.r = ''; item.l = '' })

			}

			if (optType === 'auto') {

				view.auto_recordList_active = ''

				view.autoTab.forEach(function(item) { item.r = ''; item.l = '' })

			}

			if (optType === 'main') {

				view.mainTab.forEach(function(item) { item.r = ''; item.l = '' })

			}

		},

		opt_findOptInfo(optId, optType) {

			var that = this

			var view = this.addOptView

			var params = new FormData()

			params.append('id', optId)

			postData('/mobileMakeOrder/findOptInfo.json', params).then(function(res) {

				var data = res.data || res

				var optInfo = data.optInfo || {}

				if (data.empId) {

					view.emp.id = data.empId

					view.emp.name = data.empName || ''

					view.emp.img = data.empImg || ''

				}

				if (optType === 'main') {

					view.optMainId = optInfo.id || ''

					view.mainKcomment = optInfo.kcomment || ''

					var checkType = optInfo.checkType || ''

					var checkType2 = optInfo.checkType2 || ''

					var newCheckType = checkType2 ? (checkType + '_' + checkType2) : checkType

					view.ygType = newCheckType || 'default'

					that.opt_switchType(newCheckType || 'default')

				} else if (optType === 'original') {

					view.optOriginalId = optInfo.id || ''

				} else if (optType === 'auto') {

					view.optAutoId = optInfo.id || ''

				}

				var tab = optType === 'original' ? view.originalTab : (optType === 'auto' ? view.autoTab : view.mainTab)

				tab.forEach(function(item) {

					item.l = optInfo['l' + item.itemType] || ''

					item.r = optInfo['r' + item.itemType] || ''

				})

				// Update old data

				if (optType === 'original') {

					view.old_originalTab = JSON.parse(JSON.stringify(view.originalTab))

				} else if (optType === 'auto') {

					view.old_autoTab = JSON.parse(JSON.stringify(view.autoTab))

				} else {

					view.old_mainTab = JSON.parse(JSON.stringify(view.mainTab))

				}

			}).catch(function(e) {

				console.error('opt_findOptInfo failed', e)

			})

		},

		opt_flashCssFun(mainTab, ygItem, RL, num) {

			var flag = false

			if ((ygItem.itemType === 'pole' || ygItem.itemType === 'axes') && num === '') {

				mainTab.forEach(function(item) {

					if (item.itemType === 'pole' || item.itemType === 'axes') {

						if (RL === 'r' && item.r !== '') flag = true

						if (RL === 'l' && item.l !== '') flag = true

					}

				})

			}

			return flag

		},

		opt_redFun(mainTab, ygType) {

			var flag = true

			var ygArr_L = []

			var ygArr_R = []

			mainTab.forEach(function(ygItem) {

				if (ygItem.red && ygItem.l === '') ygArr_L.push('')

				if (ygItem.red && ygItem.r === '') ygArr_R.push('')

			})

			var specialTypes = ['rgp', 'jmsx_vstcg', 'jmsx_vstsg', 'jmsx_crtcg', 'jmsx_crtssg']

			if (specialTypes.indexOf(ygType) >= 0) {

				if (ygArr_L.length > 0 && ygArr_R.length > 0) flag = false

			} else {

				if (ygArr_L.length > 0 || ygArr_R.length > 0) flag = false

			}

			// pole + axes must both have value

			var lpole = '', rpole = '', laxes = '', raxes = ''

			mainTab.forEach(function(ygItem) {

				if (ygItem.itemType === 'pole') { lpole = ygItem.l; rpole = ygItem.r }

				if (ygItem.itemType === 'axes') { laxes = ygItem.l; raxes = ygItem.r }

			})

			if (rpole !== '' || raxes !== '') {

				if (!(rpole !== '' && raxes !== '')) flag = false

			}

			if (lpole !== '' || laxes !== '') {

				if (!(lpole !== '' && laxes !== '')) flag = false

			}

			if (!flag) {

				uni.showToast({ title: this.$t('measure.optRedRequired'), icon: 'none' })

			}

			return flag

		},

		opt_ygDataFun(data) {

			// Fill zeros for R/L pairs

			var itemTypes = ['ball', 'pole', 'axes', 'sign', 'check', 'space', 'nspace', 'cnspace', 'cspace',

				'add', 'hspace', 'passageway', 'prism1', 'prism2', 'ker', 'kery', 'kera',

				'locatingArc', 'reverseCurve', 'peripheralArc', 'adaptiveArc1', 'adaptiveArc2',

				'floor', 'floor2', 'baseCurve', 'myopiaDecline', 'trial', 'rzd1', 'rzd2',

				'lza1', 'lza2', 'diameter', 'dominanceEye', 'rz1', 'rz2', 'tz1', 'tz2',

				'pwr', 'cp', 'ccz', 'lite', 'rocation', 'lars', 'color']

			itemTypes.forEach(function(item) {

				if (('r' + item) in data) {

					if (data['r' + item] === '' && data['l' + item] !== '') {

						data['r' + item] = (item === 'ball' || item === 'pole') ? '+0.00' : '0'

					}

					if (data['l' + item] === '' && data['r' + item] !== '') {

						data['l' + item] = (item === 'ball' || item === 'pole') ? '+0.00' : '0'

					}

					if (data['l' + item] === '' && data['r' + item] === '') {

						delete data['l' + item]

						delete data['r' + item]

					}

				}

			})

			return data

		},

		opt_saveFun() {

			var that = this

			var view = this.addOptView

			// Validate emp

			if (!view.emp.id) {

				this.addOpt_selectEmp()

				uni.showToast({ title: this.$t('measure.optPleaseSelectEmp'), icon: 'none' })

				return

			}

			// Red required fields

			if (!this.opt_redFun(view.mainTab, view.ygType)) return



			var mainFlag = JSON.stringify(view.mainTab) !== JSON.stringify(view.old_mainTab)

			var originalFlag = JSON.stringify(view.originalTab) !== JSON.stringify(view.old_originalTab)

			var autoFlag = JSON.stringify(view.autoTab) !== JSON.stringify(view.old_autoTab)



			var optMain = {

				empId: view.emp.id,

				empName: view.emp.name,

				checkType: view.ygType.split('_')[0],

				checkType2: view.ygType.split('_')[1] || '',

				kcomment: view.mainKcomment,

				remarks: view.mainKcomment

			}

			if (view.main_recordList_active) optMain.id = view.main_recordList_active



			var optOriginal = {

				empId: view.emp.id,

				empName: view.emp.name,

				checkType: 'original'

			}

			if (view.original_recordList_active) optOriginal.id = view.original_recordList_active



			var optAuto = {

				empId: view.emp.id,

				empName: view.emp.name,

				checkType: 'auto'

			}

			if (view.auto_recordList_active) optAuto.id = view.auto_recordList_active



			view.mainTab.forEach(function(item) {

				if (item.r) optMain['r' + item.itemType] = item.r

				if (item.l) optMain['l' + item.itemType] = item.l

			})

			view.originalTab.forEach(function(item) {

				if (item.r) optOriginal['r' + item.itemType] = item.r

				if (item.l) optOriginal['l' + item.itemType] = item.l

			})

			view.autoTab.forEach(function(item) {

				if (item.r) optAuto['r' + item.itemType] = item.r

				if (item.l) optAuto['l' + item.itemType] = item.l

			})



			var login = this.$store.state.login || {}

			var clientId = view.client.id || (login.ykClientId || '')

			var params = {

				clientId: clientId,

				optDataTime: view.ygTime,

				optOriginalId: view.optOriginalId,

				optAutoId: view.optAutoId,

				mainFlag: mainFlag,

				originalFlag: originalFlag,

				autoFlag: autoFlag,

				optMain: JSON.stringify(this.opt_ygDataFun(optMain)),

				optOriginal: JSON.stringify(this.opt_ygDataFun(optOriginal)),

				optAuto: JSON.stringify(this.opt_ygDataFun(optAuto)),

				kcomment: view.mainKcomment,

				remarks: view.mainKcomment

			}



			if (view.type === 'edit') {

				params.optMainId = view.optMainId

			}



			var url = '/frntend/ordermng/updateMultipleOpt.json'

			postData(url, params).then(function(res) {

				var data = res.data || res

				if (data.code === '1' || data.code === 1) {

					uni.showToast({ title: that.$t('measure.optSaveSuccess'), icon: 'success' })

					var optId = data.optometryId || ''

					// Set the optometry object in addMeasure if available

					if (optId && that.addMeasure) {

						that.addMeasure.ygObj = { id: optId, obj: { id: optId } }

					}

					that.addOptShow = false

				} else {

					uni.showToast({ title: data.message || that.$t('measure.optSaveFail'), icon: 'none' })

				}

			}).catch(function(e) {

				console.error('opt_saveFun failed', e)

				uni.showToast({ title: that.$t('measure.optSaveFail'), icon: 'none' })

			})

		},

		opt_typeChange(command) {

			this.addOptView.ygType = command

			var ygTabObj = {

				'default': {

					itemList: ['ball', 'pole', 'axes', 'sign', 'check', 'space', 'hspace', 'prism1', 'prism2', 'floor', 'floor2'],

					red: ['ball']

				},

				'yinxing': {

					itemList: ['ball', 'pole', 'axes', 'sign', 'check', 'add', 'ker', 'kery', 'kera', 'baseCurve', 'diameter'],

					red: ['ball']

				},

				'djd': {

					itemList: ['ball', 'pole', 'axes', 'sign', 'check', 'space', 'nspace', 'add', 'hspace', 'passageway', 'prism1', 'prism2', 'floor', 'floor2'],

					red: ['ball', 'space', 'add', 'hspace', 'passageway']

				},

				'jycf': {

					itemList: ['ball', 'pole', 'axes', 'sign', 'check', 'nspace', 'hspace', 'prism1', 'prism2', 'floor', 'floor2'],

					red: ['ball', 'nspace']

				},

				'rgp': {

					itemList: ['color', 'ball', 'pole', 'axes', 'sign', 'check', 'ker', 'baseCurve', 'diameter'],

					red: ['color', 'ball', 'diameter']

				},

				'jmsx_vstcg': {

					itemList: ['color', 'ball', 'pole', 'axes', 'ker', 'locatingArc', 'myopiaDecline', 'rz1', 'tz1', 'pwr', 'diameter'],

					red: ['color', 'diameter']

				},

				'jmsx_vstsg': {

					itemList: ['color', 'ball', 'pole', 'axes', 'ker', 'locatingArc', 'myopiaDecline', 'trial', 'cp', 'rz1', 'rz2', 'tz1', 'tz2', 'pwr', 'diameter'],

					red: ['color', 'diameter']

				},

				'jmsx_crtcg': {

					itemList: ['color', 'ball', 'pole', 'axes', 'baseCurve', 'rzd1', 'lza1', 'diameter'],

					red: ['color', 'rzd1', 'lza1', 'diameter']

				},

				'jmsx_crtssg': {

					itemList: ['color', 'ball', 'pole', 'axes', 'baseCurve', 'rzd1', 'rzd2', 'lza1', 'lza2', 'diameter'],

					red: ['color', 'baseCurve', 'rzd1', 'rzd2', 'lza1', 'lza2', 'diameter']

				},

				'scleral': {

					itemList: ['color', 'ball', 'pole', 'axes', 'baseCurve', 'lza1', 'lza2', 'ccz', 'lite', 'rocation', 'lars'],

					red: ['color', 'ball']

				},

				'original': {

					itemList: ['ball', 'pole', 'axes', 'check', 'space', 'add'],

					red: []

				},

				'auto': {

					itemList: ['ball', 'pole', 'axes', 'space', 'ker', 'kery', 'kera'],

					red: []

				}

			}

			var config = ygTabObj[command]

			if (!config) config = ygTabObj['default']

			this.addOptView.mainTab = this.opt_buildTabArray(config)

			return this.addOptView.mainTab

		},

		opt_buildTabArray(obj) {

			var ygArr = [

				{ itemType: 'color', tip: '颜色', ms: '(color)', red: false, l: '', r: '' },

				{ itemType: 'ball', tip: '球光', ms: '(S)', red: false, l: '', r: '' },

				{ itemType: 'pole', tip: '柱镜', ms: '(C)', red: false, l: '', r: '' },

				{ itemType: 'axes', tip: '轴位', ms: '(A)', red: false, l: '', r: '' },

				{ itemType: 'sign', tip: '裸眼视力', ms: '', red: false, l: '', r: '' },

				{ itemType: 'check', tip: '矫正视力', ms: '', red: false, l: '', r: '' },

				{ itemType: 'space', tip: '远瞳距', ms: '(PD-f)', red: false, l: '', r: '' },

				{ itemType: 'nspace', tip: '近瞳距', ms: '(PD-n)', red: false, l: '', r: '' },

				{ itemType: 'cnspace', tip: '近用瞳距', ms: '(PD)', red: false, l: '', r: '' },

				{ itemType: 'cspace', tip: '远用瞳距', ms: '(PD)', red: false, l: '', r: '' },

				{ itemType: 'add', tip: 'ADD', ms: '(ADD)', red: false, l: '', r: '' },

				{ itemType: 'hspace', tip: '瞳高', ms: '(PH)', red: false, l: '', r: '' },

				{ itemType: 'passageway', tip: '通道', ms: '(n)', red: false, l: '', r: '' },

				{ itemType: 'prism1', tip: '棱镜1', ms: '(P1)', red: false, l: '', r: '' },

				{ itemType: 'prism2', tip: '棱镜2', ms: '(P2)', red: false, l: '', r: '' },

				{ itemType: 'ker', tip: '曲率H', ms: '(KH)', red: false, l: '', r: '' },

				{ itemType: 'kery', tip: '曲率V', ms: '(KV)', red: false, l: '', r: '' },

				{ itemType: 'kera', tip: '曲率A', ms: '(KA)', red: false, l: '', r: '' },

				{ itemType: 'locatingArc', tip: '定位弧', ms: '(AC)', red: false, l: '', r: '' },

				{ itemType: 'reverseCurve', tip: '反转弧', ms: '(RC)', red: false, l: '', r: '' },

				{ itemType: 'peripheralArc', tip: '周边弧', ms: '(PC)', red: false, l: '', r: '' },

				{ itemType: 'adaptiveArc1', tip: '适配弧1', ms: '(FA-ac1)', red: false, l: '', r: '' },

				{ itemType: 'adaptiveArc2', tip: '适配弧2', ms: '(FA-ac2)', red: false, l: '', r: '' },

				{ itemType: 'floor', tip: '基底1', ms: '(SC1)', red: false, l: '', r: '' },

				{ itemType: 'floor2', tip: '基底2', ms: '(SC2)', red: false, l: '', r: '' },

				{ itemType: 'baseCurve', tip: '基弧', ms: '(BC)', red: false, l: '', r: '' },

				{ itemType: 'myopiaDecline', tip: '近视降幅度', ms: '(TP)', red: false, l: '', r: '' },

				{ itemType: 'trial', tip: '散光/环曲', ms: '(Trial)', red: false, l: '', r: '' },

				{ itemType: 'rzd1', tip: '反转区1', ms: '(RZD1)', red: false, l: '', r: '' },

				{ itemType: 'rzd2', tip: '反转区2', ms: '(RZD2)', red: false, l: '', r: '' },

				{ itemType: 'lza1', tip: '着陆角1', ms: '(LZA1)', red: false, l: '', r: '' },

				{ itemType: 'lza2', tip: '着陆角2', ms: '(LZA2)', red: false, l: '', r: '' },

				{ itemType: 'diameter', tip: '直径', ms: '(DIA)', red: false, l: '', r: '' },

				{ itemType: 'dominanceEye', tip: '主视眼', ms: '(dominanceEye)', red: false, l: '', r: '' },

				{ itemType: 'rz1', tip: '矢高1', ms: '(rz1)', red: false, l: '', r: '' },

				{ itemType: 'rz2', tip: '矢高2', ms: '(rz2)', red: false, l: '', r: '' },

				{ itemType: 'tz1', tip: '切线1', ms: '(tz1)', red: false, l: '', r: '' },

				{ itemType: 'tz2', tip: '切线2', ms: '(tz2)', red: false, l: '', r: '' },

				{ itemType: 'pwr', tip: '过压量', ms: '(pwr)', red: false, l: '', r: '' },

				{ itemType: 'cp', tip: '散光', ms: '(CP)', red: false, l: '', r: '' },

				{ itemType: 'ccz', tip: '中央泪区', ms: '(CCZ)', red: false, l: '', r: '' },

				{ itemType: 'lite', tip: '角膜缘区', ms: '(LITE)', red: false, l: '', r: '' },

				{ itemType: 'rocation', tip: '旋转', ms: '(ROCATION)', red: false, l: '', r: '' },

				{ itemType: 'lars', tip: 'LARS计算', ms: '(LARS)', red: false, l: '', r: '' },

				{ itemType: 'OpticAxis', tip: '光轴', ms: '(OA)', red: false, l: '', r: '' }

			]

			var arr = []

			var itemList = obj.itemList || []

			var redList = obj.red || []

			for (var i = 0; i < itemList.length; i++) {

				for (var j = 0; j < ygArr.length; j++) {

					if (ygArr[j].itemType === itemList[i]) {

						var item = JSON.parse(JSON.stringify(ygArr[j]))

						arr.push(item)

						break

					}

				}

			}

			for (var a = 0; a < redList.length; a++) {

				for (var b = 0; b < arr.length; b++) {

					if (redList[a] === arr[b].itemType) {

						arr[b].red = true

					}

				}

			}

			return arr

		},

		// ========== Add Optometry methods END ==========

		// ========== OptInput Preset Value Picker methods START ==========
		opt_showPopup(event, section, tabIdx, fieldKey, currentValue, lr) {
			var rect
			try {
				var el = event && (event.currentTarget || event.target)
				if (el && el.getBoundingClientRect) {
					rect = el.getBoundingClientRect()
				} else if (event && event.detail) {
					rect = { bottom: (event.detail.y || event.clientY || 200) + 5, left: event.detail.x || event.clientX || 100, top: event.detail.y || event.clientY || 200 }
				} else if (event && event.touches && event.touches[0]) {
					rect = { bottom: event.touches[0].clientY + 5, left: event.touches[0].clientX, top: event.touches[0].clientY }
				} else {
					rect = { bottom: 200, left: 100, top: 200 }
				}
			} catch(e) {
				rect = { bottom: 200, left: 100 }
			}
			// Determine itemType based on fieldKey
			var signFields = ["sph", "cyl", "add"]
			var type = signFields.indexOf(fieldKey) > -1 ? "sign" : "number"
			var popup = this.optPopup
			popup.itemType = type
			popup.LR = lr || 'R'
			popup.tabName = fieldKey.toUpperCase()
			popup.index = tabIdx
			popup.section = section
			popup.fieldKey = fieldKey
			popup.mode = 'preset'
			popup.lastStr = ''

			// Build preset list based on itemType
			var list = this.opt_getPresetList(fieldKey)
			popup.list = list

			// Position: below and to the right of the input
			var popupTop = rect.bottom + 2
			var popupLeft = rect.left

			// If bottom doesn't have enough space, show above
			var winH = window.innerHeight || document.documentElement.clientHeight
			if (popupTop + 200 > winH) {
				popupTop = rect.top - 200
				if (popupTop < 0) popupTop = 10
			}
			// If right doesn't have enough space, shift left
			var winW = window.innerWidth || document.documentElement.clientWidth
			var estimatedWidth = 300
			if (list.length > 0 && list[0].td && list[0].td.length > 10) {
				estimatedWidth = list[0].td.length * 42
			}
			if (popupLeft + estimatedWidth > winW) {
				popupLeft = winW - estimatedWidth - 10
				if (popupLeft < 0) popupLeft = 10
			}

			popup.x = popupLeft
			popup.y = popupTop
			popup.show = true
		},
		opt_getPresetList(type) {
			// Normalize aliases
			if (type === 'rzd1' || type === 'rzd2') type = 'rzd'
			if (type === 'lza1' || type === 'lza2') type = 'lza'
			if (type === 'rz1' || type === 'rz2') type = 'rz'
			if (type === 'tz1' || type === 'tz2') type = 'tz'

			var list = []
			if (type === 'color') {
				list = [
					{gray:false,td:['\u767d\u8272','\u7d2b\u8272','\u84dd\u8272']},
					{gray:false,td:['\u7eff\u8272','\u7ea2\u8272','\u7070\u8272']},
					{gray:false,td:['0']}
				]
			}
			if (type === 'ball') {
				list = [
					{gray:false,td:['+6.00','+5.00','+4.00','+3.00','+2.00','+1.00','+0.00','-1.00','-2.00','-3.00','-4.00','-5.00','-6.00','-7.00','-8.00','-9.00','-10.00','-11.00','-12.00','-13.00','-14.00','-15.00','-16.00','-17.00','-18.00']},
					{gray:false,td:['+5.75','+4.75','+3.75','+2.75','+1.75','+0.75','-0.25','-1.25','-2.25','-3.25','-4.25','-5.25','-6.25','-7.25','-8.25','-9.25','-10.25','-11.25','-12.25','-13.25','-14.25','-15.25','-16.25','-17.25','']},
					{gray:false,td:['+5.50','+4.50','+3.50','+2.50','+1.50','+0.50','-0.50','-1.50','-2.50','-3.50','-4.50','-5.50','-6.50','-7.50','-8.50','-9.50','-10.50','-11.50','-12.50','-13.50','-14.50','-15.50','-16.50','-17.50','']},
					{gray:false,td:['+5.25','+4.25','+3.25','+2.25','+1.25','+0.25','-0.75','-1.75','-2.75','-3.75','-4.75','-5.75','-6.75','-7.75','-8.75','-9.75','-10.75','-11.75','-12.75','-13.75','-14.75','-15.75','-16.75','-17.75','']}
				]
			}
			if (type === 'pole') {
				list = [
					{gray:false,td:['+0.00','-1.00','-2.00','-3.00','-4.00','-5.00','-6.00']},
					{gray:false,td:['-0.25','-1.25','-2.25','-3.25','-4.25','-5.25','']},
					{gray:false,td:['-0.50','-1.50','-2.50','-3.50','-4.50','-5.50','']},
					{gray:false,td:['-0.75','-1.75','-2.75','-3.75','-4.75','-5.75','']}
				]
			}
			if (type === 'axes') {
				list = [
					{gray:false,td:['0','20','40','60','80','100','120','140','160','180']},
					{gray:false,td:['5','25','45','65','85','105','125','145','165','']},
					{gray:false,td:['10','30','50','70','90','110','130','150','170','']},
					{gray:false,td:['15','35','55','75','95','115','135','155','175','']}
				]
			}
			if (type === 'sign' || type === 'check') {
				list = [
					{gray:false,td:['5.2','5.0','4.9','4.8','4.6','4.4','4.2','4.0','3.8','2.4']},
					{gray:true,td:['1.5','1.0','0.8','0.6','0.4','0.25','0.15','0.1','0.08','0.004']},
					{gray:false,td:['5.1','4.95','4.85','4.7','4.5','4.3','4.1','3.9','3.2','']},
					{gray:true,td:['1.2','0.9','0.7','0.5','0.3','0.2','0.12','0.09','0.02','']}
				]
			}
			if (type === 'space' || type === 'nspace') {
				list = [
					{gray:false,td:['20','22','24','26','28','30','32','34','36','38','40']},
					{gray:false,td:['20.5','22.5','24.5','26.5','28.5','30.5','32.5','34.5','36.5','38.5','']},
					{gray:false,td:['21','23','25','27','29','31','33','35','37','39','']},
					{gray:false,td:['21.5','23.5','25.5','27.5','29.5','31.5','33.5','35.5','37.5','39.5','']}
				]
			}
			if (type === 'cspace' || type === 'cnspace') {
				list = [
					{gray:false,td:['40','44','48','52','56','60','64','68','72','76','80']},
					{gray:false,td:['41','45','49','53','57','61','65','69','73','77','']},
					{gray:false,td:['42','46','50','54','58','62','66','70','74','78','']},
					{gray:false,td:['43','47','51','55','59','63','67','71','75','79','']}
				]
			}
			if (type === 'hspace') {
				list = [
					{gray:false,td:['0','4','8','12','16','20','24','28','32','36','40','44','48']},
					{gray:false,td:['1','5','9','13','17','21','25','29','33','37','41','45','49']},
					{gray:false,td:['2','6','10','14','18','22','26','30','34','38','42','46','50']},
					{gray:false,td:['3','7','11','15','19','23','27','31','35','39','43','47','']}
				]
			}
			if (type === 'diameter') {
				list = [
					{gray:false,td:['10.00','10.40','10.80','11.20','11.60','12.00']},
					{gray:false,td:['10.20','10.60','11.00','11.40','11.80','']}
				]
			}
			if (type === 'ker' || type === 'kery') {
				list = [
					{gray:false,td:['36.00','37.00','38.00','39.00','40.00','41.00','42.00','43.00','44.00','45.00','46.00','47.00','48.00']},
					{gray:false,td:['36.25','37.25','38.25','39.25','40.25','41.25','42.25','43.25','44.25','45.25','46.25','47.25']},
					{gray:false,td:['36.50','37.50','38.50','39.50','40.50','41.50','42.50','43.50','44.50','45.50','46.50','47.50']},
					{gray:false,td:['36.75','37.75','38.75','39.75','40.75','41.75','42.75','43.75','44.75','45.75','46.75','47.75']}
				]
			}
			if (type === 'kera') {
				list = [
					{gray:false,td:['0','20','40','60','80','100','120','140','160','180']},
					{gray:false,td:['5','25','45','65','85','105','125','145','165']},
					{gray:false,td:['10','30','50','70','90','110','130','150','170']},
					{gray:false,td:['15','35','55','75','95','115','135','155','175']}
				]
			}
			if (type === 'dominanceEye') {
				list = [
					{gray:false,td:['OD','OS']},
					{gray:false,td:['OU']}
				]
			}
			if (type === 'rzd') {
				list = [
					{gray:false,td:['500','550','600']},
					{gray:false,td:['525','575','625']}
				]
			}
			if (type === 'lza') {
				list = [
					{gray:false,td:['31','33','35']},
					{gray:false,td:['32','34','36']}
				]
			}
			if (type === 'locatingArc') {
				list = [
					{gray:false,td:['36.00','37.00','38.00','39.00','40.00','41.00','42.00','43.00','44.00','45.00','46.00','47.00','48.00']},
					{gray:false,td:['36.25','37.25','38.25','39.25','40.25','41.25','42.25','43.25','44.25','45.25','46.25','47.25','']},
					{gray:false,td:['36.50','37.50','38.50','39.50','40.50','41.50','42.50','43.50','44.50','45.50','46.50','47.50','']},
					{gray:false,td:['36.75','37.75','38.75','39.75','40.75','41.75','42.75','43.75','44.75','45.75','46.75','47.75','']}
				]
			}
			if (type === 'myopiaDecline') {
				list = [
					{gray:false,td:['-0.25','-1.25','-2.25','-3.25','-4.25','-5.25','-6.25','-7.25','-8.25','-9.25']},
					{gray:false,td:['-0.50','-1.50','-2.50','-3.50','-4.50','-5.50','-6.50','-7.50','-8.50','-9.50']},
					{gray:false,td:['-0.75','-1.75','-2.75','-3.75','-4.75','-5.75','-6.75','-7.75','-8.75','-9.75']},
					{gray:false,td:['-1.00','-2.00','-3.00','-4.00','-5.00','-6.00','-7.00','-8.00','-9.00','-10.00']}
				]
			}
			if (type === 'trial' || type === 'cp') {
				list = [
					{gray:false,td:['-0.25','-1.25','-2.25','-3.25','-4.25','-5.25']},
					{gray:false,td:['-0.50','-1.50','-2.50','-3.50','-4.50','-5.50']},
					{gray:false,td:['-0.75','-1.75','-2.75','-3.75','-4.75','-5.75']},
					{gray:false,td:['-1.00','-2.00','-3.00','-4.00','-5.00','-6.00']}
				]
			}
			if (type === 'rz') {
				list = [
					{gray:false,td:['0.37','0.41','0.45','0.49','0.53','0.57','0.61','0.65','0.69','0.73','0.77','0.81','0.85','0.89','0.93','0.97']},
					{gray:false,td:['0.38','0.42','0.46','0.50','0.54','0.58','0.62','0.66','0.70','0.74','0.78','0.82','0.86','0.90','0.94','0.98']},
					{gray:false,td:['0.39','0.43','0.47','0.51','0.55','0.59','0.63','0.67','0.71','0.75','0.79','0.83','0.87','0.91','0.95','0.99']},
					{gray:false,td:['0.40','0.44','0.48','0.52','0.56','0.60','0.64','0.68','0.72','0.76','0.80','0.84','0.88','0.92','0.96','']}
				]
			}
			if (type === 'tz') {
				list = [
					{gray:false,td:['50','52','54','56','58','60','62','64']},
					{gray:false,td:['51','53','55','57','59','61','63','65']}
				]
			}
			if (type === 'add') {
				list = [
					{gray:false,td:['0.50','1.00','1.50','2.00','2.50','3.00','3.50','4.00']},
					{gray:false,td:['0.75','1.25','1.75','2.25','2.75','3.25','3.75','']}
				]
			}
			if (type === 'passageway') {
				list = [
					{gray:false,td:['0','2','4','6','8','10','12','14','16','18','20']},
					{gray:false,td:['1','3','5','7','9','11','13','15','17','19']}
				]
			}
			if (type === 'pwr') {
				list = [
					{gray:false,td:['0.50','1.00','1.50','2.00']},
					{gray:false,td:['0.75','1.25','1.75','']}
				]
			}
			if (type === 'mirrorFace') {
				list = [
					{gray:false,td:['5','7','9','11','13','15','17','19']},
					{gray:false,td:['6','8','10','12','14','16','18','20']}
				]
			}
			if (type === 'inclination') {
				list = [
					{gray:false,td:['1','3','5','7','9']},
					{gray:false,td:['2','4','6','8','10']}
				]
			}
			if (type === 'faceCamber') {
				list = [
					{gray:false,td:['0','2','4','6','8','10','12','14']},
					{gray:false,td:['1','3','5','7','9','11','13','15']}
				]
			}
			return list
		},
		opt_selectPreset(value) {
			if (!value && value !== '0' && value !== 0) return
			var popup = this.optPopup
			var finalValue = (popup.lastStr || '') + value
			var section = popup.section || 'main'
			var tabKey = section === 'main' ? 'mainTab' : section === 'original' ? 'originalTab' : 'autoTab'
			var col = this.addOptView[tabKey][popup.index]
			if (col) {
				if (popup.LR === 'R') col.r = finalValue
				else col.l = finalValue
			}
			this.opt_closePopup()
		},
		opt_closePopup() {
			this.optPopup.show = false
		},
		opt_manualInput() {
			var popup = this.optPopup
			var section = popup.section || 'main'
			var colIdx = popup.index
			var lr = popup.LR
			popup.show = false

			// Use setTimeout to ensure popup is closed and DOM updated
			setTimeout(function() {
				try {
					// uni-app compiles to uni-view, find by class
					var allTables = document.querySelectorAll('.addOptCon .optRecordBar')
					console.log('Found tables:', allTables.length, 'looking for section:', section, 'col:', colIdx, 'lr:', lr)

					var tableIdx = section === 'main' ? 0 : section === 'original' ? 1 : 2
					var table = allTables[tableIdx]
					if (!table) { console.log('Table not found at index', tableIdx); return }

					// Get all column li elements (first is label, rest are data columns)
					var cols = table.querySelectorAll('[class*="optRecordBar-li"]')
					console.log('Found cols:', cols.length)

					// colIdx + 1 because first col is label
					var col = cols[colIdx + 1]
					if (!col) { console.log('Col not found at', colIdx + 1); return }

					// Get val cells in this column (R=index 0, L=index 1 among val cells)
					var valCells = col.querySelectorAll('[class*="optRecordBar-val"]')
					console.log('Found val cells:', valCells.length)

					var cellIndex = lr === 'R' ? 0 : 1
					var cell = valCells[cellIndex]
					if (!cell) { console.log('Cell not found'); return }

					// Find the actual input element inside
					var input = cell.querySelector('input')
					console.log('Found input:', !!input)

					if (input) {
						// Remove all blocks
						var uniInput = cell.querySelector('uni-input')
						if (uniInput) {
							uniInput.style.pointerEvents = 'auto'
							uniInput.removeAttribute('readonly')
							uniInput.removeAttribute('disabled')
						}
						input.readOnly = false
						input.disabled = false
						input.removeAttribute('readonly')
						input.removeAttribute('disabled')
						input.style.pointerEvents = 'auto'
						// Slight delay then focus
						setTimeout(function() {
							input.focus()
							// Dispatch touch event to simulate tap
							console.log('Input focused')
						}, 100)
					}
				} catch(e) {
					console.log('Manual input error:', e)
				}
			}, 200)
		},
		opt_toggleSign(sign) {
			if (this.optPopup.lastStr === sign) {
				this.optPopup.lastStr = ''
			} else {
				this.optPopup.lastStr = sign
			}
		},



		logoutFun() {

			var that = this

			uni.showModal({

				title: '',

				content: this.$t('measure.logoutConfirm'),

				success: function(res) {

					if (res.confirm) {

						fetch('/crm/logout.xhtml').then(function() {

							uni.redirectTo({ url: '/pages/login/index' })

						}).catch(function() {

							uni.redirectTo({ url: '/pages/login/index' })

						})

					}

				}

			})

		},

		searchClient() {

			var that = this

			var keyword = this.clientSearchKeyword

			// keyword can be empty to load all

			this.clientSearchLoading = true

			var params = {

				sEcho: '3',

				iDisplayStart: '0',

				iDisplayLength: '20',

				sSearch: keyword,

				mobile: '', cardNum: '', wechat: '', sex: '', grade: '',

				gwcFlag: '', wdflag: '', type: '', lastserviceEmpId: '',

				khClientId: '', relationClientId: '', crmClient: ''

			}

			postData('/frntend/hkclientdlg/query1.json', params).then(function(res) {

				var data = res.data || res

				var list = data.aaData || []

				that.clientSearchList = list.map(function(item) {

					return {

						id: item[0],

						name: item[1],

						tel: item[2],

						level: item[6] || '',

						gender: item[9] || '男',

						imgurl: item[10] || '',

						medicalNo: item[25] || '',

						birthday: item[26] || '',

						age: item[27] || ''

					}

				})

			}).catch(function(e) {

				console.error('search client failed', e)

			}).finally(function() {

				that.clientSearchLoading = false

			})

		},

		pickClient(item) {

			this.clientInfo = {

				id: item.id,

				name: item.name,

				tel: item.tel,

				gender: item.gender === '男' ? '1' : '0',

				age: item.age,

				imgurl: item.imgurl

			}

			this.clientModalShow = false

			this.clientSearchKeyword = ''

			this.clientSearchList = []

			try {

				sessionStorage.setItem('ai_measure_client', JSON.stringify(this.clientInfo))

				sessionStorage.setItem('aiPage2_clientId', item.id)

				sessionStorage.setItem('aiPage2_clientName', item.name)

				sessionStorage.setItem('aiPage2_clientImg', item.imgurl)

			} catch(e) {}

			// 同步到新增测量弹窗

			if (this.addMeasureShow) {

				this.addMeasure.client.id = item.id

				this.addMeasure.client.name = item.name

				this.addMeasure.client.img = item.imgurl || ''

			}

			// 如果是换客户操作，绑定客户到测量记录

			if (this.changeClientRecordId) {

				var that2 = this

				postData('/aiPuPil/updateAiPuPilClient.json', { id: this.changeClientRecordId, clientId: item.id }).then(function() {

					uni.showToast({ title: 'OK', icon: 'success' })

					that2.detailShow = false

					that2.changeClientRecordId = ''

					that2.loadMeasureData(true)

				}).catch(function() {

					that2.changeClientRecordId = ''

					that2.loadMeasureData(true)

				})

				return

			}

			var login = this.$store.state.login || {}

			this.loginInfo.staff = login.staff || null

			this.loginInfo.company = login.company || null

			this.loginInfo.unit = login.unit || null

			this.loadMeasureData(true)

		},

		openStorePicker() {

			this.storePickerShow = true

			var units = this.$store.state.units || []

			this.storeList = units.map(function(u) {

				var item = Array.isArray(u) ? u : [u.id, u.name, '', '', u.type || 0]

				return { id: item[0], name: item[1], type: item[4] || 0 }

			})

		},

		selectStore(store) {

			var that = this

			console.log('selectStore called:', store.id, store.name)

			// Call API to switch store
			uni.request({
				url: '/crm/httpmine/initUnitGet.json?unitId=' + store.id,
				method: 'GET',
				success: function() {
					console.log('initUnitGet success')
				},
				fail: function(e) {
					console.log('initUnitGet failed, proceeding:', e)
				},
				complete: function() {
					var loginInfo = Object.assign({}, that.$store.state.login)
					loginInfo.unit = { id: store.id, name: store.name }
					that.$store.commit('setLogin', loginInfo)

					that.loginInfo.unit = { id: store.id, name: store.name }
					that.loginInfo.staff = that.$store.state.login.staff || null
					that.loginInfo.company = that.$store.state.login.company || null

					try {
						sessionStorage.setItem('aivision_login', JSON.stringify(loginInfo))
					} catch(e) {}

					that.storePickerShow = false
					that.loadMeasureData(true)
				}
			})

		},

		initData() {

			// 从sessionStorage恢复状态

			// 恢复登录信息到 store

			try {

				var savedLogin = sessionStorage.getItem('aivision_login')

				if (savedLogin) {

					var loginData = JSON.parse(savedLogin)

					if (loginData && (loginData.staff || loginData.company || loginData.unit)) {

						this.$store.commit('setLogin', loginData)

					}

				}

				var savedUnits = sessionStorage.getItem('aivision_units')

				if (savedUnits) {

					this.$store.commit('setUnits', JSON.parse(savedUnits))

				}

			} catch(e) {}

			try {

				var saved = sessionStorage.getItem('ai_measure_client')

				if (saved) {

					this.clientInfo = JSON.parse(saved)

				}

				var savedDevice = sessionStorage.getItem('ai_measure_device')

				if (savedDevice) {

					this.deviceInfo = JSON.parse(savedDevice)

				}

				var savedLang = localStorage.getItem('aivision_lang')

				if (savedLang) {

					this.lang = savedLang

				}

			} catch (e) {}

			this.loadMeasureData(true)

		},



		// 加载测量列表

		loadMeasureData(reset) {

			var that = this

			if (reset) {

				this.pageNo = 1

				this.list = []

				this.rawList = []

				this.loading = true

			} else {

				this.loadingMore = true

			}

			var params = {

				pageNo: this.pageNo,

				pageSize: this.pageSize

			}

			if (this.clientInfo.id) params.clientId = this.clientInfo.id

			if (this.allUnits) params.allUnits = 1

			if (this.tj.startDate) params.startDate = this.tj.startDate

			if (this.tj.endDate) params.endDate = this.tj.endDate

			if (this.tj.checkType) params.checkType = this.tj.checkType

			if (this.tj.frameKeyword) params.keyword = this.tj.frameKeyword

			if (this.bindStatus === 'unbound') params.unbound = 1

			else if (this.bindStatus === 'bound') params.bound = 1



			postData('/aiPuPil/getAiPuPilList.json', params).then(function(res) {

				var resData = res.data || res

				if (resData && resData.returnCode === 'SUCCESS') {

					var dataList = resData.apslist || resData.dataList || resData.list || resData.result || []

					var parsed = dataList.map(function(arr) {

						return Array.isArray(arr) ? parseListItem(arr) : arr

					})

					if (reset) {

						that.rawList = parsed

						that.list = parsed

					} else {

						that.rawList = that.rawList.concat(parsed)

						that.list = that.list.concat(parsed)

					}

					that.hasMore = dataList.length >= that.pageSize

					that.updateStats(resData)

				}

			}).catch(function(e) {

				console.error('Load measure failed', e)

			}).finally(function() {

				that.loading = false

				that.loadingMore = false

			})

		},



		loadMore() {

			if (this.loadingMore) return

			this.pageNo++

			this.loadMeasureData(false)

		},



		doSearch() {

			this.loadMeasureData(true)

		},



		refreshData() {

			this.tj.startDate = ''

			this.tj.endDate = ''

			this.tj.frameKeyword = ''

			this.tj.checkType = ''

			this.bindStatus = ''

			this.allUnits = false

			this.loadMeasureData(true)

		},



		updateStats(res) {

			if (res.totalCount != null) this.stats.total = res.totalCount

			else if (res.total != null) this.stats.total = res.total

			else this.stats.total = this.rawList.length

			if (res.monthCount != null) this.stats.month = res.monthCount

			if (res.todayCount != null) this.stats.today = res.todayCount

		},



		// 设备相关

		loadDeviceList() {

			var that = this

			var compId = this.$store.getters.compId

			if (!compId) {

				try {

					var saved = JSON.parse(sessionStorage.getItem('aivision_login') || '{}')

					compId = saved.company ? saved.company.id : ''

				} catch(e) {}

			}

			if (!compId) { console.log('compId is empty, skip loadDeviceList'); return }

			postData('/aiPuPil/getAiCameraInfoList.json', { compId: compId, materielId: '5' }).then(function(res) {

				var data = res.data || res

				if (data && data.returnCode === 'SUCCESS') {

					var list = data.aclist || data.list || data.dataList || []

					that.deviceList = list.map(function(item) {

						return {

							id: item[6] || item.id || '',

							brandId: item[2] || item.brandId || '',

							brandName: item[3] || item.brandName || '',

							name: item[5] || item.name || '',

							angle: item[9] || item.angle || '',

							addmm: item[10] || item.addmm || 0,

							cameraid: item[6] || item.cameraid || ''

						}

					})

					// 提取品牌

					// 使用接口返回的 brandList

					if (data.brandList) {

						that.deviceBrandList = data.brandList

					} else {

						var brands = {}

						that.deviceList.forEach(function(d) {

							if (d.brandId && !brands[d.brandId]) {

								brands[d.brandId] = { id: d.brandId, name: d.brandName || d.brandId }

							}

						})

						that.deviceBrandList = Object.values(brands)

					}

				}

			}).catch(function(e) {

				console.error('Load devices failed', e)

			})

		},



		selectDevice(device) {

			this.deviceInfo = device

			this.deviceModalShow = false

			try {

				sessionStorage.setItem('ai_measure_device', JSON.stringify(device))

			} catch (e) {}

		},



		// 客户相关

		clearClient() {

			this.clientInfo = { id: '', name: '', tel: '', gender: '1', age: '' }

			try {

				sessionStorage.removeItem('ai_measure_client')

			} catch (e) {}

			this.loadMeasureData(true)

		},



		setGuestMode() {

			var ykClientId = (this.$store.state.login && this.$store.state.login.ykClientId) ? this.$store.state.login.ykClientId + '' : ''

			try { if (!ykClientId) { var saved = JSON.parse(sessionStorage.getItem('aivision_login') || '{}'); ykClientId = saved.ykClientId || '' } } catch(e) {}

			this.clientInfo = { id: ykClientId, name: this.$t('measure.guest'), tel: '', gender: '1', age: '' }

			this.loadMeasureData(true)

		},



		// 筛选

		onCheckTypeChange(e) {

			var idx = e.detail.value

			if (idx == 0) {

				this.tj.checkType = ''

			} else {

				this.tj.checkType = this.checkTypes[idx - 1].value

			}

			this.doSearch()

		},



		// 图片错误处理

		onImgError(item) {

			item.capImgSrc = this.defaultImg

		},



		// 打开详情弹窗

		openDetail(item) {

			var that = this

			this.detailItem = Object.assign({}, item)

			this.detailShow = true

			this.detailLoading = true

			postData('/aiPuPil/getAiPuPilById.json', { id: item.id }).then(function(res) {

				var data = res.data || res

				if (data && data.returnCode === 'SUCCESS') {

					var pupil = data.aiPuPil || {}

					var fixImg = function(src) {

						if (!src) return ''

						if (src.indexOf('http') === 0) return src

						return '/crm/' + src

					}

					that.detailItem = Object.assign({}, item, pupil, {

						capImgSrc: fixImg(data.capImgSrc || pupil.capImgSrc),

						side_capImgSrc: fixImg(data.side_capImgSrc || pupil.side_capImgSrc),

						dataImgSrc: fixImg(data.dataImgSrc || pupil.dataImgSrc),

						jxcTarkImgSrc: fixImg(data.jxcTarkImgSrc || pupil.jxcTarkImgSrc),

						tarkImgSrc: fixImg(data.tarkImgSrc || pupil.tarkImgSrc),

						skImgSrc: fixImg(data.skImgSrc || pupil.skImgSrc),

						imgSrc: fixImg(data.imgSrc || pupil.imgSrc)

					})

				}

			}).catch(function(e) {

				console.error('Load detail failed', e)

			}).finally(function() {

				that.detailLoading = false

			})

		},

		closeDetail() {

			this.detailShow = false

		},

		selectMeasure(item) {

			this.closeDetail()

			uni.showToast({ title: this.$t('measure.select') + ' OK', icon: 'none' })

		},

		editMeasure(item) {

			this.closeDetail()

			uni.navigateTo({ url: '/pages/addMeasure/index?id=' + item.id })

		},

		changeDetailClient(item) {

			this.changeClientRecordId = item.id

			this.openClientSearch()

		},

		shareMeasure(id) {

			var url = window.location.origin + '/crm/aiPuPil/share.xhtml?id=' + id

			if (navigator.clipboard) {

				navigator.clipboard.writeText(url).then(function() {

					uni.showToast({ title: this.$t('measure.linkCopied'), icon: 'none' })

				}.bind(this)).catch(function() {

					uni.showToast({ title: url, icon: 'none' })

				})

			} else {

				uni.showToast({ title: url, icon: 'none' })

			}

		},

		printMeasure(id) {

			var url = '/crm/aiPuPil/print.xhtml?id=' + id

			window.open(url, '_blank')

		},

		deleteMeasure(id) {

			var that = this

			uni.showModal({

				title: '',

				content: this.$t('measure.confirmDelete'),

				success: function(res) {

					if (res.confirm) {

						postData('/aiPuPil/deleteAiPuPil.json', { id: id }).then(function(res) {

							var data = res.data || res

							if (data && data.returnCode === 'SUCCESS') {

								uni.showToast({ title: that.$t('measure.deleteSuccess'), icon: 'success' })

								that.detailShow = false

								that.loadMeasureData(true)

							} else {

								uni.showToast({ title: that.$t('measure.deleteFailed'), icon: 'none' })

							}

						}).catch(function(e) {

							uni.showToast({ title: that.$t('measure.deleteFailed'), icon: 'none' })

						})

					}

				}

			})

		},



		// ========== 新增测量弹窗 methods START ==========

		openAddMeasure() {

			var am = this.addMeasure

			am.client.id = this.clientInfo.id || ''

			am.client.name = this.clientInfo.name || ''

			am.client.img = ''

			am.intDomId = ''

			am.intDom = ''

			am.support = '1'

			am.optTyle = 'yy'

			am.scene = '3'

			am.type = '0'

			am.readingDis = '40'

			am.intAngle = ''

			am.intDomList = []

			am.jkW = ''

			am.bl = ''

			am.jkOutH = ''

			am.ygObj = { id: '', obj: {} }

			this.addMeasureShow = true

			// No client selected, auto set guest mode

			if (!am.client.id && !am.client.name) {

				this.setGuestMode()

				am.client.id = this.clientInfo.id || ''

				am.client.name = this.clientInfo.name || ''

			}

		},

		addMeasure_close() {

			this.addMeasureShow = false

		},

		supportChange(val) {

			this.addMeasure.support = val

			this.addMeasure.jkW = ''

			this.addMeasure.bl = ''

			this.addMeasure.jkOutH = ''

			if (val == '1') {

				this.addMeasure.type = '0'

			} else {

				this.addMeasure.type = '1'

			}

		},

		optTyleChange(val) {

			this.addMeasure.optTyle = val

			this.addMeasure.readingDis = '40'

		},

		sceneChange(val) {

			this.addMeasure.scene = val

		},

		typeChange(val) {

			this.addMeasure.type = val

		},

		readingDisChange(val) {

			this.addMeasure.readingDis = val

		},

		rlHspaceFun(rhspace, lhspace) {

			var hspace = Number(rhspace) + Number(lhspace)

			return parseFloat(hspace.toFixed(2))

		},

		ygObjClearFun() {

			this.addMeasure.ygObj = { id: '', obj: {} }

		},

		intDomSearch() {

			var that = this

			var keyword = (this.addMeasure.intDom || '').replace(/\s+/g, '')

			if (!keyword) {

				this.addMeasure.intDomList = []

				return

			}

			postData('/shotlink/getJpProbindByLikeName.json', { likeName: keyword }).then(function(res) {

				var data = res.data || res

				if (data && data.returnCode === 'SUCCESS') {

					that.addMeasure.intDomList = data.list || []

				}

			})

		},

		intDomLiFun(item) {

			this.addMeasure.intDomId = item[0]

			this.addMeasure.intDom = item[1]

			this.addMeasure.intDomList = []

		},

		intDomBlur() {

			var that = this

			setTimeout(function() {

				that.addMeasure.intDomList = []

			}, 300)

		},

		openClientForMeasure() {

			// Re-use existing client search; after selection, sync to addMeasure

			this.clientModalShow = true

			this.clientSearchKeyword = ''

			this.searchClient()

		},

		openAddClientForMeasure() {

			this.openAddClient()

		},

		addMeasure_selectYg() {

			if (!this.addMeasure.client.id) {

				uni.showToast({ title: this.$t('measure.pleaseSelectClient'), icon: 'none' })

				return

			}

			this.openSelectYg()

		},

		addMeasure_newOpt() {

			if (!this.addMeasure.client.id) {

				uni.showToast({ title: this.$t('measure.pleaseSelectClient'), icon: 'none' })

				return

			}

			this.opt_openAddModal('add', this.addMeasure.client)

		},

		addMeasure_yes() {

			var am = this.addMeasure

			// Validate reading distance

			if (!am.readingDis && am.optTyle !== 'yy') {

				uni.showToast({ title: this.$t('measure.amPleaseReadingDis'), icon: 'none' })

				return

			}

			var login = this.$store.state.login || {}

			var clientId = am.client.id || ''

			var empId = (login.staff && login.staff.id) ? login.staff.id : ''

			var unitId = (login.unit && login.unit.id) ? login.unit.id : ''

			var compId = (login.company && login.company.id) ? login.company.id : ''

			var cmdName = am.intDom || ''

			var proBindId = am.intDomId || ''

			var addmm = this.deviceInfo.addmm || ''

			var angle = this.deviceInfo.angle || ''

			if (am.intAngle) {

				angle = am.intAngle

			}

			var aiCameraName = this.deviceInfo.name || ''

			var cameraId = this.deviceInfo.cameraid || this.deviceInfo.id || ''

			var optId = (am.ygObj.obj && am.ygObj.obj.id) ? am.ygObj.obj.id : ''



			if (!angle) {

				uni.showToast({ title: this.$t('measure.pleaseSelectDevice'), icon: 'none' })

				return

			}



			var rspace = (am.ygObj.obj && am.ygObj.obj.rspace) || ''

			var lspace = (am.ygObj.obj && am.ygObj.obj.lspace) || ''

			var rnspace = (am.ygObj.obj && am.ygObj.obj.rnspace) || ''

			var lnspace = (am.ygObj.obj && am.ygObj.obj.lnspace) || ''

			var optType = am.optTyle

			var readingDis = am.readingDis

			var scene = am.scene

			var currentLang = this.lang || 'zh'

			var FOS_tyle = am.type



			// Build query params object

			var params = {

				clientId: clientId,

				empId: empId,

				unitId: unitId,

				compId: compId,

				addmm: addmm,

				angle: angle,

				proBindId: proBindId,

				cameraId: cameraId,

				optId: optId,

				aiCameraName: aiCameraName,

				rspace: rspace,

				lspace: lspace,

				rnspace: rnspace,

				lnspace: lnspace,

				optType: optType,

				readingDis: readingDis,

				scene: scene,

				lang: currentLang

			}



			if (FOS_tyle == '1' && am.support == '0') {

				// No frame + upload mode: require frame width & bridge

				if (!am.jkW || !am.bl) {

					uni.showToast({ title: this.$t('measure.amFrameRequired'), icon: 'none' })

					return

				}

				params.blw = am.bl

				params.jkw = am.jkW

				params.jkh = am.jkOutH

			}



			// Build URL query string

			var queryArr = []

			for (var k in params) {

				queryArr.push(k + '=' + encodeURIComponent(params[k] || ''))

			}

			var queryStr = queryArr.join('&')



			// Navigate to measurement page (face-discern-uniapp)

			var targetPage = '/pages/index/index'

			if (FOS_tyle == '1') {

				targetPage = '/pages/index/index' // upload mode also goes to index with upload flag

			}

			console.log('[addMeasure_yes] navigating to:', targetPage + '?' + queryStr)

			this.addMeasureShow = false



			uni.navigateTo({

				url: targetPage + '?' + queryStr

			})

		},

		// ========== 新增测量弹窗 methods END ==========



		// 语言切换

		setLang(lang) {

			this.lang = lang

			var localeMap = { zh: 'zh-CN', en: 'en-US', hk: 'zh-HK' }

			this.$i18n.locale = localeMap[lang] || 'zh-CN'

			localStorage.setItem('aivision_lang', lang)

		}

	}

}

</script>



<style lang="scss" scoped>

.db-panel {

	min-height: 100vh;

	background: #f1f5f9;

	padding: 16px;

}



/* ============ 统计行样式 ============ */

.db-stat-row {

	display: flex;

	gap: 12px;

	margin-bottom: 12px;

}

.db-stat-card {

	flex: 1;

	background: white;

	border-radius: 12px;

	padding: 12px 16px;

	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

	text-align: center;

}

.db-stat-value {

	font-size: 24px;

	font-weight: 700;

	color: #1e293b;

	line-height: 1.2;

	display: block;

}

.db-stat-label {

	font-size: 12px;

	color: #64748b;

	margin-top: 2px;

	display: block;

}



/* ============ AI测量工具栏 ============ */

.am-toolbar {

	display: flex;

	align-items: center;

	justify-content: space-between;

	gap: 12px;

	padding: 14px 20px;

	background: white;

	border-radius: 12px;

	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

	margin-bottom: 12px;

	flex-wrap: wrap;

}



.am-toolbar-left, .am-toolbar-right {

	display: flex;

	align-items: center;

	gap: 8px;

	flex-wrap: wrap;

}



.am-toolbar-divider {

	width: 1px;

	height: 24px;

	background: #e2e8f0;

	margin: 0 4px;

}



/* ============ 客户 Chip ============ */

.am-client-chip {

	display: flex;

	align-items: center;

	gap: 8px;

	padding: 5px 10px 5px 6px;

	background: #f8fafc;

	border: 1px solid #e2e8f0;

	border-radius: 20px;

	cursor: pointer;

	transition: all 0.15s;

	min-width: 120px;

	max-width: 200px;

}

.am-client-chip-avatar {

	width: 28px;

	height: 28px;

	border-radius: 50%;

	background: #94a3b8;

	color: white;

	font-size: 13px;

	font-weight: 600;

	display: flex;

	align-items: center;

	justify-content: center;

	flex-shrink: 0;

	&.male { background: #3b82f6; }

	&.female { background: #ec4899; }

}

.am-client-chip-info {

	display: flex;

	flex-direction: column;

	min-width: 0;

}

.am-client-chip-name {

	font-size: 13px;

	font-weight: 500;

	color: #1e293b;

	white-space: nowrap;

	overflow: hidden;

	text-overflow: ellipsis;

}

.am-client-chip-sub {

	font-size: 11px;

	color: #94a3b8;

}



/* ============ 设备 Chip ============ */

.am-device-chip {

	display: flex;

	align-items: center;

	gap: 6px;

	padding: 6px 10px;

	background: #f0f9ff;

	border: 1px solid #bae6fd;

	border-radius: 20px;

	cursor: pointer;

	font-size: 13px;

	color: #0369a1;

	transition: all 0.15s;

}



/* ============ 按钮 ============ */

.am-btn {

	display: inline-flex;

	align-items: center;

	gap: 5px;

	padding: 7px 14px;

	border-radius: 8px;

	font-size: 13px;

	cursor: pointer;

	border: 1px solid #E2E8F0;

	background: white;

	color: #374151;

	transition: all 0.15s;



	&.active {

		background: #6366F1;

		color: white;

		border-color: #6366f1;

	}

}



.am-btn-add {

	background: linear-gradient(135deg, #6366F1, #818CF8);

	color: white;

	border: none;

}



.am-btn-primary {

	background: linear-gradient(135deg, #6366F1, #818CF8);

	color: white;

	border: none;

}



/* ============ 全部门店切换按钮 ============ */

.am-btn-filter-toggle {

	display: flex;

	align-items: center;

	gap: 4px;

	padding: 5px 10px;

	font-size: 12px;

	color: #64748b;

	background: white;

	border: 1px solid #e2e8f0;

	border-radius: 8px;

	cursor: pointer;

	transition: all 0.15s;

	&.active {

		background: #eef2ff;

		border-color: #6366f1;

		color: #6366f1;

	}

}



/* ============ 筛选栏 ============ */

.am-filter-bar {

	display: none;

	flex-wrap: wrap;

	align-items: center;

	gap: 12px;

	padding: 14px 20px;

	background: white;

	border-radius: 12px;

	margin-bottom: 12px;

	box-shadow: 0 1px 3px rgba(0,0,0,0.04);



	&.active { display: flex; }

}



.am-filter-group {

	display: flex;

	align-items: center;

	gap: 6px;

}

.am-filter-label {

	font-size: 13px;

	color: #64748b;

	white-space: nowrap;

}

.am-filter-sep {

	color: #94a3b8;

}



.am-filter-input, .am-filter-select {

	padding: 6px 10px;

	border: 1px solid #E2E8F0;

	border-radius: 6px;

	font-size: 13px;

	outline: none;

}



/* ============ 卡片列表 ============ */

.am-card-list {

	display: flex;

	flex-direction: column;

	gap: 8px;

	height: calc(100vh - 280px);

}



.am-measure-card {

  display: flex;

  align-items: center;

  gap: 16px;

  padding: 16px 20px;

  background: white;

  border-radius: 12px;

  cursor: pointer;

  transition: all 0.2s;

  box-shadow: 0 1px 3px rgba(0,0,0,0.04);

  margin-bottom: 8px;

}



.am-card-thumb {

	width: 72px;

	height: 72px;

	border-radius: 8px;

	overflow: hidden;

	background: #F8FAFC;

	flex-shrink: 0;



	image {

		width: 100%;

		height: 100%;

	}

}



.am-card-body {

	flex: 1;

	min-width: 0;

}

.am-card-header {

	display: flex;

	align-items: center;

	gap: 8px;

	margin-bottom: 4px;

}

.am-card-name {

	font-weight: 600;

	color: #1e293b;

}

.am-card-gender {

	font-size: 14px;

	&.male { color: #2563EB; }

	&.female { color: #DB2777; }

}

.am-card-age {

	font-size: 13px;

	color: #64748b;

}



.am-check-type {

	padding: 2px 8px;

	border-radius: 12px;

	font-size: 11px;

	font-weight: 600;

	&.type-far { background: #DBEAFE; color: #1D4ED8; }

	&.type-near { background: #FEF3C7; color: #92400E; }

	&.type-multi { background: #F3E8FF; color: #7E22CE; }

	&.type-office { background: #DCFCE7; color: #166534; }

	&.type-drive { background: #FEE2E2; color: #991B1B; }

	&.type-prevent { background: #FFEDD5; color: #9A3412; }

}



.am-card-frame {

	font-size: 13px;

	color: #64748b;

	margin-bottom: 4px;

}



.am-card-meta {

	display: flex;

	gap: 16px;

	font-size: 12px;

	color: #94A3B8;

	flex-wrap: wrap;

}



.am-card-meta-item {

	display: flex;

	align-items: center;

	gap: 4px;

}



.am-card-params {

	display: flex;

	gap: 16px;

	flex-shrink: 0;

	flex-wrap: wrap;

}

.am-card-param {

	text-align: center;

}

.am-card-param-value {

	font-weight: 700;

	color: #1e293b;

	font-size: 15px;

	display: block;

}

.am-card-param-label {

	font-size: 10px;

	color: #94A3B8;

	display: block;

}



/* ============ 空状态 ============ */

.am-empty {

	text-align: center;

	padding: 60px 20px;

	background: white;

	border-radius: 12px;

	color: #94a3b8;

}

.am-empty-icon {

	margin-bottom: 12px;

}

.am-empty-text {

	font-size: 15px;

	margin-bottom: 16px;

	display: block;

}



/* ============ 绑定/未绑定徽章 ============ */

.am-bound-badge {

	position: absolute;

	top: 8px;

	right: 8px;

	padding: 2px 7px;

	background: #dcfce7;

	color: #16a34a;

	font-size: 11px;

	border-radius: 10px;

	font-weight: 500;

	z-index: 1;

}

.am-unbound-badge {

	position: absolute;

	top: 8px;

	right: 8px;

	padding: 2px 7px;

	background: #fef3c7;

	color: #d97706;

	font-size: 11px;

	border-radius: 10px;

	font-weight: 500;

	z-index: 1;

}



/* ============ 加载更多 ============ */

.am-load-more {

	padding: 16px;

	text-align: center;

}

.am-load-more-btn {

	padding: 8px 24px;

	font-size: 13px;

	color: #6366f1;

	background: white;

	border: 1px solid #6366f1;

	border-radius: 8px;

	cursor: pointer;

	transition: all 0.15s;

	display: inline-block;

}



/* ============ 弹窗 ============ */

.modal-overlay {

	position: fixed;

	top: 0;

	left: 0;

	right: 0;

	bottom: 0;

	background: rgba(15, 23, 42, 0.6);

	z-index: 2000;

	display: flex;

	align-items: center;

	justify-content: center;

}



.modal {

	background: white;

	border-radius: 16px;

	padding: 36px;

	max-width: 480px;

	width: 90%;

	position: relative;

	box-shadow: 0 20px 60px rgba(0,0,0,0.15);

}



.modal-close {

	position: absolute;

	top: 16px;

	right: 16px;

	width: 32px;

	height: 32px;

	border-radius: 8px;

	background: #f1f5f9;

	color: #64748b;

	cursor: pointer;

	display: flex;

	align-items: center;

	justify-content: center;

}



.modal-title {

	font-size: 20px;

	font-weight: 700;

	color: #1e293b;

	margin-bottom: 20px;

	display: block;

}



/* ============ 设备选择弹窗 ============ */

.device-modal {

	max-width: 480px;

	width: 90vw;

}

.device-brand-tabs {

	display: flex;

	flex-wrap: wrap;

	gap: 6px;

	margin-bottom: 12px;

}

.device-brand-tab {

	padding: 4px 12px;

	font-size: 12px;

	border: 1px solid #e2e8f0;

	border-radius: 12px;

	background: white;

	color: #64748b;

	cursor: pointer;

	&.active {

		background: #6366f1;

		color: white;

		border-color: #6366f1;

	}

}

.device-list {

	display: flex;

	flex-direction: column;

	gap: 8px;

	max-height: 340px;

	overflow-y: auto;

}

.device-card {

	display: flex;

	align-items: center;

	gap: 12px;

	padding: 10px 14px;

	border: 1px solid #e2e8f0;

	border-radius: 10px;

	cursor: pointer;

	transition: all 0.15s;

	&:active {

		border-color: #6366f1;

		background: #fafafa;

	}

}

.device-card-info {

	flex: 1;

	min-width: 0;

	display: flex;

	flex-direction: column;

}

.device-card-name {

	font-size: 14px;

	font-weight: 500;

	color: #1e293b;

}

.device-card-sub {

	font-size: 12px;

	color: #94a3b8;

	margin-top: 2px;

}



.opt-ms {
	font-size: 12px;
	color: #999;
	line-height: 14px;
}
.opt-input-cell {
	height: 25px;
}
.addOpt-red {
	color: #e53935;
}
.addOpt-flash {
	animation: addOptFlash 1s ease infinite;
}
@keyframes addOptFlash {
	0% { border-color: #fd7634; }
	100% { border-color: #e8e8e8; }
}
/* Remark */

.addOpt-remark {

	display: flex;

	align-items: center;

	gap: 8px;

	margin-top: 10px;

	font-size: 13px;

}

.addOpt-remark-input {

	flex: 1;

	max-width: 500px;

	border: 1px solid #ddd;

	border-radius: 5px;

	padding: 4px 8px;

	font-size: 13px;

	background: #fff;

}

/* Bottom tables (original + auto) */

.addOpt-bottom-tables {

	display: block;

	gap: 20px;

	margin-top: 15px;

}

.addOpt-bottom-left {

	width: 45%;

	flex-shrink: 0;

}

.addOpt-bottom-right {

	flex: 1;

}

.addOpt-sub-table {

	min-width: auto;

	width: 100%;

}

/* Footer */

.addOpt-footer {

	display: flex;

	justify-content: center;

	gap: 12px;

	padding: 12px 20px;

	border-top: 1px solid #f0f0f0;

}

.addOpt-btn {

	padding: 8px 24px;

	border-radius: 8px;

	font-size: 14px;

	cursor: pointer;

	border: 1px solid #ddd;

	background: #fff;

	color: #555;

	text-align: center;

}

.addOpt-btn-primary {

	background: linear-gradient(135deg, #6B73FF 0%, #A78BFA 100%);

	color: #fff;

	border-color: #6B73FF;

}


/* ========== OptInput Preset Value Picker styles ========== */
/* 验光预选值弹窗 - 原版样式 */

/* Loading spinner */
.am-loading-spinner {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 0;
}
.am-loading-spinner .spinner {
	width: 32px;
	height: 32px;
	border: 3px solid rgba(107, 115, 255, 0.15);
	border-top-color: #6B73FF;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
	margin-bottom: 12px;
}
.am-loading-spinner .am-loading-text {
	font-size: 13px;
	color: #94a3b8;
}
@keyframes spin {
	to { transform: rotate(360deg); }
}

/* Gender buttons - matching original el-radio-button style */
.CAC_genderBtn {
	display: inline-flex !important;
	align-items: center !important;
	gap: 4px !important;
	padding: 8px 20px !important;
	border: 1px solid #dcdfe6 !important;
	border-radius: 4px !important;
	cursor: pointer !important;
	font-size: 14px !important;
	transition: all 0.2s !important;
	background: #fff !important;
	color: #606266 !important;
}
.CAC_genderBtn:first-child {
	border-radius: 4px 0 0 4px !important;
	margin-right: -1px !important;
	z-index: 0;
}
.CAC_genderBtn:last-child {
	border-radius: 0 4px 4px 0 !important;
	z-index: 0;
}
.CAC_genderBtn.active {
	z-index: 1 !important;
}
.CAC_genderBtn.active.CAC_genderBtn-male {
	background: #ecf5ff !important;
	border-color: #3B82F6 !important;
	color: #3B82F6 !important;
}
.CAC_genderBtn.active.CAC_genderBtn-female {
	background: #fdf2f8 !important;
	border-color: #EC4899 !important;
	color: #EC4899 !important;
}
.gender-icon-male {
	color: #3B82F6;
	font-size: 14px;
}
.gender-icon-female {
	color: #EC4899;
	font-size: 14px;
}
.CAC_genderBtn:last-child.active {
	border-left-color: inherit !important;
}

/* Device card enhancements */
.device-card-icon {
	font-size: 20px;
	flex-shrink: 0;
}
.device-card.active {
	border-color: #6366f1 !important;
	background: #f5f3ff !important;
}
.device-card-check {
	color: #6366f1;
	font-size: 16px;
	font-weight: normal;
	margin-left: auto;
	flex-shrink: 0;
}

.modal-footer {
	display: flex;
	justify-content: center;
	padding-top: 16px;
	margin-top: 12px;
}

/* Override modal for device popup to match original */
.modal.device-modal {
	background: white;
	border-radius: 16px;
	padding: 36px;
	max-width: 480px;
	width: 90vw;
	position: relative;
	box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

/* ModalView-style header (purple gradient) - matching original */
.MV_header {
	background: linear-gradient(135deg, #6b73ff, #a78bfa);
	color: #fff;
	padding: 16px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 14px 14px 0 0;
}
.MV_title {
	font-size: 18px;
	font-weight: 600;
	color: #fff;
}
.MV_close {
	width: 30px;
	height: 30px;
	background: rgba(255,255,255,0.2);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.MV_close:active {
	background: rgba(255,255,255,0.3);
}

/* Medium modal (800px like original addAiMeasure width="800") */
.aam-modal-md {
	width: 880px;
	max-width: 95vw;
}

/* Fix AAM_row to match original padding */
.AAM_row {

	display: flex;

	align-items: flex-start;

	padding: 10px 0;

	border-bottom: none;

}
.AAM_tip {

	min-width: 90px;

	text-align: right;

	color: #666;

	font-size: 13px;

	line-height: 32px;

	flex-shrink: 0;

	margin-right: 8px;

}

/* Fix cartCmdName_ul width to match original 400px */
.cartCmdName_ul {

	width: 300px;

	background: #fff;

	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

	border-radius: 8px;

	border: 1px solid #e2e8f0;

	position: absolute;

	top: 36px;

	left: 0;

	z-index: 10;

	max-height: 200px;

	overflow-y: auto;

}


/* 验光详情 - matching original .AAM_ul li .item style */






.selectYg-toolbar ::v-deep uni-text:nth-child(3) { min-width: 150px; }
.selectYg-toolbar ::v-deep uni-text:nth-child(4) { min-width: 200px; }
.selectYg-toolbar ::v-deep uni-text:nth-child(5) { min-width: 80px; }

/* 验光详情项样式穿透 */
.AAM_ygRow_item ::v-deep uni-text,
.AAM_ygRow_item ::v-deep uni-text span {
	background: rgba(107, 115, 255, 0.05);
	padding: 3px 10px;
	border-radius: 6px;
	font-size: 12px;
	color: #5A6C7D;
	display: inline-block;
}

/* ========== 选择验光弹窗 - 匹配原项目 ========== */
.selectYg-modal {
	width: 1000px;
	max-width: 95vw;
}
.selectYg-body {
	background: #f9f8f8;
	padding: 20px;
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.selectYg-scroll {
	flex: 1;
	max-height: 55vh;
}
.AAM_ul_li {
	background: rgba(255, 255, 255, 0.6);
	border: 1px solid rgba(107, 115, 255, 0.1);
	border-radius: 10px;
	padding: 12px;
	margin-bottom: 8px;
	cursor: pointer;
	transition: all 0.3s ease;
}
.AAM_ul_li:active {
	background: rgba(107, 115, 255, 0.05);
	border-color: rgba(107, 115, 255, 0.2);
}
.AAM_ul_item {
	display: inline-block;
}
.AAM_ul_item ::v-deep uni-text,
.AAM_ul_item ::v-deep uni-text span {
	background: rgba(107, 115, 255, 0.05);
	padding: 3px 5px;
	border-radius: 6px;
	font-size: 12px;
	color: #5A6C7D;
}

.ai-tag-bound {
	background: rgba(34, 197, 94, 0.1) !important;
	color: #16a34a !important;
	padding: 3px 8px;
	border-radius: 6px;
	font-size: 12px;
}
.ai-tag-unbound {
	background: rgba(239, 68, 68, 0.1) !important;
	color: #dc2626 !important;
	padding: 3px 8px;
	border-radius: 6px;
	font-size: 12px;
}

.ai-tag-bound {
	background: rgba(34, 197, 94, 0.1) !important;
	color: #16a34a !important;
	padding: 3px 8px;
	border-radius: 6px;
	font-size: 12px;
}
.ai-tag-unbound {
	background: rgba(239, 68, 68, 0.1) !important;
	color: #dc2626 !important;
	padding: 3px 8px;
	border-radius: 6px;
	font-size: 12px;
}

.ai-tag-bound {
	background: rgba(34, 197, 94, 0.1) !important;
	color: #16a34a !important;
	padding: 3px 8px;
	border-radius: 6px;
	font-size: 12px;
}
.ai-tag-unbound {
	background: rgba(239, 68, 68, 0.1) !important;
	color: #dc2626 !important;
	padding: 3px 8px;
	border-radius: 6px;
	font-size: 12px;
}

.AAM_ul_item[style*="350px"] ::v-deep uni-text span {
	word-break: break-all;
	white-space: normal;
	line-height: 1.4;
}

.AAM_ul_li:hover {
	background: rgba(107, 115, 255, 0.05);
	border-color: rgba(107, 115, 255, 0.2);
	transform: translateX(3px);
}

/* 验光详情卡片 - 跟选择验光列表同样式 */
.AAM_ygRow {
	background: rgba(255, 255, 255, 0.6);
	border: 1px solid rgba(107, 115, 255, 0.1);
	border-radius: 10px;
	padding: 12px;
	margin-bottom: 8px;
}
.AAM_ygRow_item {
	display: inline-block;
	margin-bottom: 4px;
}

/* AvatarName 客户选择器 - 匹配原项目 */
.AN_wrap {
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	vertical-align: middle;
}
.AN_avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 4px;
	flex-shrink: 0;
}
.AN_name {
	padding: 4px 15px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	font-size: 13px;
	color: #606266;
	background: #fff;
	line-height: 24px;
}
.AN_name:active {
	border-color: #6366f1;
	color: #6366f1;
}

/* 客户搜索/新增客户弹窗 z-index 高于新增测量弹窗 */
.modal-overlay {
	z-index: 3000 !important;
}

/* ========== 员工码弹窗 - 匹配原项目 ========== */
.empCode-modal {
	max-width: 500px;
	width: 90vw;
	padding: 0;
	border-radius: 12px;
	overflow: hidden;
}
.empCode-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 20px;
	background: #f1f1f1;
}
.empCode-title {
	font-size: 16px;
	color: #333;
}
.empCode-body {
	background: #f1f1f1;
	text-align: center;
	padding: 20px 30px 30px;
}
.empCode-img {
	width: 300px;
	height: 300px;
	margin: 0 auto;
	background: #fff;
	border-radius: 8px;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
.empCode-name {
	display: block;
	font-size: 18px;
	font-weight: bold;
	margin-top: 20px;
	margin-bottom: 30px;
	color: #333;
}
.empCode-tabs {
	display: flex;
	justify-content: center;
}

/* ========== 员工码弹窗 - 匹配原项目 ========== */
.empCode-modal {
	max-width: 500px;
	width: 90vw;
	padding: 0;
	border-radius: 12px;
	overflow: hidden;
}
.empCode-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 20px;
	background: #f1f1f1;
}
.empCode-title {
	font-size: 16px;
	color: #333;
}
.empCode-body {
	background: #f1f1f1;
	text-align: center;
	padding: 20px 30px 30px;
}
.empCode-img {
	width: 300px;
	height: 300px;
	margin: 0 auto;
	background: #fff;
	border-radius: 8px;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
.empCode-name {
	display: block;
	font-size: 18px;
	font-weight: bold;
	margin-top: 20px;
	margin-bottom: 30px;
	color: #333;
}
.empCode-tabs {
	display: flex;
	justify-content: center;
}

/* topbar store hover */
.db-topbar-store:active {
	background: rgba(99,102,241,0.06);
}
.db-topbar-unit {
	display: flex !important;
	align-items: center !important;
}

/* topbar store hover */
.db-topbar-store:active {
	background: rgba(99,102,241,0.06);
}
.db-topbar-unit {
	display: flex !important;
	align-items: center !important;
}

/* ===== Restored topbar CSS ===== */

.db-topbar {

	display: flex;

	align-items: center;

	justify-content: space-between;

	padding: 0 24px;

	height: 56px;

	background: white;

	border-bottom: 1px solid #E2E8F0;

	position: sticky;

	top: 0;

	z-index: 100;

}

.db-topbar-left {

	display: flex;

	align-items: center;

	gap: 12px;

}

.db-topbar-right {

	display: flex;

	align-items: center;

	gap: 12px;

}

.db-topbar-title {

	font-size: 18px;

	font-weight: 700;

	color: #1E293B;

}

.db-topbar-menu {

	width: 36px;

	height: 36px;

	display: flex;

	align-items: center;

	justify-content: center;

	border-radius: 8px;

	cursor: pointer;

	color: #64748B;

	&:active { background: #F1F5F9; }

}

.db-topbar-store {

	cursor: pointer;

	padding: 6px 12px;

	border-radius: 8px;

	transition: all 0.15s;

	&:active { background: #F8FAFC; }

}

.db-topbar-store-info {

	display: flex;

	flex-direction: column;

	align-items: flex-end;

}

.db-topbar-company {

	font-size: 12px;

	color: #64748B;

}

.db-topbar-lang {

	display: flex;

	gap: 2px;

	padding: 3px;

	background: #F1F5F9;

	border-radius: 8px;

}

.db-topbar-lang-btn {

	padding: 4px 10px;

	font-size: 12px;

	font-weight: 600;

	border-radius: 6px;

	color: #64748B;

	cursor: pointer;

	transition: all 0.15s;

	&.active {

		background: white;

		color: #6366F1;

		box-shadow: 0 1px 2px rgba(0,0,0,0.05);

	}

}

.db-topbar-logout-btn {

	width: 36px;

	height: 36px;

	border-radius: 8px;

	display: flex;

	align-items: center;

	justify-content: center;

	cursor: pointer;

	color: #94A3B8;

	transition: all 0.15s;

	&:active {

		background: #F1F5F9;

		color: #EF4444;

	}

}


/* ========== 门店选择弹窗 - 完全匹配原项目 ========== */
.sp-modal {
	background: white;
	border-radius: 16px;
	padding: 0;
	max-width: 480px;
	width: 92vw;
	max-height: 80vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
}
.sp-header {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 28px 24px 12px;
}
.sp-header-icon {
	color: #fff;
	background: linear-gradient(135deg, #6366f1, #818cf8);
	border-radius: 12px;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 42px;
	height: 42px;
	display: flex;
}
.sp-title {
	font-size: 18px;
	font-weight: 700;
	color: #1e293b;
	display: block;
}
.sp-subtitle {
	font-size: 13px;
	color: #94a3b8;
	display: block;
	margin-top: 2px;
}
.sp-current-tip {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 10px 24px;
	font-size: 13px;
	color: #64748b;
	background: #f8fafc;
	border-top: 1px solid #f1f5f9;
	border-bottom: 1px solid #f1f5f9;
}
.sp-current-dot {
	color: #22c55e;
	font-size: 10px;
}
.sp-list {
	flex: 1;
	overflow-y: auto;
	padding: 12px 16px 16px;
	max-height: 50vh;
}
.sp-card {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	border: 1px solid #e2e8f0;
	border-radius: 10px;
	margin-bottom: 8px;
	cursor: pointer;
	transition: all 0.15s;
}
.sp-card:active {
	border-color: #c7d2fe;
	background: #fafafa;
}
.sp-card.active {
	border-color: #6366f1;
	background: #eef2ff;
}
.sp-card-icon {
	color: #64748b;
	background: #f1f5f9;
	border-radius: 10px;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 38px;
	height: 38px;
	transition: all 0.15s;
	display: flex;
}
.sp-card.active .sp-card-icon {
	color: #6366f1;
}
.sp-card-info {
	flex: 1;
	min-width: 0;
}
.sp-card-name {
	font-size: 14px;
	font-weight: 500;
	color: #1e293b;
	display: block;
}
.sp-card-meta {
	margin-top: 4px;
}
.sp-badge {
	font-size: 11px;
	padding: 1px 8px;
	border-radius: 4px;
	display: inline-block;
}
.sp-badge.franchise {
	background: #f1f5f9;
	color: #64748b;
}
.sp-badge.direct {
	background: #eef2ff;
	color: #6366f1;
}
.sp-card-check {
	flex-shrink: 0;
	color: #6366f1;
}
.sp-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px 0;
	color: #94a3b8;
	font-size: 13px;
}
.sp-card.active .sp-card-icon {
	color: #fff;
	background: #6366f1;
}
.db-topbar-unit {
	color: #1e293b;
	white-space: nowrap;
	text-overflow: ellipsis;
	align-items: center;
	max-width: 120px;
	font-size: 13px;
	font-weight: 500;
	line-height: 1.3;
	display: flex;
	overflow: hidden;
}

/* 绑单badge */
.am-bound-badge {
	position: absolute;
	top: 8px;
	right: 8px;
	background: #6366f1;
	color: #fff;
	font-size: 11px;
	padding: 2px 8px;
	border-radius: 4px;
	z-index: 1;
}
.am-card-frame {
	font-size: 12px;
	color: #94a3b8;
	margin-top: 4px;
}
.am-card-meta-item {
	display: inline-flex !important;
	align-items: center !important;
	gap: 3px !important;
}

/* ========== 测量详情弹窗 - 完全匹配原项目 ========== */
.am-detail-body { display: flex; min-height: 300px; }
.am-detail-left { width: 280px; flex-shrink: 0; padding: 20px; background: #F8FAFC; }
.am-detail-right { flex: 1; padding: 20px; }
.am-detail-img-wrap { margin-bottom: 12px; position: relative; }
.am-detail-img-wrap image { width: 100%; border-radius: 8px; }
.am-detail-client { margin-bottom: 16px; }
.am-detail-client-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.am-detail-client-name { font-size: 18px; font-weight: 700; color: #1e293b; }
.am-detail-client-meta { display: flex; gap: 16px; font-size: 13px; color: #64748b; }
.am-detail-client-meta-item { display: flex; align-items: center; gap: 4px; }
.am-detail-section { margin-bottom: 16px; }
.am-detail-section-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
.am-param-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.am-param-cell { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #F8FAFC; border-radius: 8px; }
.am-param-label { font-size: 12px; color: #64748b; }
.am-param-value { font-size: 16px; font-weight: 700; color: #1e293b; }
.am-param-unit { font-size: 11px; color: #94a3b8; font-weight: 400; margin-left: 2px; }
.am-detail-footer { display: flex; gap: 8px; justify-content: flex-end; padding: 12px 20px; border-top: 1px solid #f0f0f0; }
@media (max-width: 767px) {
  .am-detail-body { flex-direction: column; }
  .am-detail-left { width: 100%; }
}

.aam-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.45);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* ===== Restored missing CSS ===== */
.aam-modal {

	background: #fff;

	border-radius: 14px;

	width: 880px;

	max-width: 95vw;

	max-height: 85vh;

	display: flex;

	flex-direction: column;

	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

	overflow: hidden;

}
.aam-header {

	display: flex;

	align-items: center;

	justify-content: space-between;

	padding: 14px 20px;

	border-bottom: 1px solid #f0f0f0;

}
.aam-title {

	font-size: 16px;

	font-weight: 600;

	color: #1e293b;

}
.aam-close {

	font-size: 18px;

	color: #94a3b8;

	padding: 4px 8px;

	cursor: pointer;

}
.aam-body {

	flex: 1;

	overflow-y: auto;

	max-height: 60vh;

}
.aam-footer {

	display: flex;

	justify-content: center;

	gap: 12px;

	padding: 12px 20px;

	border-top: 1px solid #f0f0f0;

}
.aam-input-sm {

	width: 80px;

	height: 30px;

	line-height: 30px;

	border: 1px solid #e2e8f0;

	border-radius: 6px;

	padding: 0 8px;

	font-size: 13px;

	text-align: center;

	background: #fff;

}
.aam-input-lg {

	width: 300px;

	height: 32px;

	line-height: 32px;

	border: 1px solid #e2e8f0;

	border-radius: 6px;

	padding: 0 10px;

	font-size: 13px;

	background: #fff;

}
.add-client-modal {

	max-width: 880px;

	width: 94%;

	overflow: hidden;

	padding: 0;

	position: relative;

	max-height: 90vh;

	display: flex;

	flex-direction: column;

}
.add-client-body {

	padding: 20px 24px;

	flex: 1;

	overflow-y: auto;

	overflow-x: hidden;

	max-height: 65vh;

	box-sizing: border-box;

}
.add-client-footer {

	display: flex;

	justify-content: center;

	gap: 10px;

	padding: 16px 24px;

	border-top: 1px solid #e2e8f0;

}
.addAiMeasureCon {

	padding: 12px 20px;

}
.AAM_info {

	flex: 1;

	display: flex;

	flex-wrap: wrap;

	align-items: center;

	gap: 8px;

	line-height: 32px;

}
.AAM_link {

	color: #6366f1;

	font-size: 13px;

	padding: 2px 6px;

	margin-left: 8px;

}
.AAM_sceneTip {

	font-size: 12px;

	color: #999;

	margin-left: 10px;

}
.CAC_row {

	display: flex;

	flex-wrap: wrap;

	gap: 10px;

}
.CAC_item {

	display: inline-flex;

	align-items: center;

	width: 32%;

	min-width: 0;

	box-sizing: border-box;

	overflow: hidden;

}
.CAC_item_full {

	width: 100% !important;

	align-items: flex-start;

}
.CAC_tip {

	display: inline-block;

	min-width: 65px;

	text-align: right;

	font-size: 13px;

	color: #374151;

	flex-shrink: 0;

	margin-right: 6px;

}
.CAC_input {

	flex: 1;

	min-width: 0;

	padding: 0 12px;

	height: 34px;

	line-height: 34px;

	border: 1px solid #e2e8f0;

	border-radius: 8px;

	font-size: 14px;

	color: #374151;

	outline: none;

	background: transparent;

	box-sizing: border-box;

}
.CAC_genderRow {
	display: flex;
	gap: 0;
}
.CAC_textarea {

	flex: 1;

	min-width: 0;

	padding: 8px 12px;

	border: 1px solid #e2e8f0;

	border-radius: 8px;

	font-size: 14px;

	color: #374151;

	outline: none;

	background: #fbfbfb;

	min-height: 100px;

	resize: none;

	box-sizing: border-box;

	width: 100%;

}
.CAC_divider {

	border-top: 2px dashed #ddd;

	margin: 15px 0 10px;

}
.CSU_upCon {

	background: #fff;

	border-bottom: 1px solid #e2e8f0;

	padding: 12px 24px;

}
.CSU_searchRow {

	display: flex;

	align-items: center;

	gap: 8px;

}
.CSU_searchInputWrap {

	flex: 1;

	display: flex;

	align-items: center;

	gap: 8px;

	padding: 0 12px;

	border: 1px solid #e2e8f0;

	border-radius: 8px;

	height: 36px;

	background: #fff;

}
.CSU_searchInput {

	flex: 1;

	border: none;

	outline: none;

	font-size: 14px;

	color: #374151;

	background: transparent;

	height: 36px;

}
.CSU_avatar {

	position: relative;

	flex-shrink: 0;

	width: 50px;

	height: 50px;

	border-radius: 50%;

}
.CSU_avatar_img {

	width: 50px;

	height: 50px;

	border-radius: 50%;

}
.CSU_avatar_name {

	width: 50px;

	height: 50px;

	border-radius: 50%;

	display: flex;

	align-items: center;

	justify-content: center;

	background: linear-gradient(135deg, #6B73FF 0%, #A78BFA 100%);

	color: white;

	font-size: 20px;

	font-weight: 600;

}
.CSU_info { flex: 1; }
.CSU_info_row1 {

	display: flex;

	align-items: center;

	gap: 8px;

	margin-bottom: 6px;

}
.CSU_info_row2 {

	display: flex;

	align-items: center;

	gap: 16px;

	font-size: 13px;

	color: #64748b;

}
.client-search-modal {

	max-width: 600px;

	width: 94%;

	padding: 0;

	position: relative;

	max-height: 85vh;

	display: flex;

	flex-direction: column;

	overflow: hidden;

}
.clientSearchCon {

	padding: 0 20px;

	flex: 1;

	overflow-y: auto;

	overflow-x: hidden;

	max-height: 55vh;

	box-sizing: border-box;

	width: 100%;

}
.clientSearchLi {

	display: flex;

	align-items: center;

	gap: 15px;

	padding: 15px;

	border: 1px solid #E2E8F0;

	border-radius: 10px;

	margin-bottom: 10px;

	cursor: pointer;

	transition: all 0.3s ease;

	background: white;

}
.clientSearchUl {

	padding: 10px 0;

}
.customer_name {

	font-size: 15px;

	font-weight: 600;

	color: #2C3E50;

}
.customer_age {

	font-size: 13px;

	color: #64748B;

	background: #F1F5F9;

	padding: 2px 8px;

	border-radius: 12px;

}
.customer_editBtn {

	padding: 4px 15px;

	color: #6b58ff;

	background: transparent;
	border: 1px solid #e2e8f0;

	border-radius: 100px;

	font-size: 12px;

	cursor: pointer;

	transition: all 0.2s ease;

	margin-left: auto;

}
.customer_level {

	font-size: 12px;

	padding: 2px 10px;

	border-radius: 12px;

	display: inline-flex;

	align-items: center;

	gap: 4px;

}
.level_vip {

	background: #FEF3C7;

	color: #D97706;

}
.gender_icon {

	position: absolute;

	bottom: -2px;

	right: -2px;

	width: 20px;

	height: 20px;

	border-radius: 50%;

	display: flex;

	align-items: center;

	justify-content: center;

	font-size: 10px;

	border: 2px solid white;

}
.gender_male { background: #3B82F6; color: white; }
.gender_female { background: #EC4899; color: white; }
.info_item {

	margin-right: 10px;

	font-size: 13px;

	color: #64748b;

}
.composeBoxCss {

	display: inline-flex;

	background: rgba(255, 255, 255, 0.6);

	border-radius: 18px;

	padding: 2px;

	backdrop-filter: blur(10px);

	border: 1px solid rgba(107, 115, 255, 0.1);

	vertical-align: middle;

}
.mustCss {

	color: #EF4444;

	margin-right: 2px;

}
.am-filter-date .has-value {

	color: #1e293b;

}
.cartCmdName_con {

	display: inline-block;

	position: relative;

}
.cartCmdName_li {

	padding: 8px 12px;

	font-size: 13px;

	border-bottom: 1px solid #f8f8f8;

}
.am-btn-danger {

	background: #ef4444 !important;

	color: #fff !important;

	border-color: #ef4444 !important;

}
.am-btn-success {

	background: #10b981 !important;

	color: white !important;

	border-color: #10b981 !important;

}
.am-filter-date {

	padding: 6px 12px;

	border: 1px solid #e2e8f0;

	border-radius: 6px;

	font-size: 13px;

	color: #94a3b8;

	cursor: pointer;

	min-width: 90px;

	text-align: center;

	background: white;

	transition: all 0.15s;

}
.modal-overlay-top {

	z-index: 3000 !important;

}
.addOpt-overlay {

	position: fixed;

	top: 0; left: 0; right: 0; bottom: 0;

	background: rgba(0, 0, 0, 0.5);

	z-index: 4000;

	display: flex;

	align-items: center;

	justify-content: center;

}
.addOpt-modal {

	background: #fff;

	border-radius: 14px;

	width: 900px;

	max-width: 96vw;

	max-height: 90vh;

	display: flex;

	flex-direction: column;

	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

	overflow: hidden;

}
.addOpt-header {

	display: flex;

	align-items: center;

	justify-content: space-between;

	padding: 14px 20px;

	background: linear-gradient(135deg, #6b73ff, #a78bfa);

	color: #fff;

}
.addOpt-title {

	font-size: 16px;

	font-weight: 600;

	color: #fff;

}
.addOpt-close {

	font-size: 18px;

	color: rgba(255,255,255,0.8);

	padding: 4px 10px;

	cursor: pointer;

}
.addOpt-body {

	flex: 1;

	padding: 10px 20px 20px;

	overflow-y: auto;

	max-height: 60vh;

}
.addOpt-topbar {

	padding: 10px 20px;

	border-bottom: 1px solid #f0f0f0;

	background: #fafbfc;

}
.addOpt-topbar-row {

	display: flex;

	align-items: center;

	flex-wrap: wrap;

	gap: 8px;

}
.addOpt-emp-chip, .addOpt-date-chip {

	background: #fff;

	border: 1px solid #e0e0e0;

	border-radius: 6px;

	padding: 4px 12px;

	font-size: 13px;

	color: #333;

	cursor: pointer;

}
.addOpt-client-box {

	margin-left: auto;

	background: transparent;
	border: 1px solid #e2e8f0;

	padding: 3px 10px;

	border-radius: 5px;

	font-size: 13px;

	display: flex;

	align-items: center;

	gap: 4px;

}
.addOpt-typeTabs {

	display: flex;

	flex-wrap: wrap;

	gap: 4px;

	margin-bottom: 10px;

}
.addOpt-typeTab {

	display: inline-block;

	padding: 5px 12px;

	border-radius: 4px;

	border: 1px solid #ddd;

	background: #fff;

	font-size: 13px;

	color: #555;

	cursor: pointer;

	transition: all 0.2s;

}
.addOpt-typeTab-small {

	font-size: 11px;

	padding: 3px 6px;

}
.addOpt-label {

	font-size: 13px;

	color: #555;

	line-height: 32px;

}
.addOpt-recordUl {

	display: flex;

	flex-wrap: wrap;

	gap: 4px;

	margin-bottom: 10px;

	align-items: center;

}
.addOpt-recordLi {

	padding: 2px 12px;

	border-radius: 100px;

	color: #909090;

	background: transparent;
	border: 1px solid #e2e8f0;

	cursor: pointer;

	font-size: 13px;

}
.addOpt-recordFont {

	font-size: 13px;

	color: #555;

	margin-right: 4px;

}
.addOpt-recordAdd {

	color: #2196f3;

}
.addOpt-recordDel {

	color: #e53935;

}
.am-detail-img-label {

	position: absolute;

	bottom: 6px;

	left: 6px;

	background: rgba(0, 0, 0, 0.5);

	color: white;

	font-size: 11px;

	padding: 2px 6px;

	border-radius: 4px;

}
.btn-cs {

	padding: 8px 16px;

	border-radius: 8px;

	font-size: 13px;

	font-weight: 500;

	cursor: pointer;

	white-space: nowrap;

	display: flex;

	align-items: center;

}
.btn-cs-primary {

	background: #6366f1;

	color: white;

}
.btn-cs-success {

	background: #10b981;

	color: white;

}
.meta-icon {

	font-size: 12px;

	margin-right: 3px;

	filter: grayscale(1) opacity(0.5);

}


/* composeBoxCss 子元素样式 */
.composeBoxCss > text {
	background: transparent;
	border: none;
	color: #999;
	padding: 5px 15px;
	border-radius: 16px;
	font-size: 13px;
	font-weight: 500;
	transition: all 0.3s ease;
	cursor: pointer;
}
.composeBoxCss > text.active {
	background: linear-gradient(135deg, #6B73FF 0%, #A78BFA 100%);
	color: #ffffff;
	box-shadow: 0 2px 8px 0 rgba(107, 115, 255, 0.2);
}
.composeBoxCss ::v-deep uni-text {
	background: transparent;
	border: none;
	color: #999;
	padding: 5px 15px;
	border-radius: 16px;
	font-size: 13px;
	font-weight: 500;
	transition: all 0.3s ease;
	cursor: pointer;
}
.composeBoxCss ::v-deep uni-text.active,
.composeBoxCss ::v-deep uni-text.active span {
	background: linear-gradient(135deg, #6B73FF 0%, #A78BFA 100%);
	color: #ffffff !important;
	box-shadow: 0 2px 8px 0 rgba(107, 115, 255, 0.2);
}

/* uni-datetime-picker 内边距 */
.am-filter-group ::v-deep .uni-date-x {
	padding: 0 10px;
}

.AAM_ul_row1 {
	display: flex;
	flex-wrap: wrap;
	gap: 2px;
	margin-bottom: 6px;
}
.AAM_ul_row2 {
	display: flex;
}

.AAM_ul_row1 {
	justify-content: flex-start;
}
.AAM_ul_row1 .AAM_ul_item:last-child {
	margin-left: auto;
}

/* ========== 新增验光弹窗 - 匹配原项目 ========== */
.addOpt-overlay {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 4000;
	display: flex;
	align-items: center;
	justify-content: center;
}
.addOpt-modal {
	background: #fff;
	border-radius: 14px;
	width: 1010px;
	max-width: 96vw;
	max-height: 90vh;
	display: flex;
	flex-direction: column;
	box-shadow: 0 20px 60px rgba(0,0,0,0.15);
	overflow: hidden;
}
.addOpt-topbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 20px;
	border-bottom: 1px solid #f0f0f0;
	background: #fff;
	flex-shrink: 0;
}
.addOpt-topbar-left {
	display: flex;
	align-items: center;
	gap: 6px;
}
.addOpt-topbar-right {
	display: flex;
	align-items: center;
}
.addOpt-avatar {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	flex-shrink: 0;
}
.addOpt-emp-name {
	padding: 2px 12px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	font-size: 13px;
	color: #606266;
	background: #fff;
}
.addOpt-label {
	font-size: 13px;
	color: #606266;
	line-height: 32px;
}
.addOpt-date-chip {
	padding: 4px 12px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	font-size: 13px;
	color: #606266;
	background: #fff;
	cursor: pointer;
}
.addOpt-client-box {
	background: transparent;
	padding: 3px 10px;
	border-radius: 5px;
	font-size: 13px;
	line-height: 28px;
	color: #666;
}
.addOpt-body {
	flex: 1;
	overflow-y: auto;
	overflow-x: auto;
	max-height: calc(90vh - 180px);
	width: 100%;
	box-sizing: border-box;
}
.addOptCon {
	padding: 5px 20px 20px;
	color: #000;
}
.addOpt-type-row {
	margin-bottom: 10px;
}
.addOpt-record-section {
	margin-bottom: 5px;
}
/* 记录列表 - 匹配原项目 */
.AOUO_recordUl {
	overflow: hidden;
	margin-bottom: 5px;
}
.AOUO_li_font {
	float: left;
	padding: 0;
	margin: 5px 3px 3px 0;
	font-size: 13px;
	user-select: none;
}
.AOUO_recordLi {
	float: left;
	padding: 0 12px;
	margin: 5px 3px 3px 0;
	border-radius: 100px;
	color: #909090;
	background: #f1f1f1;
	cursor: pointer;
	user-select: none;
	font-size: 13px;
}
.AOUO_recordLi:active {
	color: #fff;
	background: #a1a1a1;
}
.AOUO_recordLi.active {
	color: #fff;
	background: #4cae4c;
}
/* 闪动动画 */
.flashCss {
	animation: flashAnim 1s ease infinite;
}
@keyframes flashAnim {
	0% { border-color: #fd7634 !important; }
	100% { border-color: #ddd !important; }
}
/* 原镜+电脑验光 并排 */
.addOpt-bottom-tables {
	display: flex;
	gap: 20px;
	margin-top: 15px;
}
.addOpt-bottom-left {
	width: 45%;
}
.addOpt-bottom-right {
	flex: 1;
}
/* 备注 */
.addOpt-remark {
	margin-top: 15px;
	display: flex;
	align-items: center;
	gap: 8px;
}
.addOpt-remark-input {
	flex: 1;
	max-width: 500px;
	height: 32px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	padding: 0 10px;
	font-size: 13px;
}
/* 底部按钮 */
.addOpt-footer {
	display: flex;
	gap: 8px;
	justify-content: center;
	padding: 12px 20px;
	border-top: 1px solid #f0f0f0;
	flex-shrink: 0;
}
@media (max-width: 767px) {
	.addOpt-bottom-tables { flex-direction: column; }
	.addOpt-bottom-left { width: 100%; }
	.addOpt-topbar { flex-direction: column; gap: 8px; }
}

/* R/L label row - no input border */

.AOUO_box {
	background: transparent;
	display: inline-block;
	border-radius: 5px;
	padding: 3px 5px 5px 5px;
}

/* 验光输入框 - 匹配原项目 el-input */






/* label列的R/L文字不需要input样式 */
/* input样式 - 去掉外层边框，只给最内层input加 */



/* label列的R/L文字不需要input样式 */
/* input样式 - 去掉外层边框，只给最内层input加 */



/* ========== 验光数据表 ========== */
.optRecordBar {
	margin-top: 10px;
	display: inline-flex;
}
.optRecordBar-li {
	display: inline-block;
	width: 60px;
	text-align: center;
	box-sizing: border-box;
	padding: 0 3px;
}
.optRecordBar-li-label {
	width: 50px;
	padding-left: 0;
}
.optRecordBar-cell {
	position: relative;
	padding: 2px 0;
	font-size: 13px;
}
.optRecordBar-header {
	font-size: 12px;
	color: #333;
	min-height: 18px;
}
.optRecordBar-sub {
	line-height: 10px;
	min-height: 16px;
	font-size: 12px;
	color: #999;
}
.optRecordBar-sub.red text {
	color: #ef4444;
}
.optRecordBar-val {
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
}
/* label列的R/L文字不需要input样式 */
.optRecordBar-li-label .optRecordBar-val text {
	border: none;
	background: transparent;
	font-weight: normal;
	color: #333;
}
/* input样式 - 去掉外层边框，只给最内层input加 */
.optRecordBar-input {
	border: none !important;
	background: transparent !important;
	width: 100% !important;
	height: 100% !important;
	padding: 0 !important;
}
.optRecordBar-val ::v-deep uni-input {
	border: none !important;
	background: transparent !important;
	width: 54px !important;
	height: 25px !important;
}
.optRecordBar-val ::v-deep .uni-input-wrapper {
	border: none !important;
	background: transparent !important;
	width: 100% !important;
	height: 100% !important;
}
.optRecordBar-val ::v-deep .uni-input-input {
	border: 1px solid #d0d7de !important;
	border-radius: 4px !important;
	background: #fff !important;
	text-align: center !important;
	font-size: 13px !important;
	height: 23px !important;
	width: 52px !important;
	box-sizing: border-box !important;
	padding: 0 2px !important;
}



/* ========== 验光预选值弹窗 - 匹配原项目 ========== */
.ygSetBox {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0);
	z-index: 9999;
	overflow: auto;
}
.ygSetInfo {
	position: absolute;
	border-radius: 5px;
}
.ygSetTj {
	text-align: center;
	padding: 5px 5px;
	border: 1px solid #09f;
	box-sizing: border-box;
	margin-left: -1px;
	background: #fff;
}
.ygSetTj-span {
	display: inline-block;
	color: #fff;
	padding: 4px 10px;
	background: #795548;
	font-size: 12px;
	border-radius: 5px;
	cursor: pointer;
	margin: 0 5px;
}
.ygSetTj-font {
	display: inline-block;
	width: 35px;
	box-sizing: border-box;
	text-align: center;
	color: #000;
	padding: 4px 10px;
	background: #f0f0f0;
	font-size: 12px;
	border-radius: 5px;
	cursor: pointer;
	margin: 0 5px;
}
.ygSetTj-font.active {
	color: #fff;
	background: #4caf50;
}
.ygSetUl {
	background: #fff;
	margin-bottom: 20px;
	display: flex;
}
.ygSetUl-li {
	width: 70px;
	margin-right: -1px;
}
.ygSetUl-td {
	display: block;
	width: 70px;
	height: 25px;
	line-height: 25px;
	font-size: 12px;
	text-align: center;
	border: 1px solid #09f;
	border-bottom: 0;
	border-right: 0;
	cursor: pointer;
	margin: -1px 0 0 -1px;
	box-sizing: border-box;
}
.ygSetUl-li:last-child .ygSetUl-td {
	border-right: 1px solid #09f;
}
.ygSetUl-li .ygSetUl-td:last-child {
	border-bottom: 1px solid #09f;
}
.ygSetUl.twoRow .ygSetUl-li,
.ygSetUl.twoRow .ygSetUl-td {
	width: 87px;
}
.oldValue {
	color: #a5a5a5;
}


/* disabled input 看起来正常 */
.optRecordBar-val ::v-deep .uni-input-input:disabled {
	color: #333 !important;
	-webkit-text-fill-color: #333 !important;
	opacity: 1 !important;
	background: #fff !important;
}


/* input不拦截点击，让父层view捕获 */
.optRecordBar-val uni-input {
	pointer-events: none;
}
</style>
