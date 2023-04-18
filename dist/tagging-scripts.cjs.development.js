'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lodash = require('lodash');
var R = require('ramda');

var __TaggingConfiguration;
var flattenKeys = function flattenKeys(obj, path) {
  var _ref;
  if (path === void 0) {
    path = [];
  }
  return !lodash.isObject(obj) ? (_ref = {}, _ref[path.join('.')] = obj, _ref) : lodash.reduce(obj, function (cum, next, key) {
    return lodash.merge(cum, flattenKeys(next, [].concat(path, [key])));
  }, {});
};
var replace = function replace(str, obj) {
  return str.replaceAll(/\{([^}]+)\}/gi, function (_, a) {
    return a.split('.').reduce(function (b, c) {
      return b == null ? void 0 : b[c];
    }, obj);
  });
};
var getPictureFromDom = function getPictureFromDom(domTarget) {
  var dataset = domTarget.dataset,
    _domTarget$classList = domTarget.classList,
    classList = _domTarget$classList === void 0 ? [] : _domTarget$classList,
    id = domTarget.id;
  return {
    dataset: dataset,
    classList: classList,
    id: id
  };
};
var getPathname = function getPathname(locationInstance) {
  var location = locationInstance || window.location;
  var _getAppConfig = getAppConfig(),
    hash = _getAppConfig.hash;
  if (hash) {
    return location.hash.replace('#', '');
  }
  return location.pathname;
};
var getAppConfig = function getAppConfig() {
  return __TaggingConfiguration;
};
var setAppConfig = function setAppConfig(config) {
  __TaggingConfiguration = config;
};
var updateInfos = function updateInfos(infos) {
  if (!__TaggingConfiguration.infos) {
    __TaggingConfiguration.infos = {};
  }
  lodash.merge(__TaggingConfiguration.infos, infos);
};
var updateAuth = function updateAuth(auth) {
  if (!__TaggingConfiguration.auth) {
    __TaggingConfiguration.auth = {};
  }
  lodash.merge(__TaggingConfiguration.auth, auth);
};

var getData = function getData() {
  return getAppConfig().auth || {};
};

var getData$1 = function getData() {
  return getAppConfig().infos || {};
};

var dynamic = {};
var getData$2 = function getData(key) {
  return lodash.get(dynamic, key, {});
};
var setData = function setData(key, data) {
  lodash.set(dynamic, key, data);
};

var pushEvent = function pushEvent(scope, data) {
  var _utils$getAppConfig = getAppConfig(),
    eventLabel = _utils$getAppConfig.eventLabel,
    _utils$getAppConfig$p = _utils$getAppConfig.pushTargets,
    pushTargets = _utils$getAppConfig$p === void 0 ? {} : _utils$getAppConfig$p;
  // push event
  lodash.set(window, '__TAG_DATA__LAYER', data);
  var eventName = lodash.get(scope, eventLabel, scope.type || 'event');
  var targetPipe = Object.values(pushTargets);
  targetPipe.forEach(function (pushFn) {
    // new function with event name and data as arguments
    var pushFnWithArgs = new Function('eventName', 'data', pushFn);
    pushFnWithArgs(eventName, data);
  });
};

var runJob = function runJob() {
  var page = getActivedPage();
  if (!page || !lodash.isEmpty(page == null ? void 0 : page.dynamicKeys)) {
    return;
  }
  var output = getRuleOutput(true);
  if (lodash.isEmpty(output)) {
    return;
  }
  pushEvent(page, output);
};
var runJobWithDynamicData = function runJobWithDynamicData() {
  var output = getRuleOutput(true);
  if (lodash.isEmpty(output)) {
    return;
  }
  pushEvent(getActivedPage(), output);
};
var findPage = /*#__PURE__*/R.memoizeWith(R.toUpper, function (identifier) {
  var config = getAppConfig();
  return R.find(R.propEq(identifier, 'id'))(config.pages);
});
var getActivedPage = function getActivedPage() {
  var pathname = getPathname();
  var page = findPage(pathname);
  if (!page) {
    return;
  }
  return page;
};
var getActivePageTag = function getActivePageTag() {
  var page = getActivedPage();
  if (!page) {
    return;
  }
  return page.tag;
};
var getRuleOutput = function getRuleOutput(decode) {
  var page = getActivedPage();
  if (!page) {
    return;
  }
  var rules = page.rules,
    tag = page.tag,
    _page$dynamicKeys = page.dynamicKeys,
    dynamicKeys = _page$dynamicKeys === void 0 ? [] : _page$dynamicKeys;
  var dynamicData = getData$2(getPathname());
  var data = lodash.merge({}, dynamicData, tag, getData(), getData$1());
  if (!lodash.isEmpty(dynamicKeys)) {
    var keysOfCurrentPage = Object.keys(dynamicData);
    var diff = R.difference(dynamicKeys, keysOfCurrentPage);
    if (!R.isEmpty(diff)) {
      console.warn('[page]missing dynamic keys', diff);
    }
  }
  // pending runtime data
  var flattenRules = flattenKeys(rules);
  var output = R.mapObjIndexed(function (value) {
    if (value.startsWith('return')) {
      var vauleFunc = new Function('data', value);
      return vauleFunc(data);
    }
    return replace(value, data);
  }, flattenRules);
  if (decode) {
    var decodeOutput = {};
    R.forEachObjIndexed(function (value, key) {
      lodash.set(decodeOutput, key, value);
    }, output);
    return decodeOutput;
  }
  return output;
};

