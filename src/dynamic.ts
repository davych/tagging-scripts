import { set, get } from "lodash";
let dynamic: any = {};

export const getData = (key: string): any => {
  return get(dynamic, key, {});
}

export const setData = (key: string, data: any) => {
  set(dynamic, key, data);
}