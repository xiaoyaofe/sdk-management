
type DeviceTypes = {
  ios: boolean,
  iPhone: boolean,
  iPad: boolean,
  android: boolean,
  win: boolean
}


export class DeviceManager {
  private static _ins: DeviceManager;
  static get instance(): DeviceManager {
    return this._ins || new DeviceManager();
  }
  private _deviceType: 'ios' | 'iPhone' | 'iPad' | 'Android' | 'Windows' | 'unknow' = 'unknow';
  private _deviceTypes: DeviceTypes;
  private _deviceMsg: DeviceMsg;
  constructor() {
    var u = navigator.userAgent;
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) this._deviceType = 'ios';
    if (u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1) this._deviceType = 'iPhone';
    if (u.indexOf('iPad') > -1) this._deviceType = 'iPad';
    if (u.indexOf('Android') > -1) this._deviceType = 'Android';
    if (u.indexOf('Windows')) this._deviceType = 'Windows';
    this._deviceTypes = this.getDeviceTypes();
  }

  get type() {
    return this._deviceType;
  }
  get deviceType() {
    return this._deviceTypes || this.getDeviceTypes()
  }
  getDeviceTypes() {
    var u = navigator.userAgent;
    return this._deviceTypes = {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1,
      android: u.indexOf('Android') > -1,
      win: u.indexOf('Windows') > -1
    }
  }
}


export function getNetworkType() {
  var ua = navigator.userAgent;
  var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  var result: number;
  /* 网络 0=wifi 1 = 3g 2=其他  4g直接按3g*/
  switch (networkStr) {
    case 'wifi':
      result = 0;
      break;
    case '4g':
      result = 1;
      break;
    case '3g':
      result = 1;
      break;
    case '3gnet':
      result = 1;
      break;
    default:
      result = 2;
  }
  return result;
}
// 获取手机的设备类型和操作系统
export function getOsAndModel() {
  // http://hgoebl.github.io/mobile-detect.js/
  let MobileDetect: any; //这里使用的是一个外部库，如要使用，请加载MobileDetect
  //判断数组中是否包含某字符串
  const contains = function (needle, that) {
    for (i in that) {
      if (that[i].indexOf(needle) > 0)
        return i;
    }
    return -1;
  }

  var device_type = navigator.userAgent;//获取userAgent信息
  document.write(device_type);//打印到页面
  var md = new MobileDetect(device_type);//初始化mobile-detect
  var os = md.os();//获取系统
  var model = "";
  if (os == "iOS") {//ios系统的处理
    os = md.os() + md.version("iPhone");
    model = md.mobile();
  } else if (os == "AndroidOS") {//Android系统的处理
    os = md.os() + md.version("Android");
    var sss = device_type.split(";");
    var i = contains("Build/", sss);
    if (i > -1) {
      model = sss[i].substring(0, sss[i].indexOf("Build/"));
    }
  }
  alert(os + "---" + model);//打印系统版本和手机型号
  /* 作者：昕鸿
  来源：CSDN
  原文：https://blog.csdn.net/szs860806/article/details/70316556
  版权声明：本文为博主原创文章，转载请附上博文链接！ */
}
