function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var memoize = _interopDefault(require('memoizee'));
var md5 = _interopDefault(require('md5'));
var Citation = _interopDefault(require('citation-js'));
var svgPathParse = require('svg-path-parse');
var gsap = _interopDefault(require('gsap')); var MorphSVGPlugin = _interopDefault(require('gsap-bonus/MorphSVGPlugin'));
var DrawSVGPlugin = _interopDefault(require('gsap-bonus/DrawSVGPlugin'));
var reactRouterDom = require('react-router-dom');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var range = function range(n) {
  return [].concat(Array(n).keys());
};
var defaultTranslations = {
  _: '',
  h: {
    opacity: 0
  },
  v: {
    opacity: 1
  },
  p: {
    opacity: 0.3
  },
  d: {
    drawSVG: 0
  },
  D: {
    drawSVG: '0 100%'
  },
  x: true
};
function timeline(obj) {
  var stepsByKey = Object.entries(obj).map(function (_ref) {
    var key = _ref[0],
        thing = _ref[1];
    var steps, translations;

    if (typeof thing == 'string') {
      steps = thing;
      translations = {};
    } else {
      steps = thing[0];
      var _thing$ = thing[1];
      translations = _thing$ === void 0 ? {} : _thing$;
    }

    var translated = [];
    var number = 0;

    var translate = function translate(s) {
      return translations.hasOwnProperty(s) ? translations[s] : defaultTranslations.hasOwnProperty(s) ? defaultTranslations[s] : s;
    };

    steps.split('').forEach(function (step) {
      var prev = translated[translated.length - 1];

      if (step === ' ') {
        translated.push(prev);
        return;
      }

      if (step === '+') {
        number += 1;
        translated.push(translate(number));
        return;
      }

      if (step === '-') {
        number -= 1;
        translated.push(translate(number));
        return;
      }

      var n = parseInt(step);

      if (!isNaN(n)) {
        number = n;
        translated.push(translate(number));
        return;
      }

      translated.push(translate(step));
    });
    return [key, translated];
  });
  var result = range(stepsByKey[0][1].length).map(function (stepIndex) {
    return Object.fromEntries(stepsByKey.map(function (_ref2) {
      var key = _ref2[0],
          steps = _ref2[1];
      return [key, steps[stepIndex]];
    }));
  });
  return result;
}
var fetchLaTeXSvg = function fetchLaTeXSvg(tex) {
  try {
    return Promise.resolve(fetchLaTeXSvghelper(tex)).then(function (text) {
      var ele = document.createElement('div');
      ele.innerHTML = text;
      var svg = ele.querySelector('svg');

      if (!svg) {
        console.error("Couldn't compile " + tex);
        return null;
      }

      var rootId = 'r' + Math.floor(Math.random() * 100000);
      [].concat(svg.querySelectorAll('[id]')).forEach(function (ele) {
        ele.classList.add(ele.id);
        ele.id = rootId + ele.id;
      });
      [].concat(svg.querySelectorAll('use')).forEach(function (ele) {
        var selector = ele.getAttribute('xlink:href');
        var originalId = selector.slice(1);
        ele.setAttribute('xlink:href', '#' + rootId + originalId);
      });
      return svg;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var fetchLaTeXSvghelper = function () {
  var cacheBust = 8;
  var environment = process.env.NODE_ENV;

  if (environment === 'development') {
    var HOST = "http://" + window.location.hostname + ":3001";
    return memoize(function (tex) {
      return fetch(HOST + "/latex?cachebust=" + cacheBust + "&tex=" + encodeURIComponent(tex)).then(function (res) {
        return res.text();
      });
    });
  } else if (environment === 'production') {
    return memoize(function (tex) {
      var filename = "" + cacheBust + md5(tex) + ".svg";
      return fetch("/latex/" + filename).then(function (res) {
        return res.text();
      });
    });
  }
}();

function usePrevious(value) {
  var ref = React.useRef();
  React.useEffect(function () {
    ref.current = value;
  });
  return ref.current;
}
function useLocalStorage(key, initialValue) {
  var _useState = React.useState(function () {
    try {
      var item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }),
      storedValue = _useState[0],
      setStoredValue = _useState[1];

  var setValue = function setValue(value) {
    try {
      var valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

var CitationContext = React__default.createContext(null);
function CitationProvider(_ref) {
  var bibUrl = _ref.bibUrl,
      citationMap = _ref.citationMap,
      children = _ref.children;

  var _useState = React.useState(null),
      bibliography = _useState[0],
      setBibliography = _useState[1];

  React.useEffect(function () {

    (function () {
      try {
        if (!bibUrl) {
          return;
        }

        return Promise.resolve(fetch(bibUrl).then(function (res) {
          return res.text();
        })).then(function (text) {
          var result = Citation.parse.bibtex.text(text);
          setBibliography(result);
        });
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, []);
  return /*#__PURE__*/React__default.createElement(CitationContext.Provider, {
    value: {
      bibliography: bibliography,
      citationMap: citationMap
    }
  }, children);
}
function RenderCite(_ref2) {
  var id = _ref2.id,
      render = _ref2.render;

  var _useContext = React.useContext(CitationContext),
      citationMap = _useContext.citationMap,
      bibliography = _useContext.bibliography;

  return render({
    text: bibliography ? new Citation(bibliography.find(function (e) {
      return e.label === id;
    })).format('bibliography', {
      format: 'text',
      template: 'apa',
      lang: 'en-US'
    }) : null,
    number: bibliography && !bibliography.find(function (e) {
      return e.label === id;
    }) ? "?? " + id : citationMap[id] || null
  });
}
function RenderBibliography(_ref3) {
  var render = _ref3.render;

  var _useContext2 = React.useContext(CitationContext),
      citationMap = _useContext2.citationMap,
      bibliography = _useContext2.bibliography;

  var sortedEntries = Object.entries(citationMap).sort(function (_ref4, _ref5) {
    var n1 = _ref4[1];
    var n2 = _ref5[1];
    return n1 - n2;
  });
  if (!bibliography) return render([]);
  return render(sortedEntries.map(function (_ref6) {
    var id = _ref6[0],
        n = _ref6[1];
    var entry = bibliography.find(function (e) {
      return e.label === id;
    });
    var html = new Citation(entry).format('bibliography', {
      format: 'html',
      template: 'apa',
      lang: 'en-US'
    });
    return {
      id: id,
      n: n,
      html: html
    };
  }));
}

function Notes(_ref) {
  _objectDestructuringEmpty(_ref);

  return /*#__PURE__*/React__default.createElement("div", null);
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$1.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray_1(value) || isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? _baseFlatten(array, INFINITY) : [];
}

var flattenDeep_1 = flattenDeep;

var animate = function animate(svgEl, text, replaceImediately, TIMING, setSvgData) {
  if (replaceImediately === void 0) {
    replaceImediately = false;
  }

  if (TIMING === void 0) {
    TIMING = DEFAULT_TIMING;
  }

  if (setSvgData === void 0) {
    setSvgData = function setSvgData() {};
  }

  try {
    var _temp3 = function _temp3() {
      if (!newSvg) {
        return;
      }

      var newPaths = svgToGroupedPaths(newSvg);
      setSvgData({
        width: parseFloat(newSvg.getAttribute('width').replace('pt', ''), 10),
        height: parseFloat(newSvg.getAttribute('height').replace('pt', ''), 10),
        viewBox: newSvg.getAttribute('viewBox').split(' ').map(function (s) {
          return parseFloat(s, 10);
        })
      });
      var afterIds = Object.keys(newPaths);
      var beforeIds = [].concat(svgEl.querySelectorAll('[id]')).map(function (e) {
        return e.id;
      });
      var allIds = [].concat(new Set([].concat(afterIds, beforeIds)));
      return Promise.all(allIds.map(function (id) {
        var shouldRemove = beforeIds.includes(id) && !afterIds.includes(id);
        var isNew = afterIds.includes(id) && !beforeIds.includes(id);

        if (shouldRemove) {
          var _element = svgEl.querySelector("#" + id);

          if (replaceImediately) {
            _element.remove();

            return true;
          } else {
            return new Promise(function (res) {
              return gsap.to(_element, TIMING, {
                opacity: 0,
                onComplete: function onComplete() {
                  _element.remove();

                  res();
                }
              });
            });
          }
        }

        if (isNew) {
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.id = id;
          path.setAttribute('d', newPaths[id]);
          var color = colorFromGroupId(id);

          if (whiteListedColors.includes(color)) {
            path.setAttribute('fill', color);
          }

          path.style.opacity = 0;
          svgEl.appendChild(path);

          if (replaceImediately) {
            path.style.opacity = 1;
            return true;
          } else {
            return new Promise(function (res) {
              return gsap.to(path, TIMING, {
                opacity: 1,
                onComplete: res
              });
            });
          }
        }

        var element = svgEl.querySelector("#" + id);

        if (replaceImediately) {
          element.setAttribute('d', newPaths[id]);
          element.style.opacity = 1;
          return true;
        } else {
          return new Promise(function (res) {
            return gsap.to(element, TIMING, {
              morphSVG: newPaths[id],
              opacity: 1,
              onComplete: res
            });
          });
        }
      }));
    };

    text = text.replace(/\\g(\d)/g, function (match, p1) {
      return "\\g{" + colorHash(p1) + "}";
    });
    text = text.replace(/\\g\{(.*?)\}/g, function (match, p1) {
      return "\\g{" + colorHash(p1) + "}";
    });
    var newSvg;

    var _temp4 = function () {
      if (text == '') {
        newSvg = document.createElement('svg');
        newSvg.setAttribute('width', '0pt');
        newSvg.setAttribute('height', '0pt');
        newSvg.setAttribute('viewBox', '0 0 0 0');
      } else {
        return Promise.resolve(fetchLaTeXSvg(text)).then(function (_fetchLaTeXSvg) {
          newSvg = _fetchLaTeXSvg;
        });
      }
    }();

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
};
gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);
var whiteListedColors = ['#00d56f'];

function elementToPath(child, transform) {
  if (transform === void 0) {
    transform = '';
  }

  var svg = child.ownerSVGElement;

  if (child.tagName === 'use') {
    var offsetX = parseFloat(child.getAttribute('x'), 10) || 0;
    var offsetY = parseFloat(child.getAttribute('y'), 10) || 0;
    var id = child.getAttribute('xlink:href');
    var element = svg.querySelector(id);

    if (element.tagName == 'path') {
      var path = element.getAttribute('d');

      var _pathParse$relNormali = svgPathParse.pathParse(path).relNormalize({
        transform: ("translate(" + offsetX + ", " + offsetY + ") " + transform).trim()
      }),
          err = _pathParse$relNormali.err,
          segments = _pathParse$relNormali.segments,
          type = _pathParse$relNormali.type;

      var newPath = svgPathParse.serializePath({
        err: err,
        segments: segments,
        type: type
      });
      return newPath;
    } else if (element.tagName == 'use') {
      var tr = element.getAttribute('transform') || '';
      return elementToPath(element, ("translate(" + offsetX + ", " + offsetY + ") " + tr).trim());
    } else {
      console.error('Unrecognized use of element', element);
    }
  }

  if (child.tagName === 'rect') {
    var x = +child.getAttribute('x');
    var y = +child.getAttribute('y');
    var width = +child.getAttribute('width');
    var height = +child.getAttribute('height');
    var pathData = 'M' + x + ' ' + y + 'H' + (x + width) + 'V' + (y + height) + 'H' + x + 'z';
    return pathData;
  }

  console.error('Unrecognized:', child);
  return null;
}

function groupIdFromElement(element) {
  var fill = element.getAttribute('fill');

  if (!fill) {
    return 'g0';
  }

  return 'g' + fill.slice(1);
}

function colorFromGroupId(id) {
  if (id == 'g0') return 'black';
  return '#' + id.slice(1);
}

function svgToGroupedPaths(svg) {
  var rest = [].concat(svg.querySelectorAll('.page1 > :not(g)')).map(function (child) {
    return {
      id: groupIdFromElement(child),
      path: elementToPath(child)
    };
  });
  var gs = [].concat(svg.querySelectorAll('.page1 > g')).map(function (group) {
    return {
      id: groupIdFromElement(group),
      path: [].concat(group.children).map(function (child) {
        return elementToPath(child);
      }).filter(Boolean).join(' ')
    };
  });
  var byGroupId = [].concat(rest, gs).reduce(function (acum, _ref) {
    var id = _ref.id,
        path = _ref.path;

    if (!acum[id]) {
      acum[id] = '';
    }

    acum[id] += ' ' + path;
    return acum;
  }, {});
  return byGroupId;
}

function colorHash(str) {
  str = String(str);
  var hash = 0;

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var colour = '';

  for (var _i = 0; _i < 3; _i++) {
    var value = hash >> _i * 8 & 0xff;
    colour += ('00' + value.toString(16)).substr(-2).toUpperCase();
  }

  return colour;
}

var DEFAULT_TIMING = 0.4;

var allColors = ['#D32F2F', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19'];

function convertToTeX(tex, selections) {
  return tex.split('').map(function (c, i) {
    var ending = selections.filter(function (_ref) {
      var e = _ref[2];
      return e === i;
    });
    var starting = selections.filter(function (_ref2) {
      var s = _ref2[1];
      return s === i;
    }).sort(function (a, b) {
      return b[3] - a[3];
    }).map(function (_ref3) {
      var c = _ref3[0];
      return c;
    });
    return ending.map(function (e) {
      return '}';
    }).join('') + starting.map(function (col) {
      return "\\g{" + (col + 1) + "}{";
    }).join('') + c;
  }).join('') + selections.filter(function (_ref4) {
    var e = _ref4[2];
    return e === tex.length;
  }).map(function (e) {
    return '}';
  }).join('');
}

var lookupAnimationGroups = function () {
  return function (start, end) {
    var data = JSON.parse(localStorage.animationGroups || '[]');
    var result = data.find(function (_ref5) {
      var s = _ref5.start,
          e = _ref5.end;
      return start === s && end === e || start === e && end === s;
    });

    if (!result) {
      return [start, end];
    }

    if (result.start === start) {
      return [convertToTeX(result.start, result.startGroups), convertToTeX(result.end, result.endGroups)];
    } else {
      return [convertToTeX(result.end, result.endGroups), convertToTeX(result.start, result.startGroups)];
    }
  };
}();
function AnimationEditor(_ref6) {
  var playedAnimations = _ref6.animations;

  var _useLocalStorage = useLocalStorage('animationGroups', []),
      animations = _useLocalStorage[0],
      setAnimations = _useLocalStorage[1];

  var _useState = React.useState(0),
      colorIndex = _useState[0],
      setColorIndex = _useState[1];

  var onKeyPress = function onKeyPress(e) {
    try {
      var i = parseInt(e.key, 10);
      setColorIndex((i + 9) % 10);
    } catch (e) {}
  };

  React.useEffect(function () {
    window.addEventListener('keypress', onKeyPress);
    return function () {
      return window.removeEventListener('keypress', onKeyPress);
    };
  }, []);
  React.useEffect(function () {
    var newOnes = playedAnimations.filter(function (animation) {
      var animated = animations.find(function (a) {
        return animation.start == a.start && animation.end == a.end || animation.start == a.end && animation.end == a.start;
      });
      var inDataBase = !animated;
      return inDataBase;
    }).map(function (anim) {
      return _extends({}, anim, {
        startGroups: [],
        endGroups: []
      });
    });

    if (newOnes.length >= 1) {
      setAnimations(function (animations) {
        return [].concat(animations, newOnes);
      });
    }
  }, [animations, setAnimations, playedAnimations]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "animation-editor"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "colors"
  }, allColors.map(function (c, i) {
    return /*#__PURE__*/React__default.createElement("span", {
      key: i,
      className: "color",
      style: {
        backgroundColor: c,
        transform: colorIndex === i ? 'scale(1.4)' : 'scale(1)'
      },
      onClick: function onClick() {
        return setColorIndex(i);
      }
    });
  })), /*#__PURE__*/React__default.createElement("style", null, " .formula *::selection { background: " + allColors[colorIndex] + " } "), /*#__PURE__*/React__default.createElement("div", {
    className: "animations"
  }, playedAnimations.map(function (animation) {
    var index = animations.findIndex(function (a) {
      return animation.start == a.start && animation.end == a.end || animation.start == a.end && animation.end == a.start;
    });
    var a = animations[index];
    if (!a) return null;
    return _extends({}, a, {
      start: '' + a.start,
      end: '' + a.end,
      index: index
    });
  }).filter(Boolean).map(function (animation) {
    var i = animation.index;
    return /*#__PURE__*/React__default.createElement(Animation, {
      animation: animation,
      setAnimation: function setAnimation(f) {
        return setAnimations([].concat(animations.slice(0, i), [f], animations.slice(i + 1)));
      },
      removeAnimation: function removeAnimation() {
        return setAnimations([].concat(animations.slice(0, i), animations.slice(i + 1)));
      },
      colorIndex: colorIndex,
      setColorIndex: setColorIndex,
      i: i
    });
  }).filter(Boolean)));
}

function Animation(_ref7) {
  var colorIndex = _ref7.colorIndex,
      setColorIndex = _ref7.setColorIndex,
      animation = _ref7.animation,
      setAnimation = _ref7.setAnimation;

  var handleSelection = function handleSelection(ev, part, background) {
    if (ev.button === 2) {
      var _extends2;

      var index = ev.target.dataset.index;
      var groups = part + 'Groups';
      var selections = determineSelections(animation[part], animation[groups]);
      var activeSelection = selections[index];

      if (!activeSelection) {
        return;
      }

      setAnimation(_extends({}, animation, (_extends2 = {}, _extends2[groups] = animation[groups].filter(function (s) {
        return s !== activeSelection;
      }), _extends2)));
      return;
    }

    if (ev.button === 1) {
      ev.preventDefault();
      var group = ev.target.dataset.group;
      setColorIndex(+group);
      return;
    }

    var sel = window.getSelection();

    try {
      var _extends3;

      var s = parseInt(sel.anchorNode.parentNode.dataset.index, 10) + sel.anchorOffset;
      var e = parseInt(sel.focusNode.parentNode.dataset.index, 10) + sel.focusOffset;
      var start = Math.min(s, e);
      var end = Math.max(s, e);

      if (start === end) {
        return;
      }

      var newAnimation = _extends({}, animation, (_extends3 = {}, _extends3[part + 'Groups'] = mergeSelections([].concat(animation[part + 'Groups'], [[colorIndex, start, end]])), _extends3));

      setAnimation(newAnimation);
    } catch (e) {
      console.error(e);
    } finally {
      sel.removeAllRanges();
    }
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "animation",
    style: {}
  }, ['start', 'end'].map(function (part) {
    var groups = part + 'Groups';
    var selections = determineSelections(animation[part], animation[groups]);
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", {
      className: "formula",
      style: {
        fontFamily: 'Iosevka Term, monospace'
      },
      onMouseUp: function onMouseUp(e) {
        return handleSelection(e, part);
      },
      onContextMenu: function onContextMenu(e) {
        return e.preventDefault();
      }
    }, animation[part].split('').map(function (c, j) {
      var color = null === selections[j] ? 'black' : allColors[selections[j][0]];
      var group = null === selections[j] ? -1 : selections[j][0];
      return /*#__PURE__*/React__default.createElement("span", {
        "data-index": j,
        "data-group": group,
        style: {
          background: color
        }
      }, c);
    })));
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "preview"
  }, /*#__PURE__*/React__default.createElement(AutoMorph, {
    steps: [convertToTeX(animation.start, animation.startGroups), convertToTeX(animation.end, animation.endGroups)]
  })));
}

function AutoMorph(_ref8) {
  var steps = _ref8.steps;

  var _useState2 = React.useState(0),
      step = _useState2[0],
      setStep = _useState2[1];

  var onClick = function onClick() {
    return setStep(function (step) {
      return (step + 1) % 2;
    });
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "automorph",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement(Morph, {
    TIMING: 1.0,
    display: true,
    useAnimationDatabase: false
  }, steps[step]));
}

function determineSelections(tex, selections) {
  var colors = [];
  var levels = [];
  tex.split('').forEach(function (c, i) {
    var ending = selections.filter(function (_ref9) {
      var e = _ref9[2];
      return e === i;
    });
    var starting = selections.filter(function (_ref10) {
      var s = _ref10[1];
      return s === i;
    }).sort(function (a, b) {
      return b[3] - a[3];
    });
    levels = levels.slice(0, levels.length - ending.length);
    levels = [].concat(levels, starting);
    var currentActive = levels[levels.length - 1];

    if (!currentActive) {
      colors.push(null);
    } else {
      colors.push(currentActive);
    }
  });
  return colors;
}

function mergeSelections(selections) {
  var result = [];
  selections.forEach(function (_ref11) {
    var color = _ref11[0],
        start = _ref11[1],
        end = _ref11[2];
    var prev = result.find(function (_ref12) {
      var c = _ref12[0],
          e = _ref12[2];
      return e === start && c === color;
    });

    if (prev) {
      prev[3] = end;
    } else {
      result.push([color, start, end]);
    }
  });
  return result;
}

function Morph(_ref) {
  var children = _ref.children,
      display = _ref.display,
      inline = _ref.inline,
      debug = _ref.debug,
      _ref$useAnimationData = _ref.useAnimationDatabase,
      useAnimationDatabase = _ref$useAnimationData === void 0 ? true : _ref$useAnimationData,
      replace = _ref.replace,
      _ref$TIMING = _ref.TIMING,
      TIMING = _ref$TIMING === void 0 ? 0.6 : _ref$TIMING;
  var svgEl = React.useRef(null);

  var _useState = React.useState({
    viewBox: [0, 0, 0, 0],
    width: 0,
    height: 0
  }),
      _useState$ = _useState[0],
      _useState$$viewBox = _useState$.viewBox,
      vx = _useState$$viewBox[0],
      vy = _useState$$viewBox[1],
      vw = _useState$$viewBox[2],
      vh = _useState$$viewBox[3],
      width = _useState$.width,
      height = _useState$.height,
      setSvgData = _useState[1];

  var _useState2 = React.useState(false),
      transition = _useState2[0],
      setTransition = _useState2[1];

  var wrapMath = function wrapMath(s) {
    if (display) {
      return '$\\displaystyle ' + s + '$';
    } else if (inline) {
      return '$' + s + '$';
    }

    return s;
  };
  var FONT_SCALING_FACTOR = 2;

  var updateSvgData = function updateSvgData(_ref2) {
    var viewBox = _ref2.viewBox,
        width = _ref2.width,
        height = _ref2.height;
    setSvgData({
      viewBox: viewBox,
      width: FONT_SCALING_FACTOR * width,
      height: FONT_SCALING_FACTOR * height
    });
  };

  var previousChildren = usePrevious(children);
  React.useEffect(function () {

    (function () {
      try {
        var _temp8 = function _temp8(_result) {
          var _exit2 = false;
          if (_exit4) return _result;

          function _temp5(_result2) {
            var _exit3 = false;
            if (_exit2) return _result2;

            function _temp3(_result3) {
              if (_exit3) return _result3;

              var _temp = function () {
                if (useAnimationDatabase) {
                  var _lookupAnimationGroup = lookupAnimationGroups(previousChildren || '', children),
                      before = _lookupAnimationGroup[0],
                      after = _lookupAnimationGroup[1];

                  return Promise.resolve(anim(wrapMath(before), true)).then(function () {
                    return Promise.resolve(anim(wrapMath(after), false)).then(function () {});
                  });
                } else {
                  return Promise.resolve(anim(wrapMath(children), false)).then(function () {});
                }
              }();

              if (_temp && _temp.then) return _temp.then(function () {});
            }

            var _temp2 = function () {
              if (replace) {
                return Promise.resolve(anim(wrapMath(children), true)).then(function () {
                  _exit3 = true;
                });
              }
            }();

            return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
          }

          if (typeof children !== 'string') {
            console.error("Trying to compile something that is'nt text:", children);
            return;
          }

          var _temp4 = function () {
            if (!previousChildren) {
              return Promise.resolve(anim(wrapMath(children), false)).then(function () {
                _exit2 = true;
              });
            }
          }();

          return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
        };

        var _exit4 = false;
        var svg = svgEl.current;

        var anim = function anim(text, replaceImediately) {
          setTransition(!replaceImediately);
          return animate(svg, text, replaceImediately, TIMING, updateSvgData, debug);
        };

        var _temp9 = function () {
          if (!children) {
            return Promise.resolve(anim('', false)).then(function () {
              _exit4 = true;
            });
          }
        }();

        return _temp9 && _temp9.then ? _temp9.then(_temp8) : _temp8(_temp9);
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [children]);
  var inner = /*#__PURE__*/React__default.createElement("div", {
    style: _extends({}, display ? {
      left: '50%',
      transform: "translate(" + -width / 2 + "pt, 0)"
    } : {}, {
      width: 0,
      height: 0,
      marginTop: -vy * FONT_SCALING_FACTOR + "pt",
      marginRight: width + "pt",
      verticalAlign: 'baseline',
      position: 'relative',
      display: 'inline-block'
    }, transition ? {
      transition: TIMING + "s margin-right, " + TIMING + "s margin-top, " + TIMING + "s transform"
    } : {}, debug ? {
      outline: '1px solid lightblue'
    } : {})
  }, /*#__PURE__*/React__default.createElement("svg", {
    width: width + 'pt',
    height: height + 'pt',
    viewBox: [vx, vy, vw, vh].join(' '),
    style: _extends({
      display: 'inline-block',
      position: 'absolute',
      top: FONT_SCALING_FACTOR * vy + "pt",
      verticalAlign: 'baseline'
    }, debug ? {
      outline: '1px solid yellow'
    } : {}),
    ref: svgEl
  }));

  if (display) {
    return /*#__PURE__*/React__default.createElement("div", {
      style: _extends({
        display: 'flex',
        flexGrow: 1,
        height: height + 'pt',
        margin: '0.5em 0'
      }, transition ? {
        transition: TIMING + "s height"
      } : {}, debug ? {
        outline: '1px solid red'
      } : {})
    }, inner);
  } else {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      style: _extends({
        display: 'inline-block',
        width: 0,
        verticalAlign: 'text-top',
        marginTop: '0.9em',
        height: height + vy + 'pt'
      }, transition ? {
        transition: TIMING + "s height, " + TIMING + "s margin-bottom"
      } : {}, debug ? {
        width: '2px',
        background: 'limegreen'
      } : {})
    }), inner);
  }
}

window.React = React__default;

var withFakeDispatcher = function withFakeDispatcher(ctx, cb) {
  var ReactCurrentDispatcher = React__default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
  var original = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current = {
    useContext: function useContext(context) {
      var result = ctx.find(function (_ref) {
        var c = _ref[0];
        return c == context;
      });

      if (result) {
        return result[1];
      }

      return {};
    },
    readContext: function readContext() {
      return null;
    },
    useCallback: function useCallback(x) {
      return x;
    },
    useEffect: function useEffect() {
      return null;
    },
    useImperativeHandle: function useImperativeHandle() {
      return null;
    },
    useLayoutEffect: function useLayoutEffect() {
      return null;
    },
    useMemo: function useMemo(x) {
      return x;
    },
    useReducer: function useReducer(_, initialState) {
      return initialState;
    },
    useRef: function useRef(initial) {
      var ref = {
        current: initial
      };
      return ref;
    },
    useState: function useState(initial) {
      return [initial, function (x) {
        return x;
      }];
    },
    useDebugValue: function useDebugValue() {
      return null;
    },
    useResponder: function useResponder() {
      return null;
    },
    useDeferredValue: function useDeferredValue() {
      return null;
    },
    useTransition: function useTransition() {
      return null;
    }
  };
  var result;

  try {
    result = cb();
  } finally {
    ReactCurrentDispatcher.current = original;
  }

  return result;
};

var ignore = [Morph, RenderCite];

var findElementsInTree = function findElementsInTree(node, predicate) {
  var found = [];

  var handleTree = function handleTree(node) {
    if (predicate(node)) {
      found.push(node);
      return;
    }

    if (node.type && typeof node.type === 'function') {
      if (ignore.includes(node.type)) {
        return;
      }

      var resolved = node.type(node.props);
      return handleTree(resolved);
    }

    if (node.props && node.props.children) {
      var childs = flattenDeep_1(Array.isArray(node.props.children) ? node.props.children : [node.props.children]);
      childs.forEach(function (child) {
        if (child) {
          handleTree(child);
        }
      });
    }
  };

  handleTree(node);
  return found;
};

var getPropsRecursiveUntilSlideComponentIsEncountered = function getPropsRecursiveUntilSlideComponentIsEncountered(node) {
  var props = node.props;
  var type = node.type;

  if (type == RenderSlide) {
    return _extends({}, props, {
      slide: node
    });
  }

  var resolved = type(_extends({}, props));
  var rest = getPropsRecursiveUntilSlideComponentIsEncountered(resolved);
  return _extends({}, props, rest);
};

function getSlideInfo(slides) {
  var mockContextes = [[PresentationContext, {
    slideIndex: 0,
    infos: [],
    info: {},
    numSlides: 0
  }], [CitationContext, {
    bibliography: [],
    citationMap: {}
  }]];
  var slideWithProps;
  withFakeDispatcher(mockContextes, function () {
    slideWithProps = slides.map(getPropsRecursiveUntilSlideComponentIsEncountered);
  });
  var infos = [];

  for (var _iterator = _createForOfIteratorHelperLoose(slideWithProps), _step; !(_step = _iterator()).done;) {
    var _ref6 = _step.value;

    var props = _objectWithoutPropertiesLoose(_ref6, ["slide"]);

    var accumulatedInfo = infos[infos.length - 1];

    var newInfo = _extends({}, accumulatedInfo);

    newInfo.sectionSlide = !!props.section;
    newInfo.hideNavigation = !!props.hideNavigation;

    if (props.section) {
      newInfo.section = props.section;
    }

    if (props.header) {
      newInfo.header = props.header;
    } else {
      newInfo.header = null;
    }

    infos.push(newInfo);
  }

  var citationMap = withFakeDispatcher(mockContextes, function () {
    return getCitations(slideWithProps.map(function (x) {
      return x.slide;
    }));
  });
  mockContextes.find(function (_ref3) {
    var c = _ref3[0];
    return c == PresentationContext;
  })[1].infos = infos;
  mockContextes.find(function (_ref4) {
    var c = _ref4[0];
    return c == CitationContext;
  })[1].citationMap = citationMap;
  return withFakeDispatcher(mockContextes, function () {
    slideWithProps = slides.map(getPropsRecursiveUntilSlideComponentIsEncountered);
    var slideInfo = slideWithProps.map(function (_ref5, index) {
      var slide = _ref5.slide,
          props = _objectWithoutPropertiesLoose(_ref5, ["slide"]);

      return {
        slide: slide,
        info: infos[index],
        steps: props.steps || [null],
        animations: animations(slide),
        presenterNotes: presenterNotes(slide)
      };
    });
    console.log('slideInfo is', slideInfo);
    return {
      slideInfo: slideInfo,
      citationMap: citationMap
    };
  });
}

var presenterNotes = function presenterNotes(slide) {
  var tree;

  if (!slide.props.steps || typeof slide.props.children !== 'function') {
    tree = slide;
  } else {
    tree = slide.props.children(slide.props.steps[0]);
  }

  var notes = findElementsInTree(tree, function (node) {
    return typeof node.type === 'function' && node.type === Notes;
  });

  if (notes.length > 1) {
    console.error('On slide ', slide, 'you have more than one <Notes>!');
  }

  var note = notes[0];
  if (!note) return null;
  return note.props.children;
};

var animations = function animations(slide) {
  var morphs = {};
  if (!slide.props.steps) return [];

  if (typeof slide.props.children !== 'function') {
    return [];
  }

  slide.props.steps.forEach(function (step) {
    var tree = slide.props.children(step);
    findElementsInTree(tree, function (node) {
      return typeof node.type === 'function' && node.type === Morph;
    }).forEach(function (node) {
      if (node.props.replace) {
        return;
      }

      var id = JSON.stringify(node._source);
      var contents = node.props.children;
      morphs[id] = morphs[id] ? [].concat(morphs[id], [contents]) : [contents];
    });
  });
  var anim = [];

  var _loop = function _loop(key) {
    var formulas = morphs[key];
    formulas.forEach(function (formula, i) {
      var start = formula;
      var end = formulas[i + 1];

      if (i < formulas.length - 1 && start !== end) {
        anim.push({
          start: start,
          end: end
        });
      }
    });
  };

  for (var key in morphs) {
    _loop(key);
  }

  return anim;
};

function getCitations(slides) {
  var citationMap = {};
  slides.forEach(function (slide) {
    var trees = [slide];

    if (typeof slide.props.children == 'function' && !!slide.props.steps) {
      trees = slide.props.steps.map(function (step) {
        return slide.props.children(step);
      });
    }

    trees.forEach(function (tree) {
      findElementsInTree(tree, function (node) {
        return typeof node.type === 'function' && node.type == RenderCite;
      }).forEach(function (cite) {
        var id = cite.props.id;

        if (!citationMap[id]) {
          var number = Math.max.apply(Math, [0].concat(Object.values(citationMap))) + 1;
          citationMap[id] = number;
        }
      });
    });
  });
  return citationMap;
}

function Show(_ref) {
  var when = _ref.when,
      children = _ref.children,
      text = _ref.text,
      block = _ref.block,
      opacity = _ref.opacity,
      style = _ref.style,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className;

  var realStyle = _extends({
    opacity: opacity !== undefined ? opacity : when ? 1 : 0,
    transition: '0.5s opacity ease-in-out'
  }, style);

  if (text) {
    return /*#__PURE__*/React__default.createElement("span", {
      className: "inline",
      style: _extends({}, realStyle)
    }, children);
  }

  if (block) {
    return /*#__PURE__*/React__default.createElement("div", {
      style: realStyle,
      className: className
    }, children);
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, React__default.Children.map(children, function (c) {
    return React__default.cloneElement(c, _extends({}, c.props && c.props.style ? c.props.style : {}, {
      style: realStyle
    }));
  }));
}

function RenderPresentation(_ref) {
  var children = _ref.children,
      bibUrl = _ref.bibUrl,
      renderSlide = _ref.renderSlide;
  return /*#__PURE__*/React__default.createElement(reactRouterDom.BrowserRouter, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: "/"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: "/0/0"
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: "/storage"
  }, /*#__PURE__*/React__default.createElement(Storage, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "/overview"
  }, /*#__PURE__*/React__default.createElement(PresentationOverview, {
    renderSlide: renderSlide,
    bibUrl: bibUrl
  }, children)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "/:slideIndex/:stepIndex",
    exact: false
  }, /*#__PURE__*/React__default.createElement(PresentationUI, {
    renderSlide: renderSlide,
    bibUrl: bibUrl
  }, children))));
}
var PresentationContext = React__default.createContext(null);

function PresentationUI(_ref2) {
  var children = _ref2.children,
      renderSlide = _ref2.renderSlide,
      bibUrl = _ref2.bibUrl;
  var reactSlides = React__default.Children.toArray(children);

  var _useMemo = React.useMemo(function () {
    return getSlideInfo(children);
  }, [children]),
      slideInfo = _useMemo.slideInfo,
      citationMap = _useMemo.citationMap;

  var match = reactRouterDom.useRouteMatch();
  var history = reactRouterDom.useHistory();

  var _useParams = reactRouterDom.useParams(),
      _useParams$slideIndex = _useParams.slideIndex,
      slideIndex = _useParams$slideIndex === void 0 ? 0 : _useParams$slideIndex,
      _useParams$stepIndex = _useParams.stepIndex,
      stepIndex = _useParams$stepIndex === void 0 ? 0 : _useParams$stepIndex;

  slideIndex = parseInt(slideIndex);
  stepIndex = parseInt(stepIndex);

  var _useState = React.useState({}),
      transitions = _useState[0],
      setTransitions = _useState[1];

  var _useState2 = React.useState(false),
      fullScreen = _useState2[0],
      setFullScreen = _useState2[1];

  var setSlideAndStep = function setSlideAndStep(slideIndex, stepIndex) {
    history.push(reactRouterDom.generatePath(match.path, {
      slideIndex: slideIndex,
      stepIndex: stepIndex
    }));
  };

  var prev = React.useCallback(function (dontStepButGoToPrevSlide) {
    if (dontStepButGoToPrevSlide) {
      if (slideIndex > 0) {
        setSlideAndStep(slideIndex - 1, 0);
      }

      return;
    }

    if (stepIndex > 0) {
      setSlideAndStep(slideIndex, stepIndex - 1);
      return;
    }

    if (slideIndex > 0) {
      setSlideAndStep(slideIndex - 1, slideInfo[slideIndex - 1].steps.length - 1);
    }
  }, [slideIndex, stepIndex, setSlideAndStep]);
  var next = React.useCallback(function (dontStepButGoToNextSlide) {
    if (dontStepButGoToNextSlide) {
      if (slideIndex < slideInfo.length - 1) {
        setSlideAndStep(slideIndex + 1, 0);
      }

      return;
    }

    if (stepIndex < slideInfo[slideIndex].steps.length - 1) {
      setSlideAndStep(slideIndex, stepIndex + 1);
      return;
    }

    if (slideIndex < slideInfo.length - 1) {
      setSlideAndStep(slideIndex + 1, 0);
    }
  }, [slideIndex, stepIndex, setSlideAndStep]);
  var handleKey = React.useCallback(function (e) {
    if (e.key == 'ArrowDown') {
      next(true);
    }

    if (e.key == 'ArrowUp') {
      prev(true);
    }

    if (e.key == 'PageDown' || e.key == 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key == 'PageUp' || e.key == 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key == '.') {
      e.preventDefault();
      setFullScreen(function (f) {
        return !f;
      });
    }
  }, [next, prev, stepIndex, slideIndex]);
  React.useEffect(function () {
    window.addEventListener('keydown', handleKey);
    return function () {
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleKey]);

  if (slideIndex > slideInfo.length) {
    return /*#__PURE__*/React__default.createElement("div", null, "Too high slide number!");
  }

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(CitationProvider, {
    citationMap: citationMap,
    bibUrl: bibUrl
  }, renderSlide({
    fullScreen: fullScreen,
    slideInfo: slideInfo,
    info: slideInfo[slideIndex].info,
    slideIndex: slideIndex,
    stepIndex: stepIndex,
    numSlides: reactSlides.length,
    slides: reactSlides.map(function (slide, i) {
      return /*#__PURE__*/React__default.createElement(PresentationContext.Provider, {
        key: i,
        value: {
          i: i,
          slideIndex: slideIndex,
          infos: slideInfo.map(function (i) {
            return i.info;
          }),
          info: slideInfo[i].info,
          setTransitions: setTransitions,
          stepIndex: i === slideIndex ? stepIndex : i < slideIndex && slideInfo[i].steps.length ? slideInfo[i].steps.length - 1 : 0,
          numSlides: reactSlides.length,
          transition: transitions[i]
        }
      }, slide);
    })
  }), /*#__PURE__*/React__default.createElement("div", null, slideInfo[slideIndex].presenterNotes), /*#__PURE__*/React__default.createElement(AnimationEditor, {
    animations: slideInfo[slideIndex].animations
  })));
}

function PresentationOverview(_ref3) {
  var children = _ref3.children,
      renderSlide = _ref3.renderSlide,
      bibUrl = _ref3.bibUrl;
  var reactSlides = React__default.Children.toArray(children);

  var _useMemo2 = React.useMemo(function () {
    return getSlideInfo(children);
  }, [children]),
      slideInfo = _useMemo2.slideInfo,
      citationMap = _useMemo2.citationMap;

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(CitationProvider, {
    citationMap: citationMap,
    bibUrl: bibUrl
  }, slideInfo.flatMap(function (info, slideIndex) {
    return info.steps.map(function (step, stepIndex) {
      return renderSlide({
        fullScreen: false,
        info: info.info,
        slideIndex: 0,
        stepIndex: stepIndex,
        numSlides: reactSlides.length,
        slides: [/*#__PURE__*/React__default.createElement(PresentationContext.Provider, {
          value: {
            infos: slideInfo.map(function (i) {
              return i.info;
            }),
            info: info.info,
            i: slideIndex,
            slideIndex: slideIndex,
            stepIndex: stepIndex,
            numSlides: reactSlides.length,
            setTransitions: function setTransitions() {
              return null;
            },
            transition: {}
          }
        }, reactSlides[slideIndex])]
      });
    });
  })));
}

function RenderSlide(_ref4) {
  var children = _ref4.children,
      _ref4$steps = _ref4.steps,
      steps = _ref4$steps === void 0 ? [] : _ref4$steps,
      render = _ref4.render;
  var TIMING = 0.5;

  var _useContext = React.useContext(PresentationContext),
      stepIndex = _useContext.stepIndex,
      info = _useContext.info,
      i = _useContext.i,
      slideIndex = _useContext.slideIndex,
      transition = _useContext.transition;

  var _useState3 = React.useState({
    transition: TIMING + "s transform, " + TIMING + "s opacity",
    transform: 'scale(1) translate3d(0px, 0px, 0px)',
    opacity: 0
  }),
      style = _useState3[0],
      setStyle = _useState3[1];

  var updateStyle = function updateStyle(style) {
    return setStyle(function (s) {
      return _extends({}, s, style);
    });
  };

  React.useEffect(function () {
    var _ref5 = transition || {},
        _ref5$after = _ref5.after,
        after = _ref5$after === void 0 ? {
      transform: "translate3d(-100%, 0px, 0px)",
      opacity: 0,
      zIndex: 0
    } : _ref5$after,
        _ref5$before = _ref5.before,
        before = _ref5$before === void 0 ? {
      transform: "translate3d(100%, 0px, 0px)",
      opacity: 0,
      zIndex: 0
    } : _ref5$before;

    if (i > slideIndex) {
      updateStyle(_extends({}, before));
    }

    if (i < slideIndex) {
      updateStyle(_extends({}, after));
    }

    if (i == slideIndex) {
      updateStyle({
        zIndex: 10,
        opacity: 1,
        transform: "scale(1) translate3d(0px,0px,0px)"
      });
    }
  }, [slideIndex, i, transition]);
  var content = children && (children.call ? children(steps[stepIndex]) : children);
  return render({
    info: info,
    content: content,
    i: i,
    slideIndex: slideIndex,
    style: style
  });
}

function Storage() {
  return /*#__PURE__*/React__default.createElement("pre", {
    style: {
      whiteSpace: 'break-spaces'
    }
  }, localStorage.animationGroups);
}

function Presentation(_ref) {
  var props = _extends({}, _ref);

  var h = 900;
  var w = 1200;
  return /*#__PURE__*/React__default.createElement(RenderPresentation, _extends({}, props, {
    renderSlide: function renderSlide(_ref2) {
      var slides = _ref2.slides,
          slideIndex = _ref2.slideIndex,
          info = _ref2.info,
          numSlides = _ref2.numSlides;
      var threeSlides = slides.slice(Math.max(0, slideIndex - 1), Math.min(numSlides, slideIndex + 2));
      return /*#__PURE__*/React__default.createElement("div", {
        className: "flex justify-center items-center bg-blue h-screen"
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "inline-block relative flex-shrink-0 flex flex-col text-white bg-blue",
        style: {
          overflow: 'hidden',
          fontFamily: 'Computer Modern Sans',
          width: w,
          height: h
        }
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "flex-grow relative"
      }, threeSlides), /*#__PURE__*/React__default.createElement("div", {
        className: "flex flex-col",
        style: {
          transition: '0.5s transform',
          transform: "translate(0px, " + (info.hideNavigation ? 100 : 0) + "%)"
        }
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "flex justify-between text-xs theme-font-open"
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "px-2 py-1"
      }, info.sectionSlide ? '\xa0' : info.section), /*#__PURE__*/React__default.createElement("div", {
        className: "px-2 py-1"
      }, slideIndex + 1)), /*#__PURE__*/React__default.createElement("div", {
        className: "w-full inline-block",
        style: {
          height: 2
        }
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "h-full bg-green",
        style: {
          width: slideIndex / (numSlides - 1) * 100 + "%",
          transition: 'width 0.5s'
        }
      })))));
    }
  }));
}

