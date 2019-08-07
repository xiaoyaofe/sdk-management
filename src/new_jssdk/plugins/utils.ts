/**
 * create zongjiang
 * time 2019/5/10
 * decriptrion 通用的工具方法,将一个对象序列化、查询参数的转对象、对象转查询参数、
 * 当方法太多时，大于1500行时，可以考虑建一个utils文件夹，将方法分类
 */

export function getObjectKeyValueStr(pre: string = '', connector: string = ',', func: (str: snb) => string, obj: { [key: string]: snb }) {
  var str = pre;
  Object.keys(obj).forEach(key => str += `${func(key)}=${func(obj[key])}${connector}`);
  return str.length === pre.length ? '' : str.slice(0, str.length - 1);
}

export function getUrlParam(url: string) {

  let result = {};
  if (url.indexOf('?') !== -1) {
    url.slice(url.indexOf('?') + 1).split(/&/)
      .forEach(item => (result[decodeURIComponent(item.split(/=/)[0])] = decodeURIComponent(item.split(/=|%3D/)[1])));
  }
  return result
}

export function setUrlParam(obj: { [key: string]: snb }) {

  return getObjectKeyValueStr('?', '&', encodeURIComponent, obj)
}

type loadJsParams = {
  success?: Function;
  error?: Function;
  id?: string;
  asyncLoad?: boolean;
  deferLoad?: boolean;
}

export function loadJs(url: string, params?: loadJsParams) {
  var js, fjs = document.getElementsByTagName('script')[0];
  if (params.id && document.getElementById(params.id)) return;
  js = document.createElement("script");
  js.src = url;
  params.asyncLoad && (js.async = true);
  params.deferLoad && (js.defer = true);
  params.id && (js.id = params.id);
  if (params.success) {
    js.onload = function (ev) {
      params.success(ev);
    };
  }
  if (params.error) {
    js.onerror = function (ev) {
      params.error(ev);
    }
  }
  fjs.parentNode ? fjs.parentNode.insertBefore(js, fjs) : document.body.appendChild(js);
}


export function initDebugger() {
  return new Promise((resolve, reject) => {
    loadJs("//cdnjs.cloudflare.com/ajax/libs/vConsole/3.2.0/vconsole.min.js", {
      success: function () {
        new VConsole();
        resolve()
      },
      error: function () {
        reject();
      }
    });
  })
}

export function polyfill(polyfillsArr: string[], polyfillUrl: string, Polyfilled: Function) {
  let features = [];
  polyfillsArr.forEach(feature => {
    if (!(feature in window)) features.push(feature);
  })
  if (!polyfillsArr.length) return Polyfilled();
  loadJs(`${polyfillUrl}?features=${polyfillsArr.join(',')}&flags=gated,always&rum=0`, {
    success: Polyfilled
  });
}

export function facebookJssdkInit(fbAppId: string) {
  // window._RG.facebookSdkLoad = true;
  return new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: fbAppId,
        status: true,
        xfbml: true,
        version: FBVersion
      });
      resolve();
    }
    loadJs("https://connect.facebook.net/en_US/sdk.js", {
      id: 'facebook-jssdk',
      success: function () {
        console.info('facebook sdk load finish.');
      },
      error: function () {
        reject("facebook sdk load failed!!!");
      }
    })
  })
}

export function adjustSdkLoad() {
  return new Promise((resolve, reject) => {
    import("Src/plugins/adjust.min.js" as any)
      .then(() => {
        if (Adjust) {
          resolve();
        } else {
          reject("load Adjust failed");
        }
      })
      .catch(err => {
        reject("load Adjust failed" + err);
      });
  });
}

export async function getSdk(sdkType: PlatformType, advChannel: number) {
  const types = {
    1: "web",
    2: "native",
    3: 'facebook_web_game',
    4: "facebook_instant_game"
  }
  return import('../kinds/' + types[sdkType]).then((res) => {
    return res.default;
  });
}

export function getSdkType(advChannel: number) {
  let type: PlatformType;
  if (this.config.advChannel > 30000 && this.config.advChannel < 31000) {
    type = 1;
  } else if (this.config.advChannel < 30000) {
    type = 2;
  } else if (this.config.advChannel > 31000 && this.config.advChannel < 32000) {
    type = 3;
  } else if (this.config.advChannel > 32000 && this.config.advChannel < 33000) {
    type = 4;
  }
  return type;
}
/* 准备去掉所有的的配置,配置在服务端，暂时只有一个配置火影忍者 */
/* export async function getGameConfig(appId: number, advChannel: number) {

  return Promise.all([import('../config/game_config'), import('../config/i18n')])
    .then((values) => {
      const config = values[0].default[appId][advChannel] || values[0].default[appId].default;
      const i18n = values[1].default[config.language];
      return Object.assign(config, {
        appId,
        advChannel,
        i18n
      })
    }).catch(e => {
      console.info('game config or i18n load failed', e);
    })
} */

