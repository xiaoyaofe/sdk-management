import { SdkApi } from '../api'

export class Account {
  static _ins: Account;
  static get instance(): Account {
    return this._ins || new Account();
  }
  private _user: User;
  private _users: Users;
  get user() {
    return this._user;
  }
  get users() {
    return this._users;
  }
  set user(user: User) {
    this._user = user;
    if (user.accountType !== 2) {
      // facebook账号不保存在users中
      this._users[user.userId] = user;
    }
  }
  constructor() {
    Account._ins = this;
  }
  init(data: { user: User, users: Users }) {
    data.user && (this._user = data.user);
    data.users && (this._users = data.users);
  }
  delCurUser(userId: number) {
    if (this._users[userId]) {
      delete this._users[userId];
      this._user = null;
    }
  }
}

export type Users = {
  [key: string]: User
}
export interface User {
  accountType: number;
  emailValid: number;
  email: string;
  firstLogin: number;
  password: string;
  token: string;
  userId: number;
  userName: string;
  userType: number;
}
