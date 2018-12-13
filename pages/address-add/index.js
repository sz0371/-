var commonCityData = require('../../utils/city.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    region: ['浙江省', '杭州市', '滨江区'],
  },
  bindCancel:function () {
    wx.navigateBack({})
  },
  bindSave: function(e) {
    var that = this;
    console.log("that",that)
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;

    if (linkMan == ""){
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel:false
      })
      return
    }
    if (mobile == ""){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false
      })
      return
    }
    if (this.data.selProvince == "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (this.data.selCity == "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (address == ""){
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel:false
      })
      return
    }
    // 新增，修改判断
    var apiAddoRuPDATE = "add";
    var apiAddid = that.data.id;
    console.log("apiAddid", apiAddid)
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = '';
    }
    // console.log("linkMan", linkMan)
    // console.log("address", address)
    // console.log("mobile", mobile)
    // console.log("cityName", cityName)
    // console.log("districtName", districtName)
    // console.log("provinceName", provinceName)
    wx.request({
      url: app.globalData.url + '/user/addaddress.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        address: this.data.region.join(","),
        cityArea: address,
        name: linkMan,
        phone: mobile,
        userId: app.globalData.userId,
        id: apiAddid
      },
      success: (res) => {
        if (!res.data.success) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel:false
          })
          return;
        }
        const addressId = res.data.data.id;
        console.log("addressId", addressId)
        wx.request({
          url: app.globalData.url + '/user/setdefultaddress.json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            id: addressId,
            isDefault: 'Y',
            userId: '8a2b45b362af72890162af7289850000'
          },
          success: (res) => {
            if (!res.data.success) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '失败',
                content: res.data.msg,
                showCancel: false
              })
              return;
            }
            // 跳转到结算页面
            wx.navigateBack({})
          }
        })
      }
    })
  },
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  onLoad: function (e) {
    var that = this;
    var id = e.id;
    console.log("id",id)
    if (id) {
      // 初始化原数据
      wx.showLoading();
      wx.request({
        url: app.globalData.url + '/user/getaddress.json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          id: id,
          userId: app.globalData.userId
        },
        success: (res) => {
          wx.hideLoading();
          // console.log("res",res.data.data)
          if (res.data.success) {
            const ads = res.data.data[0];
            console.log('ads', ads.address.split(","))
            this.setData({  
              id: ads.id,      
              addressData: {
                id: ads.id,
                linkMan: ads.name,
                mobile: ads.phone,         
                address: ads.cityArea
              },
              region: ads.address.split(","),
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '无法获取快递地址数据',
              showCancel: false
            })
          } 
        }
      });
    }
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log("id",id)
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/user/deladdress.json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              userId: app.globalData.userId,
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