function Slide(_ref3) {
  var className = _ref3.className,
      children = _ref3.children,
      props = _objectWithoutPropertiesLoose(_ref3, ["className", "children"]);

  return /*#__PURE__*/React__default.createElement(RenderSlide, _extends({
    children: children
  }, props, {
    render: function render(_ref4) {
      var info = _ref4.info,
          content = _ref4.content,
          style = _ref4.style;
      return /*#__PURE__*/React__default.createElement("div", {
        className: "slide",
        style: _extends({
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        }, style)
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "absolute inset-0 flex flex-col"
      }, info.header && /*#__PURE__*/React__default.createElement("div", {
        className: "ml-6 mt-6 text-white font-semibold text-lg flex items-center theme-font-open"
      }, /*#__PURE__*/React__default.createElement("span", {
        style: {
          height: '2em',
          width: '4px',
          marginRight: '1em',
          background: '#00D56F',
          borderRadius: '2px'
        }
      }), info.header), /*#__PURE__*/React__default.createElement("div", {
        className: "flex-grow p-6 flex flex-col " + className
      }, content)));
    }
  }));
}
function SectionSlide(_ref5) {
  var section = _ref5.section;

  var _useContext = React.useContext(PresentationContext),
      i = _useContext.i,
      numSlides = _useContext.numSlides;

  return /*#__PURE__*/React__default.createElement(Slide, {
    className: "flex justify-center items-center text-3xl theme-font-open",
    hideNavigation: true
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, section), /*#__PURE__*/React__default.createElement("div", {
    className: "mt-3",
    style: {
      background: 'rgba(255, 255, 255, 0.2)',
      width: '16em',
      height: '4px',
      borderRadius: '2px'
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "h-full bg-green",
    style: {
      width: i / (numSlides - 1) * 100 + "%",
      borderRadius: '2px'
    }
  }))));
}
function ConclusionSlide(_ref6) {
  var section = _ref6.section;
  return /*#__PURE__*/React__default.createElement(Slide, {
    className: "flex justify-center items-center text-3xl theme-font-open"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, section), /*#__PURE__*/React__default.createElement("div", {
    className: "bg-gray-300 mt-3",
    style: {
      width: '16em',
      height: '2px'
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "h-full bg-green",
    style: {
      width: "100%"
    }
  }))));
}
function TitleSlide(_ref7) {
  var title = _ref7.title,
      names = _ref7.names,
      names2 = _ref7.names2,
      date = _ref7.date;
  return /*#__PURE__*/React__default.createElement(Slide, {
    className: "flex flex-col items-stretch justify-between theme-font-open",
    steps: [0, 1, 2],
    hideNavigation: true
  }, function (step) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      className: "flex-grow flex flex-col justify-center"
    }, /*#__PURE__*/React__default.createElement(Show, {
      when: step > 0
    }, /*#__PURE__*/React__default.createElement("h1", {
      className: "text-4xl font-semibold text-green"
    }, title))), /*#__PURE__*/React__default.createElement(Show, {
      when: step > 1
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "text-sm flex items-end justify-between"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, names), /*#__PURE__*/React__default.createElement("div", null, names2)), /*#__PURE__*/React__default.createElement("div", null, date))));
  });
}
function TableOfContentsSlide(_ref8) {
  var header = _ref8.header;

  var _useContext2 = React.useContext(PresentationContext),
      infos = _useContext2.infos;

  var sections = infos.map(function (i) {
    return i.section;
  }).filter(Boolean).filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  return /*#__PURE__*/React__default.createElement(Slide, {
    hideNavigation: true,
    header: header,
    steps: sections.map(function (_, i) {
      return i;
    }),
    className: "flex items-start"
  }, function (step) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("ol", null, sections.map(function (section, i) {
      return /*#__PURE__*/React__default.createElement(Show, {
        key: section,
        when: step >= i
      }, /*#__PURE__*/React__default.createElement("li", {
        className: "my-5"
      }, section));
    })));
  });
}
function QuestionSlide(_ref9) {
  var _ref9$title = _ref9.title,
      title = _ref9$title === void 0 ? 'Questions?' : _ref9$title;
  return /*#__PURE__*/React__default.createElement(Slide, {
    className: "bg-blue text-gray-100 text-3xl flex items-center justify-center p-0",
    hideNavigation: true
  }, title);
}
function Figure(_ref10) {
  var children = _ref10.children,
      caption = _ref10.caption;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "flex-grow"
  }, children), caption && /*#__PURE__*/React__default.createElement("div", {
    className: "p-1"
  }, /*#__PURE__*/React__default.createElement("b", null, "Figure:"), " ", caption));
}
function List(_ref11) {
  var children = _ref11.children,
      step = _ref11.step,
      props = _objectWithoutPropertiesLoose(_ref11, ["children", "step"]);

  var childArray = React__default.Children.toArray(children);
  return /*#__PURE__*/React__default.createElement("ul", props, childArray.map(function (child, i) {
    return /*#__PURE__*/React__default.createElement(Show, {
      key: i,
      when: i < step || step === undefined
    }, child);
  }));
}
function Item(_ref12) {
  var children = _ref12.children,
      name = _ref12.name,
      props = _objectWithoutPropertiesLoose(_ref12, ["children", "name"]);

  if (name) {
    return /*#__PURE__*/React__default.createElement("li", _extends({}, props, {
      style: _extends({}, props.style || {}, {
        listStyle: 'none'
      })
    }), /*#__PURE__*/React__default.createElement("b", null, name + ' '), children);
  } else {
    return /*#__PURE__*/React__default.createElement("li", props, children);
  }
}
function Cite(_ref13) {
  var id = _ref13.id,
      hidden = _ref13.hidden;
  return /*#__PURE__*/React__default.createElement(RenderCite, {
    id: id,
    render: function render(_ref14) {
      var text = _ref14.text,
          number = _ref14.number;
      if (hidden) return /*#__PURE__*/React__default.createElement("span", null);
      return /*#__PURE__*/React__default.createElement("span", {
        title: text || 'Loading ...'
      }, "[", number || '??', "]");
    }
  });
}
function BibliographySlide() {
  var stride = 4;
  return /*#__PURE__*/React__default.createElement(RenderBibliography, {
    render: function render(items) {
      return /*#__PURE__*/React__default.createElement(Slide, {
        steps: range(Math.ceil(items.length / stride))
      }, function (step) {
        if (!items) return /*#__PURE__*/React__default.createElement("div", null, "Loading");
        var start = stride * step;
        var end = start + stride;
        return /*#__PURE__*/React__default.createElement("ul", {
          className: "list-none text-sm"
        }, items.slice(start, end).map(function (_ref15) {
          var n = _ref15.n,
              html = _ref15.html;
          return /*#__PURE__*/React__default.createElement("li", {
            className: "flex my-2"
          }, /*#__PURE__*/React__default.createElement("span", {
            className: "mr-2"
          }, "[", n, "]"), /*#__PURE__*/React__default.createElement("div", {
            className: "inline-block"
          }, /*#__PURE__*/React__default.createElement("span", {
            dangerouslySetInnerHTML: {
              __html: html
            }
          })));
        }));
      });
    }
  });
}
function Box(_ref16) {
  var title = _ref16.title,
      children = _ref16.children,
      className = _ref16.className,
      smallTitle = _ref16.smallTitle,
      style = _ref16.style;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "theme-border theme-shadow " + (className || ''),
    style: style
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "p-2"
  }, title && /*#__PURE__*/React__default.createElement("span", {
    className: "pr-2 text-green font-semibold " + (smallTitle ? 'text-xs block' : '')
  }, title, "."), children));
}
function Qed(props) {
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: "flex justify-end"
  }, props), /*#__PURE__*/React__default.createElement("div", {
    className: "inline-block w-2 h-2 bg-white m-1"
  }));
}

