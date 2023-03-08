/**
 * 会员类型相关api
 */
import request from '@/utils/request'

export function getMemberType(placeId,memberId) {
	return request({
		url: '/member/memberType/' + placeId + '/place/' + memberId ,
		method: 'get',
		headers: {
			'auth': true // 需要认证
		}
	})
}

export function addMemberType(data) {
	return request({
		url: '/member/memberType/add',
		method: 'post',
		data: data,
		headers: {
			'auth': true // 需要认证
		}
	})
}