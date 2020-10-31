// components/blog-ctrl/blog-ctrl.js
const db = wx.cloud.database()
let userInfo = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String
  },

  externalClasses: ['iconfont','icon-pinglun','icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    // 登陆组件是否显示
    loginShow: false,
    // 底部弹出层是否显示
    modalShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                //console.log(res)
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          } else {
            this.setData({
              loginShow: true,
            })
          }
        }
      })
    },
    onLoginsuccess(userInfo) {
      // 授权框消失, 评论框显示
      this.setData({
        loginShow: false
      },() => {
          userInfo = userInfo
         // 显示评论弹出层
         this.setData({
          modalShow: true,
        })
        
      })
    },
    onLoginfail(res) {
      wx.showModal({
        title: "授权用户才能进行评价",
        content: '',
      })
    },
    onSend(event) {
      //插入数据库
      console.log(event)
      let content = event.detail.value.content
      let formId = event.detail.formId
      if(content.trim() == ''){
        wx.showModal({
          title: '评论内容不能为空',
          content: ''
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask: true,
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
         // 推送模板消息
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            content,
            formId,
            blogId: this.properties.blogId,
            nickName: userInfo.nickName,
          }
        }).then(res => {
          console.log(res)
        })


        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow : false,
          content: ''
        })
      })
    },
  }
})
