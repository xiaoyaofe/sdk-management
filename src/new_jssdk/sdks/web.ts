import { User, Users } from '../common/account';

import { Base } from './sdk';
import { localStorageUserKeys } from "../config/Const"

export class Web extends Base {
  indexOrigin: string;
  isMobile: boolean;
  getUserPromiseResolve: Function;
  sdkType = "web";

  constructor(region: Region) {
    super(region);
    this.isMobile = isMobile();
  }

  async init() {
    await this.reactInitPromise;
    await this.reactDomAndRouterPromise;
    this.App = await this.domPromise;
    const data = await this.getUser();
    this.account.init(data as { user: User, users: Users });
    await this.baseInit();
  }
  // 自动登录
  autoLogin() {
    let autoLogin = false;
    const user = this.account.user;
    if (user) autoLogin = true;
    if (window.name === "redirect") {
      autoLogin = false;
      window.name = "";
    }
  }
  // 下载到桌面
  install() {
    let url: string;
    if (/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)) {
      if (this.config.download_ios) {
        url = this.config.download_ios;
      } else {
        url = `${SERVER}/jssdk/${this.config.sdkVersion}/add-shortcut.html?language=${this.config.language}&system=ios&appId=${this.config.appId}&link=${this.indexOrigin}`;
      }
    } else if (/(Android)/i.test(window.navigator.userAgent)) {
      if (this.config.download_android) {
        url = this.config.download_android;
      } else {
        url = `${SERVER}/jssdk/${this.config.sdkVersion}/add-shortcut.html?language=${this.config.language}&system=android&appId=${this.config.appId}&link=${this.indexOrigin}`;
      }
    } else {
      url = `${SERVER}/platform/shortcut.jsp?link=${encodeURIComponent(this.indexOrigin + '?shortcut=true')}&fileName=${RG.jssdk.config.name}&t=${Date.now()}`;
    }
    console.info(url);
    window.open(url);
  }
  // 获取设备信息
  getDeviceMsgAsync = () => {
    // web 不管是移动端还是pc端source都是3
    const data: NativeDeviceMsg = { device: "0", deviceNo: "0", version: "0", model: "0", operatorOs: "0", network: 0, source: 3 };
    return Promise.resolve(data);
  }
  // 打点
  mark(markName: string, markParams: markParams) {
    this.$postMessage("mark", markParams);
  };
  // 联系客服
  conactCustomer() {
    let url: string;
    if (this.isMobile) {
      url = this.config.facebook_index;
    } else {
      url = this.config.messenger_pc;
    }
    window.open(url);
  }
  // 保存用户信息
  saveUser() {
    this.setItem(localStorageUserKeys.user, JSON.stringify(this.account.user));
    this.setItem(localStorageUserKeys.users, JSON.stringify(this.account.users));
    this.$postMessage("set", { user: this.account.user, users: this.account.users });
  }
  // 获取用户信息
  getUser() {
    return new Promise<{ user: User | "", users: Users | {} }>((resolve, reject) => {
      const userStr = this.getItem(localStorageUserKeys.user);
      const usersStr = this.getItem(localStorageUserKeys.users);
      let data: { user: User | "", users: Users | {} };
      try {
        data.user = JSON.parse(userStr);
      } catch (e) {
        console.log(e);
        data.user = "";
      }
      try {
        data.users = JSON.parse(usersStr);
      } catch (e) {
        console.log(e);
        data.users = {};
      }
      if (data.user) {
        resolve(data);
      } else {
        this.getUserPromiseResolve = resolve;
        this.$postMessage("get");
      }
    })
  }
  $postMessage(action: "set" | "get" | "mark", params?: any) {

    const data = JSON.stringify({ action, data: params });
    window.parent.postMessage(data, this.indexOrigin);
  }
  initIndexOrigin() {
    const indexUrl = this.config.index_formal;
    this.indexOrigin = /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(indexUrl)[0];
    var that = this;
    window.addEventListener("message", onMessage(this.indexOrigin), false);
    function onMessage(indexUrl: string) {
      return function (event: MessageEvent) {
        if (event.origin !== /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(indexUrl)[0]) return;
        that.getUserPromiseResolve(JSON.parse(event.data));
      }
    }
  }
}

function isMobile() {
  var a = window.navigator.userAgent || window.navigator.vendor || window.opera;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) return true;
  else return false;
}

/*
https://blog.zhengxianjun.com/2015/05/javascript-crypto-js/
*/
