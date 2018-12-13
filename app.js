//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     // const appid = 'wx9419e6eb22249376'; //填写微信小程序appid  
    //     // const secret = '6ee196eace058e26316750d2e2f49fe8'; //填写微信小程序secret 
    //     const appid = 'wxbb812ea4670d30b6'; //填写微信小程序appid  
    //     const secret = 'f45827f2569a01f3a3ec957a908bd05d'; //填写微信小程序secret  
    //     console.log("res.code", res.code)
    //     const that  = this;
    //     //调用request请求api转换登录凭证  
    //     wx.request({
    //       url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${res.code}&grant_type=authorization_code`,
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       success: function (res) {
    //         console.log(res.data.openid) //获取openid  
    //         console.log("openId", res.data.openid);
    //         const openid = res.data.openid;
    //         // 获取用户信息
    //         wx.getSetting({
    //           success: res => {
    //             if (res.authSetting['scope.userInfo']) {
    //               // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //               wx.getUserInfo({
    //                 success: res => {
    //                   // 可以将 res 发送给后台解码出 unionId
    //                   that.globalData.userInfo = res.userInfo
    //                   console.log("userInfo", res.userInfo)
    //                   // that.setUserInfo(openid, res.userInfo)
    //                   // // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //                   // // 所以此处加入 callback 以防止这种情况
    //                   // if (this.userInfoReadyCallback) {
    //                   //   this.userInfoReadyCallback(res)
    //                   // }
    //                 }
    //               })
    //             }
    //           }
    //         })
    //       }
    //     })  
    //   }
    // })  
    this.login();
  },

  login: function () {
    const that = this;
    // const userId = that.globalData.userId;
    // 获取用户信息，用户信息如果获取到的话
    // if (userId) {
    //   wx.request({
    //     url: that.globalData.url + '/interface/user/getuserinfo.json',
    //     data: {
    //       id: userId
    //     },
    //     success: function (res) {
    //       if (res.data.success) {
    //         that.globalData.userId = res.data.data.id;
    //         that.globalData.integral = res.data.data.integral;
    //         that.globalData.userInfo = res.data.data;
    //       } else {
    //         wx.showModal({
    //           title: '提示',
    //           content: '无法登录，请重试',
    //           showCancel: false
    //         })
    //       }
    //     }
    //   })
    //   return;
    // }
    wx.login({
      success: function (res) {
        console.log("code",res.code)
        const code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            console.log("res.iv", res.iv);
            console.log('res.encryptedData', res.encryptedData)
            console.log("res.userInfo",res.userInfo)
            that.globalData.userInfo = res.userInfo;
            // 下面开始调用注册接口
            wx.request({
              url: that.globalData.url + '/user/getwxappletuserinfo.json',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: { code: code, encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
              success: (res) => {
                if (res.data.data) {
                  console.log('res.id', res.data.data.id)
                  that.globalData.userId = res.data.data.id;
                } else {
                  that.login();
                }
                wx.hideLoading();
              }
            })
          },
          fail: function () {
            // 调用微信弹窗接口
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权，将无法正常使用EIO环保联盟的功能体验。请删除小程序重新进入。',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    url: 'http://121.40.85.201:8084/jkgoshop',
    userId: '8a2b45b362af72890162af7289850000'
  }
})