<template>
	<view class="scrool-page">
		<view class="list-cont">
			<scroll-view class="scrool-more" style="height: 100%;" scroll-y="true" scroll-with-animation="true">
				<view class="row-box">
					<text class="item-box">课程名称: </text>
					<text class="item">{{data.courseName}}</text>
				</view>
				<view class="row-box" v-if="data.courseType">
					<text class="item-box">课程类型: </text>
					<text class="item">{{data.courseType == 1 ? '团课'
					 : data.courseType == 2 ? '私教' : ''}}</text>
				</view>
				<view class="row-box">
					<text class="item-box">课程价格: </text>
					<text class="item">{{data.price}}</text>
				</view>
				<view class="row-box" v-if="data.roomType">
					<text class="item-box">教室: </text>
					<text class="item">{{data.roomType == 1 ? '小教室'
					 : data.roomType == 2 ? '大教室' 
					 : data.roomType == 3 ? '多功能教室' : ''}}</text>
				</view>
				<view class="row-box" v-if="data.coachName">
					<text class="item-box">教练: </text>
					<text class="item">{{data.coachName}}</text>
				</view>
				<view class="row-box" v-if="!data.coachName && data.disable == 'false'">
					<view class="uni-list">
						<view class="uni-list-cell" style="display: flex;">
							<view class="uni-list-cell-left item-box">
								教练列表
							</view>
							<view class="uni-list-cell-db item">
								<picker @change="bindPickerChange" :value="index" :range="array" v-if="array.length > 0">
									<view class="uni-input">{{array[index]}}</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
				<view class="row-box" v-if="data.courseDesc">
					<text class="item-box">课程简介</text>
				</view>
				<view class="row-box" style="height: auto;" v-if="data.courseDesc">
					<text class="item-box">{{data.courseDesc}}</text>
				</view>
			</scroll-view>
		</view>
		<view class="footer">
			<button :disabled="data.disable == 'true' ? data.disable : false" type="warn" @click="order">{{data.buttonText}}</button>
	    </view>
	</view>
</template>

