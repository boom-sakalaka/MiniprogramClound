// pages/demo/demo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    arr: ["wxml", "wxss", "json", "js"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用 let const 定义变量 块级作用域 比较安全 省资源
    // 定义对象用字面量的方式
    // 高内聚 低耦合
    wx.cloud
      .callFunction({
        name: "login",
      })
      .then((res) => {
        this.setData({
          openid: res.result.openid,
        });
      });
    this.fooTow();
  },
  async fooTow() {
    let res = await this.foo();
    console.log(res);
  },
  foo() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("resolved");
      }, 1000);
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
