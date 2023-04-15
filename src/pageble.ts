import * as utils from './utils';
import * as auth from './auth';
import * as infos from './infos';
import * as R from 'ramda';
import { merge, set } from 'lodash';

export const runJob = () => {
  const page = getActivedPage();
  if (!page) {
    return;
  }
  const { rules, tag } = page;
  const data = merge({}, tag, auth.getData(), infos.getData());
  // pending runtime data
  const flattenRules = utils.flattenKeys(rules);
  const output = R.mapObjIndexed((value) => {
    return utils.replace(value, data);
  }, flattenRules);
  console.log('output', output);
}

export const findPage = R.memoizeWith(R.toUpper, (identifier: string): any => {
  return R.find(R.propEq(identifier, 'id'))(window.__TaggingConfiguration.pages);
});

export const getActivedPage = () => {
  const pathname = utils.getPathname();
  const page = findPage('/home');
  if (!page) {
    return { pathname };
  }
  return page;
}

export const getActivePageTag = () => {
  const page = getActivedPage();
  if (!page) {
    return;
  }
  return page.tag;
}

export const getRuleOutput = (decode?: boolean) => {
  const page = getActivedPage();
  if (!page) {
    return;
  }
  const { rules, tag } = page;
  const data = merge({}, tag, auth.getData(), infos.getData());
  // pending runtime data
  const flattenRules = utils.flattenKeys(rules);
  const output = R.mapObjIndexed((value) => {
    return utils.replace(value, data);
  }, flattenRules);

  if(decode) {
    const decodeOutput = {};
    R.forEachObjIndexed((value, key) => {
      set(decodeOutput, key, value);
    }, output);
    return decodeOutput;
  }
  
  return output
}