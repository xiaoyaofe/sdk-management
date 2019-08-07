/*
  引入文件类型
*/
import { SdkApi } from "Src/api";

export class Payment {
  private _gamePayParams: RgPayConfig;
  private _lastTime: string = '1525771365401';
  api: SdkApi;

  constructor() { }

  getPaymentHistory(appId: number, userId: number) {
    return this.api.getPaymentHistory({ appId, userId, lastTime: this._lastTime })
      .then(res => {
        if (res && res.code === 200) this._lastTime = res.lastTime;
        return res;
      });
  }
  getPaymentConfig(params: PaymentConfigBaseParams, gamePayParams: RgPayConfig) {
    this._gamePayParams = gamePayParams;
    const data = Object.assign(params, gamePayParams);
    return this.api.getPaymentConfig(data);
  }
  createOrder(params: createOrderBaseParams, productInfo: createOrderProductInfo) {
    const data = Object.assign(params, productInfo, this._gamePayParams);
    return this.api.createOrder(data);
  }
  finishOrder(params: finishOrderBaseParams, orderInfo: finishOrderParams) {
    const data = Object.assign(params, orderInfo);
    return this.api.finishOrder(data);
  }
  clearGameParams() {
    this._gamePayParams = null;
  }
}
export interface PaymentConfigBaseParams {
  appId: number;
  advChannel: number;
  /** 0=ios 1=android */
  source: SourceType
  /* 网络 0=wifi 1 = 3g 2=其他 */
  network: NetWork;
  /** 游戏版本 控制每种支付方式的开关 */
  version: string
}


interface createOrderBaseParams {
  /** 平台方分配给游戏的appId */
  appId: number
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number
  /** 充值来源 0=ANDROID客户端 1=IOS客户端 2=网页 */
  source: number
  /** 设备号 */
  deviceNo: string
  /** Android:MAC地址 IOS:IDFA */
  device: string
  /** 网络 0=wifi 1 = 3g 2=其他 */
  network: number
  /** 机型 */
  model: string
  /** 操作系统，例如Android4.4 */
  operatorOs: string
  /** 游戏版本 */
  version: string
  /** SDK版本号 */
  sdkVersion: string
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string
}

export interface createOrderProductInfo {
  channel: number;
  code: number;
  amount: string;
  currency: string;
  productName: string;
  itemType: number;
  isOfficial: number;
  /** 额外的信息,没有给"" */
  exInfo: string;
}

export interface finishOrderParams {
  /** 交易流水 */
  transactionId: string;
  /** 支付方式 0=appstore 1=google play 2=vnpt 3=1pay 4=mol 28=facebook */
  channel: number;
  /** APPSTORE单据或者Google play signatureData */
  receipt: string;
  /** Google play signature */
  signature: string;
  /** 额外的信息 */
  exInfo?: string;
}

interface finishOrderBaseParams {
  /** 包ID */
  advChannel: number;
  /** SDK版本 */
  sdkVersion: string;
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string;
  /** 设备号 */
  deviceNo: string;
  /** Android: MAC地址 IOS: IDFA */
  device: string;
  /** 网络 0 = wifi 1 = 3g 2 = 其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统，例如Android4.4 */
  operatorOs: string;
  /** 游戏版本 */
  version: string;
}
