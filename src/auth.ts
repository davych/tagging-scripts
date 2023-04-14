import * as utils from './utils';

let auth: any;

export const getData = (): any => {
  return auth || utils.getAppConfig().auth || {};
}

export const setData = (data: any) => {
  auth = data;
}