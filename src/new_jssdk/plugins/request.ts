/**
 * create zongjiang
 * time 2019/5/10
 * decriptrion ajax请求的方法
 * 在这里只能传递完整的url
 */
import { getObjectKeyValueStr } from './utils';

export function get<T>(url: string, data: { [key: string]: any } | null = null): Promise<T> {
  let str = data ? getObjectKeyValueStr('?', '&', encodeURIComponent, data) : '';
  return ajax<T>('GET', url + str);
}
export function post<T>(url: string, data: { [key: string]: any }, isJSON: boolean = false): Promise<T> {

  let sendData = !isJSON ? getObjectKeyValueStr('', '&', encodeURIComponent, data) : data;
  return ajax<T>('POST', url, sendData);
}

function ajax<T>(method: 'GET' | 'POST', url: string, data: any | null = null): Promise<T> {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url)
  method === 'POST' && (typeof data === 'string') && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(data);

  return new Promise<T>((resolve, reject) => {

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          // resolve(JSON.parse(xhr.responseText))
          reject('conde:' + xhr.status + ',' + "server res err");
        }
      }
    }
  })
}
