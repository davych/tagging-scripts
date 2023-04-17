import * as pageble from './pageble';
import * as utils from './utils';
import * as dynamic from './dynamic';

export const updateDynamicData = (data: any) => {
  const pathname = utils.getPathname();
  dynamic.setData(pathname, data);
  // update dynamic data
  pageble.runJobWithDynamicData();
};

export const updateAuth = (auth: any) => {
  utils.updateAuth(auth);
};

export const updateInfos = (infos: any) => {
  utils.updateInfos(infos);
};
