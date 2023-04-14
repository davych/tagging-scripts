import config from './config';
import * as clickable from './clickable';
import * as utils from './utils';

window.__TaggingConfiguration = config;

(() => {
  if (window.__TaggingConfiguration) {
    window.addEventListener('hashchange', () => {
      console.log('hashchange');
    });

    window.addEventListener('popstate', () => {
      console.log('popstate');
    });

    document.addEventListener('click', (e) => {
      clickable.runJob(utils.getPictureFromDom(e.target));
    }, true);
  }
})()