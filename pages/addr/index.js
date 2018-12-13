const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    list: [],
    goodsId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    this.setData({
      goodsId: options.id
    })
  },

  findAll: function () {
    wx.request({
      url: app.globalData.url + '/useraddress/getaddresslist.json',
      data: {
        userId: app.globalData.userId
      },
      success: (res) => {
        // console.log('data',data.data.data)
        if (res.data.success) {
          this.setData({
            list: res.data.data,
            loading: true
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },

  redirectHandler(e) {
    console.log('e', e.currentTarget.dataset.index)
    if (this.data.goodsId) {
      const index = e.currentTarget.dataset.index;
      const obj = JSON.stringify(this.data.list[index]);
      wx.redirectTo({
        url: `/pages/shop/goods/index?id=${this.data.goodsId}&obj=${obj}`,
      })
    }
  },

  editHandler(e) {
    console.log('e', e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index;
    const objString = JSON.stringify(this.data.list[index])
    wx.redirectTo({
      url: `/pages/user/address/add/index?obj=${objString}&goodsId=${this.data.goodsId}`,
    })
  },

  deleteHandler(e) {
    console.log('e', e.currentTarget.dataset.id)
    wx.request({
      url: app.globalData.url + '/useraddress/deleteaddress.json',
      data: {
        ids: e.currentTarget.dataset.id
      },
      success: (res) => {
        if (res.data.success) {
          this.findAll();
        } else {
          this.setData({
            list: res.data.data,
            loading: true
          })
        }
      }
    })
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
    this.findAll();
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