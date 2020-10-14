// pages/player/player.js
let  musiclist = [];
// 当前正在播放歌曲的数值
let nowPlayingIndex = 0;
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl : '',
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist') || []
    this._loadMusicDetail(options.musicId)
  },

  _loadMusicDetail(musicId) {
    backgroundAudioManager.stop()
    let music = musiclist[nowPlayingIndex]
    //console.log(music);
    wx.setNavigationBarTitle({
      'title':  music.name
    })
    this.setData({
      picUrl: music.al.picUrl
    })
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url : 'musicUrl'
      }
    }).then(res => {
      //console.log(res)
      const result = res.result
      backgroundAudioManager.src = result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
  },

  togglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
     isPlaying: !this.data.isPlaying
    })
  },

  onPrev() {
    nowPlayingIndex--
    if(nowPlayingIndex < 0){
      nowPlayingIndex = musiclist.length -1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  
  onNext() {
    nowPlayingIndex++
    if(nowPlayingIndex === musiclist.length){
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
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