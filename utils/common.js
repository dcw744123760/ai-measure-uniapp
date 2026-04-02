/**
 * Common utility functions
 */

// Check types definition
export var CHECK_TYPES = [
	{ value: 'default', name: '远用', nameEn: 'Far', nameHk: '遠用', cssClass: 'type-far' },
	{ value: 'jycf', name: '近用', nameEn: 'Near', nameHk: '近用', cssClass: 'type-near' },
	{ value: 'djd', name: '多焦点', nameEn: 'Multi-focus', nameHk: '多焦點', cssClass: 'type-multi' },
	{ value: '6', name: '办公', nameEn: 'Office', nameHk: '辦公', cssClass: 'type-office' },
	{ value: '7', name: '驾驶', nameEn: 'Driving', nameHk: '駕駛', cssClass: 'type-drive' },
	{ value: '8', name: '防控', nameEn: 'Prevention', nameHk: '防控', cssClass: 'type-prevent' }
]

// Default placeholder image (base64 SVG)
export var DEFAULT_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFRUVFRUUiLz48cGF0aCBkPSJNMzUgNjVMNDUgNTBMNTUgNjBMNjUgNDVMNzUgNjVIMzVaIiBmaWxsPSIjQ0NDQ0NDIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSIzNSIgcj0iOCIgZmlsbD0iI0NDQ0NDQyIvPjwvc3ZnPg=='

// Build image URL from API array data
export function buildImgUrl(arr) {
	var completeUrl = arr[12]
	if (!completeUrl) return ''
	if (completeUrl.indexOf('http') === 0) return completeUrl
	if (completeUrl.indexOf('demoLogin/') !== -1) return '/crm/' + completeUrl
	var compCode = arr[21]
	var dirPath = arr[22]
	var fileName = arr[11]
	var format = arr[23]
	if (compCode && dirPath && fileName) {
		var fn = format ? fileName + '.' + format : fileName
		return '/crm/demoLogin/exceldemo.json?companyCode=' + compCode + '&directoryPath=' + dirPath + '&filename=' + fn
	}
	return '/crm/' + completeUrl
}

// Parse list item from API array format
export function parseListItem(arr) {
	var checkType = arr[40] || 'default'
	var found = CHECK_TYPES.find(function(t) { return t.value === checkType })
	var rhLhArr = arr[37]
	return {
		id: arr[13],
		clientName: arr[0] || '游客',
		gender: arr[1] || '1',
		age: arr[2] || 0,
		mirrorFrame: arr[4] || '',
		cnSpace: arr[6],
		fnSpace: arr[7],
		createTime: arr[8],
		capImgSrc: buildImgUrl(arr),
		imgSrc: '',
		jxcTarkImgSrc: '',
		skImgSrc: '',
		tarkImgSrc: '',
		clientid: arr[16],
		checked: arr[19],
		orderid: arr[20],
		vd: arr[29],
		pa: arr[30],
		tilt_max: arr[32],
		frame_high: arr[33],
		fw: arr[34],
		fn_space: arr[35],
		cn_space: arr[36],
		hspace: arr[37],
		rhSpace: Array.isArray(rhLhArr) ? rhLhArr[0] : rhLhArr,
		lhSpace: Array.isArray(rhLhArr) ? rhLhArr[1] : '',
		wrap: arr[38],
		checkType: checkType,
		checkTypeName: found ? found.name : '远用',
		checkTypeClass: found ? found.cssClass : 'type-far',
		unitName: '',
		side_capImgSrc: '',
		fnRspace: '',
		fnLspace: '',
		compid: arr[15],
		empid: arr[17],
		unitid: arr[18],
		optid: arr[27],
		frameWide: arr[34],
		frameType: arr[41],
		frameNose: arr[42],
		frameHighAll: arr[43],
		params: (!!(arr[10] && arr[12])) ? '' : (arr[44] || '')
	}
}

// Format date to YYYY-MM-DD
export function formatDate(date) {
	if (!date) return ''
	var d = new Date(date)
	var year = d.getFullYear()
	var month = String(d.getMonth() + 1).padStart(2, '0')
	var day = String(d.getDate()).padStart(2, '0')
	return year + '-' + month + '-' + day
}

export default {
	CHECK_TYPES: CHECK_TYPES,
	DEFAULT_IMG: DEFAULT_IMG,
	buildImgUrl: buildImgUrl,
	parseListItem: parseListItem,
	formatDate: formatDate
}
