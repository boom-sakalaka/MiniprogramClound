const MAX_WORDS_NUM = 140
const MAX_IMG_NUM = 9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true
  },

  onInput(event) {
    let wordsNum = event.detail.value.length
    if(wordsNum >= MAX_WORDS_NUM){
      wordsNum = `最大次数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
  },
  onFocus(event) {
    console.log(event.detail)
    this.setData({
      footerBottom: event.detail.height
    });
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  onChooseImage() {
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        max =  MAX_IMG_NUM - this.data.images.length
          this.setData({
            selectPhoto: max <= 0 ? false : true
          })
      },
    })
  },
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },
  send() {
    // 数据 -> 云数据库
    // 数据库: 内容` 图片
    // 图片 云存储
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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