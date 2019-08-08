/*
    类型文件引入
*/
import { User, Users } from '../common/account';
import { createOrderProductInfo, finishOrderParams } from '../common/payment';
import App from 'DOM/App';
// 文件引入
import { SdkApi } from '../api';
import { Login } from '../common/login';
import { Account } from '../common/account';
import { Payment } from '../common/payment';
import { loadJs, dateFormat } from '../utils';

export class Base {
  protected App: App
  protected api: SdkApi;
  protected login: Login;
  protected account: Account;
  protected pay: Payment;

  protected config: any;
  facebookSDKInit: boolean = false;
  protected kaKaoSDKInit: boolean = false;
  protected reactInitPromise: Promise<void>;
  protected reactDomAndRouterPromise: Promise<void[]>;
  protected domPromise: Promise<any>;
  protected configPromise: Promise<any>;
  sdkType: string;

  constructor(region: Region) {
    this.reactInitPromise = this.loadScript(reactSrc);
    this.reactDomAndRouterPromise = Promise.all([reactDomSrc, reactRouterDomSrc].map((src) => {
      return this.loadScript(src)
    }));
    this.domPromise = import('DOM/index');
    // 初始化config
    //this.configPromise =  this.api.getInitConfig();
    this.api = new SdkApi(region);
    this.account = new Account();
    this.pay = new Payment();
  }
  async baseInit({ appId, advChannel, sdkVersion, region }) {
    this.config = await this.configPromise;
    this.config.appId = appId;
    this.config.advChannel = advChannel;
    this.config.sdkVersion = sdkVersion;
    this.config.region = region
    fbSdkLoad(this.config.fb_appid).then(() => {
      this.facebookSDKInit = true;
    })
    this.api.init(this.config.appKey);
    this.login = new Login(this.config.fbAppId, this.api);
  }
  // 在JSToNative上挂载一个方法
  getDeviceMsgAsync: () => Promise<NativeDeviceMsg>;
  // 打点的方法，每个sdk都要实现
  mark(markName: string, markParams: any): void {
    throw "Here's the Base with no mark functions, you have to do it yourself.";
  }
  // 绑定区服的接口，主要使用来登录后绑定游戏区服
  async bindZone(params: RgBindZoneParams) {
    const { appId, advChannel, sdkVersion } = this.config;
    const { userId, gameZoneId, createRole, roleId, level } = params;
    const { device, deviceNo, version, model, operatorOs, source, network } = await this.getDeviceMsgAsync();
    const res = await this.api.bindZone({ appId, advChannel, sdkVersion, device, deviceNo, version, model, operatorOs, source, network, userId, gameZoneId, createRole, roleId, level });
    if (!res) return;
    return res;
  }
  // 切换账号
  redirect() {
    window.name = "rg-redirect";
    window.location.reload();
  }
  // 修改密码
  async changePassword(oldPassword: string, newPassword: string) {
    const result = await this.api.changePassword({
      appId: this.config.appId,
      userId: this.account.user.userId,
      password: md5(oldPassword),
      newPassword: md5(newPassword)
    });
    if (!result) return;
    return result;
  }
  // 游客升级,密码限制6-20字符之间
  async bindVisitor(userName: string, password: string) {
    const { appId } = this.config;
    const { userId } = this.account.user;
    const result = await this.api.bindVisitor({ appId, userId, userName, password: md5(password), email: "" });
    if (!result) return;
    return result;
  }
  // 忘记密码
  async forgetPwd(userName: string) {
    const result = await this.api.forgetPwd({ appId: this.config.appId, userName });
    if (!result) return;
    return result;
  }
  // 支付历史
  async getPaymentHistory() {
    const result = await this.pay.getPaymentHistory(this.config.appId, this.account.user.userId);
    if (!result) return;
    return result;
  }
  // 支付信息
  async getPaymentConfig(params: RgPayConfig) {
    const { appId, advChannel } = this.config;
    const { version, source, network } = await this.getDeviceMsgAsync();
    const result = await this.pay.getPaymentConfig({ appId, advChannel, source, network, version }, params);
    if (!result) return;
    return result;
  }
  // 创建订单
  async createOrder(params: createOrderProductInfo) {
    const { appId, advChannel, sdkVersion } = this.config;
    const { device, deviceNo, version, model, operatorOs, source, network } = await this.getDeviceMsgAsync();
    const createOrderBaseParams = { appId, advChannel, source, deviceNo, device, network, model, operatorOs, version, sdkVersion, clientTime: dateFormat() };
    const result = await this.pay.createOrder(createOrderBaseParams, params);
    if (!result) return;
    return result;
  }
  // 官方支付消单，第三方不需要消单
  async finishOrder(params: finishOrderParams) {
    const { advChannel, sdkVersion } = this.config;
    const { device, deviceNo, version, model, operatorOs, network } = await this.getDeviceMsgAsync();
    const finishOrderBaseParams = { advChannel, deviceNo, device, network, model, operatorOs, version, sdkVersion, clientTime: dateFormat() }
    const result = await this.pay.finishOrder(finishOrderBaseParams, params);
    if (!result) return;
    return result;
  }
  // 清除支付信息，在关闭支付界面的时候进行
  clearPayGameParams() {
    this.pay.clearGameParams();
  }
  // fb分享
  fbShare(shareUrl: string) {
    return new Promise(resolve => {
      FB.ui({
        method: 'share',
        href: shareUrl,
        display: 'popup'

      }, function (shareDialogResponse) {
        if (shareDialogResponse) {
          if (shareDialogResponse.error_message) {
            resolve({
              code: 0,
              error_msg: shareDialogResponse.error_message
            });
          } else {
            resolve({
              code: 200
            });
          }
        } else {
          resolve({
            code: 0
          });
        }
      })
    })
  }
  loadScript(url: string) {

    return new Promise<void>((resolve, reject) => {
      loadJs(url, {
        success: resolve,
        error: reject
      })
    }).catch((err) => {
      console.log(url + "load failed \n" + err);
    });
  }
  setItem(name: string, info: string) {
    try {
      localStorage.setItem(name, info);
    } catch (e) {
      console.log(e);
    }
  }
  getItem(name: string) {
    let result;
    try {
      result = localStorage.getItem(name);
    } catch (e) {
      console.log(e);
    }
    return result;
  }
}
// facebook sdk 加载
function fbSdkLoad(fbAppId: string) {

  return new Promise((resolve, reject) => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: fbAppId,
        status: true,
        xfbml: true,
        version: FBVersion
      });
      resolve();
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  })
}


