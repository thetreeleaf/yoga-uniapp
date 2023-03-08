/**
 * 用户相关api
 */
import request from '@/utils/request'

// 小程序授权登录
export function login(code, encryptedData,iv) {
	return request({
		url: '/oauth/token',
		method: 'post',
		params: {
			code: code,
			encryptedData: encryptedData,
			iv:iv,
			grant_type: 'wechat'
		},
		headers: {
			'Authorization': 'Basic eW9nYS13ZWFwcDoxMjM0NTY=' // 客户端信息Base64加密，明文：yoga-weapp:123456
		}
	})
}

export function logout() {
	return request({
		url: '/oauth/logout',
		method: 'delete',
		headers: {
			'auth': true // 需要认证，通过
		}
	})
}

export function getUserInfo() {
	return request({
		url: '/member/member/me',
		method: 'get',
		headers: {
			'auth': true
		}
	})
}

//购卡扣减会员余额
export function deductBalance(id,balance,memberCardId) {
	return request({
		url: '/member/member/current/' + id + 'balances/_deduct',
		method: 'put',
		params: {
			balance: balance,
			memberCardId: memberCardId
		},
		headers: {
			'auth': true
		}
	})
}

//预约扣减会员余额
export function reduceBalance(balance) {
	return request({
		url: '/member/member/order/balances/reduce',
		method: 'put',
		params: {
			balance: balance,
		},
		headers: {
			'auth': true
		}
	})
}

//会员充值
export function addBalance(balance) {
	return request({
		url: '/member/member/current/balances/add',
		method: 'put',
		params: {
			balance: balance	
		},
		headers: {
			'auth': true
		}
	})
}
