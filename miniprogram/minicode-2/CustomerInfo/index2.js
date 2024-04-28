// index.js
Page({
  data: {
    userInfo: null
  },
  onLoad: function () {
    // 在页面加载时检查用户是否已经登录
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      });
    }
  },
  login: function () {
    // 用户点击登录按钮，调用微信登录接口
    wx.login({
      success: (res) => {
        // 获取用户信息
        wx.getUserInfo({
          success: (res) => {
            const userInfo = res.userInfo;
            // 将用户信息存储到本地
            wx.setStorageSync('userInfo', JSON.stringify(userInfo));
            this.setData({
              userInfo: userInfo
            });
          }
        });
      }
    });
  },
  gotoAboutMe: function () {
    // 跳转到关于界面
    wx.navigateTo({
      url: '/about/about'
    });
  },
  gotoSettings: function () {
    // 跳转到设置界面
    wx.navigateTo({
      url: '/settings/settings'
    });
  }
});
