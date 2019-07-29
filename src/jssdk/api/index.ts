/**
 * create zongjiang
 * time 2019/5/10
 * decriptrion 将需要的base_url这些与数据与接口调用的方法封装在一起,签名整体在这里进行
 */
import { post, get } from '../plugins/request';

export class SdkApi {
  private baseUrl: string
  private appKey: string
  private routes: {
    // 登录
    login: "/user/v3/login",
    // 注册
    register: "/user/v3/register",
    // 绑定区服
    bindZone: "/user/v3/bindZone",
    // 获取支付参数
    paymentConfig: "/config/paymentConfig/v4.0",
    // 创建订单
    createOrder: "/order/create/v4.0",
    // 消单
    finishOrder: "/official/order/finish/v4.0",
    // 订单列表
    orderList: "/order/getOrderList",
    // 游客账号绑定
    bindVisitor: "/user/bindVisitor",
    // 修改密码
    changePassword: "/user/changePwd",
    // 初始化原生端参数
    initNativeSDK: "/config/v3.1/initSDK"
  }
  constructor(region: Region, appKey: string) {
    const BASEURL = {
      sg: 'https://sdk-sg.pocketgamesol.com',
      de: 'https://sdk-de.pocketgamesol.com',
      vn: 'https://sdk-vn.pocketgamesol.com',
      test: 'https://sdk-test.changic.net.cn'
    }
    this.baseUrl = BASEURL[region] + "/pocketgames/client";
    this.appKey = appKey;
  }
  // 平台登录
  login(params: LoginParam): Promise<LoginAndRegisterRes | void> {
    const url = this.baseUrl + this.routes.register;
    // appId + userName + password + source + appKey
    const signParamsArr = [params.appId, params.userName, params.password, params.source];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<LoginAndRegisterRes>(url, data, false).catch((e) => {
      this.logError('login', e);
    });
  }
  // 注册
  register(params: RegisterParams): Promise<LoginAndRegisterRes | void> {
    const url = this.baseUrl + this.routes.register;
    // appId + userName + password + source + appKey
    const signParamsArr = [params.appId, params.userName, params.password, params.source];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<LoginAndRegisterRes>(url, data, false).catch((e) => {
      this.logError('register', e);
    });
  }
  // 绑定区服
  bindZone(params: BindZoneParam): Promise<ServerRes | void> {
    const url = this.baseUrl + this.routes.bindZone;
    // userId + appId + gameZoneId + source + appKey
    const signParamsArr = [params.userId, params.appId, params.gameZoneId, params.source];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<ServerRes>(url, data, false).catch((e) => {
      this.logError('bindZone', e);
    });
  }
  //获取支付参数
  getPaymentConfig(params: PaymentConfig): Promise<PaymentConfigRes | void> {
    const url = this.baseUrl + this.routes.paymentConfig;
    // appId+ advChannel+userId+gameCoin+level +source+ network +appKey
    const signParamsArr = [params.appId, params.advChannel, params.userId, params.gameCoin, params.level, params.source, params.network];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<PaymentConfigRes>(url, data, false).catch((e) => {
      this.logError('getPaymentConfig', e);
    });
  }
  // 创建订单
  createOrder(params: createOrderParams): Promise<createOrderRes | void> {
    const url = this.baseUrl + this.routes.createOrder;
    /*  MD5(appId + advChannel + userId + roleId + gameOrderId + gameZoneId+
     code + source + channel + amount + currency + productName + exInfo + app_key) */
    const signParamsArr = [
      params.appId,
      params.advChannel,
      params.userId,
      params.roleId,
      params.gameOrderId,
      params.gameZoneId,
      params.code,
      params.source,
      params.channel,
      params.amount,
      params.currency,
      params.productName,
      params.exInfo];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<createOrderRes>(url, data, false).catch((e) => {
      this.logError('createOrder', e);
    });
  }
  // 消单
  finishOrder(params: finishedOrderParams): Promise<finishedOrderRes | void> {
    const url = this.baseUrl + this.routes.finishOrder;
    /*  MD5(transactionId + receipt + signature +channel+advChannel+appKey)*/
    const signParamsArr = [
      params.transactionId,
      params.receipt,
      params.signature,
      params.channel,
      params.advChannel,];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<finishedOrderRes>(url, data, false).catch((e) => {
      this.logError('finishOrder', e);
    });
  }
  // 订单列表,get请求
  getPaymentHistory(params: getPaymentHistoryParams): Promise<getPaymentHistoryRes | void> {
    // appId+userId+appKey
    const sign = this.getSign([params.appId, params.userId]);
    // http://ip:port/pocketgames/client/order/getOrderList/{appId}/{userId}/{lastTime}/{sign}
    const url = this.baseUrl + this.routes.orderList +
      `${params.appId}/${params.userId}/${params.lastTime}/${sign}`;

    return get<getPaymentHistoryRes>(url).catch((e) => {
      this.logError('getPaymentHistory', e);
    });
  }
  // 游戏账号绑定
  bindVisitor(params: bindVisitorParams): Promise<bindVisitorRes | void> {
    const url = this.baseUrl + this.routes.bindVisitor;
    // appId+userId+userName+password+appKey
    const signParamsArr = [params.appId, params.userId, params.userName, params.password];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<bindVisitorRes>(url, data, false).catch((e) => {
      this.logError('bindVisitor', e);
    });
  }
  // 修改密码
  changePassword(params: changePassword): Promise<ServerRes | void> {
    const url = this.baseUrl + this.routes.changePassword;
    // appId+userId+password+newPassword+appKey
    const signParamsArr = [params.appId, params.userId, params.password, params.newPassword];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<ServerRes>(url, data, false).catch((e) => {
      this.logError('changePassword', e);
    });
  }
  // 仅用与Native的初始化
  initNativeSDK(params: initNativeSDKParams): Promise<initNativeSDKRes | void> {
    const url = this.baseUrl + this.routes.initNativeSDK;
    // appId+source+advChannel+appKey
    const signParamsArr = [params.appId, params.source, params.advChannel];
    const data = Object.assign({ sign: this.getSign(signParamsArr) }, params);

    return post<initNativeSDKRes>(url, data, false).catch((e) => {
      this.logError('initNativeSDK', e);
    });
  }
  // 未实现，一个jssdk的配置接口,暂时未使用
  static getInitConfig(params: initWebSdkParams) {

    console.log(params);
    // this.logError('getPaymentHistory', e);
    // this.appKey = params.appKey;
    // return params;
  }
  // 获取加密参数
  getSign(params: (string | number)[]) {
    if (!this.appKey) throw "api appKey is not defined";

    return md5(params.join('') + this.appKey);
  }
  // 打印错误信息
  logError(methodName: string, e: any) {
    console.log("---------------------------------------\napi " + methodName + " error" + e
      + '\n----------------------------------------------');
  }
}

