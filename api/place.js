/**
 * 场馆相关api
 */
import request from '@/utils/request'

export function getPlaceDetail(id) {
	return request({
		url: '/system/place/' + id + '/detail',
		method: 'get',
		headers: {
			'auth': true // 需要认证
		}
	})
}

export function getPlaceList() {
	return request({
		url: '/system/place/list',
		method: 'get',
		headers: {
			'auth': true // 需要认证
		}
	})
}