var modern = {
  __proto__: null,
  Presentation: Presentation,
  Slide: Slide,
  SectionSlide: SectionSlide,
  ConclusionSlide: ConclusionSlide,
  TitleSlide: TitleSlide,
  TableOfContentsSlide: TableOfContentsSlide,
  QuestionSlide: QuestionSlide,
  Figure: Figure,
  List: List,
  Item: Item,
  Cite: Cite,
  BibliographySlide: BibliographySlide,
  Box: Box,
  Qed: Qed
};

gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

var positionSvg = function positionSvg(textSvg) {
  var _textSvg$getAttribute = textSvg.getAttribute('viewBox').split(' ').map(function (s) {
    return parseFloat(s, 10);
  }),
      vy = _textSvg$getAttribute[1];

  var width = parseFloat(textSvg.getAttribute('width').replace('pt', ''), 10);
  var height = parseFloat(textSvg.getAttribute('height').replace('pt', ''), 10);
  var _textSvg$dataset = textSvg.dataset,
      scale = _textSvg$dataset.scale,
      textX = _textSvg$dataset.textX,
      textY = _textSvg$dataset.textY;
  var FONT_SCALING_FACTOR = 2;
  textX = parseFloat(textX, 10);
  textY = parseFloat(textY, 10);
  textSvg.dataset.scale = scale;
  textSvg.setAttribute('x', textX);
  textSvg.setAttribute('y', textY + FONT_SCALING_FACTOR * scale * vy * 1.3);
  textSvg.setAttribute('width', FONT_SCALING_FACTOR * scale * width + 'pt');
  textSvg.setAttribute('height', FONT_SCALING_FACTOR * scale * height + 'pt');
};

