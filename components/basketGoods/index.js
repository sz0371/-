// components/basketGoods/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    number: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选中
    buyIt() {
      console.log("number",this.data.number)
    },
    // 增加数量
    _addNumber() {
      const number = this.data.number + 1;
      this.setData({
        number,
      })
    },
    // 减少数量
    _cutNumber() {
      if (this.data.number <= 1) {
        return;
      }
      const number = this.data.number - 1;
      this.setData({
        number,
      })
    },
  }
})
