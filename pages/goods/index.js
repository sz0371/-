const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    comments: [],
    commentsCount: '',
    isBasket: false,
    number: 1, // 商品数量默认1
    standard: {}, // 增加格式化后的规格
    selectStandard: [],
    selectTags: [], // 用户判断是否选择
    selectsureStandard: {}, // 最后选中的规则
    linkto: '', // 立即购买还是加入购物车
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options",options.id)
    this.getDetail(options.id);
    this.getComment(options.id);
    // 8a2b45b361db260b0161db6fdf410009
  },

  // 获取商品详情
  getDetail(id) {
    wx.request({
      url: app.globalData.url + '/product/getinfobyid.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id,
        userId: app.globalData.userId
      },
      success: (res) => {
        const that = this;
        WxParse.wxParse('imagesList', 'html', res.data.data.detail, that, 5);
        const photoAlbum = res.data.data.photoAlbum.split(',');
        res.data.data.photoAlbum = photoAlbum;
        this.setData({
          goods: res.data.data,
        })
      }
    })
  },

  // 获取评价列表
  getComment(id) {
    wx.request({
      url: app.globalData.url + '/product/getcommentlist.json',
      method: 'POST',
      data: {
        productId: id,
        userId: app.globalData.userId
      },
      success: (res) => {
        this.setData({
          comments: res.data.data.resultList,
          commentsCount: res.data.data.pageInfo.allcount
        })
      }
    })
  },

  // 获取商品规格
  getStandard(id) {
    wx.request({
      url: app.globalData.url + '/product/getstandarddatabyid.json',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        productId: id,
        userId: app.globalData.userId
      },
      success: (res) => {
        const keyNamesGroup = [];
        const keyValuesGroup = [];
        const _keyValuesGroup = [];
        res.data.data.forEach((item) => {
          const keyNameGroup = item.standardKeyName.split(',');
          keyNameGroup.forEach((group,index) => {
            const namesGroup = group.split("_");
            if (keyNamesGroup.indexOf(namesGroup[0]) == -1) {
              keyNamesGroup.push(namesGroup[0])
            }
            if (_keyValuesGroup.indexOf(namesGroup[1]) == -1) {
              _keyValuesGroup.push([index,namesGroup[1]])
            }
          })
        });
        res.data.keyNamesGroup = keyNamesGroup;
        keyNamesGroup.forEach((item,index) => {
          const array = [];
          _keyValuesGroup.forEach((group)=> {
            if (index == group[0]) {
              if (array.indexOf(group[1]) == -1) {
                array.push(group[1]);
              }
            }
          });
          keyValuesGroup.push(array)
        });
        res.data.keyValuesGroup = keyValuesGroup;

        // 确定需要选择的规则
        const selectStandard = [];
        res.data.keyNamesGroup.forEach((item) => {
          const obj = {};
          obj.index = item;
          obj.tag = '';
          selectStandard.push(obj);
        });
        this.setData({
          standard: res.data,
          selectStandard
        });
        console.log('selectStandard', selectStandard)
        console.log("keyNamesGroup", keyNamesGroup)
        console.log("_keyValuesGroup", _keyValuesGroup)
        console.log("keyValuesGroup", keyValuesGroup)
        console.log("res.data.keyNamesGroup", res.data)
      }
    })
  },

  // 选择规则
  chooseStandard(e) {
    const dataset = e.target.dataset;
    console.log('dataset', dataset)
    const selectStandard = this.data.selectStandard;
    selectStandard.forEach((item) => {
      if (item.index == dataset.index) {
        item.tag = dataset.tag;
      }
    });
    const selectTags = ['0']; 
    selectStandard.forEach((item) => {
      selectTags.push(item.tag)
    })
    this.setData({
      selectStandard,
      selectTags
    });
    console.log("selectTags", selectTags)
    console.log("selectStandard", selectStandard)
  },

  // 是否有选择规则的商品，有则添加，无则提示
  hasThisStandard(callback) {
    const keyName = [];
    this.data.selectStandard.forEach((item) => {
      keyName.push(item.index + '_' + item.tag);
    });
    const standardKeyName = keyName.join(',');
    let selectsureStandard = this.data.selectsureStandard;
    this.data.standard.data.forEach((item) => {
      if (standardKeyName == item.standardKeyName) {
        selectsureStandard = item;
      }
    });
    if (!selectsureStandard.id) {
      wx.showModal({
        title: '提示',
        content: '请选择产品规格，或已没有此产品',
        showCancel: false
      })
    }

    this.setData({
      selectsureStandard
    });
    console.log("selectsureStandard", selectsureStandard)
    callback(selectsureStandard);
  },

  // 获取筛选商品规则
  selectStandard(e) {
    const dataset = e.target.dataset;
    console.log('dataset', dataset)
    this.setData({
      isBasket: true,
      linkto: dataset.num
    })
    // console.log("goods",this.data.goods)
    this.getStandard(this.data.goods.id);
  },

  // 取消筛选规格
  cancleStandard() {
    this.setData({
      isBasket: false
    })
  },

  // 获取价格
  getPrice() {

  },

  // 增加数量
  addNumber() {
    const number = this.data.number + 1;
    this.setData({
      number, 
    })
  },
  // 减少数量
  cutNumber() {
    if (this.data.number <= 1) {
      return;
    }
    const number = this.data.number - 1;
    this.setData({
      number,
    })
  },
  // 立即购买
  buyNow() {
    this.selectStandard()
  },

  // 加入购物车
  putBasket() {
    this.selectStandard();
  },

  submitBuyBtn() {
    const that = this;
    // if (this.data.linkto == '立即购买') {
    //   var todo = function() {
    //     console.log('立即购买')
    //     wx.navigateTo({
    //       url: app.globalData.url + '/pages/goods/buynow/index'
    //     })
    //   }
    // }
    // if (this.data.linkto == '加入购物车') {
      var todo = function (product) {
        const number = that.data.number;
        console.log('加入购物车', product);
        wx.request({
          url: app.globalData.url + '/cart/addshoppingcart.json',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            productId: product.productId,
            productNum: number,
            standardDataId: product.id,
            userId: app.globalData.userId
          },
          success: (res) => {   
            if (!res.data.success) {
              wx.showModal({
                title: '提示',
                content: '无法加入购物车',
                showCancel: false
              })
            } else {
              wx.switchTab({
                url: '/pages/shop-cart/index',
              })
            }
          }
        });
      } 
    // }  
    this.hasThisStandard(todo);
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