var replaceText = function replaceText(textEle) {
  try {
    var text = textEle.textContent;
    if (!text) return Promise.resolve();
    return Promise.resolve(fetchLaTeXSvg(text)).then(function (textSvg) {
      if (!textSvg) {
        console.error('No svg for:', textEle, text);
        return;
      }

      var matrix = textEle.getScreenCTM();
      if (!matrix) return;
      var scale = 1 / matrix.a;
      textSvg.dataset.textX = textEle.getAttribute('x');
      textSvg.dataset.textY = textEle.getAttribute('y');
      textSvg.dataset.scale = scale;
      positionSvg(textSvg);

      var textContentToId = function textContentToId(textContent) {
        return textContent.replace(/[^a-zA-z]+/g, '');
      };

      textSvg.id = textContentToId(textEle.textContent);
      textEle.parentNode.replaceChild(textSvg, textEle);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var TIMING = 0.4;

function update(svg, step, replaceImediately) {
  for (var key in step) {
    if (step[key] === null) {
      continue;
    }

    if (key.startsWith('text:')) {
      (function () {
        var id = key.replace(/^text:/, '');
        var textSvg = svg.querySelector("svg#" + id);

        if (textSvg) {
          if (replaceImediately) {
            textSvg.innerHTML = '';
          }

          animate(textSvg, step[key] || '', replaceImediately, 0.3, function (_ref) {
            var width = _ref.width,
                height = _ref.height,
                viewBox = _ref.viewBox;
            textSvg.setAttribute('width', width + 'pt');
            textSvg.setAttribute('height', height + 'pt');
            textSvg.setAttribute('viewBox', viewBox.join(' '));
            positionSvg(textSvg);
          });
        }
      })();
    } else {
      var ele = svg.querySelector("#" + key);

      var _step$key = step[key],
          _step$key$css = _step$key.css,
          css = _step$key$css === void 0 ? {} : _step$key$css,
          rest = _objectWithoutPropertiesLoose(_step$key, ["css"]);

      if (ele) {
        for (var _key in css) {
          ele.style[_key] = css[_key];
        }

        if (replaceImediately) {
          gsap.set(ele, _extends({}, rest));
        } else {
          console.log('timing is ', rest.seconds, TIMING);
          gsap.to(ele, rest.seconds || TIMING, _extends({}, rest));
        }
      }
    }
  }
}

function AnimateSVG(_ref2) {
  var src = _ref2.src,
      _ref2$step = _ref2.step,
      step = _ref2$step === void 0 ? {} : _ref2$step,
      _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? '100%' : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? 'auto' : _ref2$height;
  var element = React.useRef(null);
  React.useEffect(function () {

    (function () {
      try {
        return Promise.resolve(fetch(src).then(function (r) {
          return r.text();
        })).then(function (text) {
          var div = element.current;
          if (!element.current) return;
          div.style.opacity = 0;
          div.innerHTML = text;
          div.querySelector('svg').style.width = width;
          div.querySelector('svg').style.height = height;
          return Promise.resolve(Promise.all([].concat(div.querySelectorAll('text')).map(function (textEle) {
            try {
              if (textEle.matches('.dont-replace *')) {
                return Promise.resolve();
              }

              var _temp2 = function () {
                if (textEle.children.length === 0) {
                  return Promise.resolve(replaceText(textEle)).then(function () {});
                } else {
                  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                  return Promise.resolve(Promise.all([].concat(textEle.children).map(replaceText))).then(function () {
                    [].concat(textEle.children).forEach(function (e) {
                      return g.appendChild(e);
                    });
                    textEle.parentNode.replaceChild(g, textEle);
                  });
                }
              }();

              return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
            } catch (e) {
              return Promise.reject(e);
            }
          }))).then(function () {
            if (element.current) {
              update(element.current, step, true);
            }

            div.style.transition = '0.3s opacity';
            div.style.opacity = 1;
          });
        });
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [element.current]);
  React.useEffect(function () {
    if (!element.current) return;
    update(element.current, step, false);
  }, [step, element]);
  return /*#__PURE__*/React__default.createElement("div", {
    ref: element,
    style: {
      margin: '-1rem'
    }
  });
}

function InlineMath(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default.createElement(Morph, {
    inline: true,
    replace: true
  }, children);
}
function DisplayMath(_ref2) {
  var children = _ref2.children;
  return /*#__PURE__*/React__default.createElement(Morph, {
    display: true,
    replace: true
  }, children);
}
var m = function m() {
  return /*#__PURE__*/React__default.createElement(InlineMath, null, String.raw.apply(String, arguments));
};
var M = function M() {
  return /*#__PURE__*/React__default.createElement(DisplayMath, null, String.raw.apply(String, arguments));
};

function measureText(text, style) {
  if (style === void 0) {
    style = {};
  }

  var div = document.createElement('div');
  document.body.appendChild(div);
  div.style.position = 'absolute';
  div.style.left = -1000;
  div.style.top = -1000;

  for (var key in style) {
    div.style[key] = style[key];
  }

  div.innerHTML = text;
  var result = {
    width: div.clientWidth,
    height: div.clientHeight
  };
  document.body.removeChild(div);
  return result;
}

function MObject(_ref) {
  var children = _ref.children;

  var _useState = React.useState(null),
      child = _useState[0],
      setChild = _useState[1];

  var _useState2 = React.useState(1),
      opacity = _useState2[0],
      setOpacity = _useState2[1];

  var _useState3 = React.useState(0),
      width = _useState3[0],
      setWidth = _useState3[1];

  React.useEffect(function () {
    setOpacity(0);
    setWidth(measureText(children).width);
    setTimeout(function () {
      return setChild(children);
    }, 500);
    setTimeout(function () {
      return setOpacity(1);
    }, 500);
  }, [children]);
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      opacity: opacity,
      display: 'inline-block',
      transition: '0.5s opacity, 0.7s width',
      width: width,
      overflow: 'hidden',
      verticalAlign: 'top'
    }
  }, child);
}

function getRect(element) {
  var el = element;
  var offsetLeft = 0;
  var offsetTop = 0;

  do {
    offsetLeft += el.offsetLeft;
    offsetTop += el.offsetTop;
    el = el.offsetParent;
  } while (!el.classList.contains('slide'));

  return {
    left: offsetLeft,
    top: offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight,
    parentWidth: el.offsetWidth,
    parentHeight: el.offsetHeight
  };
}

var addPortal = function addPortal(_ref, portal) {
  var i = _ref.i,
      setTransitions = _ref.setTransitions;
  var _portal$rect = portal.rect,
      width = _portal$rect.width,
      height = _portal$rect.height,
      left = _portal$rect.left,
      top = _portal$rect.top,
      parentWidth = _portal$rect.parentWidth,
      parentHeight = _portal$rect.parentHeight;
  var sx = parentWidth / width;
  var sy = parentHeight / height;
  var s = Math.max(sx, sy);
  var x = left;
  var y = top;
  var enlarge = {
    transformOrigin: x + width / 2 + "px " + (y + height / 2) + "px",
    transform: "translate3d(" + (-(x + width / 2) + parentWidth / 2) + "px, " + (-(y + height / 2) + parentHeight / 2) + "px, 0px) scaleX(" + s + ") scaleY(" + s + ")",
    opacity: 0
  };
  var shrink = {
    transformOrigin: parentWidth / 2 + "px " + parentHeight / 2 + "px",
    transform: "translate3d(" + (-parentWidth / 2 + x + width / 2) + "px, " + (-parentHeight / 2 + y + height / 2) + "px, 0px) scaleX(" + 1 / s + ") scaleY(" + 1 / s + ")",
    opacity: 0
  };
  setTransitions(function (transitions) {
    var newTransitions = _extends({}, transitions);

    if (portal.zoom === 'in') {
      newTransitions[i] = _extends({}, newTransitions[i] || {}, {
        after: enlarge
      });
      newTransitions[i + 1] = _extends({}, newTransitions[i + 1] || {}, {
        before: shrink
      });
    }

    if (portal.zoom === 'out') {
      newTransitions[i - 1] = _extends({}, newTransitions[i - 1] || {}, {
        after: shrink
      });
      newTransitions[i] = _extends({}, newTransitions[i] || {}, {
        before: enlarge
      });
    }

    return newTransitions;
  });
};

function Portal(_ref2) {
  var children = _ref2.children,
      zoomin = _ref2.zoomin,
      zoomout = _ref2.zoomout,
      props = _objectWithoutPropertiesLoose(_ref2, ["children", "zoomin", "zoomout"]);

  var context = React.useContext(PresentationContext);
  var zoom = zoomin ? 'in' : zoomout ? 'out' : null;
  var domEle = React.useRef();
  React.useEffect(function () {
    if (!zoom) return;
    setTimeout(function () {
      if (!domEle.current) return;
      var rect = getRect(domEle.current);
      addPortal(context, {
        zoom: zoom,
        rect: rect
      });
    }, 200);
  }, [domEle]);
  return /*#__PURE__*/React__default.createElement("div", _extends({
    ref: domEle
  }, props), children);
}

var themes = {
  modern: modern
};

exports.AnimateSVG = AnimateSVG;
exports.DisplayMath = DisplayMath;
exports.InlineMath = InlineMath;
exports.M = M;
exports.MObject = MObject;
exports.Morph = Morph;
exports.Notes = Notes;
exports.Portal = Portal;
exports.Show = Show;
exports.m = m;
exports.range = range;
exports.themes = themes;
exports.timeline = timeline;
//# sourceMappingURL=index.js.map
