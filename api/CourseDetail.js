/**
 * 课程细节相关api
 */
import request from '@/utils/request'

export function listPlaceCourse(id,week,date,courseType,memberId) {
	return request({
		url: '/course/courseDetail/' + id + '/list',
		method: 'get',
		params: {
			week: week,
			date: date,
			courseType: courseType,
			memberId: memberId
		},
		headers: {
			'auth': true // 需要认证
		}
	})
}

export function idlist(id,week,date,rangeTime) {
	return request({
		url: '/course/courseDetail/' + id + '/idlist',
		method: 'get',
		params: {
			week: week,
			date: date,
			rangeTime: rangeTime
		},
		headers: {
			'auth': true // 需要认证
		}
	})
}
