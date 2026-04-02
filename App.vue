<script>
export default {
	onLaunch() {
		console.log('App Launch')
	},
	onShow() {
		console.log('App Show')
	},
	onHide() {
		console.log('App Hide')
	}
}
</script>

<style>
page {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	-webkit-font-smoothing: antialiased;
	color: #1e293b;
	background: #f1f5f9;
}
view, text, image {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.uni-input-input {
	padding: 0 16px !important;
}

.uni-input-input {
	padding: 0 16px !important;
}

.device-card {
	margin-bottom: 8px !important;
}
.device-card-info {
	display: flex !important;
	flex-direction: column !important;
}

.aam-modal .composeBoxCss > text,
.aam-modal .aam-footer > .btn-cs {
	height: 29px !important;
	line-height: 29px !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.aam-modal .am-client-chip {
	height: auto !important;
	line-height: normal !important;
}

uni-toast, .uni-toast,
uni-modal, .uni-modal,
.uni-toast-mask, .uni-modal-mask,
uni-actionsheet, .uni-actionsheet {
	z-index: 99999 !important;
}
.uni-toast {
	z-index: 99999 !important;
}

.AAM_info {
	display: flex !important;
	flex-wrap: wrap !important;
	align-items: center !important;
	gap: 6px !important;
}
.AAM_link {
	white-space: nowrap !important;
	flex-shrink: 0 !important;
}

.opt-ms {
	min-height: 16px !important;
	line-height: 10px !important;
	font-size: 12px !important;
	color: #999 !important;
	margin-bottom: 4px !important;
}

.addOpt-modal .optRecordBar {
	display: block !important;
	overflow-x: auto !important;
	white-space: nowrap !important;
	margin-bottom: 15px !important;
}

.optRecordBar-li-header {
	width: auto !important;
	min-width: 20px !important;
	white-space: nowrap !important;
}



/* 验光表格 R/L 对齐修复 */
.optRecordBar-li,
.optRecordBar-li-header {
	vertical-align: top !important;
}
/* 每行固定高度，让 header 和 input 列对齐 */
.optRecordBar-li > view:nth-child(1) {
	height: 22px !important;
	line-height: 22px !important;
}
.optRecordBar-li > view:nth-child(2) {
	height: 16px !important;
	line-height: 16px !important;
}
.optRecordBar-li > view:nth-child(3),
.optRecordBar-li > view:nth-child(4) {
	height: 32px !important;
	line-height: 32px !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
}
/* input 单元格 */
.opt-input-cell {
	height: 32px !important;
	display: flex !important;
	align-items: center !important;
}
.opt-input-cell uni-input,
.opt-input-cell .uni-input-wrapper {
	height: 26px !important;
	line-height: 26px !important;
	width: 100% !important;
}
/* 上下 input 间距 */
.optRecordBar-li > view:nth-child(4) {
	margin-top: 4px !important;
}

/* 验光input铺满修复 */
.opt-input-cell uni-input {
	width: 100% !important;
	height: 100% !important;
	padding: 0 !important;
	margin: 0 !important;
}
.opt-input-cell .uni-input-wrapper {
	height: 100% !important;
	padding: 0 !important;
	margin: 0 !important;
}
.opt-input-cell .uni-input-input {
	height: 100% !important;
	padding: 2px 3px !important;
	margin: 0 !important;
	text-align: center !important;
	border: 1px solid #e2e8f0 !important;
	border-radius: 5px !important;
	box-sizing: border-box !important;
	background: #fff !important;
	width: 100% !important;
}
.opt-input-cell .uni-input-placeholder {
	display: none !important;
}


</style>
