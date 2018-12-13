import WxValidate from '../../../utils/WxValidate';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['浙江省', '杭州市', '滨江区'],
    isDefault: true,
    address: '',
    name: '',
    phone: '',
    id: '',
    goodsId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options',options)
    this.setData({
      goodsId: options.goodsId
    })
    if (options.obj) {
      const obj = JSON.parse(options.obj);
      console.log("obj", obj)
      const isDefault = obj.isDefault == 'Y' ? true : false
      console.log('isDefault', isDefault)
      this.setData({
        name: obj.name,
        address: obj.address,
        phone: obj.phone,
        id: obj.id,
        region: obj.cityArea.split(','),
        isDefault
      })
    }
    this.initValidate();
  },

  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  checkboxChange(e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value[0])
    const isDefault = e.detail.value[0] == 'false' ? true : false;
    this.setData({
      isDefault
    })
  },

  formSubmit: function (e) {
    // console.log('e',e.detail.value)
    const params = e.detail.value;
    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    const isDefault = this.data.isDefault == true ? 'Y' : 'N';
    wx.request({
      url: app.globalData.url + '/useraddress/modify.json',
      data: {
        userId: app.globalData.userId,
        phone: params.phone,
        id: this.data.id,
        cityArea: this.data.region.join(","),
        address: params.address,
        isDefault,
        name: params.name
      },
      success: (data) => {
        wx.redirectTo({
          url: `/pages/user/address/index?id=${this.data.goodsId}`
        })
      }
    })
  },

  initValidate() {
    const rules = {
      name: {
        required: true
      },
      phone: {
        required: true,
        tel: true
      },
      cityArea: {
        required: true
      },
      address: {
        required: true
      }
    };
    const messages = {
      name: {
        required: '联系人必填'
      },
      phone: {
        required: '联系电话必填'
      },
      cityArea: {
        required: '地址必填'
      },
      address: {
        required: '详细地址必填'
      }
    };
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages);
  },

  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
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