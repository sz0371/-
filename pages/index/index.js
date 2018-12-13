//index.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    imgUrls: [],
    recommendList: [],
    leaseList: []
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBanners();
    this.getRecommend();
    this.getLease();
  },

  // 轮播图
  getBanners() {
    wx.request({
      url:  app.globalData.url + '/info/adbytypecode.json',
      method: 'POST',
      success: (res) => {
        console.log("res", res.data.data.resultList)
        this.setData({
          imgUrls: res.data.data.resultList
        })
      }
    })
  },

  // 热门推荐
  getRecommend() {
    wx.request({
      url: app.globalData.url + '/product/search.json',
      method: 'POST',
      data: {
        isHot: 'Y',
        isRecommend: 'Y',
        type: '1'
      },
      success: (res) => {
        console.log("resultList", res.data.data.resultList)
        this.setData({
          recommendList: res.data.data.resultList
        })
      }
    })
  },

  // 热门租赁
  getLease() {
    wx.request({
      url: app.globalData.url + '/product/search.json',
      method: 'POST',
      data: {
        isHot: 'Y',
        isRecommend: 'Y',
        type: '2'
      },
      success: (res) => {
        console.log("leaseList", res.data.data.resultList)
        this.setData({
          leaseList: res.data.data.resultList
        })
      }
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
