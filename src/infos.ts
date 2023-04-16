import * as utils from './utils';

let infos: any;

export const getData = () => {
  return infos || utils.getAppConfig().infos || {};
};

export const setData = (data: any) => {
  infos = data;
};
