import * as pageble from './pageble';
import * as utils from './utils';
import * as dynamic from './dynamic';

export const updateDynamicData = (data: any) => {
  const pathname = utils.getPathname();
  dynamic.setData(pathname, data);
  // update dynamic data
  pageble.runJobWithDynamicData();
}

export const action = (name: string) => {
  return {
    run: () => {
      // run action
    }
  }
}