// 登录的参数
interface LoginParam {
  appId: number;
  userName: string;
  password: string;
  source: SourceType;
  advChannel: number;
  network: NetWork;
  model: string;
  operatorOs: string;
  deviceNo: DeviceNo;
  device: Device;
  version: string;
  sdkVersion: string;
  exInfo?: string;
  // sign: string;
}
// 注册的参数
type RegisterParams = LoginParam & {
  nickName?: string;
  accountType: AccountType;
  thirdPartyId?: string;
  sex?: Sex;
  birthday?: string;
  email?: string;
  telephone?: string;
  userChannel: UserChannel;
}
// 登录和注册的服务器响应数据
export interface LoginAndRegisterRes extends ServerRes {
  data: {
    // 用户id
    userId: number;
    // 用户名
    userName: string;
    // 1.正式账号 0.游客账号
    userType: 0 | 1;
    // 账号类型
    accountType: AccountType;
    // 邮箱
    email: string;
    // 邮箱是否验证，0=未设置 1=未验证 2=已验证
    emailValid: 0 | 1 | 2;
    // 电话号
    telephone: string;
    // 0=登陆  1 = 注册
    firstLogin: 0 | 1;
  };
  // 是否第一次登录
  firstLogin: boolean;
  // 平台token
  token: string;
}

type BindZoneParam = {
  appId: number;
  advChannel: number;
  sdkVersion: string;
  device: Device;
  deviceNo: DeviceNo;
  version: string;
  model: string;
  operatorOs: string;
  source: SourceType;
  network: NetWork;
  // sign: string;
} & RgBindZoneParams;

