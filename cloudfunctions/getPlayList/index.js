// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const axios = require("axios");
const URL = `https://apis.imooc.com/personalized?icode=1E869A26F5C13737`;
const playlistCollection = db.collection("playlist");
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取集合中的数据 做去重处理
  // const list = await playlistCollection.get();
  const { total } = await playlistCollection.count();
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get();
    tasks.push(promise);
  }
  let list = {
    data: [],
  };

  if (tasks.length) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
      };
    });
  }

  const { data } = await axios.get(URL);
  if (data.code >= 1000) {
    console.log(data.msg);
    return 0;
  }
  const playlist = data.result;

  const newData = [];
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true;
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false;
        break;
      }
    }
    if (flag) {
      newData.push(playlist[i]);
    }
  }
  console.log(newData.length);
  // 插入数据 批量处理
  if (newData.length) {
    await playlistCollection
      .add({
        data: [...newData],
      })
      .then((res) => {
        console.log("插入成功");
      })
      .catch((err) => {
        console.error("插入失败");
      });
  }
};
