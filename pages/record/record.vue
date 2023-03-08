<template>
	<view class="content">
		<view class="container">
			<!-- 菜单列表 -->
			<scroll-view class="scroll-view_H b-t b-b" scroll-x>
				<block v-for="(item,index) in menuArr" :key="index">
					<div class="flex-box" @click="selectMenuEvent(index,item)" :class="{ borderb: index==menuActive}">
						<view class="date-box" :style="{color:index==menuActive?selectedTabColor:'#333'}">
							<text class="fontw">{{item.name}}</text>
						</view>
					</div>
				</block>
			</scroll-view>
			<!-- 记录列表 -->
			<view class="time-box">
				<block v-for="(item,_index) in recordList" :key="_index">
					<view class="item">
						<view class="item-box">
							<view style="margin-top: 20upx;margin-bottom: 20upx;">
								<text style="font-size: 50upx;">{{item.rangeTime}}</text>
								<button v-if="item.state == 1 || item.state == 3" size="mini" style="float: right;margin-right: 20upx;" type="warn" @click="operation(item)">
								{{item.state == 1 ? '签到': item.state == 3 ? '取消预约' : ''}}
								</button>
							</view>
							<view>
								<text style="font-size: 50upx;">{{item.courseName}}</text>
								<text style="margin-top: 10upx; font-size: 35upx;float: right;">{{item.operationTime}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {listCourseState,update} from '../../api/CourseState.js';
	import {addBalance} from '../../api/user.js'
	export default {
		data() {
			return {
				menuArr:[{
						name: "未签到"
					},
					{
						name: "签到完成"
					},
					{
						name: "已预约"
					},
					{
						name: "取消预约"
					}
				],
				menuActive: 2, //选中的菜单索引
				selectMenu: "", //选择的菜单
				recordList: undefined,
				ids: []
			}
		},
		onShow() {
			this.getRecord()
		},
		methods: {
			selectMenuEvent(index, item) {
				this.menuActive = index
				this.selectMenu = item.name;
				this.getRecord()	
			},
			operation(item) {
				this.ids.push(item.id)
				var status = 0;
				if(item.state == 1) {
					status = 2
				}
				if(item.state == 3) {
					status = 4
					addBalance(item.price).then(resp => {
						console.log(resp.code)		
					})
				}
				console.log(status)
				update(this.ids,status).then(response =>{
					if(response.code == "00000") {
						this.getRecord()
					}
				})
				this.ids = []
			},
			getRecord() {
				const id = uni.getStorageSync('placeId');
				const userId = this.$store.state.user.memberId;
				listCourseState(id,this.menuActive + 1,userId,1,10000).then(response=>{
					this.recordList = response.data;
				}) 
			}
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
</style>
