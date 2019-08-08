import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'normalize.css';
import './base.scss'
import App from "./App";

const root = document.createElement('div');
root.id = "RG-SDK";
root.style.zIndex = "9999";
root.style.fontFamily = 'Helvetica, Arial, "Microsoft YaHei", sans-serif;';
document.body.appendChild(root);
// 直接传递到所有的组件中，横竖屏和语言包
ReactDOM.render(<App />, root);

export const Ins = App.instance;

