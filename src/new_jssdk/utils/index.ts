// 导出所有
export * from './device';
export * from './cookie';
export * from './urlParams'
// 处理后导出
import { formatDate } from './date'

// 日期格式化方法
export function dateFormat(date: Date = new Date()) {
  return formatDate(date, "yyyy-MM-dd hh:mm:ss");
}
// 验证参数
export function signed(params: any) {
  var paramskeys = Object.keys(params)
  var data = paramskeys.map(key => {
    return params[key]
  }).join('') + (RG.jssdk.config.app_key)
  return md5(data);
}
// 账户类型
export function getAccountType(userType: number/* UserType */, accountType: /* AccountType */number) {

  if (accountType === 2) return "fb";
  if (userType === 0) return "guest";
  return "sdk";
}
// sdk的type
export function getSdkType(advChannel: number) {
  let type: number;
  if (advChannel > 30000 && advChannel < 31000) {
    type = 1;
  } else if (advChannel < 30000) {
    type = 2;
  } else if (advChannel > 31000 && advChannel < 32000) {
    type = 3;
  } else if (advChannel > 32000 && advChannel < 33000) {
    type = 4;
  } else {
    throw "unknow advChannel";
  }
  return type;
}
// 加载js
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

type loadJsParams = {
  success?: Function;
  error?: Function;
  id?: string;
  asyncLoad?: boolean;
  deferLoad?: boolean;
}


