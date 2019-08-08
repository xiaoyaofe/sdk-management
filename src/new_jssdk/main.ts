import { Web } from "./sdks/web";
import { getUrlParams, getSdkType } from "./utils";


init(window);

function init(w: Window) {
  // 取地址栏参数,debugger不能解构
  const urlParams: UrlParams = getUrlParams(location.href);
  const appId = urlParams.advChannel;
  const advChannel = urlParams.advChannel;
  const sdkVersion = urlParams.sdkVersion;
  const region = urlParams.region;
  // 如果没有appId和advChannel 抛出错误
  if (!appId || !advChannel) throw "appId or advChannel is not find."
  // 打补丁
  polyfill();
  // 是否加载移动端log工具
  urlParams["debugger"] && initDebugger();
  // 获取sdk类型
  let type = getSdkType(advChannel);
  // 根据类型加载对应的sdk
  const sdk = loadSdkWithType(type, region).then((res => {
    res.init({ appId, advChannel, sdkVersion, region });
    return res
  }));
  // 初始化RG

  // 加载facebook jssdk
  // var fbInitPromise = fbSdkLoad();

  // 初始化w.RG
  function exposeApis(sdk: Web) {
    let RG = function () { };
    RG.prototype.jssdk = sdk;
    w.RG = new RG();

    // w.RG[api] = RG.jssdk[api]
  }
  // 打补丁完成后执行函数
  function RgPolyfilled() {

  }
  // 为一些老的浏览器打补丁
  function polyfill() {
    const polyfills = ['Promise', 'Set', 'Map', 'Object.assign', 'Function.prototype.bind'];
    const polyfillUrl = 'https://polyfill.io/v3/polyfill.min.js';
    const features = polyfills.filter(feature => !(feature in w));
    if (!features.length) return w.RgPolyfilled()

    var s = document.createElement('script');
    s.src = `${polyfillUrl}?features=${features.join(',')}&flags=gated,always&rum=0`;
    s.async = true;
    document.head.appendChild(s);
    s.onload = function () {
      w.RgPolyfilled()
    }
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
  // 异步加载sdk
  function loadSdkWithType(type: number, region: Region) {
    if (type < 1 || type > 4) throw `unknow type ${type}`;
    let result: Web;
    switch (type) {
      case 1:
        return import("./sdks/web").then(module => {
          return new module.Web(region);
        });
      case 2:
      // return import("SDK/Native").then(module => {
      // })
      case 3:
      // return import("SDK/FacebookWebGames");
      case 4:
      // return import("SDK/FacebookInstantGames");
    }
  }
}

type UrlParams = {
  appId: number;
  advChannel: number;
  sdkVersion: string;
  region: Region;
  t: string;
  debugger?: boolean;
  // web中必须传
  advertiseId?: string;
}