interface PaymentConfig {
  /** 平台方分配给游戏的appId */
  appId: number
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number
  /** 平台用户ID */
  userId: number
  /** 游戏内角色id */
  roleId: number
  /** 0=ios 1=android */
  source: SourceType
  /* 网络 0=wifi 1 = 3g 2=其他 */
  network: NetWork
  /** 角色等级 */
  level: number
  /** 游戏版本 控制每种支付方式的开关 */
  version: string
  /** 游戏币数量 */
  gameCoin: number
  /** 额外参数 */
  exInfo?: string
  /** 验证参数MD5(appId+ advChannel+userId+gameCoin+level +source+ network +app_key) */
  // sign: string
};
interface Product {
  // 金额
  amount: number;
  // 货币单位 USD
  currency: string;
  // 折扣描述
  discountDesc?: string;
  // 游戏货币数量
  gameCoin: number;
  // 游戏货币单位
  gameCurrency: string;
  // 商品类型：0=普通商品，1=月卡，2=年卡......
  itemType: number;
  // 商品描述
  productDesc: string;
  // 商品名
  productName: string;
  // 货币单位的缩写，$
  shortCurrency: string;
}
export interface PaymentChannel {
  name: string;
  description: string;
  channel: number;
  code: number;
  codeImg: string;
  // 推荐位图片名称
  hotImg?: string;
  // 折扣率图片名称
  discountImg?: string;
  //是否显示商品列表 ：1=显示，0= 不显示
  showProductList: 0 | 1;
  //显示方式：0=打开网页 1=显示序列号和PIN 2=显示PIN 3=调起SDK不显示支付界面的确认界面（不可修改金额）） 4=九宫格展现 5 = 调起SDK 显示支付界面的确认界面（可修改支付金额，如短代） 6= 显示内容，
  showMethod: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  exInfo: string;
  isOfficial: number;
  //选中的商品
  selectedProduct: Product;
  //商品列表
  products: Product[];
  nodes?: PaymentChannel[];

  isFacebook?: boolean;
}
interface PaymentConfigRes extends ServerRes {
  payments: PaymentChannel[];
}

interface createOrderParams {
  /** 平台方分配给游戏的appId */
  appId: number
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number
  /** 平台用户ID */
  userId: number
  /** 游戏订单ID */
  gameOrderId: string
  /** 游戏区服ID */
  gameZoneId: string
  /** 角色ID */
  roleId: string
  /** 角色ID */
  roleName: string
  /** 角色等级 */
  level: string
  /** 充值来源 0=ANDROID客户端 1=IOS客户端 2=网页 */
  source: number
  /** 支付渠道 0=appstore 1=google play 2=vnpt 3=1pay 4=mol,具体见渠道常量表 */
  channel: number
  /** CODE值，具体见支付方式常量表 */
  code: number
  /** 金额 */
  amount: string
  /** 货币 */
  currency: string
  /** 商品名称 */
  productName: string
  /** 商品类型：0=普通商品，1=月卡，2=年卡.... */
  itemType: number
  /** 0=第三方，1=官方 */
  isOfficial: number
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
  /** 额外的信息，如果是刮刮卡,它的格式是{“serialNo”:””,”pin”:””}JSON字符串 */
  exInfo: string
  /** 参数签名结果 MD5(appId+advChannel+userId+roleId+gameOrderId+gameZoneId+code+source+channel+amount+currency+productName + exInfo +app_key)
  */
  //  sign: string
}

interface createOrderRes extends ServerRes {
  data: {
    // double	成功，则返回金额(实际支付的金额)
    money: number
    // String	成功，则返回货币（实际支付的货币）
    currency: string
    // String	游戏订单ID(SDK订单交易ID)
    transactionId: string
    // String	额外信息，如果返回url格式为："returnInfo" ：{ "url": "https://hao.360.cn/?z1002" }
    returnInfo: String
  }
}

interface finishedOrderParams {
  /** 交易流水 */
  transactionId: string
  /** APPSTORE单据或者Google play signatureData */
  receipt: string
  /** Google play signature */
  signature: string
  /** 支付方式 0=appstore 1=google play 2=vnpt 3=1pay 4=mol 28=facebook */
  channel: number
  /** 包ID */
  advChannel: number
  /** SDK版本 */
  sdkVersion: string
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string
  /** 参数签名结果 MD5(transactionId + receipt + signature + channel + advChannel + app_key) */
  // sign: string
  /** 设备号 */
  deviceNo: string
  /** Android: MAC地址 IOS: IDFA */
  device: string
  /** 网络 0 = wifi 1 = 3g 2 = 其他 */
  network: number
  /** 机型 */
  model: string
  /** 操作系统，例如Android4.4 */
  operatorOs: string
  /** 游戏版本 */
  version: string
  /** 额外的信息 */
  exInfo?: string
}

interface finishedOrderRes extends ServerRes {
  // double	成功，则返回金额（实际支付金额）
  money: number
  // String	成功，则返回货币（实际支付货币）
  currency: string
  // 	String	交易ID
  transactionId: string
}




interface getPaymentHistoryParams {
  // 平台方分配给游戏的appId
  appId: number
  // 用户ID
  userId: number
  // 	第一次传空，第二次传服务器返回的时间戳
  lastTime: string
  // MD5(appId+userId+appKey)
  // sign:string
}
interface getPaymentHistoryRes extends ServerRes {
  lastTime: string
  data: {
    // 交易流水
    transactionId: string
    // 金额
    amount: string
    // 货币类型
    currency: string
    // 付方式 0=官方1=刮刮卡
    channel: number
    // 	200成功，错误请见错误列表
    status: number
    // chargingType 0=平台币 1=直冲
    chargingType: number
    // 客户端时间
    clientDate: number
  }[]
}


