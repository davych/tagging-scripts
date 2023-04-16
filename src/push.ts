import { set, get } from 'lodash';
import * as utils from './utils';

export const pushEvent = (scope: any, data: any) => {
  const { eventLabel, pushTargets = {} } = utils.getAppConfig();
  // push event
  set(window, '__TAG_DATA__LAYER', data);

  const eventName = get(scope, eventLabel, scope.type || 'event');

  const targetPipe: string[] = Object.values(pushTargets);
  targetPipe.forEach(pushFn => {
    // new function with event name and data as arguments
    const pushFnWithArgs = new Function('eventName', 'data', pushFn);
    pushFnWithArgs(eventName, data);
  });
};
