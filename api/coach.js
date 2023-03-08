/**
 * 教练相关api
 */
import request from '@/utils/request'

export function getCoachList(id) {
	return request({
		url: '/system/coach/list/' + id,
		method: 'get',
		headers: {
			'auth': true // 需要认证
		}
	})
}

export function getCoachName(id) {
	return request({
		url: '/system/coach/one/' + id,
		method: 'get',
		headers: {
			'auth': true // 需要认证
		}
	})
}
