import * as R from 'ramda';
import * as pageble from './pageble';
import * as utils from './utils';
import * as auth from './auth';
import * as infos from './infos';
import { isEmpty, merge, set } from 'lodash';
import * as push from './push';
import * as dynamic from './dynamic';

export const runJob = ({ dataset = {}, classList = [], id }: any) => {
  // get actived page
  const page = pageble.getActivedPage();
  if (!page) {
    return;
  }

  // get actived button
  const button = getTargetButton({ classList, id }, page);

  if (!button) {
    return;
  }
  // get page output, get button output
  const resultOfPage = pageble.getRuleOutput() || {};
  const resultOfButton = getRuleOutput(button, false, dataset);
  const result = merge({}, resultOfPage, resultOfButton);

  const data = {};
  R.forEachObjIndexed((value, key) => {
    set(data, key, value);
  }, result);

  push.pushEvent(button, data);
};

export const getRuleOutput = (button: any, decode: boolean, dataset: any) => {
  const { rules, tag, dynamicKeys = [] } = button;

  if (!isEmpty(dynamicKeys)) {
    const keysOfCurrentButton = Object.keys(dataset);
    const diff = R.difference(dynamicKeys, keysOfCurrentButton);
    if (!R.isEmpty(diff)) {
      console.warn('[clickable]missing dynamic keys', diff);
    }
  }

  const pageTag = pageble.getActivePageTag();
  const dynamicData = dynamic.getData(utils.getPathname());
  const data = merge(
    {},
    dynamicData,
    dataset,
    pageTag,
    tag,
    auth.getData(),
    infos.getData()
  );
  const flattenRules = utils.flattenKeys(rules);
  const output = R.mapObjIndexed(value => {
    if(value.startsWith('return')) {
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

export const getTargetButton = (picture: any, page?: any) => {
  if (!page) {
    page = pageble.getActivedPage();
  }
  if (!page) {
    return;
  }
  const button: any = R.find(
    R.anyPass([
      R.propEq(picture.id, 'id'),
      R.propSatisfies(v => picture.classList?.contains(v), 'class'),
    ])
  )(page.actions.clicks);

  if (!button) {
    return;
  }
  return button;
};
