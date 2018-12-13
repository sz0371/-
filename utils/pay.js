function wxpay(app, money, orderId, redirectUrl) {
  // let remark = "在线充值";
  // let nextAction = {};
  // if (orderId != 0) {
  //   remark = "支付订单 ：" + orderId;
  //   nextAction = { type: 0, id: orderId };
  // }
  wx.request({
    url: app.globalData.url + '/order/payfrom.json',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method:'POST',
    data: {
      id: orderId
    },
    success: function(res){
      if(res.data.success){
        // 发起支付
        wx.requestPayment({
          timeStamp:res.data.data.timeStamp,
          nonceStr:res.data.data.nonceStr,
          package:'prepay_id=' + res.data.data.prepayId,
          signType:'MD5',
          paySign:res.data.data.sign,
          fail:function (aaa) {
            wx.showToast({title: '支付失败:' + aaa})
          },
          success:function () {
            wx.showToast({title: '支付成功'})
            wx.redirectTo({
              url: redirectUrl
            });
          }
        })
      } else {
        wx.showToast({ title: '服务器忙' + res.data.code + res.data.msg})
      }
    }
  })
}

module.exports = {
  wxpay: wxpay
}
