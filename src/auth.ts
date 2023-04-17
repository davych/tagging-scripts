import * as utils from './utils';

export const getData = (): any => {
  return utils.getAppConfig().auth || {};
};