var runJob$1 = function runJob(_ref) {
  var _ref$dataset = _ref.dataset,
    dataset = _ref$dataset === void 0 ? {} : _ref$dataset,
    _ref$classList = _ref.classList,
    classList = _ref$classList === void 0 ? [] : _ref$classList,
    id = _ref.id;
  // get actived page
  var page = getActivedPage();
  if (!page) {
    return;
  }
  // get actived button
  var button = getTargetButton({
    classList: classList,
    id: id
  }, page);
  if (!button) {
    return;
  }
  // get page output, get button output
  var resultOfPage = getRuleOutput() || {};
  var resultOfButton = getRuleOutput$1(button, false, dataset);
  var result = lodash.merge({}, resultOfPage, resultOfButton);
  var data = {};
  R.forEachObjIndexed(function (value, key) {
    lodash.set(data, key, value);
  }, result);
  pushEvent(button, data);
};
var getRuleOutput$1 = function getRuleOutput(button, decode, dataset) {
  var rules = button.rules,
    tag = button.tag,
    _button$dynamicKeys = button.dynamicKeys,
    dynamicKeys = _button$dynamicKeys === void 0 ? [] : _button$dynamicKeys;
  if (!lodash.isEmpty(dynamicKeys)) {
    var keysOfCurrentButton = Object.keys(dataset);
    var diff = R.difference(dynamicKeys, keysOfCurrentButton);
    if (!R.isEmpty(diff)) {
      console.warn('[clickable]missing dynamic keys', diff);
    }
  }
  var pageTag = getActivePageTag();
  var dynamicData = getData$2(getPathname());
  var data = lodash.merge({}, dynamicData, dataset, pageTag, tag, getData(), getData$1());
  var flattenRules = flattenKeys(rules);
  var output = R.mapObjIndexed(function (value) {
    if (value.startsWith('return')) {
      var vauleFunc = new Function('data', value);
      return vauleFunc(data);
    }
    return replace(value, data);
  }, flattenRules);
  if (decode) {
    var decodeOutput = {};
    R.forEachObjIndexed(function (value, key) {
      lodash.set(decodeOutput, key, value);
    }, output);
    return decodeOutput;
  }
  return output;
};
var getTargetButton = function getTargetButton(picture, page) {
  if (!page) {
    page = getActivedPage();
  }
  if (!page) {
    return;
  }
  var button = R.find(R.anyPass([R.propEq(picture.id, 'id'), R.propSatisfies(function (v) {
    var _picture$classList;
    return (_picture$classList = picture.classList) == null ? void 0 : _picture$classList.contains(v);
  }, 'class')]))(page.actions.clicks);
  if (!button) {
    return;
  }
  return button;
};

var updateDynamicData = function updateDynamicData(data) {
  var pathname = getPathname();
  setData(pathname, data);
  // update dynamic data
  runJobWithDynamicData();
};
var updateAuth$1 = function updateAuth$1(auth) {
  updateAuth(auth);
};
var updateInfos$1 = function updateInfos$1(infos) {
  updateInfos(infos);
};

var helpers = {
  __proto__: null,
  updateDynamicData: updateDynamicData,
  updateAuth: updateAuth$1,
  updateInfos: updateInfos$1
};

// import config from './config';
var taggingRun = function taggingRun(__TaggingConfiguration) {
  if (__TaggingConfiguration) {
    console.log('Tagging is running');
    setAppConfig(__TaggingConfiguration);
    var pushState = window.history.pushState;
    window.history.pushState = function () {
      var beforeIdentifier = getPathname(window.location);
      pushState.apply(window.history, arguments);
      var afterIdentifier = getPathname(window.location);
      if (beforeIdentifier !== afterIdentifier) {
        lodash.debounce(runJob, 100)();
      }
    };
    window.addEventListener('popstate', function () {
      runJob();
    });
    document.addEventListener('click', function (e) {
      runJob$1(getPictureFromDom(e.target));
    }, true);
  }
};

exports.default = taggingRun;
exports.tagHelpers = helpers;
//# sourceMappingURL=tagging-scripts.cjs.development.js.map
