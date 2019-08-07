/*
  引入文件类型
*/
import { SdkApi, RegisterRemainingParams, RegisterParams } from "../api";

export class Login {
  fbAppId: string;
  api: SdkApi;
  constructor(fbAppId: string, api: SdkApi) {
    this.api = api;
    this.fbAppId = fbAppId;
  }
  login(userName: string, password: string, loginBaseParams: loginBaseParams, exInfo: string = "") {
    const data = Object.assign({ userName, password, exInfo: exInfo }, loginBaseParams);
    return this.api.login(data);
  }
  // 注册需要取地址栏的advertiseId参数赋给thirdPartyId,原生就给一个""
  register(userName: string, password: string, loginBaseParams: loginBaseParams, params: RegisterRemainingParams, exInfo: string = "") {

    const data: RegisterParams = Object.assign({ userName, password, exInfo: exInfo }, loginBaseParams, params);
    return this.api.register(data);
  }
  // facebook登录,每次登录都是一次注册，
  async fbLogin(type: PlatformType, loginBaseParams: loginBaseParams, thirdPartyId: string = "") {
    const data = await this.getFacebookParams(type);
    if (!data) return;
    const { userName, nickName, sex, birthday, email } = data;
    //
    return this.register(userName, "", loginBaseParams, { accountType: 2, userChannel: 0, nickName, sex, birthday, email, thirdPartyId });
  }
  getFacebookParams(type: PlatformType) {
    // 获取facebook登录用的参数
    return new Promise<void | info>((resolve, reject) => {

      if (type === 4) {
        FB.api(`/${FBInstant.player.getID()}`, { fields: 'name,email' }, (response) => { // name,email,id
          const data = this.fbParamsHandle(response);
          resolve(data);
        });
        return;
      }
      this.checkFbLoginStatus(type, resolve, reject);
    }).catch((e) => {
      console.log("------------facebook login error" + e);
    })
  }
  checkFbLoginStatus(type: PlatformType, resolve: Function, reject: Function) {
    // 检查是否授权登录，如果没有重新授权
    FB.getLoginStatus(async _res => {
      if (_res.status === "connected") {
        this.getFacebookUserInfo(resolve);
        return;
      }
      switch (type) {
        case 1:
          this.webFbLogin(resolve, reject);
          break;
        case 2:
          this.nativeFbLogin();
          break;

      }
    })
  }
  webFbLogin(resolve: Function, reject: Function) {
    FB.login(_res => {
      if (_res.status === "connected") {
        this.getFacebookUserInfo(resolve);
      } else {
        reject(_res);
      }
    },
      {
        scope: 'email'
      }
    )
  }
  nativeFbLogin(): void {
    // 跳转登录，后重定向
    let index = location.href.indexOf('&code=');
    let url = index === -1 ? location.href : location.href.substr(0, index);
    location.href = `https://www.facebook.com/${FBVersion}/dialog/oauth?client_id=${this.fbAppId}&redirect_uri=${encodeURIComponent(url)}&t=${Date.now()}&scope=email`;
  }
  getFacebookUserInfo(resolve: Function, fbUserid?: string) {
    // 获取需要的用户参数email、name、id，email当用户没有email时获取不到
    const url = fbUserid ? `/${fbUserid}` : '/me';
    FB.api(url, { fields: 'name,email' }, (response) => { // name,email,id
      const data = this.fbParamsHandle(response);
      resolve(data);
    });
  }
  fbParamsHandle(data: fbUserInfo): info {
    var info: info = { userName: 'fb-' + data.id };
    data.name && (info.nickName = data.name);
    data.email && (info.email = data.email);
    data.birthday && (info.birthday = data.birthday);
    data.gender && (info.sex = data.gender === 'male' ? 0 : 1);
    return info;
  }
  // kaKao登录，需要完成，第三方登录，全部走注册,登录然后取用户信息
  async kaKaoLogin(loginBaseParams: loginBaseParams, thirdPartyId: string = "") {
    const data = await this.getKaKaoUserInfo();
    if (!data) return;
    const { userName, nickName, sex, birthday, email } = data;
    return this.register(userName, userName + "RGkakao", loginBaseParams, { accountType: 11, userChannel: 0, nickName, sex, birthday, email, thirdPartyId });
  }
  getKaKaoUserInfo() {

    return new Promise<info | void>((resolve, reject) => {
      Kakao.Auth.login({
        success: (authObj) => {

          // If login succeeds, call API.
          // success: {"access_token":"eb10EiQgVqalVfZH5YbaUzDyvRkuo-Z5tcZDPAorDKYAAAFsS1cK_g","token_type":"bearer","refresh_token":"oW5oVR3RdKe_HYseA23ioIO12Csa0zJ9YaCKNQorDKYAAAFsS1cK_Q","expires_in":7199,"scope":"account_email profile","refresh_token_expires_in":5183999}


          Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
              res.kakao_account.id = res.id;
              res.kakao_account.nickname = res.properties.nickname;
              // for_partner: {uuid: "zvfO98bwxPPD79_zwIM"}
              // id: 1136359776
              // kakao_account: {
              // email: "2012729493@qq.com"
              // email_needs_agreement: false
              // has_email: true
              // is_email_valid: true
              // is_email_verified: true
              // properties: {nickname: "2012729493@qq.com"}
              // nickname: "2012729493@qq.com"}

              const data = this.KakaoParamsHandle(res.kakao_account);
              resolve(data);
            },
            fail: (error) => {
              console.log("kaKao login userInfo got failed" + error);
              reject();
            }
          });
        },
        fail: (err) => {
          console.log("kaKao login failed" + err);
          reject();
        }
      });
    })
  }
  KakaoParamsHandle(data: kaKaoUserInfo) {
    var info: info = { userName: 'kakao-' + data.id };
    data.nickname && (info.nickName = data.nickname);
    data.email && (info.email = data.email);
    data.birthday && (info.birthday = data.birthday);
    data.gender && (info.sex = data.gender === 'male' ? 0 : 1);
    return info;
  }
}

interface loginBaseParams {
  appId: number;
  source: SourceType;
  advChannel: number;
  network: NetWork;
  model: string;
  operatorOs: string;
  deviceNo: DeviceNo;
  device: Device;
  version: string;
  sdkVersion: string;
}
interface fbUserInfo {
  name?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  id: string;
}
interface info {
  nickName?: string;
  email?: string;
  birthday?: string;
  sex?: 0 | 1;
  userName: string;
}
interface kaKaoUserInfo {
  nickname?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  id: string;
}
