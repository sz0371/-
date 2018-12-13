const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    list:[],
    allIncome: 0,
    card: 10 
  },

  switchTab: function(e) {
    const index = e.target.dataset.num;
    if (index == this.data.tab) {
      return ;
    }
    this.data.tab === 0 ? this.setData({ tab: 1 }) : this.setData({ tab: 0 })
  },

  switchCard(e) {
    const index = e.target.dataset.card;
    this.setData({
      card: index
    })
  },

  payment() {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: app.globalData.url + '/user/getintegrals.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: app.globalData.userId,
        payType: '1'
      },
      success: (res) => {
        console.log("res", res.data.data)
        if (res.data.data.length > 0) {
          this.setData({
            list: res.data.data,
            allIncome: app.userInfo.allIncome
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})