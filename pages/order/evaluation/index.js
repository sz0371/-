import $wuxRater from '../../../templates/rater/rater';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      id: '001',
      text: 'Face',
      value: 1,
    },{
      id: '002',
      text: 'Eye',
      value: 2,
    }],
    content: '',
    range: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log("option",option.orderId)
    this.setData({
      orderId: option.orderId || ''
    });
    const that = this;
    console.log("$wuxRater", $wuxRater)
    $wuxRater.init('star', {
      value: 5,
      callback(value, data, text) {
        console.log(value)
        if (value <= 4) {
          that.setData({
            range: '3'
          })
        }
        if (value <= 2) {
          that.setData({
            range: '2'
          })
        }  
        if (value == 5) {
          that.setData({
            range: '1'
          })
        }
      }
    })

    this.data.items.forEach(n => $wuxRater.init(n.id, {
      value: n.value,
    }))
  },
  
  // 评价
  onEvaluation() {
    const { content, range, orderId} = this.data;
    console.log("content", content, 'range', range, 'orderId', orderId)
    wx.request({
      url: app.globalData.url + '/order/addcommentlist.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId,
        userId: app.globalData.userId,
        content
      },
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          });   
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: '失败',
            icon: 'fail',
            duration: 2000
          })
        }
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