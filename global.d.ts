/* 以下为新的类型 */
// webpack中定义的值
declare var md5: Function;
declare const VERSION: string;
declare const IS_DEV: boolean;
declare var FBVersion: string;
declare var ACTION: string;
declare var reactSrc: string;
declare var reactDomSrc: string;
declare var reactRouterDomSrc: string;
/* 全局变量 */
declare const VConsole: any;
declare var RG: RG;
declare var JsToNative: JsToNative;
// declare var NativeToJs: NativeToJs;
declare var CryptoJS: any;
declare var Adjust: any;

/* 第三方的没有类型定义文件的定义 */
declare var Kakao: any;

/** 1: web端 2：原生应用 3：facebook页游平台 4：facebook instant games */
type PlatformType = 1 | 2 | 3 | 4;
type snb = string | number | boolean;
// 平台来源 0 = ios 1 = android 2 = 网页支付 3 = PC web登录
type SourceType = 0 | 1 | 2 | 3;
// 性别 0=男 1=女
type Sex = 0 | 1;
// 用户渠道 0=默认渠道 1=appota 2=mwork
type UserChannel = 0 | 1 | 2;
/* 账户类型0. 普通用户  1.Email用户 2 fb账号 3.gamecent账号 4. Google账号 5.line账号
6.vk账号 7:手机，11：kakao登录 */
type AccountType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 11;
// 网络 0=wifi 1 = 3g 2=其他
type NetWork = 0 | 1 | 2;
// 设备号(ANDROID = IMEI, IOS = IDFV)
type DeviceNo = 'IMEI' | 'IDFV' | '0';
// 设备(Android = MAC#ANDRIDID IOS = IDFA）
type Device = 'MAC#ANDRIDID' | 'IDFA' | '0';
type Region = "sg" | 'de' | 'vn' | 'test';
interface ServerRes {
  code: number;
  error_msg: string;
}

interface RgBindZoneParams {
  // userId 用户id
  userId: number;
  // gameZoneId 区服id
  gameZoneId: number;
  // createRole  是否创角 0=否 1=是
  createRole: number;
  // roleId  角色id
  roleId: number;
  // level 角色等级
  level: number;
}

interface RgPayConfig {
  /* 用户Id */
  userId: number
  /* 游戏订单Id */
  gameOrderId: string;
  /* 游戏区服Id */
  gameZoneId: string;
  /* 角色Id */
  roleId: string;
  /* 角色名 */
  roleName: string;
  /* 角色等级 */
  level: string;
  /* 游戏币数量 */
  gameCoin: number;
}



interface markParams {
  google ?: object;
  adjust ?: object;
  currency ?: string;
  money ?: string;
  eventToken ?: string;
}

interface NativeDeviceMsg {
  // 不一定能取到
  gaid?: string;
  device: Device;
  deviceNo: DeviceNo;
  version: string;
  model: string;
  operatorOs: string;
  source: SourceType;
  network: NetWork;
}
