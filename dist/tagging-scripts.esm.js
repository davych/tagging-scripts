import { isObject, reduce, merge, get, set, isEmpty, debounce } from 'lodash-es';
import { difference, isEmpty as isEmpty$1, mapObjIndexed, forEachObjIndexed, memoizeWith, toUpper, find, propEq, anyPass, propSatisfies } from 'ramda';

var __TaggingConfiguration;
var flattenKeys = function flattenKeys(obj, path) {
  var _ref;
  if (path === void 0) {
    path = [];
  }
  return !isObject(obj) ? (_ref = {}, _ref[path.join('.')] = obj, _ref) : reduce(obj, function (cum, next, key) {
    return merge(cum, flattenKeys(next, [].concat(path, [key])));
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

var getData = function getData() {
  return getAppConfig().auth || {};
};

var getData$1 = function getData() {
  return getAppConfig().infos || {};
};

var dynamic = {};
var getData$2 = function getData(key) {
  return get(dynamic, key, {});
};

var pushEvent = function pushEvent(scope, data) {
  var _utils$getAppConfig = getAppConfig(),
    eventLabel = _utils$getAppConfig.eventLabel,
    _utils$getAppConfig$p = _utils$getAppConfig.pushTargets,
    pushTargets = _utils$getAppConfig$p === void 0 ? {} : _utils$getAppConfig$p;
  // push event
  set(window, '__TAG_DATA__LAYER', data);
  var eventName = get(scope, eventLabel, scope.type || 'event');
  var targetPipe = Object.values(pushTargets);
  targetPipe.forEach(function (pushFn) {
    // new function with event name and data as arguments
    var pushFnWithArgs = new Function('eventName', 'data', pushFn);
    pushFnWithArgs(eventName, data);
  });
};

var runJob = function runJob() {
  var page = getActivedPage();
  if (!page || !isEmpty(page == null ? void 0 : page.dynamicKeys)) {
    return;
  }
  var output = getRuleOutput(true);
  if (isEmpty(output)) {
    return;
  }
  pushEvent(page, output);
};
var findPage = /*#__PURE__*/memoizeWith(toUpper, function (identifier) {
  var config = getAppConfig();
  return find(propEq(identifier, 'id'))(config.pages);
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
  var data = merge({}, dynamicData, tag, getData(), getData$1());
  if (!isEmpty(dynamicKeys)) {
    var keysOfCurrentPage = Object.keys(dynamicData);
    var diff = difference(dynamicKeys, keysOfCurrentPage);
    if (!isEmpty$1(diff)) {
      console.warn('[page]missing dynamic keys', diff);
    }
  }
  // pending runtime data
  var flattenRules = flattenKeys(rules);
  var output = mapObjIndexed(function (value) {
    return replace(value, data);
  }, flattenRules);
  if (decode) {
    var decodeOutput = {};
    forEachObjIndexed(function (value, key) {
      set(decodeOutput, key, value);
    }, output);
    return decodeOutput;
  }
  return output;
};

var runJob$1 = function runJob(_ref) {
  var _ref$dataset = _ref.dataset,
    dataset = _ref$dataset === void 0 ? {} : _ref$dataset,
    classList = _ref.classList,
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
  var result = merge({}, resultOfPage, resultOfButton);
  var data = {};
  forEachObjIndexed(function (value, key) {
    set(data, key, value);
  }, result);
  pushEvent(button, data);
};
var getRuleOutput$1 = function getRuleOutput(button, decode, dataset) {
  var rules = button.rules,
    tag = button.tag,
    _button$dynamicKeys = button.dynamicKeys,
    dynamicKeys = _button$dynamicKeys === void 0 ? [] : _button$dynamicKeys;
  if (!isEmpty(dynamicKeys)) {
    var keysOfCurrentButton = Object.keys(dataset);
    var diff = difference(dynamicKeys, keysOfCurrentButton);
    if (!isEmpty$1(diff)) {
      console.warn('[clickable]missing dynamic keys', diff);
    }
  }
  var pageTag = getActivePageTag();
  var data = merge({}, dataset, pageTag, tag, getData(), getData$1());
  // pending runtime data
  var flattenRules = flattenKeys(rules);
  var output = mapObjIndexed(function (value) {
    return replace(value, data);
  }, flattenRules);
  if (decode) {
    var decodeOutput = {};
    forEachObjIndexed(function (value, key) {
      set(decodeOutput, key, value);
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
  var button = find(anyPass([propEq(picture.id, 'id'), propSatisfies(function (v) {
    var _picture$classList;
    return (_picture$classList = picture.classList) == null ? void 0 : _picture$classList.contains(v);
  }, 'class')]))(page.actions.clicks);
  if (!button) {
    return;
  }
  return button;
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
        debounce(runJob, 100)();
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

export default taggingRun;
//# sourceMappingURL=tagging-scripts.esm.js.map
