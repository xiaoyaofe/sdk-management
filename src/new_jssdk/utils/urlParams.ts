/* 函数重载 */
export function getUrlParam(): { [key: string]: string };
export function getUrlParam(name: string): string;
export function getUrlParam(name?: string): any {
  var _params = getUrlParams(location.href);
  if (!name) return _params;
  return _params.hasOwnProperty(name) ? _params[name] : "";
}

export function getObjectKeyValueStr(pre: string = '', connector: string = ',', func: (str: snb) => string, obj: { [key: string]: snb }) {
  var str = pre;
  Object.keys(obj).forEach(key => str += `${func(key)}=${func(obj[key])}${connector}`);
  return str.length === pre.length ? '' : str.slice(0, str.length - 1);
}
export function setUrlParam(obj: { [key: string]: snb }, url?: string) {

  return getObjectKeyValueStr(url + '?', '&', encodeURIComponent, obj);
}
export function getUrlParams(url: string): any {

  let result = {};
  if (url.indexOf('?') !== -1) {
    result = url.slice(url.indexOf('?') + 1).split(/&/)
      .reduce((obj, item) => {
        var arr = item.split(/=/);
        obj[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
        return obj;
      }, {});
  }
  return result
}

/* 用来参考 */
function getParameterByName(name: string) {

  const key = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
