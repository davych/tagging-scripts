// import config from './config';
import { debounce } from 'lodash';
import * as clickable from './clickable';
import * as pageble from './pageble';
import * as utils from './utils';


const taggingRun = (__TaggingConfiguration: any) => {
  if (__TaggingConfiguration) {
    console.log('Tagging is running');
    utils.setAppConfig(__TaggingConfiguration);
    var pushState = window.history.pushState;
    window.history.pushState = function() {
      const beforeIdentifier = utils.getPathname(window.location);
      pushState.apply(window.history, arguments as any);
      const afterIdentifier = utils.getPathname(window.location);
      if (beforeIdentifier !== afterIdentifier) {
        debounce(pageble.runJob, 100)();
      }
    };

    window.addEventListener('popstate', () => {
      pageble.runJob();
    });

    document.addEventListener(
      'click',
      e => {
        clickable.runJob(utils.getPictureFromDom(e.target));
      },
      true
    );
  }
};

export default taggingRun;
