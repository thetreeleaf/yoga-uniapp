/* 场馆信息 */
const placeDetal = {
	placePicture: '/static/background.png',
	placeName: '瑜伽体验馆',
	address: '广东省广州市白云区',
	phone: '15817914850'
}

const coachList = [{
		coachName: "张三",
		coachIntro: "多年瑜伽教学经验"
	},
	{
		coachName: "李四",
		coachIntro: "瑜伽教学经验丰富"
	}
]
			
/*  课程列表 */
const courseList = [{
		rangeTime: "9:30-10:30",
		courseName: "练习瑜伽",
		price: 200
	},
	{
		rangeTime: "14:30-15:30",
		courseName: "瑜伽基础",
		price: 200
	},
	
]



export default {
	placeDetal,
	courseList,
	coachList
}
