const wxpay = require('../../utils/pay.js');
const moment = require('../../utils/moments.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '-1',
    orderList: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.num;
    console.log("index",index)
    this.setData({
      tab: index
    });
    this.onShow(index);
  },

  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: app.globalData.url + '/order/updateorderstate.json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: orderId,
              state: '-2'
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.success) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },

  toPayTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    const money = e.currentTarget.dataset.money;
    wxpay.wxpay(app, money, orderId, "/pages/order/index");
  },

  makesureTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定收货？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: app.globalData.url + '/order/updateorderstate.json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: orderId,
              state: '8'
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.success) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },

  deleteTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要删除该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: app.globalData.url + '/order/deletebyorderid.json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.success) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },


  // 跳转评价
  gotoEvaluation(e) {
    const orderId = e.target.dataset.id;
    console.log("orderId", orderId)
    wx.navigateTo({
      url: `/pages/order/evaluation/index?orderId=${orderId}`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (state) {
    state = state || '-1';
    // 获取订单列表
    wx.showLoading();
    wx.request({
      url: app.globalData.url + '/order/getorder.json',
      method: 'POST',
      data: {
        userId: app.globalData.userId,
        state: state
      },
      success: (res) => {
        wx.hideLoading();
        console.log("res", res.data.data.resultList)
        const orderList = res.data.data.resultList.forEach((item) => {
          item.orderCreateTime = moment(item.orderCreateTime).format('YYYY-MM-DD HH:mm:ss');
        });
        this.setData({
          orderList: res.data.data.resultList
        })
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