import * as utils from './utils';

export const getData = () => {
  return utils.getAppConfig().infos || {};
};
