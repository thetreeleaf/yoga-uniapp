<template>
	<view>
		<view v-for="(item,index) in placeList" :key="index" class="place" v-if="item.id != 1"  @click="chose(item.id)">
			<image  :src="item.placePicture" class="image"></image>
			<view style="float: left;margin-top: 30upx;">
				<text style="width: 100%;font-size: 50upx;margin-left: 40upx;">{{item.placeName}}\n</text>
				<text style="font-size: 10upx;">\n</text>
				<text style="margin-left: 40upx;">{{item.address}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {getPlaceList} from "../../api/place.js"
	export default {
		data() {
			return {
				placeList: []
			}
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData() {
				getPlaceList().then(response => {
					this.placeList = response.data;
				});
			},
			chose(id) {
				uni.setStorageSync('placeId', id);
				uni.navigateBack()
			}
			
		}
	}
</script>

<style lang="scss">
	.place {
		background: #fff;
		color: #333;
		border: 1px solid #EEEEEE;			
		border-radius: 10upx;
		height: 200upx;
		display: flex;
		width: 100%;
		.image {
			height: 100%;
			width: 25%;
		}
	}
	
</style>
