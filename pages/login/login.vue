<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<view class="wrapper">
			<!-- 小程序登录授权界面 -->
			<!-- #ifdef MP -->
			<button class="confirm-btn" @click.stop="getUserProfile">小程序登录授权</button>
			<view class="tip">
				温馨提示:未注册瑜伽馆的用户,初次登录时将完成注册
			</view>
			<!-- #endif -->
		</view>
		<!-- <view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view> -->
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	
	export default {
		data() {
			return {
				logining: false,
				code: undefined
			}
		},
		onLoad() {
			// #ifdef MP
			this.getCode()
			// #endif
		},
		methods: {
			navBack() {
				uni.navigateBack();
			},
			getUserProfile() {
				uni.getUserProfile({
					lang: 'zh_CN',
					desc: '获取用户相关信息',
					success: response => {
						const {
							encryptedData,
							iv
						} = response
						this.login(encryptedData, iv)
					}
				})
			},
			async login(encryptedData, iv) {
				this.logining = true;
				this.$store.dispatch('user/login', {
					code: this.code,
					encryptedData: encryptedData,
					iv: iv
				}).then(res => {
					this.$store.dispatch('user/getUserInfo');
					uni.setStorageSync("placeId",3)
					uni.navigateBack()
				}).catch(() => {
					this.logining = false;
				});
			},
			getCode() {
				uni.login({
					provider: 'weixin',
					success: res => {
						console.log('code:'+res.code)
						this.code = res.code
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			// toRegist() {
			// 	this.$api.msg('去注册');
			// }
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	
	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
	
		&:before,
		&:after {
			display: block;
			content: '';
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
	
		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
	
		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	
	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	
	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
	
		&:after {
			border-radius: 100px;
		}
	}
	
	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		text-align: center;
	
		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	
	
	.tip {
		margin-top: 60upx;
		font-size: $font-base - 4upx;
		color: $font-color-dark;
		text-align: center;
		font-family: yticon;
		font-weight: bold;
	}
</style>
