<template>
	<view class="content">
		<view class="container">
			<view style="display: flex;justify-content: center;">
				<button :type="league" @click="getLeage" style="width: 50%;">团课</button>
				<button :type="personal" @click="getPersonal" style="width: 50%;">私教</button>
			</view>
			<!-- 日期列表 -->
			<scroll-view class="scroll-view_H b-t b-b" scroll-x>
				<block v-for="(item,index) in dateArr" :key="index">
					<div class="flex-box" @click="selectDateEvent(index,item)" :class="{ borderb: index==dateActive}">
						<view class="date-box" :style="{color:index==dateActive?selectedTabColor:'#333'}">
							<text class="fontw">{{item.week}}</text>
							<text>{{item.date}}</text>
						</view>
					</div>
				</block>
			</scroll-view>
			<!-- 课程列表 -->
			<view class="time-box">
				<block v-for="(item,_index) in courseList" :key="_index">
					<view class="item">
						<view class="item-box">
							<view style="margin-top: 20upx;margin-bottom: 20upx;">
								<text style="font-size: 50upx;">{{item.rangeTime}}</text>
								<button :disabled="item.disable == 'true' ? item.disable : false" size="mini" style="float: right;margin-right: 20upx;" type="warn" @click="order(item)">{{item.buttonText || content}}</button>
							</view>
							<view>
								<text style="font-size: 50upx;margin-left: 20upx;" @click="toDetail(item)">{{item.courseName}}</text>
								<text style="font-size: 50upx;float: right;margin-right: 30upx;">￥{{item.price}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		initData,
		initTime,
		timeStamp,
		currentTime
	} from '../../utils/date.js'
	import {listPlaceCourse} from '../../api/CourseDetail.js'
	import {getMemberType,addMemberType} from '../../api/MemberType.js'
	import {addCourseState,update,getCourseStateId} from '../../api/CourseState.js'
	import {reduceBalance,addBalance} from '../../api/user.js'
	import {memberCardList} from '../../api/MemberCard.js'
	export default {
		data() {
			return {
				dateArr: [], //日期数据
				dateActive: 0, //选中的日期索引
				selectDate: "", //选择的日期
				league: '',
				personal: '',
				courseList: [],
				content: '预约',
				courseType: 1,
				ids: [],
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
		created() {
			this.selectDate = this.nowDate = currentTime().date
			this.initOnload();
			this.league = "warn"
			this.personal = "default"
		},
		onShow() {
			this.getCourses();
		},
		methods: {
			async getCourses() {
				if(this.$store.state.user.hasLogin) {
					const id = uni.getStorageSync('placeId');
					console.log(id)
					if(id) {
						const Time = new Date(this.selectDate);
						const timestemp = Time.getTime();
						const week = timeStamp(timestemp).day;
						console.log(week);
						const date = this.selectDate + "  00:00:00";
						const memberId = this.$store.state.user.memberId;
						listPlaceCourse(id,week,date,this.courseType,memberId).then(response => {
							this.courseList = response.data;
						});
					}
				} else {
					let courseList = await this.$api.json('courseList')
					this.courseList = courseList || '';
				}
				
			},
			// 日期选择事件
			selectDateEvent(index, item) {
				this.dateActive = index
				this.selectDate = item.date
				this.initOnload()
				this.getCourses()
				this.$forceUpdate()
			},
			async order(item) {
				if(!this.$store.state.user.hasLogin) {
					console.log("先登录")
					uni.navigateTo({
						url: '/pages/login/login'
					});
				} else {
					const id = uni.getStorageSync('placeId')
					const memberId = this.$store.state.user.memberId
					this.courseState.userId = memberId
					this.courseState.detailId = item.id
					this.courseState.courseId = item.courseId
					if(item.buttonText == '取消预约') {
						this.courseState.coachId = item.coachId
						await getCourseStateId(this.courseState).then(response => {
							this.ids.push(response.data)
						})
						await update(this.ids,4).then(res =>{
							if(res.code == "00000") {
								addBalance(item.price).then(resp => {
									if(resp.code == "00000") {
										uni.showModal({
											title: '提示',
											content: '取消成功',
											success: function (res) {
												if (res.confirm) {
													console.log('用户点击确定');
												} else if (res.cancel) {
													console.log('用户点击取消');
												}
											}
										});
									} else {
										uni.showModal({
											title: '提示',
											content: '取消失败',
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
						})
						this.getCourses();
					}
					if(item.coachId && item.buttonText == '预约') {
						this.courseState.coachId = item.coachId
						this.courseState.operationTime = this.selectDate + " 00:00:00";
						var data = undefined
						await getMemberType(id,memberId).then(response=> {
							data = response.data
						});
						if(data) {
							if(data.memberTypeName == '普通会员') {
								this.operation(item)
							} else {
								const endStamp = new Date(data.endTime).getTime()
								const currentStamp = new Date().getTime()
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
										this.operation(item)
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
							this.operation(item)
						}	
						this.getCourses();
					} 
					if(!item.coachId){
						uni.showModal({
							title: '提示',
							content: '请到课程详情界面选择教练后再预约',
							success: function (res) {
								if (res.confirm) {
									console.log('用户点击确定');
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
				}
			},
			initOnload() {
				this.dateArr = initData() // 日期栏初始化
			},
			getLeage() {
				this.league = "warn"
				this.personal = "default"
				this.courseType = 1
				this.getCourses()
			},
			getPersonal() {
				this.league = "default"
				this.personal = "warn"
				this.courseType = 2
				this.getCourses()
			},
			toDetail(item) {
				var data = JSON.stringify(item)
				const time = this.selectDate + " 00:00:00";
				uni.navigateTo({
					url: `/pages/detail/detail?item=${data}&date=${time}`
				});
			},
			async operation(item) {
				if(this.$store.state.user.balance < item.price) {
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
					await addCourseState(this.courseState).then(response=>{
						if(response.code == "00000") {
							reduceBalance(item.price).then(resp =>{
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
			
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.content {
		// text-align: center;
		height: 100%;
	}

	.fontw {
		font-weight: bold;
	}

	.borderb {
		border-bottom: 2px solid #FB4B5C;
	}

	.container {

		view,
		text,
		image {
			box-sizing: border-box;
		}

		scroll-view {
			width: 100%;
			white-space: nowrap;
			height: 75px;
			background-color: #fff;
			position: relative;
			padding-top: 10px;

			// margin-top:10px;
			&::after {
				background: #e5e5e5;
				content: '';
				display: block;
				width: 100%;
				height: 1px;
				position: absolute;
				bottom: 0;
				left: 0;
				transform: scaleY(0.5);

			}

			.flex-box {
				display: inline-block;
				height: 60px;
				width: 25%;
				margin: 0 7rpx 0 7rpx;
				box-sizing: border-box;

				&.active {
					.date-box {
						border: none;

						.days {
							font-weight: bold;
							color: #818181;
						}

						.date {
							font-weight: bold;
							color: #818181;
						}
					}
				}

				.date-box {
					border: none;
					display: flex;
					height: 50px;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					font-size: 30upx;
					color: rgba(129, 129, 129, 1);

					.date {
						font-weight: bold;
						color: #818181;
						font-size: 30upx;

					}
				}
			}

		}

		.time-box {
			padding: 0upx 12upx 26upx;
			display: flex;
			flex-wrap: wrap;
			// margin-top:10px;
			background-color: #fff;

			.item {
				width: 100%;
				padding: 0 5upx;
				margin: 5upx 0;

				&-box {
					width: 100%;
					height: 200upx;
					padding: 0 20upx;
					
					background: #fff;
					color: #333;
					border: 1px solid #EEEEEE;
					font-size: 28upx;
					border-radius: 10upx;
					// display: flex;
					// flex-direction: column;
					// align-items: center;
					// justify-content: center;

					&.disable {
						background: #F1F3F6 !important;
						color: #999 !important;
						// border: 1px solid #EEEEEE;
					}

					&.active {
						// background: #0094D7;
						border: 1px solid #FB5D6B;
						font-weight: bold;
					}

					.all {
						font-size: 22upx;
						padding-top: 5px;
					}
				}

			}
		}

	}

	.text {
		font-size: 12px;
		color: #666;
		margin-top: 5px;
	}

	.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
