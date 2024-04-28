// C:\Users\xxx\WeChatProjects\minicode-1\HardwareConnect\HardwareConnect.js

Page({
  data: {
    deviceList: [],
    showAddDeviceModal: false,
    showEditDeviceModal: false,
    newDeviceName: '',
    newWifiName: '',
    newWifiPassword: '',
    editDeviceId: null,
    editDeviceName: '',
    editWifiName: '',
    editWifiPassword: '',
    managementMode: false,
    selectedDevices: [],
    connectedDeviceId: null
  },

  onLoad(options) {
    // 页面加载时执行的逻辑，可用于初始化
    // 例如：从服务端加载初始设备列表数据
    // this.loadInitialDeviceList();
  },

  onShow() {
    // 页面显示时执行的逻辑，可用于数据更新
    // 例如：从其他页面返回时重新加载数据
    // this.loadInitialDeviceList();
  },

  addDevice() {
    // 显示添加设备弹窗
    this.setData({
      showAddDeviceModal: true
    });
  },

  inputDeviceName(e) {
    // 获取输入的设备名称
    this.setData({
      newDeviceName: e.detail.value
    });
  },

  inputWifiName(e) {
    // 获取输入的WiFi名称
    this.setData({
      newWifiName: e.detail.value
    });
  },

  inputWifiPassword(e) {
    // 获取输入的WiFi密码
    this.setData({
      newWifiPassword: e.detail.value
    });
  },

  saveDevice() {
    // 保存新设备到设备列表
    const newDevice = {
      id: Date.now(), // 使用时间戳作为唯一ID
      name: this.data.newDeviceName,
      wifiName: this.data.newWifiName,
      wifiPassword: this.data.newWifiPassword,
      status: '离线' // 默认状态
    };

    this.setData({
      deviceList: [...this.data.deviceList, newDevice],
      showAddDeviceModal: false,
      newDeviceName: '',
      newWifiName: '',
      newWifiPassword: ''
    });
  },

  cancelAddDevice() {
    // 取消添加设备
    this.setData({
      showAddDeviceModal: false,
      newDeviceName: '',
      newWifiName: '',
      newWifiPassword: ''
    });
  },

  // showDeviceOptions(e) {
  //   if (!this.data.managementMode) {
  //     // 显示设备操作弹窗
  //     const deviceId = e.currentTarget.dataset.id;
  //     const device = this.data.deviceList.find(item => item.id === deviceId);
  //     wx.showModal({
  //       title: device.name,
  //       content: '请选择操作',
  //       confirmText: '连接设备',
  //       cancelText: '修改参数',
  //       success: (res) => {
  //         if (res.confirm) {
  //           this.connectDevice(device);
  //         } else if (res.cancel) {
  //           this.editDevice(deviceId);
  //         }
  //       }
  //     });
  //   }
  // },

//original work
  // showDeviceOptions(e) {
  //   if (!this.data.managementMode) {
  //     // 显示设备操作弹窗
  //     const deviceId = e.currentTarget.dataset.id;
  //     const device = this.data.deviceList.find(item => item.id === deviceId);
  //     wx.showActionSheet({
  //       itemList: ['修改参数', '连接设备'],
  //       success: (res) => {
  //         if (!res.cancel) {
  //           const index = res.tapIndex;
  //           if (index === 0) {
  //             this.editDevice(deviceId);
  //           } else if (index === 1) {
  //             this.connectDevice(device);
  //           }
  //         }
  //       }
  //     });
  //   }
  // },

  showDeviceOptions(e) {
    if (!this.data.managementMode) {
      const deviceId = e.currentTarget.dataset.id;
      const device = this.data.deviceList.find(item => item.id === deviceId);
      let itemList = ['修改参数', '连接设备'];
      if (device.id === this.data.connectedDeviceId) {
        itemList.push('断开连接'); // 如果设备已连接，则添加断开连接选项
      }
      wx.showActionSheet({
        itemList: itemList,
        success: (res) => {
          if (!res.cancel) {
            const index = res.tapIndex;
            if (index === 0) {
              this.editDevice(deviceId);
            } else if (index === 1) {
              this.connectDevice(device);
            } else if (index === 2) {
              this.disconnectDevice(deviceId); // 处理断开连接的逻辑
            }
          }
        }
      });
    }
  },

  disconnectDevice(deviceId) {
    // 获取设备在设备列表中的索引
    const deviceIndex = this.data.deviceList.findIndex(device => device.id === deviceId);
    if (deviceIndex === -1) {
      console.error('设备不存在');
      return;
    }
  
    // 更新设备状态为离线
    const updatedDeviceList = [...this.data.deviceList];
    updatedDeviceList[deviceIndex].status = '离线';
    this.setData({
      deviceList: updatedDeviceList,
      connectedDeviceId: null 
    });
  
    // 断开 Wi-Fi 连接
    wx.stopWifi({
      success: (res) => {
        console.log('Wi-Fi 断开成功', res);
        wx.showToast({
          title: 'Wi-Fi 断开成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('Wi-Fi 断开失败', err);
        wx.showToast({
          title: 'Wi-Fi 断开失败',
          icon: 'none'
        });
      }
    });
  },
  

//   connectDevice(device) {
//     // 连接设备
//     console.log('连接设备', device);
// wx.connectWifi({
//   SSID: 'SSID',
//   password: 'password',
// })
//     if (isConnected) {
//       wx.showToast({
//         title: '连接成功',
//         icon: 'success'
//       });
//     } else {
//       wx.showToast({
//         title: '连接失败，请检查WiFi设置',
//         icon: 'none'
//       });
//     }
//   },

// connectDevice(device) {
//   // 获取设备的 Wi-Fi 名称和密码
//   const wifiName = device.wifiName;
//   const wifiPassword = device.wifiPassword;
// wx.startWifi(){
//     success:()=>{
//  // 连接设备的逻辑
//   wx.connectWifi({
//     SSID: wifiName,
//     password: wifiPassword,
//     success: (res) => {
//       // 连接成功的处理逻辑
//       console.log('连接设备成功', res);
//       wx.showToast({
//         title: '连接设备成功',
//         icon: 'success'
//       });
//       }
//     });
//     },
//     fail: (err) => {
//       // 连接失败的处理逻辑
//       console.error('连接设备失败', err);
//       wx.showToast({
//         title: '连接设备失败，请检查Wi-Fi设置',
//         icon: 'none'
//       });
//     }
//   });
// },


connectDevice(device) {
  // 获取设备的 Wi-Fi 名称和密码
  const wifiName = device.wifiName;
  const wifiPassword = device.wifiPassword;

  // 开启 Wi-Fi 模块
  wx.startWifi({
    success: () => {
      // Wi-Fi 模块开启成功后，连接设备的逻辑
      wx.connectWifi({
        SSID: wifiName,
        password: wifiPassword,
        success: (res) => {
          // 连接成功的处理逻辑
          console.log('连接设备成功', res);
          const updatedDeviceList = this.data.deviceList.map(item => {
            if (item.id === device.id) {
              return { ...item, status: '在线' };
            }
            return item;
          });
          this.setData({
            deviceList: updatedDeviceList,
            connectedDeviceId: device.id
          });
          wx.showToast({
            title: '连接设备成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          // 连接失败的处理逻辑
          console.error('连接设备失败', err);
          wx.showToast({
            title: '连接设备失败，请检查Wi-Fi设置',
            icon: 'none'
          });
        }
      });
    },
    fail: (err) => {
      // Wi-Fi 模块开启失败的处理逻辑
      console.error('Wi-Fi 模块开启失败', err);
      wx.showToast({
        title: 'Wi-Fi 模块开启失败',
        icon: 'none'
      });
    }
  });
},



  editDevice(deviceId) {
    // 修改设备参数
    const device = this.data.deviceList.find(item => item.id === deviceId);
    this.setData({
      editDeviceId: deviceId,
      // editDeviceName: device.name,
      // editWifiName: device.wifiName,
      // editWifiPassword: device.wifiPassword,
      showEditDeviceModal: true
    });
  },

  saveEditedDevice() {
    // 保存修改后的设备参数
    const { editDeviceId, newDeviceName, newWifiName, newWifiPassword } = this.data;
    const updatedDeviceList = this.data.deviceList.map(device => {
      if (device.id === editDeviceId) {
        return {
          ...device,
          name: newDeviceName,
          wifiName: newWifiName,
          wifiPassword: newWifiPassword
        };
      }
      return device;
    });

    // 更新数据，并在数据更新后执行回调函数
    this.setData({
      deviceList: updatedDeviceList,
      showEditDeviceModal: false
    }, () => {
      // 数据更新后执行的操作
      console.log("数据已更新");
      // 这里可以调用其他需要在数据更新后执行的函数
    });
  },

  cancelEditDevice() {
    // 取消编辑设备参数
    this.setData({
      showEditDeviceModal: false
    });
  },

  toggleManageMode() {
    // 切换管理模式
    this.setData({
      managementMode: !this.data.managementMode,
      selectedDevices: []
    });
  },

  selectDevice(e) {
    // 选择设备
    const deviceId = e.detail.value;
    const selectedDevices = [...this.data.selectedDevices];
    if (e.detail.checked) {
      selectedDevices.push(deviceId);
    } else {
      const index = selectedDevices.indexOf(deviceId);
      selectedDevices.splice(index, 1);
    }
    this.setData({
      selectedDevices: selectedDevices
    });
  },

  selectAllDevices(e) {
    // 全选/取消全选设备
    const allDeviceIds = this.data.deviceList.map(device => device.id);
    if (e.detail.value.includes('selectAll')) {
      // 全选
      this.setData({
        selectedDevices: allDeviceIds
      });
    } else {
      // 取消全选
      this.setData({
        selectedDevices: []
      });
    }
  },
  

  deleteDevices() {
    // 删除设备
    const selectedDevices = this.data.selectedDevices;
    if (selectedDevices.length > 0) {
      const updatedDeviceList = this.data.deviceList.filter(device => !selectedDevices.includes(device.id));
      this.setData({
        deviceList: updatedDeviceList,
        selectedDevices: []
      });
    }
  },

  refreshPage() {
    // 模拟页面刷新
    wx.redirectTo({
      url: '/HardwareConnent/HardwareConnent'
    });
  }
});