<script>
	import {getCoachName,getCoachList} from '../../api/coach.js';
	import {idlist} from '../../api/CourseDetail.js';
	import {getMemberType,addMemberType} from '../../api/MemberType.js'
	import {currentTime} from '../../utils/date.js'
	import {memberCardList} from '../../api/MemberCard.js'
	import {addCourseState} from '../../api/CourseState.js'
	import {reduceBalance} from '../../api/user.js'
	export default {
		data() {
			return {
				data: undefined,
				index: 0,
				array: [],
				coachList: [],
				idList: [],
				date: undefined,
				courseState: {
					id: undefined,
					userId : undefined,
					detailId: undefined,
					state: 3,
					courseId: undefined,
					operationTime: undefined,
					coachId: undefined
				},
				memberType: {
					memberTypeId: undefined,
					memberTypeName: '普通会员',
					startTime: undefined,
					endTime: undefined,
					memberId: this.$store.state.user.memberId,
					memberCardId: undefined,
					placeId: undefined
				}
			}
		},
		async onLoad(options) {
			this.data = options.item.replace(/""/g, "")
			this.data = JSON.parse(this.data)
			this.date = options.date.replace(/""/g, "")
			this.courseState.detailId = this.data.id
			this.courseState.courseId = this.data.courseId
			this.courseState.operationTime = this.date
			if (this.$store.state.user.hasLogin) {
				if (this.data.coachId) {
					getCoachName(this.data.coachId).then(response => {
						this.data.coachName = response.data
					})
				} else {
					const id = uni.getStorageSync('placeId');
					const memberId = this.$store.state.user.memberId;
					await getCoachList(id).then(response=> {
						const dataList = response.data
						dataList.forEach(item => {
							this.coachList.push(item)
						})
					})
					await idlist(id,this.data.week,this.date,this.data.rangeTime).then(response =>{
						const list = response.data;
						if(list) {
							list.forEach(item => {
								this.idList.push(item)
							})
						}
					})
					this.coachList.forEach(item => {
						if(this.idList.length > 0) {
							if(!this.idList.indexOf(item.coachId)) {
								this.array.push(item.coachName)
							}
						} else {
							this.array.push(item.coachName)
						}
					})
					console.log(this.coachList)
					console.log(this.idList)
					console.log(this.array)
				}
			}
			console.log(this.data)
			console.log(this.date)
		},
		methods: {
			bindPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value)
			    this.index = e.target.value
			},
			async operation() {
				if(this.$store.state.user.balance < this.data.price) {
					uni.showModal({
						title: '提示',
						content: '余额不足，请先充值',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					}); 
				} else {
					if(this.data.coachId) {
						this.courseState.coachId = this.data.coachId
					} else {
						this.courseState.coachId = this.coachList[this.index].coachId
					}
					await addCourseState(this.courseState).then(response=>{
						if(response.code == "00000") {
							reduceBalance(this.data.price).then(resp =>{
								if(resp.code == "00000") {
									uni.showModal({
										title: '提示',
										content: '预约成功',
										success: function (res) {
											if (res.confirm) {
												console.log('用户点击确定');
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									}); 
								}
							}) 
						} else { 
							uni.showModal({
								title: '提示',
								content: '预约失败',
								success: function (res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							}); 
						}
					})
				}
			},
			async order() {
				if(this.data.buttonText == '取消预约') {
					uni.showModal({
						title: '提示',
						content: '请到预约或课程记录页面取消预约',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					}); 
				} else{
					const id = uni.getStorageSync('placeId')
					const memberId = this.$store.state.user.memberId
					this.courseState.userId = memberId
					var data = undefined
					await getMemberType(id,memberId).then(response=> {
						data = response.data
					});
					if(data) {
						if(data.memberTypeName == '普通会员') {
							this.operation()
						} else {
							const endStamp = new Date(data.endTime).getTime()
							const currentStamp = new Date().getTime()
							if(this.data.coachId) {
								this.courseState.coachId = this.data.coachId
							} else {
								this.courseState.coachId = this.coachList[this.index].coachId
							}
							if(endStamp > currentStamp) {
								await addCourseState(this.courseState).then(response=>{
									if(response.code == "00000") {
										uni.showModal({
											title: '提示',
											content: '预约成功',
											success: function (res) {
												if (res.confirm) {
													console.log('用户点击确定');
												} else if (res.cancel) {
													console.log('用户点击取消');
												}
											}
										}); 
									}
								})
							} else {
								var flag = false;
								uni.showModal({
									title: '提示',
									content: '会员过期,是否继续预约',
									success: function (res) {
										if (res.confirm) {
											console.log('用户点击确定');	
											flag = true;
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									}
								});
								if(flag) {
									this.operation()
								}
							}
						}
					} else {
						var startTime = currentTime().date + " " + currentTime().time
						this.memberType.startTime = startTime
						var memberCardId = 0
						await memberCardList(id).then(response=>{
							const cardList = response.data
							cardList.forEach(item=> {
								if(item.membershipCardName == '普通卡') {
									memberCardId = item.membershipCardId
								}
							})
						})
						this.memberType.memberCardId = memberCardId
						this.memberType.placeId = id
						await addMemberType(this.memberType).then(response=>{
							if(response.code == "00000") {
								console.log("添加成功")
							}
						})
						this.operation()
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
	}
	
	
	.scrool-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	
	.list-cont {
		flex: 1;
		position: relative;
	
		.scrool-more {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}
	
	}
	
	
	.footer {
		color: #fff;
		line-height: 100rpx;
		flex: 0 0 100rpx;
		/* 不放大不缩小固定100rpx */
	}
	
	.row-box {
		background: #fff;
		color: #333;
		border: 1px solid #EEEEEE;
		font-size: 50upx;
		border-radius: 10upx;
		height: 100upx;
		display: flex;
	}

	.item-box {
		margin: 20upx 30upx;
	}

	.item {
		margin-top: 20upx;
	}
</style>
