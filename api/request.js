/**
 * API Request Module
 * Matches the original postData/getData pattern from AiMeasure
 */

const BASE_URL = '/crm'

function request(url, data, method) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: BASE_URL + url,
			data: data || {},
			method: method || 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			withCredentials: true,
			success: function(res) {
				resolve(res)
			},
			fail: function(err) {
				console.error('Request failed:', url, err)
				reject(err)
			}
		})
	})
}

export function postData(url, data) {
	return request(url, data, 'POST')
}

export function getData(url, data) {
	return request(url, data, 'GET')
}

export default {
	postData: postData,
	getData: getData
}
