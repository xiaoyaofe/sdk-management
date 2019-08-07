# sdk-demo
## v2.3

```sh
├── build # 打包目录
│   ├── vxxxx #打包的对应版本的代码
│   │
├── doc # jssdk的文档
├── src # 代码目录
│   ├── jssdk # sdk目录
│   │   ├── api #所有的请求的文件，暂时未使用 
│   │   ├── Base #所有的基础的配置
│   │   ├── config #配置文件的目录，暂时未使用 
│   │   ├── DOM #dom组件的内容 
│   │   ├── native #微端sdk，暂时未使用 
│   │   ├── plugins #所有的插件，暂时未使用 
│   │   ├── untils #公共方法 ，暂时未使用 
│   │   └── main.ts # 主入口
│   │
│   ├── add-shortcut # 引导桌面收藏目录
│   │   ├── assets # 资源目录
│   │   ├── App.tsx # 主页面
│   │   ├── i18n.ts # 本地化资源
│   │   ├── main.ts # 入口
│   │   ├── style.css # 引导页样式
│   │   └── swiper.tsx # swiper组件
│   │
│   ├── index # 首页的逻辑，已经废弃，全部加载在sspa中
│   ├── add-shortcut.html # 引导页的html文件
│   └── index.html # 测试启动的页面
├── babel.config.js #babel配置文件
├── jest.config.js #jest测试的配置文件
├── package.json 
├── postcss.config.js #postcss的配置文件
├── tsconfig.json #ts的配置文件
├── vconsole.min.js #移动端日志打印的库文件
├── webpack.config.js #webpack打包的配置文件
└── index.d.ts # 全局类型文件
```



注意事项：
1. sdk_purchased_done 这个点的点名不能改变的，在微端根据这个点名来判断进行购买打点
2. 每次对接之前给游戏方提供appId，advChannel，sdkVersion，和region测试，或者直接提供一个测试的页面来测试
