//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    // youhuijine: 0, //优惠券金额
    // curCoupon: null // 当前选择使用的优惠券
  },
  onShow: function () {
    var that = this;
    var shopList = [];
    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    that.initShippingAddress();
  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType
    });
  },

  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder: function (e) {
    wx.showLoading();
    var that = this;
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

    var postData = {
      ids: that.data.goodsJsonStr,
      remark: remark,
      userId: app.globalData.userId,
      payBalance: 0
    };
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
      // 收货地址
      postData.addressId = that.data.curAddressData.id;
      console.log("收货地址", postData.addressId)
    }
    wx.request({
      url: app.globalData.url + '/order/add.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的 参数
      success: (res) => {
        wx.hideLoading();
        if (!res.data.success) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        if (e && "buyNow" != that.data.orderType) {
          // 清空购物车数据
          wx.removeStorageSync('shopCarInfo');
        }
        // 下单成功，跳转到订单管理界面
        wx.redirectTo({
          // url: "/pages/order-list/index"
          url: "/pages/order/index"
        });
      }
    })
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/user/getaddress.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: app.globalData.userId
      },
      success: (res) => {
        console.log("res",res.data.data)
        const addressList = res.data.data;
        const defaultAddressData = addressList.filter((item) => {
          return item.isDefault == 'Y';
        });
        console.log("defaultAddressData", defaultAddressData)
        if (defaultAddressData.length > 0) {
          that.setData({
            curAddressData: defaultAddressData[0]
          })
        } else {
          that.setData({
            curAddressData: null
          });
        }
        that.processYunfei();
      }
    })
  },
  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.productPrice * carShopBean.productNum;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }

      goodsJsonStrTmp += carShopBean.productId + '_' + carShopBean.productNum + '_' + carShopBean.standardDataId;
      goodsJsonStr += goodsJsonStrTmp;
    }
    console.log('goodsJsonStr', goodsJsonStr);
    console.log('allGoodsPrice', allGoodsPrice);
    that.setData({
      isNeedLogistics: 1, // 默认都需要物流信息
      goodsJsonStr: goodsJsonStr,
      allGoodsPrice: allGoodsPrice,
    });
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  }
})
