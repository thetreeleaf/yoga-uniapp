<template>
	<view>
		<view class="user-section">
			<image class="bg" :src="placeDetal.placePicture || '/static/background.png'"></image>
		</view>
			<view >
				<view class="history-section icon" style="padding-left: 30upx;">
					<view class="detail">
						<text style="font-size: 50upx;">{{placeDetal.placeName}}</text>
						<text class="iconfont icon-qiehuan" style="float: right;margin-right: 40upx;"
							@click="navTo('/pages/place/place')"></text>
					</view>
					<view class="detail">
						<text class="cell-icon yticon icon-dizhi" style="color: #5fcda2;"></text>
						<text style="margin-left: 20upx;">{{placeDetal.address}}\n</text>
					</view>
					<view class="detail">
						<text class="cell-icon yticon icon-dianhua-copy" style="color: #5fcda2;"></text>
						<text style="margin-left: 20upx;">{{placeDetal.phone}}</text>
					</view>
				</view>

				<view class="history-section icon" style="padding-left: 30upx;">
					<view style="font-size: 50upx;margin-bottom: 20upx;">教练列表</view>
					<block v-for="(item,index) in coachList" :key="index">
						<div>
							<view class="detail">
								<text style="font-size: 40upx;width: 150upx;">{{item.coachName}}</text>
								<text style="margin-left: 20upx;margin-top: 10upx;  font-size: 30upx;">{{item.coachIntro}}</text>
							</view>
						</div>
					</block>
				</view>
			</view>
		</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		getPlaceDetail
	} from '../../api/place.js'
	import {
		getCoachList
	} from '../../api/coach.js'
	export default {
		data() {
			return {
				placeDetal: {
					placePicture: '',
					placeName: '',
					address: '',
					phone: ''
				},
				coachList: [],
				placeId: undefined
			}
		},
		computed: {
			...mapGetters(['hasLogin', 'nickname', 'avatar', 'balance'])
		},
		onShow() {
			this.loadData();
		},
		methods: {
			async loadData() {
				if (this.$store.state.user.hasLogin) {
					const id = uni.getStorageSync('placeId')
					if(id) {
						getPlaceDetail(id).then(response => {
							console.log(response.data);
							this.placeDetal = response.data;
						});
						getCoachList(id).then(response => {
							console.log(response.data);
							this.coachList = response.data;
						});
					}
				} else {
					let placeDetal = await this.$api.json('placeDetal');
					this.placeDetal = placeDetal || '';
					let coachList = await this.$api.json('coachList');
					this.coachList = coachList || [];
				}
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				console.log('跳转路径', url);
				if (!this.hasLogin) {
					url = '/pages/login/login';
				}
				uni.navigateTo({
					url
				});
			},

		}
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}

	.user-section {
		height: 350upx;
		padding: 150upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
	}

	.history-section {
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.detail {
			margin-left: 10upx;
			margin-bottom: 20upx;
		}

	}
</style>
