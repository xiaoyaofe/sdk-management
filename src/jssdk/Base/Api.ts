import * as Const from "Src/Base/Constant"
import { Utils } from "../utils";
import Http from "Src/Base/Http";

export default class Api {
  static _ins: Api
  static get instance(): Api {
    return this._ins || new Api;
  }
  constructor() {
    Api._ins = this
  }

  private route = {
    bind: Const.RouteBindZone,
    bindVisitor: Const.RouteBindVisitor
  }

  /** 绑定区服 */
  public async Bind(BindZoneParam: BindZoneParam) {

    var deviceMsg = await JsToNative.getDeviceMsgAsync()

    var data = Object.assign(
      deviceMsg,
      BindZoneParam,
      {
        sign: Utils.signed({
          userId: BindZoneParam.userId,
          appId: RG.jssdk.config.appId,
          gameZoneId: BindZoneParam.gameZoneId,
          source: deviceMsg.source
        })
      }
    )
    return Http.instance.post({ route: this.route.bind, data }).then(data => {
      return data
    })
  }

  public aBindVisitor(account: string, password: string) {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: RG.CurUserInfo().userId,
      userName: account,
      password: password,
      email: '',
      sign: Utils.signed({
        appId: RG.jssdk.config.appId,
        userId: RG.CurUserInfo().userId,
        userName: account,
        password: password
      })
    }
    return Http.instance.post({ route: this.route.bindVisitor, data }).then(data => {
      if (data.code === 200) {
        var userInfo = RG.jssdk.Account.user

        userInfo.userName = account
        RG.jssdk.Account.user = userInfo
      }
      return data
    })
  }

}
