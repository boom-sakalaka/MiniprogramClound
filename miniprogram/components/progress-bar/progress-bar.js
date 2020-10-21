// components/progress-bar/progress-bar.js
let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentTimeSec = -1
let duration = 0 // 歌曲总时长 秒
let isMoving = false // 当前的进度条是否在拖动 解决 进度条拖动的时候 和 updatetime 事件有冲突的问题
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00",
    },
    movableDis: 0,
    progress: 0,
  },

  lifetimes: {
    ready() {
      if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this._setTime()
      }
      this._getMovableDis();
      this._bindBGMEvent();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event){
      //console.log('change')
      // 拖动进度条
     
      if(event.detail.source === 'touch'){
        isMoving = true
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
      }
    },
    onTouchEnd(){
      //console.log('touchEnd')
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis
      })
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
    },
    _getMovableDis() {
      const query = this.createSelectorQuery();
      query.select(".movable-area").boundingClientRect();
      query.select(".movable-view").boundingClientRect();
      query.exec((rect) => {
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
        //console.log(movableAreaWidth,movableViewWidth)
      });
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        //console.log("onPlay");
        isMoving = false
        this.triggerEvent('musicPlay')
      });

      backgroundAudioManager.onStop(() => {
        //console.log("onStop");
      });

      backgroundAudioManager.onPause(() => {
        //console.log("Pause");
        this.triggerEvent("musicPause");
      });

      backgroundAudioManager.onWaiting(() => {
        //console.log("onWaiting");
      });

      // 背景音乐可以播放的状态
      backgroundAudioManager.onCanplay(() => {
        //console.log("onCanplay");
        //console.log(backgroundAudioManager.duration)
        if (typeof backgroundAudioManager.duration != "undefined") {
          this._setTime();
        } else {
          setTimeout(() => {
            this._setTime();
          }, 1000);
        }
      });

      backgroundAudioManager.onTimeUpdate(() => {
        //console.log("onTimeUpdate");
        //console.log(isMoving)
        if(!isMoving){
          const currentTime = backgroundAudioManager.currentTime // 当前播放时间
          const duration = backgroundAudioManager.duration // 总时长
          const sec = currentTime.toString().split('.')[0]
          if(sec != currentTimeSec){
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime /duration * 100,
              ['showTime.currentTime'] : `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currentTimeSec = sec
            // 联动歌词
            this.triggerEvent('timeUpdate',{
              currentTime
            })
          }
        }
      });

      backgroundAudioManager.onEnded(() => {
        //console.log("onEnded");
        this.triggerEvent('musicEnd')
      });

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg);
        console.error(res.errCode);
        wx.showToast({
          title: "错误:" + res.errCode,
        });
      });
    },
    _setTime() {
      duration = backgroundAudioManager.duration;
      const durationFmt = this._dateFormat(duration);
      this.setData({
        ["showTime.totalTime"]: `${durationFmt.min}:${durationFmt.sec}`,
      });
    },
    _dateFormat(sec) {
      const min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      return {
        min: this._parse0(min),
        sec: this._parse0(sec),
      };
    },

    // 补零
    _parse0(sec) {
      return sec < 10 ? "0" + sec : sec;
    },
  },
});
