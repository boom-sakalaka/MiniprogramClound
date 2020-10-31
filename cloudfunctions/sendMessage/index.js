// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID,nickName } = cloud.getWXContext()
  const result =  await cloud.openapi.templateMessage.send({
    touser: OPENID,
    pages: `pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      name: {
        value: event.nickName
      },
      thing1: {
        value: event.content
      },
      templateId: 'WojKzpQRWsM-mrgXnl2Jk9CICRHiw1VLm4tjRMq07pY',
      formId: event.formId
    }
  })
  return result
}