export function getDeviceType() {
  const u = navigator.userAgent;
  return {
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
    iPad: u.indexOf('iPad') > -1,
    android: u.indexOf('Android') > -1,
    win: u.indexOf('Windows') > -1
  }
}

export function getParameterByName(name: string) {

  const key = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

// 尽量不去改变系统对象上的方法，可能会对一些第三方的库造成影响
export function formatDate(dateObj: Date, fmt: string) {
  if (!(dateObj instanceof Date)) throw "dateObj is not Date instance";

  var o = {
    "M+": dateObj.getMonth() + 1, //月份
    "d+": dateObj.getDate(), //日
    "h+": dateObj.getHours(), //小时
    "m+": dateObj.getMinutes(), //分
    "s+": dateObj.getSeconds(), //秒
    "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
    "S": dateObj.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
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

export function facebookLogin() {

}

function fbResHandle(data: fbUserInfo) {
  var info: info = { userName: 'fb-' + data.id };
  data.name && (info.nickName = data.name);
  data.email && (info.email = data.email);
  data.birthday && (info.birthday = data.birthday);
  data.gender && (info.sex = data.gender === 'male' ? 0 : 1);
  return info;
}
// 检查facebook登录
export function checkFbLogin(): Promise<info | void> {
  return new Promise((resolve, reject) => {
    FB.getLoginStatus(_res => {
      const response = _res.authResponse;
      const userID = response.userID;
      if (response && userID) {
        FB.api('/me', 'GET', { "fields": "name,email,birthday,gender,id" },
          (res: fbUserInfo) => {
            !res.id && (res.id = userID);
            if (res) resolve(fbResHandle(res));
            else resolve(fbResHandle({ id: userID }));
          });
      } else {
        reject('facebook getLoginStatus failed');
      }
    })
  })
}
// web端的facebook登录
export async function webFBLogin(appId: string, baseUrl: string) {
  let data: initFBParams = {
    userName: '',
    password: '',
    appId,
    accountType: 2,
    thirdPartyId: '',
    email: '',
    telephone: '',
    userChannel: 0,
  }
  // facebook自动登录
  let res = await checkFbLogin().catch(err => console.log(err));
  if (res) {
    return res;
  }
  return new Promise((resolve, reject) => {
    FB.login(response => {
      if (response.status === "connected") {
        var userID = response.authResponse.userID;
        FB.api('/me', 'GET', { "fields": "name,email,birthday,gender,id" },
          (res: fbUserInfo) => {
            !res.id && (res.id = userID);
            resolve(fbResHandle(res));
          });
      } else {
        reject(response.status);
      }
    }, {
        scope: 'email' // ,user_birthday,user_gender
      })
  })
}
// 原生端的facebook登录
export function nativeFBLogin(fb_app_id: string) {
  // 这个code值是facebook登录后，自动携带的参数
  let index = location.href.indexOf('&code=');
  let url = index === -1 ? location.href : location.href.substr(0, index);
  location.href = `https://www.facebook.com/${FBVersion}/dialog/oauth?client_id=${fb_app_id}&redirect_uri=${encodeURIComponent(url)}&t=${Date.now()}`;
}

export function FBInstantGameLogin() {
  /*  this.reqRegister(params, {
     response: {
       userID: FBInstant.player.getID() || 'test'
     }, resolve, reject
   }) */
}


type fbUserInfo = {
  name?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  id: string;
}

interface info {
  nickName?: string;
  email?: string;
  birthday?: string;
  sex?: 0 | 1;
  userName: string;
}

interface initFBParams {
  userName: string;
  password: string;
  appId: string;
  accountType: AccountType;
  thirdPartyId: string;
  email: string;
  telephone: string;
  userChannel: number;
}


/*
facebook login

appId: 10183
advChannel: 30001
source: 0
network: 0
model: 0
operatorOs: 0
deviceNo: 0
device: 0
version: 0
sdkVersion: 0
emailValid: 0
email:
userId: 1000002934
accountType: 2
firstLogin: 1
userName: fb-undefined
telephone:
userType: 1
password: d41d8cd98f00b204e9800998ecf8427e
token: d922583596574833add780506f5dd4a4
sign: ecb96145fb2166234ae3ab4c02f37eb9



code: 200
data: {emailValid: 0, email: "", userId: 1000002934, accountType: 2, firstLogin: 0, userName: "fb-undefined",…}
accountType: 2
email: ""
emailValid: 0
firstLogin: 0
userId: 1000002934
userName: "fb-undefined"
userType: 1
error_msg: ""
firstLogin: false
token: "7deeb0353f4f41cc88e5240db9f4c162"

*/
