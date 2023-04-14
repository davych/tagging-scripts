import * as R from 'ramda';
import * as pageble from './pageble';
import * as utils from './utils';
import * as auth from './auth';
import * as infos from './infos';
import { set } from 'lodash';

export const runJob = ({ dataset, classList, id }: any) => {
  console.log('clickable', dataset, classList, id);
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
  const resultOfButton = getRuleOutput(button);
  const result = R.mergeDeepLeft([resultOfPage, resultOfButton]);
  
  const data = {};
  R.forEachObjIndexed((value, key) => {
    set(data, key, value);
  }, result);
  console.log('clickable', data);
}

export const getRuleOutput = (button: any, decode?: boolean) => {
  const { rules, tag } = button;
  const pageTag = pageble.getActivePageTag();
  const data = R.mergeDeepLeft([pageTag, tag, auth.getData(), infos.getData()]);
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