interface bindVisitorParams {
  appId: number
  // 游客的用户ID
  userId: number
  // 绑定的用户名
  userName: string
  // 绑定的密码
  password: string
  // 电子邮箱
  email: string
  // MD5(appId+userId+userName+password+appKey)
  // sign: string
}

interface bindVisitorRes extends ServerRes {
  // 游客账号绑定的测试结果
  //   data	{…}
  // emailValid	0
  // userId	1000002910
  // accountType	0
  // userName	7298037544
  // userType	0
  // code	200
  // error_msg	success

  data: {
    // 用户ID
    userId: number
    // 用户名
    userName: string
    // 电子邮箱
    email?: string
    // 电话号码
    phoneNumber?: string
    // 电子邮箱是否验证 0=未设置 1=未验证 2=已验证
    emailValid: 0 | 1
    // 用户类型1.正式账号 0.游客账号
    userType: 0 | 1
    // 账户类型0. 普通用户  1.Email用户 2 fb账号 3.gamecent账号 4. Google账号 5.line账号 6.vk账号
    accountType: AccountType
  }
}

interface changePassword {
  appId: number
  // 用户ID
  userId: number
  // 旧密码，绑定的密码
  password: string
  // 新的密码
  newPassword: string
  // MD5(appId+userId+password+newPassword+appKey)
  // sign: string
}
interface initNativeSDKParams {
  /** 平台方分配给游戏的appId */
  appId: number;
  /** 平台来源0=ios 1=android 2=web */
  source: number;
  /** -1=IOS企业包0=AppsSore 1=GooglePlay等等，具体渠道请见渠道表 */
  advChannel: number;
  /** 网络 0=wifi 1 = 3g 2=其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统 */
  operatorOs: string;
  /** 设备号 */
  deviceNo: string;
  /** 设备 (Android=MAC#ANDRIDID IOS=IDFA） */
  device: string;
  /** 游戏版本 */
  version: string;
  /** SDK 版本 */
  sdkVersion: string;
  /** 客户端时间 (yyyy-MM-dd HH:mm:ss) */
  clientTime: string;
  /** 0=非首次安装 1=首次安装 */
  firstInstall: number;
  /** 参数签名结果 MD5(appId+source+advChannel+app_key) */
  // sign: string;
}

interface initNativeSDKRes extends ServerRes {
  messages: {
    loginMessageUrl: string
    isHasLogin: string
    isHasPause: string
    pauseMessageUrl: string
  }
  handlerBtns: {
    btnName: string
    btnNormalIcon: string
    btnNormalPressIcon: string
    btnRedIcon: string
    btnRedPressIcon: string
    btnUrl: string
    showRedSpots: string
  }[]
  loginMethods: {
    loginMethod: string
    iconUrl: string
    loginUrl: string
    callBackUrl: string
    index: string
    rotate: number
  }[]
  verifys: { // AES加密的
    gpVerify: string
    gpProduct: string
  }
  advChannels: { // android
    facebookAppId: string
    appsFlyerDevKey: string
    talkapp_key: string
    charboostAppId: string
    charboostAppSignature: string
    ewayAppId: string
    mobvistaSDKAppId: string
    admobConversionID: string
    admobValue: string
  }

}

interface initWebSdkParams {
  /** 平台方分配给游戏的appId */
  appId: string;
  /** 平台来源0=ios 1=android 2=网页支付 3=web */
  source: SourceType;
  /** -1=IOS企业包0=AppsSore 1=GooglePlay等等，具体渠道请见渠道表 */
  advChannel: string;
  /** SDK 版本 */
  sdkVersion: string;
  /** 客户端时间 (yyyy-MM-dd HH:mm:ss) */
  clientTime: string;
  /** 参数签名结果 MD5(appId+source+advChannel+app_key) */
  // sign: string;
}
interface initWebSdkRes extends ServerRes {
  data: {

  }
}

/*
游客登录
不要用户名
https://sdk-test.changic.net.cn/pocketgames/client/user/v3/register
参数：
appId	10183
advChannel	30001
source	3
network	0
model	0
operatorOs	0
deviceNo	0
device	0
version	0
sdkVersion	0
password	fc65a3571fd877c112b62aa3ee4d8fac
userName
thirdPartyId
sign	03363beb2e623044addb8f9bc235c8f2

响应：
emailValid	0
userId	1000002909
accountType	0
firstLogin	1
userName	3753475256
userType	0
token	383724bdea99472492ea1ec36fb51e96
firstLogin	false
code	200
error_msg
*/
