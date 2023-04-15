import config from './config';
import * as clickable from './clickable';
import * as pageble from './pageble';
import * as utils from './utils';

window.__TaggingConfiguration = config;

(() => {
  if (window.__TaggingConfiguration) {
    console.log('Tagging is running');

    var pushState = history.pushState;
    history.pushState = function () {
      const beforeIdentifier = utils.getPathname(location);
      pushState.apply(history, arguments as any);
      const afterIdentifier = utils.getPathname(location);
      if (beforeIdentifier !== afterIdentifier) {
        pageble.runJob();
      }
    };

    window.addEventListener('popstate', () => {
      pageble.runJob();
    });

    document.addEventListener('click', (e) => {
      clickable.runJob(utils.getPictureFromDom(e.target));
    }, true);
  }
})()