import { Web } from "./web";

function init(window: Window) {
  // 初始化window.RG
  function exposeApis() {
    let RG = function () { };
    RG.prototype.jssdk = this;
    window.RG = new RG();

  }
  // 获取地址栏参数
  function getUrlParam(): UrlParams {
    var result = Object.create(null);
    var interrogationIndex = location.href.indexOf("?") + 1
    var str = interrogationIndex === 0 ? "" : location.href.slice(interrogationIndex)
    if (str) {
      var arr = str.split(/&|%26/)
      arr.forEach(item => {
        var arr = item.split(/=|%3D/)
        var key = arr[0]
        var val = arr[1]
        result[key] = val
      })
    }
    return result;
  }
  // 初始化debugger
  function initDebugger() {
    return new Promise(resolve => {
      var js = document.createElement("script");
      js.src = "//cdnjs.cloudflare.com/ajax/libs/vConsole/3.2.0/vconsole.min.js";
      js.onload = () => {
        new VConsole();
        resolve();
      };
      document.head.appendChild(js);
    });
  }
  // 为一些老的浏览器打补丁
  function polyfill() {
    const polyfills = ['Promise', 'Set', 'Map', 'Object.assign', 'Function.prototype.bind'];
    const polyfillUrl = 'https://polyfill.io/v3/polyfill.min.js';
    const features = polyfills.filter(feature => !(feature in window));
    if (!features.length) return window.RgPolyfilled()

    var s = document.createElement('script');
    s.src = `${polyfillUrl}?features=${features.join(',')}&flags=gated,always&rum=0`;
    s.async = true;
    document.head.appendChild(s);
    s.onload = function () {
      window.RgPolyfilled()
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

  async function initSdk(appId: number, advChannel: number) {

    function getSdkType(advChannelStr: string) {
      let type: number;
      const advChannel = Number(advChannelStr)
      if (advChannel > 30000 && advChannel < 31000) {
        type = 1;
      } else if (advChannel < 30000) {
        type = 2;
      } else if (advChannel > 31000 && advChannel < 32000) {
        type = 3;
      } else if (advChannel > 32000 && advChannel < 33000) {
        type = 4;
      } else {
        throw "unknow advChannel";
      }
      return type;
    }
    async function loadSdkWithType(sdkType: number, config: any) {
      let sdk: Web;
      switch (sdkType) {
        case 1:
          await import("Src/newTypes/web").then(module => {
            sdk = new module.Web(config);
          });
          break;
        case 2:
          await import("src/old_jssdk/Native").then(module => {

          })
          break;
        case 3:
          return import("src/old_jssdk/FacebookWebGames");
        case 4:
          return import("src/old_jssdk/FacebookInstantGames");
      }
      return sdk;
    }
  }

}

type UrlParams = {
  appId: number;
  advChannel: number;
  sdkVersion: string;
  t: string;
  debugger?: boolean;
  // web中必须传
  advertiseId?: string;
}
