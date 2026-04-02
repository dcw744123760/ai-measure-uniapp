<template>
	<view class="datepicker-overlay" v-if="visible" @click="$emit('close')">
		<view class="date-picker-modal" @click.stop>
			<!-- 头部 -->
			<view class="picker-header">
				<text>选择日期</text>
			</view>
			<!-- 主体：年 + 月 + 日历 -->
			<view class="picker-body">
				<!-- 年份列表 -->
				<view class="picker-column year-column">
					<view class="column-header"><text>年</text></view>
					<scroll-view scroll-y class="scroll-list" :scroll-into-view="'year_' + selectedYear">
						<view v-for="year in years" :key="year"
							:id="'year_' + year"
							class="scroll-item" :class="{ active: year === selectedYear }"
							@click="selectYear(year)">
							<text>{{ year }}</text>
						</view>
					</scroll-view>
				</view>
				<!-- 月份列表 -->
				<view class="picker-column month-column">
					<view class="column-header"><text>月</text></view>
					<scroll-view scroll-y class="scroll-list" :scroll-into-view="'month_' + selectedMonth">
						<view v-for="month in months" :key="month"
							:id="'month_' + month"
							class="scroll-item" :class="{ active: month === selectedMonth }"
							@click="selectMonth(month)">
							<text>{{ month }}</text>
						</view>
					</scroll-view>
				</view>
				<!-- 日历网格 -->
				<view class="picker-column day-column">
					<view class="column-header"><text>日</text></view>
					<view class="day-grid">
						<view class="week-header">
							<text>日</text><text>一</text><text>二</text><text>三</text><text>四</text><text>五</text><text>六</text>
						</view>
						<view class="day-container">
							<view v-for="(day, index) in days" :key="index"
								class="day-item"
								:class="{ 'other-month': day.isOtherMonth, active: day.value === selectedDay && !day.isOtherMonth }"
								@click="!day.isOtherMonth && selectDay(day.value)">
								<text>{{ day.value }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="picker-footer">
				<text class="selected-date">已选择: {{ selectedDate }}</text>
				<view class="button-group">
					<view class="picker-btn picker-btn-cancel" @click="$emit('close')"><text>取消</text></view>
					<view class="picker-btn picker-btn-confirm" @click="confirm"><text>确定</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'DatePicker',
	props: {
		visible: { type: Boolean, default: false },
		date: { type: String, default: '' }
	},
	data() {
		var now = new Date()
		return {
			selectedYear: now.getFullYear(),
			selectedMonth: now.getMonth() + 1,
			selectedDay: now.getDate(),
			years: [],
			months: [1,2,3,4,5,6,7,8,9,10,11,12],
			days: []
		}
	},
	computed: {
		selectedDate() {
			var m = String(this.selectedMonth).padStart(2, '0')
			var d = String(this.selectedDay).padStart(2, '0')
			return this.selectedYear + '-' + m + '-' + d
		}
	},
	watch: {
		visible(val) {
			if (val) this.init()
		}
	},
	created() {
		this.generateYears()
	},
	methods: {
		init() {
			if (this.date) {
				var parts = this.date.split('-')
				if (parts.length === 3) {
					this.selectedYear = parseInt(parts[0])
					this.selectedMonth = parseInt(parts[1])
					this.selectedDay = parseInt(parts[2])
				}
			}
			this.generateDays()
		},
		generateYears() {
			var maxYear = new Date().getFullYear() + 10
			var arr = []
			for (var y = maxYear; y >= 1900; y--) {
				arr.push(y)
			}
			this.years = arr
		},
		generateDays() {
			var firstDay = new Date(this.selectedYear, this.selectedMonth - 1, 1)
			var lastDay = new Date(this.selectedYear, this.selectedMonth, 0)
			var daysInMonth = lastDay.getDate()
			var firstDayWeek = firstDay.getDay()

			var prevMonthLastDay = new Date(this.selectedYear, this.selectedMonth - 1, 0).getDate()
			var items = []

			// 上月末尾
			for (var i = firstDayWeek - 1; i >= 0; i--) {
				items.push({ value: prevMonthLastDay - i, isOtherMonth: true })
			}
			// 当月
			for (var d = 1; d <= daysInMonth; d++) {
				items.push({ value: d, isOtherMonth: false })
			}
			// 下月开头
			var nextDays = 42 - items.length
			for (var n = 1; n <= nextDays; n++) {
				items.push({ value: n, isOtherMonth: true })
			}
			this.days = items
		},
		selectYear(year) {
			this.selectedYear = year
			this.generateDays()
			this.adjustDay()
		},
		selectMonth(month) {
			this.selectedMonth = month
			this.generateDays()
			this.adjustDay()
		},
		selectDay(day) {
			this.selectedDay = day
		},
		adjustDay() {
			var lastDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate()
			if (this.selectedDay > lastDay) {
				this.selectedDay = lastDay
			}
		},
		confirm() {
			this.$emit('confirm', this.selectedDate)
		}
	}
}
</script>

<style scoped>
.datepicker-overlay {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(0,0,0,0.5);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}
.date-picker-modal {
	background: white;
	border-radius: 8px;
	width: 90%;
	max-width: 420px;
	display: flex;
	flex-direction: column;
	box-shadow: 0 2px 12px rgba(0,0,0,0.1);
	overflow: hidden;
}
.picker-header {
	padding: 15px;
	border-bottom: 1px solid #eee;
	text-align: center;
	font-weight: bold;
	font-size: 14px;
	color: #333;
}
.picker-body {
	display: flex;
	height: 340px;
	overflow: hidden;
}
.picker-column {
	border-right: 1px solid #eee;
	display: flex;
	flex-direction: column;
}
.year-column { width: 80px; }
.month-column { width: 60px; }
.day-column { flex: 1; border-right: none; }
.column-header {
	padding: 10px 0;
	text-align: center;
	font-weight: 500;
	color: #666;
	background: #f8f9fa;
	border-bottom: 1px solid #eee;
	font-size: 13px;
}
.scroll-list {
	flex: 1;
	height: 0;
}
.scroll-item {
	padding: 10px 0;
	text-align: center;
	cursor: pointer;
	transition: all 0.2s;
	font-size: 14px;
	color: #333;
}
.scroll-item.active {
	background: #1890ff;
	color: white;
}
.day-grid {
	padding: 10px;
}
.week-header {
	display: flex;
	text-align: center;
	color: #666;
	font-size: 12px;
	margin-bottom: 8px;
}
.week-header text {
	flex: 1;
	text-align: center;
}
.day-container {
	display: flex;
	flex-wrap: wrap;
}
.day-item {
	width: 14.28%;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 4px;
	font-size: 14px;
	transition: all 0.2s;
	color: #333;
	box-sizing: border-box;
}
.day-item.active {
	background: #1890ff;
	color: white;
}
.day-item.other-month {
	color: #ccc;
}
.picker-footer {
	padding: 15px;
	border-top: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.selected-date {
	color: #333;
	font-size: 13px;
}
.button-group {
	display: flex;
	gap: 10px;
}
.picker-btn {
	padding: 8px 20px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.2s;
}
.picker-btn-cancel {
	background: #f0f0f0;
	color: #666;
}
.picker-btn-confirm {
	background: #1890ff;
	color: white;
}
</style>
