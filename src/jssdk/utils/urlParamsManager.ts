export class UrlParmasManager {
  private static _ins: UrlParmasManager;
  public static get instance(): UrlParmasManager {
    return this._ins || new UrlParmasManager();
  }

  private _params = {};

  constructor() {
    this._params = getUrlParams(location.href);
  }
  getUrlParam = getUrlParam;
}
function getUrlParam(): { [key: string]: string };
function getUrlParam(name: string): string;
function getUrlParam(name?: string): any {
  if (!name) return this._params;
  return this._params.hasOwnProperty(name) ? this._params[name] : "";
}

export function getObjectKeyValueStr(pre: string = '', connector: string = ',', func: (str: snb) => string, obj: { [key: string]: snb }) {
  var str = pre;
  Object.keys(obj).forEach(key => str += `${func(key)}=${func(obj[key])}${connector}`);
  return str.length === pre.length ? '' : str.slice(0, str.length - 1);
}

export function getUrlParams(url: string) {

  let result = {};
  if (url.indexOf('?') !== -1) {
    url.slice(url.indexOf('?') + 1).split(/&/)
      .forEach(item => (result[decodeURIComponent(item.split(/=/)[0])] = decodeURIComponent(item.split(/=|%3D/)[1])));
  }
  return result
}
export function setUrlParam(obj: { [key: string]: snb }, url?: string) {

  return getObjectKeyValueStr(url + '?', '&', encodeURIComponent, obj);
}

/* 用来参考 */
export function getParameterByName(name: string) {

  const key = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
/* 暂时不会使用的函数，做一下参考，以前的实现版本 */

/*
function getUrlParams(url: string) {
  const index = url.indexOf("?") + 1;
  const str = index === 0 ? "" : url.slice(index);
  const params = {};
  if (str) {
    // 不能使用正则，可能会获取到转码后的链接中的参数;
    var arr = str.split('&');
    arr.forEach(item => {
      var arr = item.split('=');
      var key = arr[0];
      var val = arr[1];
      this._params[key] = val;
    })
  }
  return params;
} */
