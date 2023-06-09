import * as utils from './utils';
import * as auth from './auth';
import * as infos from './infos';
import * as R from 'ramda';
import { isEmpty, merge, set } from 'lodash';
import * as dynamic from './dynamic';
import * as push from './push';

export const runJob = () => {
  const page = getActivedPage();
  if (!page || !isEmpty(page?.dynamicKeys)) {
    return;
  }
  const output = getRuleOutput(true);
  if (isEmpty(output)) {
    return;
  }
  push.pushEvent(page, output);
};

export const runJobWithDynamicData = () => {
  const output = getRuleOutput(true);
  if (isEmpty(output)) {
    return;
  }
  push.pushEvent(getActivedPage(), output);
};

export const findPage = R.memoizeWith(R.toUpper, (identifier: string): any => {
  const config = utils.getAppConfig();
  return R.find(R.propEq(identifier, 'id'))(config.pages);
});

export const getActivedPage = () => {
  const pathname = utils.getPathname();
  const page = findPage(pathname);
  if (!page) {
    return;
  }
  return page;
};

export const getActivePageTag = () => {
  const page = getActivedPage();
  if (!page) {
    return;
  }
  return page.tag;
};

export const getRuleOutput = (decode?: boolean) => {
  const page = getActivedPage();
  if (!page) {
    return;
  }
  const { rules, tag, dynamicKeys = [] } = page;
  const dynamicData = dynamic.getData(utils.getPathname());
  const data = merge({}, dynamicData, tag, auth.getData(), infos.getData());
  if (!isEmpty(dynamicKeys)) {
    const keysOfCurrentPage = Object.keys(dynamicData);
    const diff = R.difference(dynamicKeys, keysOfCurrentPage);
    if (!R.isEmpty(diff)) {
      console.warn('[page]missing dynamic keys', diff);
    }
  }
  // pending runtime data
  const flattenRules = utils.flattenKeys(rules);
  const output = R.mapObjIndexed(value => {
    if (value.startsWith('return')) {
      const vauleFunc = new Function('data', value);
      return vauleFunc(data);
    }
    return utils.replace(value, data);
  }, flattenRules);

  if (decode) {
    const decodeOutput = {};
    R.forEachObjIndexed((value, key) => {
      set(decodeOutput, key, value);
    }, output);
    return decodeOutput;
  }

  return output;
};
