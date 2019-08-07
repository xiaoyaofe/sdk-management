import { User, Users } from "../common/account"
import { localStorageUserKeys } from "../config/Const"
import { Web } from "../sdks/web"
export function $postMessage(paramsStr: string, web: Web) {
  let params: any;
  try {
    params = JSON.parse(paramsStr);
  } catch (e) {
    console.log(e);
    params = {};
  }
  if (params.action === "get") {
    let user = getItem(localStorageUserKeys.user);
    user = user ? user : "";
    let users = getItem(localStorageUserKeys.users);
    users = users ? users : {};
    const data = { user, users } as userParams;
    // web.(data);
    return console.info('get User Users', data)
  } else if (params.action === "set") {
    const data = params.data as userParams;
    setItem(localStorageUserKeys.user, JSON.stringify(data.user));
    setItem(localStorageUserKeys.users, JSON.stringify(data.users));
    return console.info('set User Users', data);
  }
  if (params.action === "mark") {
    return console.info(`markName: ${params.name},param: ${JSON.stringify(params.param as markParams)}`);
  }
  console.log(paramsStr);

  function setItem(name: string, info: string) {
    try {
      localStorage.setItem(name, info);
    } catch (e) {
      console.log(e);
    }
  }
  function getItem(name: string) {
    let result;
    try {
      result = localStorage.getItem(name);
    } catch (e) {
      console.log(e);
    }
    return result;
  }
}
interface userParams {
  user: User;
  users: Users;
}
