// index.js
// const AV = require('./libs/av-weapp-min.js');
Page({
  data: {
    imageSelectedName: '', // 选中的图片名称
    imageFilePath: '', // 图片文件路径
    descriptionLength: 0, // 描述字数
    videoUrl: '', // 视频的URL
    actionDescription: '' ,// 用户输入的动作描述
    isImageChosen: false, // 默认没有图片被选中
    gifUrl: '',  // 更新这里为实际的GIF文件路径
    loading:false,
    host: '' // ESP32的IP地址

  },
  chooseImage: function() {
    const that = this;
    wx.chooseImage({
      count:1,//默认9
      sizeType:['original'],
      sourceType:['album','camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          imagePaths: res.tempFilePaths, // 保存整个数组
          // imageSelectedName: tempFilePaths[0].split('/').pop(), // 获取文件名
          imageSelectedName:1,
          isImageChosen: true // 标记已选择图片
        });
        // 更新上传按钮状态等逻辑（根据实际情况编写）
      }
    })
  },
  inputActionDescription: function(e) {
    this.setData({
      actionDescription: e.detail.value,
      descriptionLength: e.detail.value.length
    });
  },
  submitUpload: function() {
    const that = this;
    
    if (this.data.actionDescription) {

      this.delayDisplayGif();  // 页面加载完成时调用函数
      


      
      // that.setData({
      //   gifUrl: '/image/blink.gif' 
      // });
    
      // wx.request({
      //   url: 'http://127.0.0.1:9999/requestVideo', // 服务器地址，需要替换成真实可用的HTTPS地址
      //   method: 'GET', // 请求方法
      //   data: {
      //     filename: '1' // 请求参数
      //   },
      //   success: function(requestRes) {
      //     // 请求成功后，使用返回的数据进行下载操作
      //     if (requestRes.statusCode === 200 && requestRes.data) {
      //       // 假设返回的数据中包含了视频的下载链接
      //       var downloadUrl = 'http://127.0.0.1:9999/requestVideo?filename=1'; // 根据实际返回的数据结构获取URL
      //       console.log('下载链接:', downloadUrl); // 打印视频链接
      //       // 使用wx.downloadFile下载视频
      //       wx.downloadFile({
      //         url: downloadUrl, // 下载链接
      //         success: function(downloadRes) {
      //           if (downloadRes.statusCode === 200) {
      //             // 设置文件路径到页面数据，用于显示视频
      //             that.setData({
      //               videoUrl: downloadRes.tempFilePath
      //             });
      //             // 可以在这里添加其他逻辑，比如将视频显示到页面上
      //           } else {
      //             // 下载失败的处理
      //             wx.showToast({
      //               title: '下载失败',
      //               icon: 'none'
      //             });
      //           }
      //         },
      //         fail: function() {
      //           // 下载失败的处理
      //           wx.showToast({
      //             title: '下载失败',
      //             icon: 'none'
      //           });
      //         }
      //       });
      //     } else {
      //       // 请求失败的处理
      //       wx.showToast({
      //         title: '请求视频失败',
      //         icon: 'none'
      //       });
      //     }
      //   },
      //   fail: function() {
      //     // 请求失败的处理
      //     wx.showToast({
      //       title: '请求视频失败',
      //       icon: 'none'
      //     });
      //   }
      // });
    
  

      
      
    } else {
      wx.showToast({
        title: '动作描述不能为空',
        icon: 'none'
      });
    }
  },

  delayDisplayGif: function() {
    const that = this;
    this.setData({
      loading: true  // 显示加载动画
    });

    setTimeout(function() {
      that.setData({
        gifUrl: '/image/blink.gif',  // 设置GIF图片的路径
        loading: false  // 隐藏加载动画
      });
    }, 8000);  // 延时8秒

    

    
  },

  castScreen: function() {
    console.log("发送投屏信号到ESP32");
    // 例如使用wx.request发送信号到ESP32
    wx.request({
      url: 'http://192.168.4.1/show-image',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '投屏成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '投屏失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  resetPage: function() {
    // 重置所有状态到初始值
    this.setData({
      gifUrl: '',
      loading: false,
      imageSelectedName: '',
      imageFilePath: '',
      descriptionLength: 0,
      videoUrl: '',
      actionDescription: '',
      isImageChosen: false,
      host: '' // ESP32的IP地址

    });
  },

  clearScreen: function() {
    this.resetPage();
    console.log("清空屏幕");
  }

  

  
  
  // goToUpload: function() {
  //   // 设置导航到图片上传页的逻辑
  // },
  // goToConnect: function() {
  //   // 设置导航到硬件连接页的逻辑
  // },
  // goToProfile: function() {
  //   // 设置导航到个人信息页的逻辑
  // }
});
