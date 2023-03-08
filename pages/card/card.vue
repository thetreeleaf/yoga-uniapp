<template>
	<view>
		<view class="row-box" style="border: 1px solid #EEEEEE;" v-if="memberType">
			<text style="color: #ff0000;" class="item-box">会员信息</text>
		</view>
		<view class="row-box" v-if="memberType">
			<text class="item-box">会员类型: </text>
			<text class="item">{{memberType.memberTypeName}}</text>
		</view>
		<view class="row-box" v-if="memberType">
			<text class="item-box">开通时间: </text>
			<text class="item">{{memberType.startTime}}</text>
		</view>
		<view class="row-box" v-if="memberType">
			<text class="item-box">过期时间: </text>
			<text class="item">{{memberType.endTime || '永久'}}</text>
		</view>
		<view class="row-box" style="border: 1px solid #EEEEEE;">
			<text style="color: #ff0000;" class="item-box">会员卡列表</text>
		</view>
		<view v-for="(item,_index) in cardList" :key="_index">
			<view class="row-box" v-if="item.membershipCardName != '普通卡'">
				<text class="item-box">{{item.membershipCardName}}</text>
				<text class="item" style="margin-left: 100upx;">{{item.membershipCardPrice}}</text>
				<button style=" float: right;margin-top: 20upx; margin-right: 20upx;" size="mini" @click="buy(item)" type="warn">购买</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {memberCardList} from '../../api/MemberCard.js'
	import {getMemberType} from '../../api/MemberType.js'
	import {deductBalance} from '../../api/user.js'
	import { mapMutations } from 'vuex';
	export default {
		data() {
			return {
				cardList: [],
				memberType: undefined
			}
		},
		onShow() {
			this.loadData()
		},
		methods: {
			loadData() {
				const id = uni.getStorageSync('placeId');
				getMemberType(id,this.$store.state.user.memberId).then(response => {
					if(response.data) {
						this.memberType = response.data
					}
				})
				memberCardList(id).then(response => {
					this.cardList = response.data
				})
			},
			buy(item) {
				if(this.$store.state.user.balance < item.membershipCardPrice) {
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
					const id = uni.getStorageSync('placeId');
					deductBalance(id,item.membershipCardPrice,item.membershipCardId).then(response => {
						if(response.code = '00000') {
							console.log("扣减成功")
						} else {
							console.log("扣减失败")
						}
						this.$store.dispatch('user/getUserInfo');
						this.loadData()
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.row-box {
		background: #fff;
		color: #333;
		// border: 1px solid #EEEEEE;			
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
