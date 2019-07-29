/* 一些错误 */
export enum ERROR {
  E_001 = 'appId or advChannel is not defined'
}
/* 地址栏查询参数的key */
export enum GET {
  USER = 'user',
  APP_ID = 'appId',
  ADV_CHANNEL = 'advChannel',
  DEBUGGER = 'debugger',
  DEV = 'dev'
}
// 固定的打点名称
export enum DOT {
  SDK_LOADED = 'sdk_loaded',
  SDK_PURCHASED_DONE = 'sdk_purchased_done',
  SDK_REGISTER = 'sdk_register',
  SDK_CONTACT_US = 'sdk_contact_us',
  SDK_LOGIN = 'sdk_login'
}

export const localStorageUserKeys = {
  user: "_rg_user",
  users: "_rg_users"
}