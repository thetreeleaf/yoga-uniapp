/**
 * 会员卡相关api
 */
import request from '@/utils/request'

export function memberCardList(placeId) {
	return request({
		url: '/member/membershipCard/list',
		method: 'get',
		params: {
			placeId: placeId	
		},
		headers: {
			'auth': true // 需要认证
		}
	})
}