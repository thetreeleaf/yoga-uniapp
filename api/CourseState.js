/**
 * 课程状态相关api
 */
import request from '@/utils/request'

export function listCourseState(placeId,state,userId,pageNum,pageSize) {
	return request({
		url: '/course/courseState/page',
		method: 'get',
		params: {
			placeId: placeId,
			state: state,
			userId: userId,
			pageNum: pageNum,
			pageSize: pageSize
		},
		headers: {
			'auth': true // 需要认证
		}
	})
}

export function update(ids, state) {
    return request({
      url: '/course/courseState/' + ids,
      method: 'put',
      params: {
          state: state
      },
	  headers: {
	  	'auth': true // 需要认证
	  }
    })
}

export function addCourseState(data) {
	return request({
		url: '/course/courseState/order',
		method: 'post',
		data: data,
		headers: {
			'auth': true // 需要认证
		}
	})
}

export function getCourseStateId(data) {
	return request({
		url: '/course/courseState/getId',
		method: 'post',
		data: data,
		headers: {
			'auth': true // 需要认证
		}
	})
}