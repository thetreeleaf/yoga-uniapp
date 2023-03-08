<template>
	<view>
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box" @click="hasLogin == false && navTo('/pages/login/login')">
					<image class="portrait" :src="avatar || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<text class="username flex flex-direction">{{ nickname || '游客' }}</text>
					<text class="username flex flex-direction">余额：{{ balance || 0 }}</text>
				</view>
			</view>
		</view>
		
		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<view class="history-section icon">
				<list-cell icon="icon-chongzhi" iconColor="#e07472" title="充值" @eventClick="recharge"></list-cell>
				<list-cell icon="icon-huiyuan" iconColor="#5fcda2" title="会员卡" @eventClick="navTo('/pages/card/card')"></list-cell>
				<list-cell icon="icon-kechengbiao" iconColor="#9789f7" title="课程记录" @eventClick="navTo('/pages/record/record')"></list-cell>
				<list-cell icon="icon-icon-tuichu" iconColor="#e07472" title="退出登录" border="" @eventClick="toLogout"></list-cell>
			</view>
		</view>
		<!-- <l-modal ref='customModal' :modalTitle="modalTitle" @onClickConfirm="confirm"></l-modal> -->
		<modal v-if="showPop" title="充值" confirm-text="确定" cancel-text="取消" @cancel="cancelPop" @confirm="confirmPop"> 
					<input type='text' placeholder="请输入充值金额" v-model="money" />
		</modal>
	</view>
</template>

<script>
import listCell from '@/components/mix-list-cell.vue';
import lModel from '@/components/l-modal.vue'
import { mapGetters } from 'vuex';
import { addBalance } from '../../api/user.js'
import { mapMutations } from 'vuex';
let startY = 0,
	moveY = 0,
	pageAtTop = true;
export default {
	components: {
		listCell,lModel,
	},
	data() {
		return {
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			modalTitle: "请输入值",
			showPop: false,
			money: undefined
		}
	},
	// #ifndef MP
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.navTo('/pages/set/set');
		} else if (index === 1) {
			// #ifdef APP-PLUS
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			uni.navigateTo({
				url: '/pages/notice/notice'
			});
		}
	},
	// #endif
	computed: {
		...mapGetters(['hasLogin', 'nickname', 'avatar','balance'])
	},
	onShow() {
		if(this.$store.state.user.hasLogin) {
			this.$store.dispatch('user/getUserInfo');
		}
	},
	methods: {
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
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}

			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		},
		recharge() {
			if (!this.hasLogin) {
				this.navTo('/pages/login/login')
			} else {
				this.showPop = true	
			}
		},
		cancelPop() {  //取消
			this.money = '';
			this.showPop = false;
					  
		},
		confirmPop() {
			console.log("进来了");
			console.log(this.money)
			addBalance(this.money).then(response => {
				this.$store.dispatch('user/getUserInfo');
				this.showPop = false;
				this.money = '';
				uni.showModal({
					title: '提示',
					content: '充值成功',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			})
	
		},
		//退出登录
		toLogout(){
			uni.showModal({
			    content: '确定要退出登录么',
			    success: (e)=>{
			    	if(e.confirm){
			    		this.$store.dispatch('user/logout');
			    		setTimeout(()=>{
			    			uni.navigateBack();
			    		}, 200);
			    	}
			    }
			});
		}
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
			filter: blur(1px);
			opacity: 0.7;
		}
	}

	.user-info-box {
		height: 180upx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 130upx;
			height: 130upx;
			border: 5upx solid #fff;
			border-radius: 50%;
		}

		.username {
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
		
		.money {
			height: 190upx;
		}
	}

	
	.cover-container {
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position: relative;
		background: #f5f5f5;
		margin-bottom: 0upx;
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
	
		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;
	
			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}

</style>
