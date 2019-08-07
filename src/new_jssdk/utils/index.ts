import { formatDate } from './timeManager'
// import { CookieManager } from './cookieManager'
import { DeviceManager } from './deviceManager'
import { UrlParmasManager } from './urlParamsManager';

export const Utils: Utils = {
  // 暂时不需要操作cookie
  //   cookieManager: CookieManager.instance,
  formatDate(date: Date = new Date()) {
    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
  },
  // 获取查询参数，并保存
  urlParamsManager: UrlParmasManager.instance,
  // 获取设备信息
  deviceManager: DeviceManager.instance,
  // 根据用户类型和账号类型来做提示
  getAccountType: function (userType: number/* UserType */, accountType: /* AccountType */number) {
    if (accountType === 2) return "fb";
    if (userType === 0) return "guest";
    return "sdk";
  },
  // 生成adjust中打点需要的设备参数,暂时不需要
  // generateGpsAdid(len?: number, radix?: number) {
  //   var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
  //   var uuid = [], i: number;
  //   radix = radix || chars.length;

  //   if (len) {
  //     // Compact form
  //     for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  //   } else {
  //     // rfc4122, version 4 form
  //     var r;

  //     // rfc4122 requires these characters
  //     uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  //     uuid[14] = '4';

  //     // Fill in random data.  At i==19 set the high bits of clock sequence as
  //     // per rfc4122, sec. 4.1.5
  //     for (i = 0; i < 36; i++) {
  //       if (!uuid[i]) {
  //         r = 0 | Math.random() * 16;
  //         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
  //       }
  //     }
  //   }
  //   return uuid.join('');
  // },
  //参数签名
  signed(params) {
    var paramskeys = Object.keys(params)
    var data = paramskeys.map(key => {
      return params[key]
    }).join('') + (RG.jssdk.config.app_key)
    return md5(data);
  },
  /* 仅仅是为了兼容， */
  getUrlParam(name?: string) {
    return this.urlParamsManager.getUrlParam(name);
  },
  deviceType: DeviceManager.instance.getDeviceTypes(),
  loadJs
}
export function getAccountType(userType: number/* UserType */, accountType: /* AccountType */number) {

  if (accountType === 2) return "fb";
  if (userType === 0) return "guest";
  return "sdk";
}
export interface Utils {
  formatDate: () => string;
  urlParamsManager: UrlParmasManager;
  deviceManager: DeviceManager;
  getAccountType: (userType: number, account: number) => string;
  // generateGpsAdid: (len?: number, radix?: number) => string;
  signed: (params) => string;
  getUrlParam: (name?: string) => any;
  deviceType: {
    ios: boolean;
    iPhone: boolean;
    iPad: boolean;
    android: boolean;
    win: boolean;
  }
  loadJs: (url: string, params?: loadJsParams) => void
}

type loadJsParams = {
  success?: Function;
  error?: Function;
  id?: string;
  asyncLoad?: boolean;
  deferLoad?: boolean;
}

export function loadJs(url: string, params?: loadJsParams) {
  const fjs = document.getElementsByTagName('script')[0];
  if (params.id && document.getElementById(params.id)) return;
  const js = document.createElement("script");
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


