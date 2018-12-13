const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '0',
    tabs: [],
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFirstCategory();
  },

  switchTab(e) {
    const index = e.target.dataset.num;
    console.log("index",index)
    this.setData({
      tab: index
    })
    this.getSecondCategory(this.data.tabs[index].id)
  },

  // 获取一级分类
  getFirstCategory() {
    wx.request({
      url: app.globalData.url + '/product/getfirstcategory.json',
      method: 'POST',
      data: {
        type: '1'
      },
      success: (res) => {
        console.log('res',res.data.data)
        const tabs = res.data.data;
        this.setData({
          tabs,
        })
        this.getSecondCategory(tabs['0'].id)
      }
    })
  },

  // 获取二级分类
  getSecondCategory(pid) {
    wx.request({
      url: app.globalData.url + '/product/getcategory.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        pid,
      },
      success: (res) => {
        console.log('res',res.data.data)
        this.setData({
          list: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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