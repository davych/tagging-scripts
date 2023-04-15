import * as R from 'ramda';
import * as pageble from './pageble';
import * as utils from './utils';
import * as auth from './auth';
import * as infos from './infos';
import { merge, set } from 'lodash';

export const runJob = ({ dataset = {}, classList, id }: any) => {
  // get actived page
  const page = pageble.getActivedPage();
  if(!page) {
    return;
  }

  // get actived button
  const button = getTargetButton(
    { classList, id },
    page
  );
  
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
  console.log('clickable', data);
}

export const getRuleOutput = (button: any, decode: boolean, dataset: any) => {
  const { rules, tag, dynamicKeys } = button;

  if(!R.isEmpty(dynamicKeys)) {
    const keysOfCurrentButton = Object.keys(dataset);
    const diff = R.difference(dynamicKeys, keysOfCurrentButton);
    if(!R.isEmpty(diff)) {
      console.warn('missing dynamic keys', diff);
    }
  }

  const pageTag = pageble.getActivePageTag();
  const data = merge({}, dataset, pageTag, tag, auth.getData(), infos.getData());
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
  return output;
}


export const getTargetButton = (picture: any, page?: any) => {
  if(!page) {
    page = pageble.getActivedPage();
  }
  if (!page) {
    return;
  }
  const button: any = R.find(
    R.anyPass(
      [
        R.propEq(picture.id, 'id'),
        R.propSatisfies(v => picture.classList?.contains(v), 'class')
      ]
    )
  )(page.actions.clicks);

  if (!button) {
    return;
  }
  return button;
}