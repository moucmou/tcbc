//index.js
const app = getApp()
const { envList } = require('../../envList.js')
const prizeList = [
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp1.png?sign=43d5bb97cbc230ae39e3dade4a1a94f7&t=1622117463', // 奖品图片
    name: "奖品1", // 奖品名称
    isPrize: 1 // 该奖项是否为奖品
  },
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp2.png?sign=4e1ef341b2ca9ea6c981162a98663fc5&t=1622117488',
    name: "奖品2",
    isPrize: 1
  },
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp3.png?sign=627e58091bf230d7ec78793243069f92&t=1622117508',
    name: "奖品3",
    isPrize: 1
  },
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp4.png?sign=fa9067d63844037edc4c60ef7e412c5c&t=1622117524',
    name: "奖品4",
    isPrize: 1
  },
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp5.png?sign=78fb69ce6d9fbd31187775c335ec0dcd&t=1622117534',
    name: "奖品5",
    isPrize: 1
  },
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp4.png?sign=fa9067d63844037edc4c60ef7e412c5c&t=1622117524',
    name: "奖品6",
    isPrize: 1
  },
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp5.png?sign=78fb69ce6d9fbd31187775c335ec0dcd&t=1622117534',
    name: "奖品7",
    isPrize: 0
  },
  {
    icon: 'https://636c-cloud1-3g2p1a4xff655693-1306058785.tcb.qcloud.la/jp3.png?sign=627e58091bf230d7ec78793243069f92&t=1622117508',
    name: "奖品8",
    isPrize: 1
  }
]
const CIRCLE_ANGLE = 360

const config = {
  // 总旋转时间
  duration: 4000,
  // 旋转圈数
  circle: 8,
  mode: 'ease-in-out'
}
Page({
  data: {
    name: '123',
    showUploadTip: false,
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    prizeList: [],
    rotateStyle: ''
  },

  rotateAngle: 0,

  onLoad(options) {
    const db = wx.cloud.database()

    db
    .collection("test")
    .get()
    .then((res) => {
      this.initPrizeList(res.data)
    })
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index
    const powerList = this.data.powerList
    powerList[index].showItem = !powerList[index].showItem
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList)
    } else {
      this.setData({
        powerList
      })
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return
    }
    const powerList = this.data.powerList
    powerList.forEach(i => {
      i.showItem = false
    })
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    })
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    })
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'functions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        })
      }
      this.setData({
        powerList
      })
      wx.hideLoading()
    }).catch((e) => {
      console.log(e)
      this.setData({
        showUploadTip: true
      })
      wx.hideLoading()
    })
  },

  initPrizeList(prizeList) {
    const list = this.formatPrizeList(prizeList)
    this.setData({
      prizeList: list
    })
  },
  // 格式化奖品列表，计算每个奖品的位置
  formatPrizeList (list) {
    // 记录每个奖的位置
    const angleList = []

    const l = list.length
    // 计算单个奖项所占的角度
    const average = CIRCLE_ANGLE / l

    const half = average / 2

    // 循环计算给每个奖项添加style属性
    list.forEach((item, i) => {

      // 每个奖项旋转的位置为 当前 i * 平均值 + 平均值 / 2
      const angle = -((i * average) + half)
      // 增加 style
      item.style = `-webkit-transform: rotate(${angle}deg);
                    transform: rotate(${angle}deg);`

      // 记录每个奖项的角度范围
      angleList.push((i * average) + half )
    })

    this.angleList = angleList

    return list
  },
  beginRotate() {
    // 开始抽奖
    // 这里这里向服务端发起请求，得到要获得的奖
    // 可以返回下标，也可以返回奖品 id，通过查询 奖品列表，最终得到下标

    const { prizeList } = this.data
    // 随机获取下标
    this.index = this.random(prizeList.length - 1);

    // 减少剩余抽奖次数
    this.count--

    // 开始旋转
    this.rotating()
  },
  random (max, min = 0) {
    return parseInt(Math.random() * (max - min + 1) + min)
  },
  rotating() {
    const { isRotating, angleList, rotateAngle, index } = this

    if (isRotating) return

    this.isRotating = true
  
    // 计算角度
    const angle =
        // 初始角度
        rotateAngle +
        // 多旋转的圈数
        config.circle * CIRCLE_ANGLE +
        // 奖项的角度
        angleList[index] -
        (rotateAngle % CIRCLE_ANGLE)

      this.rotateAngle = angle

      const style = `
        -webkit-transition: transform ${config.duration}ms ${config.mode};
        transition: transform ${config.duration}ms ${config.mode};
        -webkit-transform: rotate(${angle}deg);
            transform: rotate(${angle}deg);`

      this.setData({
        rotateStyle: style
      })

      // 旋转结束后，允许再次触发
      setTimeout(() => {
        this.rotateOver()
      }, config.duration + 1000)
  },
  rotateOver () {
    const data = this.data.prizeList[this.index]

    this.isRotating = false
    wx.showModal({
      content: '恭喜你获得奖品：' + data.name
    }) 
  },
  //关闭弹窗
  closeToast() {
    this.prize = null;
  }
})
