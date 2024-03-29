function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Citation = _interopDefault(require('citation-js'));
var memoize = _interopDefault(require('memoizee'));
var svgPathParse = require('svg-path-parse');
var gsap = _interopDefault(require('gsap'));
var MorphSVGPlugin = _interopDefault(require('gsap-bonus/MorphSVGPlugin'));
var DrawSVGPlugin = _interopDefault(require('gsap-bonus/DrawSVGPlugin'));
var reactRouterDom = require('react-router-dom');
var useResizeObserver = _interopDefault(require('use-resize-observer'));

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
  return React__default.createElement(CitationContext.Provider, {
    value: {
      bibliography: bibliography,
      citationMap: citationMap
    }
  }, children);
}
function RenderCite(_ref2) {
  var id = _ref2.id,
      render = _ref2.render;

  var _ref3 = React.useContext(CitationContext) || {},
      _ref3$citationMap = _ref3.citationMap,
      citationMap = _ref3$citationMap === void 0 ? {} : _ref3$citationMap,
      bibliography = _ref3.bibliography;

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
function RenderBibliography(_ref4) {
  var render = _ref4.render;

  var _ref5 = React.useContext(CitationContext) || {},
      _ref5$citationMap = _ref5.citationMap,
      citationMap = _ref5$citationMap === void 0 ? {} : _ref5$citationMap,
      _ref5$bibliography = _ref5.bibliography,
      bibliography = _ref5$bibliography === void 0 ? [] : _ref5$bibliography;

  var sortedEntries = Object.entries(citationMap).sort(function (a, b) {
    return a[1] - b[1];
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

function Notes() {
  return React__default.createElement("div", null);
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

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var range = function range(n) {
  return Array.from(Array(n).keys());
};

var queryParameters = function queryParameters(obj) {
  return Object.entries(obj).map(function (_ref) {
    var key = _ref[0],
        value = _ref[1];
    return key + "=" + encodeURIComponent(value);
  }).join('&');
};

var cacheBust = '8';
var LaTeX = {
  _preamble: "",
  _host: "http://" + window.location.hostname + ":3001",
  getHost: function getHost() {
    return LaTeX._host;
  },
  setHost: function setHost(h) {
    LaTeX._host = h;
  },
  getPreamble: function getPreamble() {
    return LaTeX._preamble;
  },
  setPreamble: function setPreamble(p) {
    LaTeX._preamble = normalizeLaTeXPreamble(p);
  },
  fetchSVG: function (tex) {
    try {
      return Promise.resolve(fetch(LaTeX.getHost() + "/latex?" + queryParameters({
        cachebust: cacheBust,
        tex: tex,
        preamble: LaTeX.getPreamble()
      }))).then(function (result) {
        if (result.ok) {
          return Promise.resolve(result.text());
        } else {
          throw new Error("Couldn't compile LaTeX");
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

function normalizeLaTeXPreamble(preamble) {
  return preamble.split('\n').map(function (line) {
    return line.trim();
  }).filter(function (line) {
    return line !== '';
  }).join('\n');
}

function elementToPath(child, transform) {
  if (transform === void 0) {
    transform = '';
  }

  if (!child.ownerSVGElement) {
    throw new Error('Found a child without ownerSVGElement');
  }

  var svg = child.ownerSVGElement;

  if (child.tagName === 'use') {
    var offsetX = parseFloat(child.getAttribute('x') || '0');
    var offsetY = parseFloat(child.getAttribute('y') || '0');
    var id = child.getAttribute('xlink:href');

    if (!id) {
      throw new Error('Found a use tag without an id.');
    }

    var element = svg.querySelector(id);

    if (!element) {
      console.error('I found a use tag with id', id, child, "but I didn't find a definition in the svg: ", svg);
      return null;
    }

    if (element.tagName === 'path') {
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
    } else if (element.tagName === 'use') {
      var tr = element.getAttribute('transform') || '';
      return elementToPath(element, ("translate(" + offsetX + ", " + offsetY + ") " + tr).trim());
    } else {
      console.error('Unrecognized use of element', element);
      return null;
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

function svgToGroupedPaths(svg) {
  var byGroupId = {};

  for (var _i = 0, _Array$from = Array.from(svg.getElementById('page1').children); _i < _Array$from.length; _i++) {
    var child = _Array$from[_i];
    var id = groupIdFromElement(child);
    var path = void 0;

    if (child.tagName === 'g') {
      path = Array.from(child.children).map(function (subchild) {
        return elementToPath(subchild);
      }).filter(Boolean).join(' ');
    } else {
      path = elementToPath(child);
    }

    if (!path) continue;

    if (!byGroupId[id]) {
      byGroupId[id] = '';
    }

    byGroupId[id] += path;
  }

  return byGroupId;
}

function colorHash(str) {
  str = String(str);
  var hash = 0;

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var colour = '';

  for (var _i2 = 0; _i2 < 3; _i2++) {
    var value = hash >> _i2 * 8 & 0xff;
    colour += ('00' + value.toString(16)).substr(-2).toUpperCase();
  }

  return colour;
}

var fetchLaTeXSvg = memoize(function (tex) {
  try {
    var _temp3 = function _temp3(_result) {
      if (_exit2) return _result;
      var ele = document.createElement('div');
      ele.innerHTML = text;
      var svg = ele.querySelector('svg');

      if (!svg) {
        throw new Error('Could not find SVG in compiled LaTeX');
      }

      var groups = svgToGroupedPaths(svg);
      var width = svg.getAttribute('width');
      var height = svg.getAttribute('height');
      var viewBox = svg.getAttribute('viewBox');

      if (!width || !height || !viewBox) {
        throw new Error('Compiled LaTeX SVG has no height or width or viewBox');
      }

      return {
        groups: groups,
        width: parseFloat(width.replace('pt', '')),
        height: parseFloat(height.replace('pt', '')),
        viewBox: viewBox.split(' ').map(function (s) {
          return parseFloat(s);
        })
      };
    };

    var _exit2 = false;
    console.log('compiling', tex);
    tex = tex.replace(/\\g(\d)/g, function (_, p1) {
      return "\\g{" + colorHash(p1) + "}";
    });
    tex = tex.replace(/\\g\{(.*?)\}/g, function (_, p1) {
      return "\\g{" + colorHash(p1) + "}";
    });
    var text;

    var _temp4 = _catch(function () {
      return Promise.resolve(LaTeX.fetchSVG(tex)).then(function (_LaTeX$fetchSVG) {
        text = _LaTeX$fetchSVG;
      });
    }, function () {
      _exit2 = true;
      return null;
    });

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
});
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

var animate = function animate(svgEl, text, replaceImediately, TIMING, setSvgData) {
  if (replaceImediately === void 0) {
    replaceImediately = false;
  }

  if (TIMING === void 0) {
    TIMING = DEFAULT_TIMING;
  }

  if (setSvgData === void 0) {
    setSvgData = function setSvgData() {
      return undefined;
    };
  }

  try {
    var _temp3 = function _temp3() {
      if (!data) {
        return [];
      }

      var _data = data,
          newPaths = _data.groups,
          width = _data.width,
          height = _data.height,
          viewBox = _data.viewBox;
      setSvgData({
        width: width,
        height: height,
        viewBox: viewBox
      });
      var afterIds = Object.keys(newPaths);
      var beforeIds = Array.from(svgEl.querySelectorAll('[id]')).map(function (e) {
        return e.id;
      });
      var allIds = Array.from(new Set([].concat(afterIds, beforeIds)));
      return Promise.all(allIds.map(function (id) {
        try {
          var _temp9 = function _temp9(_result) {
            var _exit2 = false;
            if (_exit3) return _result;

            function _temp6(_result2) {
              if (_exit2) return _result2;
              var element = svgEl.getElementById(id);

              if (replaceImediately) {
                element.setAttribute('d', newPaths[id]);
                element.style.opacity = '1';
                return true;
              } else {
                return Promise.resolve(gsap.to(element, {
                  duration: TIMING,
                  morphSVG: newPaths[id],
                  opacity: 1
                })).then(function () {
                  return true;
                });
              }
            }

            var _temp5 = function () {
              if (isNew) {
                var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.id = id;
                path.setAttribute('d', newPaths[id]);
                var color = colorFromGroupId(id);

                if (whiteListedColors.includes(color)) {
                  path.setAttribute('fill', color);
                }

                path.style.opacity = '0';
                svgEl.appendChild(path);

                if (replaceImediately) {
                  path.style.opacity = '1';
                  _exit2 = true;
                  return true;
                } else {
                  return Promise.resolve(gsap.to(path, {
                    duration: TIMING,
                    opacity: 1
                  })).then(function () {
                    _exit2 = true;
                    return true;
                  });
                }
              }
            }();

            return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
          };

          var _exit3 = false;
          var shouldRemove = beforeIds.includes(id) && !afterIds.includes(id);
          var isNew = afterIds.includes(id) && !beforeIds.includes(id);

          var _temp10 = function () {
            if (shouldRemove) {
              var element = svgEl.getElementById(id);

              if (replaceImediately) {
                element.remove();
                _exit3 = true;
                return true;
              } else {
                return Promise.resolve(gsap.to(element, {
                  duration: TIMING,
                  opacity: 0
                })).then(function () {
                  element.remove();
                  _exit3 = true;
                  return true;
                });
              }
            }
          }();

          return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(_temp9) : _temp9(_temp10));
        } catch (e) {
          return Promise.reject(e);
        }
      }));
    };

    var data;

    var _temp4 = function () {
      if (text === '') {
        data = {
          groups: {},
          width: 0,
          height: 0,
          viewBox: [0, 0, 0, 0]
        };
      } else {
        return Promise.resolve(fetchLaTeXSvg(text)).then(function (_fetchLaTeXSvg) {
          data = _fetchLaTeXSvg;
        });
      }
    }();

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
};
gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

function colorFromGroupId(id) {
  if (id === 'g0') return 'black';
  return '#' + id.slice(1);
}

var whiteListedColors = ['#00d56f'];
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
      return b[2] - a[2];
    }).map(function (_ref3) {
      var c = _ref3[0];
      return c;
    });
    return ending.map(function () {
      return '}';
    }).join('') + starting.map(function (col) {
      return "\\g{" + (col + 1) + "}{";
    }).join('') + c;
  }).join('') + selections.filter(function (_ref4) {
    var e = _ref4[2];
    return e === tex.length;
  }).map(function () {
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
        return animation.start === a.start && animation.end === a.end || animation.start === a.end && animation.end === a.start;
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
  }, [animations, playedAnimations]);
  var animationsIShouldShow = React.useMemo(function () {
    return playedAnimations.map(function (animation) {
      var index = animations.findIndex(function (a) {
        return animation.start === a.start && animation.end === a.end || animation.start === a.end && animation.end === a.start;
      });
      var a = animations[index];
      if (!a) return null;
      return _extends({}, a, {
        start: '' + a.start,
        end: '' + a.end,
        index: index
      });
    }).filter(function (a) {
      return a !== null;
    }).filter(function (value, index, array) {
      return array.findIndex(function (_ref7) {
        var start = _ref7.start,
            end = _ref7.end;
        return value.start === start && value.end === end;
      }) === index;
    });
  }, [animations, playedAnimations]);
  return React__default.createElement("div", {
    className: 'animation-editor'
  }, React__default.createElement("div", {
    className: 'colors'
  }, allColors.map(function (c, i) {
    return React__default.createElement("span", {
      key: i,
      className: 'color',
      style: {
        backgroundColor: c,
        transform: colorIndex === i ? 'scale(1.4)' : 'scale(1)'
      },
      onClick: function onClick() {
        return setColorIndex(i);
      }
    });
  })), React__default.createElement("style", null, " .formula *::selection { background: " + allColors[colorIndex] + " } "), React__default.createElement("div", {
    className: 'animations'
  }, animationsIShouldShow.map(function (animation) {
    var i = animation.index;
    return React__default.createElement(Animation, {
      key: animation.start + animation.end,
      animation: animation,
      setAnimation: function setAnimation(f) {
        return setAnimations([].concat(animations.slice(0, i), [f], animations.slice(i + 1)));
      },
      colorIndex: colorIndex,
      setColorIndex: setColorIndex
    });
  })));
}

function Animation(_ref8) {
  var colorIndex = _ref8.colorIndex,
      setColorIndex = _ref8.setColorIndex,
      animation = _ref8.animation,
      setAnimation = _ref8.setAnimation;
  var handleSelection = React.useCallback(function () {
    var sel = window.getSelection();
    if (!sel) return;
    if (!sel.anchorNode || !sel.focusNode) return;

    try {
      var _sel$anchorNode, _sel$anchorNode$paren, _sel$focusNode, _sel$focusNode$parent, _extends2;

      var sString = (_sel$anchorNode = sel.anchorNode) === null || _sel$anchorNode === void 0 ? void 0 : (_sel$anchorNode$paren = _sel$anchorNode.parentNode) === null || _sel$anchorNode$paren === void 0 ? void 0 : _sel$anchorNode$paren.dataset.index;
      var eString = (_sel$focusNode = sel.focusNode) === null || _sel$focusNode === void 0 ? void 0 : (_sel$focusNode$parent = _sel$focusNode.parentNode) === null || _sel$focusNode$parent === void 0 ? void 0 : _sel$focusNode$parent.dataset.index;
      if (sString === undefined || eString === undefined) return;
      var s = parseInt(sString, 10) + sel.anchorOffset;
      var e = parseInt(eString, 10) + sel.focusOffset;
      var part1 = sel.focusNode.parentNode.dataset.part;
      var part2 = sel.focusNode.parentNode.dataset.part;
      if (!part1 || !part2) return;
      if (part1 !== part2) return;
      var part = part1;

      if (part !== 'start' && part !== 'end') {
        return;
      }

      var start = Math.min(s, e);
      var end = Math.max(s, e);

      if (start === end) {
        return;
      }

      var newAnimation = _extends({}, animation, (_extends2 = {}, _extends2[part + 'Groups'] = mergeSelections([].concat(animation[part + 'Groups'], [[colorIndex, start, end]])), _extends2));

      setAnimation(newAnimation);
    } catch (e) {} finally {
      sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
    }
  }, [animation, colorIndex]);
  var handleClick = React.useCallback(function (ev, part) {
    if (ev.button === 2) {
      var _extends3;

      var index = ev.target.dataset.index;
      var groups = part + 'Groups';
      var selections = determineSelections(animation[part], animation[groups]);
      var activeSelection = selections[index];

      if (!activeSelection) {
        return;
      }

      setAnimation(_extends({}, animation, (_extends3 = {}, _extends3[groups] = animation[groups].filter(function (s) {
        return s !== activeSelection;
      }), _extends3)));
      return;
    }

    if (ev.button === 1) {
      ev.preventDefault();
      var group = ev.target.dataset.group;
      setColorIndex(+group);
      return;
    }
  }, [setAnimation, animation, setColorIndex, colorIndex]);

  var splitChars = function splitChars(part) {
    var groups = part + 'Groups';
    var selections = determineSelections(animation[part], animation[groups]);
    return React__default.createElement("div", {
      key: part
    }, React__default.createElement("span", {
      className: 'formula',
      style: {
        fontFamily: 'Iosevka Term, monospace'
      },
      onMouseUp: function onMouseUp(e) {
        return handleClick(e, part);
      },
      onContextMenu: function onContextMenu(e) {
        return e.preventDefault();
      }
    }, animation[part].split('').map(function (c, j) {
      var sel = selections[j];
      var color = sel === null ? '' : allColors[sel[0]];
      var group = sel === null ? -1 : sel[0];
      return React__default.createElement("span", {
        key: j,
        "data-part": part,
        "data-index": j,
        "data-group": group,
        style: {
          background: color
        }
      }, c);
    })));
  };

  return React__default.createElement("div", {
    className: 'animation',
    onMouseUp: function onMouseUp() {
      return handleSelection();
    }
  }, ['start', 'end'].map(splitChars), React__default.createElement("div", {
    className: 'preview'
  }, React__default.createElement(AutoMorph, {
    steps: [convertToTeX(animation.start, animation.startGroups), convertToTeX(animation.end, animation.endGroups)]
  })));
}

function AutoMorph(_ref9) {
  var steps = _ref9.steps;

  var _useState2 = React.useState(0),
      step = _useState2[0],
      setStep = _useState2[1];

  var onClick = function onClick() {
    return setStep(function (step) {
      return (step + 1) % 2;
    });
  };

  return React__default.createElement("div", {
    className: 'automorph',
    onClick: onClick
  }, React__default.createElement(Morph, {
    TIMING: 1.0,
    display: true,
    useAnimationDatabase: false
  }, steps[step]));
}

function determineSelections(tex, selections) {
  var colors = [];
  var levels = [];
  tex.split('').forEach(function (_c, i) {
    var ending = selections.filter(function (_ref10) {
      var e = _ref10[2];
      return e === i;
    });
    var starting = selections.filter(function (_ref11) {
      var s = _ref11[1];
      return s === i;
    }).sort(function (a, b) {
      return b[2] - a[2];
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
  selections.forEach(function (_ref12) {
    var color = _ref12[0],
        start = _ref12[1],
        end = _ref12[2];
    var prev = result.find(function (_ref13) {
      var c = _ref13[0],
          e = _ref13[2];
      return e === start && c === color;
    });

    if (prev) {
      prev[2] = end;
      return;
    }

    var surrounding = result.find(function (_ref14) {
      var c = _ref14[0],
          s = _ref14[1],
          e = _ref14[2];
      return c === color && s <= start && e >= end;
    });

    if (surrounding) {
      return;
    }

    result.push([color, start, end]);
  });
  return result;
}

var wrapMathBasedOnProps = function wrapMathBasedOnProps(props, s) {
  if (props.display) {
    return '$\\displaystyle ' + s + '$';
  } else if (props.inline) {
    return '$' + s + '$';
  }

  return s;
};

function Morph(_ref) {
  var children = _ref.children,
      display = _ref.display,
      inline = _ref.inline,
      debug = _ref.debug,
      _ref$useAnimationData = _ref.useAnimationDatabase,
      useAnimationDatabase = _ref$useAnimationData === void 0 ? true : _ref$useAnimationData,
      replace = _ref.replace,
      _ref$TIMING = _ref.TIMING,
      TIMING = _ref$TIMING === void 0 ? 0.6 : _ref$TIMING,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className;
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

  var wrapMath = React.useCallback(function (tex) {
    return wrapMathBasedOnProps({
      display: display,
      inline: inline
    }, tex);
  }, [display, inline]);
  var previousChildren = usePrevious(children);
  React.useLayoutEffect(function () {
    if (!previousChildren) {
      setTransition(false);
    } else {
      setTransition(true);
    }
  }, [children]);
  var promise = React.useRef(Promise.resolve());

  var update = function update(children) {
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
        if (!svg) return;
        return animate(svg, text, replaceImediately, TIMING, updateSvgData);
      };

      var _temp9 = function () {
        if (!children) {
          return Promise.resolve(anim('', false)).then(function () {
            _exit4 = true;
          });
        }
      }();

      return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(_temp8) : _temp8(_temp9));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  React.useEffect(function () {
    promise.current = promise.current.then(function () {
      return update(children);
    })["catch"](function () {
      console.log('Failed to update Morph children');
    });
  }, [children]);
  var inner = React__default.createElement("div", {
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
    } : {
      transition: " " + TIMING + "s margin-top"
    }, debug ? {
      outline: '1px solid lightblue'
    } : {}),
    className: className
  }, React__default.createElement("svg", {
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
    } : {}, style),
    ref: svgEl
  }));

  if (display) {
    return React__default.createElement("div", {
      style: _extends({
        display: 'flex',
        flexGrow: 1,
        height: height + 'pt',
        margin: '0.5em 0',
        transition: TIMING + "s height"
      }, debug ? {
        outline: '1px solid red'
      } : {})
    }, inner);
  } else {
    return React__default.createElement(React.Fragment, null, React__default.createElement("div", {
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

var withFakeDispatcher = function withFakeDispatcher(ctx, cb) {
  var ReactCurrentDispatcher = React__default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
  var original = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current = {
    useContext: function useContext(context) {
      var result = ctx.find(function (_ref) {
        var c = _ref[0];
        return c === context;
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

var isComponent = function isComponent(node) {
  return node.type && typeof node.type === 'function';
};

var ignore = [Morph, RenderCite];

var findElementsInTree = function findElementsInTree(node, predicate) {
  var found = [];

  var handleTree = function handleTree(node) {
    if (predicate(node)) {
      found.push(node);
      return;
    }

    if (isComponent(node)) {
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

  if (type === RenderSlide) {
    return _extends({}, props, {
      slide: node
    });
  }

  var resolved = type(_extends({}, props));
  var rest = getPropsRecursiveUntilSlideComponentIsEncountered(resolved);
  return _extends({}, props, rest);
};

function getSlidesInfo(slides) {
  var mockContextes = [[PresentationContext, {
    i: 0,
    slideIndex: 0,
    slidesInfo: slides.map(function () {
      return {
        info: {}
      };
    })
  }], [CitationContext, {
    bibliography: [],
    citationMap: {}
  }]];
  var slideWithProps = withFakeDispatcher(mockContextes, function () {
    return slides.map(getPropsRecursiveUntilSlideComponentIsEncountered);
  });
  var infos = [];

  for (var _iterator = _createForOfIteratorHelperLoose(slideWithProps), _step; !(_step = _iterator()).done;) {
    var _ref4 = _step.value;

    var props = _objectWithoutPropertiesLoose(_ref4, ["slide"]);

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
  mockContextes.find(function (x) {
    return x[0] === PresentationContext;
  })[1].slidesInfo = infos.map(function (info) {
    return {
      info: info
    };
  });
  mockContextes.find(function (x) {
    return x[0] === CitationContext;
  })[1].citationMap = citationMap;
  return withFakeDispatcher(mockContextes, function () {
    slideWithProps = slides.map(getPropsRecursiveUntilSlideComponentIsEncountered);
    var slidesInfo = slideWithProps.map(function (_ref3, index) {
      var slide = _ref3.slide,
          props = _objectWithoutPropertiesLoose(_ref3, ["slide"]);

      return _extends({
        slide: slide,
        info: infos[index],
        steps: props.steps || [null]
      }, animations(slide), {
        presenterNotes: presenterNotes(slide)
      });
    });
    console.log(slidesInfo, citationMap);
    return {
      slidesInfo: slidesInfo,
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

  var allLaTeX = [];
  var morphs = {};
  var defaultResult = {
    animations: [],
    allLaTeX: []
  };
  if (!slide.props.steps) return defaultResult;

  if (typeof slide.props.children !== 'function') {
    return defaultResult;
  }

  slide.props.steps.forEach(function (step) {
    var tree = slide.props.children(step);
    findElementsInTree(tree, function (node) {
      return typeof node.type === 'function' && node.type === Morph;
    }).forEach(function (node) {
      if (node.props.replace) {
        if (node.props.children) {
          allLaTeX.push(wrapMathBasedOnProps(node.props, node.props.children));
        }

        return;
      }

      var id = JSON.stringify(node._source);
      var contents = node.props.children;
      morphs[id] = morphs[id] ? [].concat(morphs[id], [contents]) : [contents];
      morphs[id].props = node.props;
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

        if (start && end) {
          if (!formulas.props) {
            return;
          }

          var _lookupAnimationGroup = lookupAnimationGroups(start, end),
              startGrouped = _lookupAnimationGroup[0],
              endGrouped = _lookupAnimationGroup[1];

          allLaTeX.push(wrapMathBasedOnProps(formulas.props, startGrouped));
          allLaTeX.push(wrapMathBasedOnProps(formulas.props, endGrouped));
        }
      }
    });
  };

  for (var key in morphs) {
    _loop(key);
  }

  return {
    animations: anim,
    allLaTeX: allLaTeX
  };
};

function getCitations(slides) {
  var citationMap = {};
  slides.forEach(function (slide) {
    var trees = [slide];

    if (typeof slide.props.children === 'function' && !!slide.props.steps) {
      trees = slide.props.steps.map(function (step) {
        return slide.props.children(step);
      });
    }

    trees.forEach(function (tree) {
      findElementsInTree(tree, function (node) {
        return typeof node.type === 'function' && node.type === RenderCite;
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

function RenderPresentation(_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  return React__default.createElement(reactRouterDom.BrowserRouter, null, React__default.createElement(reactRouterDom.Switch, null, React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: '/storage'
  }, React__default.createElement(Storage, null)), React__default.createElement(reactRouterDom.Route, {
    path: '/presenter/:slideIndex?/:stepIndex?'
  }, React__default.createElement(PresentationUI, Object.assign({
    presenter: true
  }, props), children)), React__default.createElement(reactRouterDom.Route, {
    path: '/fullscreen/:slideIndex?/:stepIndex?'
  }, React__default.createElement(PresentationUI, Object.assign({
    fullscreen: true
  }, props), children)), React__default.createElement(reactRouterDom.Route, {
    path: '/overview'
  }, React__default.createElement(PresentationOverview, Object.assign({}, props), children)), React__default.createElement(reactRouterDom.Route, {
    path: '/:slideIndex?/:stepIndex?',
    exact: false
  }, React__default.createElement(PresentationUI, Object.assign({}, props), children))));
}
var PresentationContext = React__default.createContext(null);

function PresentationUI(_ref2) {
  var children = _ref2.children,
      render = _ref2.render,
      bibUrl = _ref2.bibUrl,
      _ref2$preamble = _ref2.preamble,
      preamble = _ref2$preamble === void 0 ? '' : _ref2$preamble,
      _ref2$compileHost = _ref2.compileHost,
      compileHost = _ref2$compileHost === void 0 ? '' : _ref2$compileHost,
      presenter = _ref2.presenter,
      fullscreen = _ref2.fullscreen;
  var reactSlides = React__default.Children.toArray(children);

  var _useMemo = React.useMemo(function () {
    return getSlidesInfo(reactSlides);
  }, [children]),
      slidesInfo = _useMemo.slidesInfo,
      citationMap = _useMemo.citationMap;

  React.useLayoutEffect(function () {
    LaTeX.setPreamble(preamble);

    if (compileHost) {
      console.log('setting host to', compileHost);
      LaTeX.setHost(compileHost);
    }
  }, [preamble, compileHost]);
  var match = reactRouterDom.useRouteMatch();
  var history = reactRouterDom.useHistory();

  var _useParams = reactRouterDom.useParams(),
      _useParams$slideIndex = _useParams.slideIndex,
      slideIndexString = _useParams$slideIndex === void 0 ? '0' : _useParams$slideIndex,
      _useParams$stepIndex = _useParams.stepIndex,
      stepIndexString = _useParams$stepIndex === void 0 ? '0' : _useParams$stepIndex;

  var slideIndex = parseInt(slideIndexString);
  var stepIndex = parseInt(stepIndexString);

  var _useState = React.useState({}),
      transitions = _useState[0],
      setTransitions = _useState[1];

  var bc = React.useMemo(function () {
    return new BroadcastChannel('presentation');
  }, []);
  bc.onmessage = React.useCallback(function (event) {
    setSlideAndStep(event.data.slideIndex, event.data.stepIndex, false);
  }, []);

  var setSlideAndStep = function setSlideAndStep(slideIndex, stepIndex, notify) {
    if (notify === void 0) {
      notify = true;
    }

    history.push(reactRouterDom.generatePath(match.path, {
      slideIndex: slideIndex,
      stepIndex: stepIndex
    }));

    if (notify) {
      bc.postMessage({
        slideIndex: slideIndex,
        stepIndex: stepIndex
      });
    }
  };

  var getNext = function getNext(slideIndex, stepIndex) {
    if (stepIndex < slidesInfo[slideIndex].steps.length - 1) {
      return [slideIndex, stepIndex + 1];
    }

    if (slideIndex < slidesInfo.length - 1) {
      return [slideIndex + 1, 0];
    }

    return [slideIndex, stepIndex];
  };

  var getPrev = function getPrev(slideIndex, stepIndex) {
    if (stepIndex > 0) {
      return [slideIndex, stepIndex - 1];
    }

    if (slideIndex > 0) {
      return [slideIndex - 1, slidesInfo[slideIndex - 1].steps.length - 1];
    }

    return [slideIndex, stepIndex];
  };

  var prev = React.useCallback(function (dontStepButGoToPrevSlide) {
    if (dontStepButGoToPrevSlide) {
      if (slideIndex > 0) {
        setSlideAndStep(slideIndex - 1, 0);
      }

      return;
    }

    setSlideAndStep.apply(void 0, getPrev(slideIndex, stepIndex));
  }, [slideIndex, stepIndex, setSlideAndStep]);
  var next = React.useCallback(function (dontStepButGoToNextSlide) {
    if (dontStepButGoToNextSlide) {
      if (slideIndex < slidesInfo.length - 1) {
        setSlideAndStep(slideIndex + 1, 0);
      }
    } else {
      setSlideAndStep.apply(void 0, getNext(slideIndex, stepIndex));
    }
  }, [slideIndex, stepIndex, setSlideAndStep]);
  var handleKey = React.useCallback(function (e) {
    if (e.key === 'ArrowDown') {
      next(true);
    }

    if (e.key === 'ArrowUp') {
      prev(true);
    }

    if (e.key === 'PageDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      next(false);
    } else if (e.key === 'PageUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      prev(false);
    }
  }, [next, prev, stepIndex, slideIndex]);
  React.useEffect(function () {
    window.addEventListener('keydown', handleKey);
    return function () {
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleKey]);

  if (slideIndex > slidesInfo.length) {
    return React__default.createElement("div", null, "Too high slide number!");
  }

  if (presenter) {
    var slides = [[slideIndex, stepIndex], getNext(slideIndex, stepIndex)].map(function (_ref3, index) {
      var slideIndex = _ref3[0],
          stepIndex = _ref3[1];
      return render({
        slideIndex: slideIndex,
        stepIndex: stepIndex,
        slidesInfo: slidesInfo,
        slides: [React__default.createElement(PresentationContext.Provider, {
          key: index,
          value: {
            i: slideIndex,
            slideIndex: slideIndex,
            slidesInfo: slidesInfo,
            stepIndex: stepIndex,
            setTransitions: function setTransitions() {
              return undefined;
            },
            transition: {
              after: {
                transform: ''
              },
              before: {
                transform: ''
              }
            }
          }
        }, reactSlides[slideIndex])]
      });
    });
    return React__default.createElement("div", {
      className: 'flex'
    }, React__default.createElement(CitationProvider, {
      citationMap: citationMap,
      bibUrl: bibUrl
    }, React__default.createElement("div", {
      className: 'flex justify-around'
    }, React__default.createElement("div", {
      className: 'flex flex-col'
    }, React__default.createElement("div", null, slides[0]), React__default.createElement("div", {
      className: 'text-lg'
    }, React__default.createElement(Clock, null))), React__default.createElement("div", {
      className: 'flex flex-col'
    }, React__default.createElement("div", {
      style: {
        transform: 'scale(0.5)',
        transformOrigin: 'top left',
        marginBottom: -450
      }
    }, slides[1]), React__default.createElement("div", null, slidesInfo[slideIndex].presenterNotes)))));
  }

  var wrappedSlides = reactSlides.map(function (slide, i) {
    return React__default.createElement(PresentationContext.Provider, {
      key: i,
      value: {
        i: i,
        slideIndex: slideIndex,
        slidesInfo: slidesInfo,
        stepIndex: i === slideIndex ? stepIndex : i < slideIndex && slidesInfo[i].steps.length ? slidesInfo[i].steps.length - 1 : 0,
        setTransitions: setTransitions,
        transition: transitions[i]
      }
    }, slide);
  });
  var threeSlides = wrappedSlides.slice(Math.max(0, slideIndex - 1), Math.min(wrappedSlides.length, slideIndex + 2));

  if (fullscreen) {
    return React__default.createElement("div", {
      className: 'flex justify-center items-center bg-blue h-screen'
    }, React__default.createElement(CitationProvider, {
      citationMap: citationMap,
      bibUrl: bibUrl
    }, render({
      slideIndex: slideIndex,
      stepIndex: stepIndex,
      slidesInfo: slidesInfo,
      slides: threeSlides
    })));
  }

  return React__default.createElement(CitationProvider, {
    citationMap: citationMap,
    bibUrl: bibUrl
  }, React__default.createElement("div", {
    className: 'flex h-screen bg-blue'
  }, render({
    slideIndex: slideIndex,
    stepIndex: stepIndex,
    slidesInfo: slidesInfo,
    slides: threeSlides
  }), React__default.createElement(Tabs, null, React__default.createElement(Tab, {
    label: 'Presenter notes'
  }, slidesInfo[slideIndex].presenterNotes ? React__default.createElement("div", {
    className: 'text-sm p-2'
  }, slidesInfo[slideIndex].presenterNotes) : null), React__default.createElement(Tab, {
    label: 'Animation editor'
  }, slidesInfo[slideIndex].animations.length ? React__default.createElement(AnimationEditor, {
    animations: slidesInfo[slideIndex].animations
  }) : null))));
}

function Tabs(_ref4) {
  var children = _ref4.children;
  return React__default.createElement("div", {
    className: 'bg-gray-900 w-full h-screen overflow-y-scroll'
  }, children);
}

function Tab(_ref5) {
  var label = _ref5.label,
      children = _ref5.children;

  var _useState2 = React.useState(true),
      show = _useState2[0],
      setShow = _useState2[1];

  if (!children) return null;
  return React__default.createElement("div", {
    className: 'w-full'
  }, React__default.createElement("div", {
    className: 'p-1 px-2 text-xs uppercase cursor-pointer sticky top-0 z-50 bg-gray-700',
    onClick: function onClick() {
      return setShow(function (s) {
        return !s;
      });
    }
  }, label), show && React__default.createElement("div", null, children));
}

function Clock() {
  return React__default.createElement("div", {
    className: 'flex justify-center items-center'
  }, "20:00");
}

function PresentationOverview(_ref6) {
  var children = _ref6.children,
      render = _ref6.render,
      bibUrl = _ref6.bibUrl,
      _ref6$preamble = _ref6.preamble,
      preamble = _ref6$preamble === void 0 ? '' : _ref6$preamble,
      compileHost = _ref6.compileHost;
  React.useLayoutEffect(function () {
    LaTeX.setPreamble(preamble);

    if (compileHost) {
      LaTeX.setHost(compileHost);
    }
  }, [preamble]);
  var reactSlides = React__default.Children.toArray(children);

  var _useMemo2 = React.useMemo(function () {
    return getSlidesInfo(reactSlides);
  }, [children]),
      slidesInfo = _useMemo2.slidesInfo,
      citationMap = _useMemo2.citationMap;

  return React__default.createElement("div", null, React__default.createElement(CitationProvider, {
    citationMap: citationMap,
    bibUrl: bibUrl
  }, slidesInfo.flatMap(function (info, slideIndex) {
    return info.steps.map(function (_step, stepIndex) {
      return React__default.createElement("div", {
        key: slideIndex + "-" + stepIndex
      }, render({
        slidesInfo: slidesInfo,
        slideIndex: slideIndex,
        stepIndex: stepIndex,
        slides: [React__default.createElement(PresentationContext.Provider, {
          key: slideIndex,
          value: {
            slidesInfo: slidesInfo,
            stepIndex: stepIndex,
            slideIndex: slideIndex,
            i: slideIndex,
            setTransitions: function setTransitions() {
              return null;
            },
            transition: {
              before: {},
              after: {}
            }
          }
        }, reactSlides[slideIndex])]
      }));
    });
  })));
}

var hasSteps = function hasSteps(node) {
  return node.call;
};

function RenderSlide(_ref7) {
  var children = _ref7.children,
      _ref7$steps = _ref7.steps,
      steps = _ref7$steps === void 0 ? [] : _ref7$steps,
      render = _ref7.render;
  var TIMING = 0.5;

  var _ref8 = React.useContext(PresentationContext) || {},
      _ref8$stepIndex = _ref8.stepIndex,
      stepIndex = _ref8$stepIndex === void 0 ? 0 : _ref8$stepIndex,
      _ref8$i = _ref8.i,
      i = _ref8$i === void 0 ? 0 : _ref8$i,
      _ref8$slideIndex = _ref8.slideIndex,
      slideIndex = _ref8$slideIndex === void 0 ? 0 : _ref8$slideIndex,
      transition = _ref8.transition,
      _ref8$slidesInfo = _ref8.slidesInfo,
      slidesInfo = _ref8$slidesInfo === void 0 ? [] : _ref8$slidesInfo;

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
    var _ref9 = transition || {},
        _ref9$after = _ref9.after,
        after = _ref9$after === void 0 ? {
      transform: "translate3d(-100%, 0px, 0px)",
      opacity: 0,
      zIndex: 0
    } : _ref9$after,
        _ref9$before = _ref9.before,
        before = _ref9$before === void 0 ? {
      transform: "translate3d(100%, 0px, 0px)",
      opacity: 0,
      zIndex: 0
    } : _ref9$before;

    if (i > slideIndex) {
      updateStyle(_extends({}, before));
    }

    if (i < slideIndex) {
      updateStyle(_extends({}, after));
    }

    if (i === slideIndex) {
      updateStyle({
        zIndex: 10,
        opacity: 1,
        transform: "scale(1) translate3d(0px,0px,0px)"
      });
    }
  }, [slideIndex, i, transition]);
  var content = children && (hasSteps(children) ? children(steps[stepIndex]) : children);
  return render({
    slidesInfo: slidesInfo,
    children: content,
    i: i,
    slideIndex: slideIndex,
    style: style
  });
}

function Storage() {
  return React__default.createElement("pre", {
    style: {
      whiteSpace: 'break-spaces'
    }
  }, localStorage.animationGroups);
}

function Show(_ref) {
  var when = _ref.when,
      children = _ref.children,
      opacity = _ref.opacity;
  var realStyle = {
    opacity: opacity !== undefined ? opacity : when ? 1 : 0,
    transition: '0.5s opacity ease-in-out'
  };
  return React__default.createElement(React__default.Fragment, null, React__default.Children.map(children, function (c) {
    if (React__default.isValidElement(c)) {
      var _c$props;

      return React__default.cloneElement(c, _extends({}, c.props || {}, {
        style: _extends({}, (c === null || c === void 0 ? void 0 : (_c$props = c.props) === null || _c$props === void 0 ? void 0 : _c$props.style) || {}, realStyle)
      }));
    } else {
      return React__default.createElement("span", {
        style: realStyle
      }, c);
    }
  }));
}

function Presentation(props) {
  var h = 900;
  var w = 1200;
  return React__default.createElement(RenderPresentation, Object.assign({}, props, {
    render: function render(_ref) {
      var slides = _ref.slides,
          slideIndex = _ref.slideIndex,
          slidesInfo = _ref.slidesInfo;
      var info = slidesInfo[slideIndex].info;
      return React__default.createElement("div", {
        className: 'inline-block relative flex-shrink-0 flex flex-col text-white bg-blue',
        style: {
          overflow: 'hidden',
          fontFamily: 'Computer Modern Sans',
          width: w,
          height: h
        }
      }, React__default.createElement("div", {
        className: 'flex-grow relative'
      }, slides), React__default.createElement("div", {
        className: 'flex flex-col',
        style: {
          transition: '0.5s transform',
          transform: "translate(0px, " + (info.hideNavigation ? 100 : 0) + "%)"
        }
      }, React__default.createElement("div", {
        className: 'flex justify-between text-xs theme-font-open'
      }, React__default.createElement("div", {
        className: 'px-2 py-1'
      }, info.sectionSlide ? '\xa0' : info.section), React__default.createElement("div", {
        className: 'px-2 py-1'
      }, slideIndex + 1)), React__default.createElement("div", {
        className: 'w-full inline-block',
        style: {
          height: 2
        }
      }, React__default.createElement("div", {
        className: 'h-full bg-green',
        style: {
          width: slideIndex / (slidesInfo.length - 1) * 100 + "%",
          transition: 'width 0.5s'
        }
      }))));
    }
  }));
}
function Slide(_ref2) {
  var className = _ref2.className,
      children = _ref2.children,
      slideStyle = _ref2.style,
      props = _objectWithoutPropertiesLoose(_ref2, ["className", "children", "style"]);

  return React__default.createElement(RenderSlide, Object.assign({
    children: children
  }, props, {
    render: function render(_ref3) {
      var slidesInfo = _ref3.slidesInfo,
          children = _ref3.children,
          i = _ref3.i,
          style = _ref3.style;
      var info = slidesInfo[i].info;
      return React__default.createElement("div", {
        className: 'slide',
        style: _extends({
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        }, style)
      }, React__default.createElement("div", {
        className: 'absolute inset-0 flex flex-col'
      }, info.header && React__default.createElement("div", {
        className: 'ml-6 mt-6 text-white font-semibold text-lg flex items-center theme-font-open'
      }, React__default.createElement("span", {
        style: {
          height: '2em',
          width: '4px',
          marginRight: '1em',
          background: '#00D56F',
          borderRadius: '2px'
        }
      }), info.header), React__default.createElement("div", {
        className: "flex-grow p-6 " + className,
        style: slideStyle
      }, children)));
    }
  }));
}
function SectionSlide(_ref4) {
  var section = _ref4.section,
      children = _ref4.children;

  var _ref5 = React.useContext(PresentationContext) || {},
      _ref5$i = _ref5.i,
      i = _ref5$i === void 0 ? 0 : _ref5$i,
      _ref5$slidesInfo = _ref5.slidesInfo,
      slidesInfo = _ref5$slidesInfo === void 0 ? [] : _ref5$slidesInfo;

  var numSlides = slidesInfo.length;
  return React__default.createElement(Slide, {
    className: 'flex justify-center items-center text-3xl theme-font-open',
    hideNavigation: true
  }, React__default.createElement("div", null, React__default.createElement("div", null, section), React__default.createElement("div", {
    className: 'mt-3',
    style: {
      background: 'rgba(255, 255, 255, 0.2)',
      width: '16em',
      height: '4px',
      borderRadius: '2px'
    }
  }, React__default.createElement("div", {
    className: 'h-full bg-green',
    style: {
      width: i / (numSlides - 1) * 100 + "%",
      borderRadius: '2px'
    }
  }))), children);
}
function ConclusionSlide(_ref6) {
  var section = _ref6.section,
      children = _ref6.children;
  return React__default.createElement(Slide, {
    hideNavigation: true,
    className: 'flex justify-center items-center text-3xl theme-font-open'
  }, React__default.createElement("div", null, React__default.createElement("div", null, section), React__default.createElement("div", {
    className: 'bg-gray-300 mt-3',
    style: {
      width: '16em',
      height: '4px'
    }
  }, React__default.createElement("div", {
    className: 'h-full bg-green',
    style: {
      width: "100%"
    }
  }))), children);
}
function TitleSlide(_ref7) {
  var title = _ref7.title,
      names = _ref7.names,
      names2 = _ref7.names2,
      date = _ref7.date,
      children = _ref7.children;
  return React__default.createElement(Slide, {
    className: 'flex flex-col items-stretch justify-between theme-font-open',
    steps: [0, 1, 2],
    hideNavigation: true
  }, function (step) {
    return React__default.createElement(React.Fragment, null, React__default.createElement("div", {
      className: 'flex-grow flex flex-col justify-center'
    }, React__default.createElement(Show, {
      when: step > 0
    }, React__default.createElement("h1", {
      className: 'text-4xl font-semibold text-green'
    }, title))), React__default.createElement(Show, {
      when: step > 1
    }, React__default.createElement("div", {
      className: 'text-sm flex items-end justify-between'
    }, React__default.createElement("div", null, React__default.createElement("div", null, names), React__default.createElement("div", null, names2)), React__default.createElement("div", null, date))), children);
  });
}
function TableOfContentsSlide(_ref8) {
  var header = _ref8.header,
      children = _ref8.children;

  var _ref9 = React.useContext(PresentationContext) || {},
      _ref9$slidesInfo = _ref9.slidesInfo,
      slidesInfo = _ref9$slidesInfo === void 0 ? [] : _ref9$slidesInfo;

  var sections = slidesInfo.map(function (i) {
    return i.info.section;
  }).filter(Boolean).filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
  return React__default.createElement(Slide, {
    hideNavigation: true,
    header: header,
    steps: sections.map(function (_, i) {
      return i;
    }),
    className: 'flex items-start'
  }, function (step) {
    return React__default.createElement(React__default.Fragment, null, React__default.createElement("ol", null, sections.map(function (section, i) {
      return React__default.createElement(Show, {
        key: section,
        when: step >= i
      }, React__default.createElement("li", {
        className: 'my-5'
      }, section));
    })), children);
  });
}
function QuestionSlide(_ref10) {
  var _ref10$title = _ref10.title,
      title = _ref10$title === void 0 ? 'Questions?' : _ref10$title,
      children = _ref10.children;
  return React__default.createElement(Slide, {
    className: 'bg-blue text-gray-100 text-3xl flex items-center justify-center p-0',
    hideNavigation: true
  }, title, children);
}
function Figure(_ref11) {
  var children = _ref11.children,
      caption = _ref11.caption;
  return React__default.createElement("div", {
    className: 'flex flex-col'
  }, React__default.createElement("div", {
    className: 'flex-grow'
  }, children), caption && React__default.createElement("div", {
    className: 'p-1'
  }, React__default.createElement("b", null, "Figure:"), " ", caption));
}
function List(_ref12) {
  var children = _ref12.children,
      step = _ref12.step,
      props = _objectWithoutPropertiesLoose(_ref12, ["children", "step"]);

  var childArray = React__default.Children.toArray(children);
  return React__default.createElement("ul", Object.assign({}, props), childArray.map(function (child, i) {
    return React__default.createElement(Show, {
      key: i,
      when: i < step || step === undefined
    }, child);
  }));
}
function Item(_ref13) {
  var children = _ref13.children,
      name = _ref13.name,
      props = _objectWithoutPropertiesLoose(_ref13, ["children", "name"]);

  if (name) {
    return React__default.createElement("li", Object.assign({}, props, {
      style: _extends({}, props.style || {}, {
        listStyle: 'none'
      })
    }), React__default.createElement("b", null, name + ' '), children);
  } else {
    return React__default.createElement("li", Object.assign({}, props), children);
  }
}
function Cite(_ref14) {
  var id = _ref14.id,
      hidden = _ref14.hidden;
  return React__default.createElement(RenderCite, {
    id: id,
    render: function render(_ref15) {
      var text = _ref15.text,
          number = _ref15.number;
      if (hidden) return React__default.createElement("span", null);
      return React__default.createElement("span", {
        title: text || 'Loading ...'
      }, "[", number || '??', "]");
    }
  });
}
function BibliographySlide() {
  var stride = 4;
  return React__default.createElement(RenderBibliography, {
    render: function render(items) {
      return React__default.createElement(Slide, {
        steps: range(Math.ceil(items.length / stride))
      }, function (step) {
        if (!items) return React__default.createElement("div", null, "Loading");
        var start = stride * step;
        var end = start + stride;
        return React__default.createElement("ul", {
          className: 'list-none text-sm'
        }, items.slice(start, end).map(function (_ref16) {
          var id = _ref16.id,
              n = _ref16.n,
              html = _ref16.html;
          return React__default.createElement("li", {
            className: 'flex my-2',
            key: id
          }, React__default.createElement("span", {
            className: 'mr-2'
          }, "[", n, "]"), React__default.createElement("div", {
            className: 'inline-block'
          }, React__default.createElement("span", {
            dangerouslySetInnerHTML: {
              __html: html
            }
          })));
        }));
      });
    }
  });
}
function Box(_ref17) {
  var title = _ref17.title,
      children = _ref17.children,
      className = _ref17.className,
      smallTitle = _ref17.smallTitle,
      style = _ref17.style;
  return React__default.createElement("div", {
    className: "theme-border theme-shadow " + (className || ''),
    style: style
  }, React__default.createElement("div", {
    className: 'p-2'
  }, title && React__default.createElement("span", {
    className: "pr-2 text-green font-semibold " + (smallTitle ? 'text-xs block' : '')
  }, title, "."), children));
}
function Qed(props) {
  return React__default.createElement("div", Object.assign({
    className: 'flex justify-end'
  }, props), React__default.createElement("div", {
    className: 'inline-block w-2 h-2 bg-white m-1'
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
    return parseFloat(s);
  }),
      vy = _textSvg$getAttribute[1];

  var width = parseFloat(textSvg.getAttribute('width').replace('pt', ''));
  var height = parseFloat(textSvg.getAttribute('height').replace('pt', ''));
  var _textSvg$dataset = textSvg.dataset,
      scaleString = _textSvg$dataset.scale,
      textXString = _textSvg$dataset.textX,
      textYString = _textSvg$dataset.textY;
  var FONT_SCALING_FACTOR = 2;
  var scale = parseFloat(scaleString || '0');
  var textX = parseFloat(textXString || '0');
  var textY = parseFloat(textYString || '0');
  textSvg.dataset.scale = String(scale);
  textSvg.setAttribute('x', textX + 'px');
  textSvg.setAttribute('y', textY + FONT_SCALING_FACTOR * scale * vy * 1.3 + 'px');
  textSvg.setAttribute('width', FONT_SCALING_FACTOR * scale * width + 'pt');
  textSvg.setAttribute('height', FONT_SCALING_FACTOR * scale * height + 'pt');
};

var replaceText = function replaceText(textEle) {
  try {
    var text = textEle.textContent;
    if (!text) return Promise.resolve();
    var textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var matrix = textEle.getScreenCTM();
    if (!matrix) return Promise.resolve();
    var scale = 1 / matrix.a;
    textSvg.dataset.textX = textEle.getAttribute('x') || undefined;
    textSvg.dataset.textY = textEle.getAttribute('y') || undefined;
    textSvg.dataset.scale = String(scale);

    var textContentToId = function textContentToId(textContent) {
      return textContent.replace(/[^a-zA-z]+/g, '');
    };

    textSvg.id = textContentToId(text);
    textEle.parentNode.replaceChild(textSvg, textEle);
    return Promise.resolve(animate(textSvg, text, true, 0, function (_ref) {
      var width = _ref.width,
          height = _ref.height,
          viewBox = _ref.viewBox;
      textSvg.setAttribute('width', width + 'pt');
      textSvg.setAttribute('height', height + 'pt');
      textSvg.setAttribute('viewBox', viewBox.join(' '));
      positionSvg(textSvg);
    })).then(function () {});
  } catch (e) {
    return Promise.reject(e);
  }
};

var TIMING = 0.4;

function update(wrapper, step, replaceImediately) {
  for (var key in step) {
    if (step[key] === null || step[key] === undefined) {
      continue;
    }

    if (key.startsWith('text:')) {
      (function () {
        var id = key.replace(/^text:/, '');
        var textSvg = wrapper.querySelector("svg#" + id);

        if (textSvg) {
          if (replaceImediately) {
            textSvg.innerHTML = '';
          }

          animate(textSvg, step[key] || '', replaceImediately, 0.3, function (_ref2) {
            var width = _ref2.width,
                height = _ref2.height,
                viewBox = _ref2.viewBox;
            textSvg.setAttribute('width', width + 'pt');
            textSvg.setAttribute('height', height + 'pt');
            textSvg.setAttribute('viewBox', viewBox.join(' '));
            positionSvg(textSvg);
          });
        }
      })();
    } else {
      var ele = wrapper.querySelector("#" + key);

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
          gsap.to(ele, _extends({
            duration: rest.seconds || TIMING
          }, rest));
        }
      }
    }
  }
}

var memoizedFetch = memoize(function (src) {
  return fetch(src).then(function (r) {
    return r.text();
  });
});

function AnimateSVG(_ref3) {
  var src = _ref3.src,
      _ref3$step = _ref3.step,
      step = _ref3$step === void 0 ? {} : _ref3$step,
      _ref3$width = _ref3.width,
      width = _ref3$width === void 0 ? '100%' : _ref3$width,
      _ref3$height = _ref3.height,
      height = _ref3$height === void 0 ? 'auto' : _ref3$height;
  var element = React.useRef(null);
  React.useEffect(function () {

    (function () {
      try {
        return Promise.resolve(memoizedFetch(src)).then(function (text) {
          var div = element.current;
          if (!div) return;
          div.style.opacity = '0';
          div.innerHTML = text;
          div.querySelector('svg').style.width = width;
          div.querySelector('svg').style.height = height;
          return Promise.resolve(Promise.all(Array.from(div.querySelectorAll('text')).map(function (textEle) {
            try {
              if (textEle.matches('.dont-replace *')) {
                return Promise.resolve();
              }

              var _temp2 = function () {
                if (textEle.children.length === 0) {
                  return Promise.resolve(replaceText(textEle)).then(function () {});
                } else {
                  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                  return Promise.resolve(Promise.all(Array.from(textEle.children).map(function (el) {
                    return replaceText(el);
                  }))).then(function () {
                    Array.from(textEle.children).forEach(function (e) {
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
            div.style.opacity = '1';
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
  return React__default.createElement("div", {
    ref: element,
    style: {
      margin: '-1rem'
    }
  });
}

function InlineMath(_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  return React__default.createElement(Morph, Object.assign({
    inline: true,
    replace: true
  }, props), children);
}
function DisplayMath(_ref2) {
  var children = _ref2.children,
      props = _objectWithoutPropertiesLoose(_ref2, ["children"]);

  return React__default.createElement(Morph, Object.assign({
    display: true,
    replace: true
  }, props), children);
}
var m = function m(template) {
  for (var _len = arguments.length, subtitutions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    subtitutions[_key - 1] = arguments[_key];
  }

  return React__default.createElement(InlineMath, null, String.raw.apply(String, [template].concat(subtitutions)));
};
var M = function M(template) {
  for (var _len2 = arguments.length, subtitutions = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    subtitutions[_key2 - 1] = arguments[_key2];
  }

  return React__default.createElement(DisplayMath, null, String.raw.apply(String, [template].concat(subtitutions)));
};

function measureText(text, style) {
  if (style === void 0) {
    style = {};
  }

  var div = document.createElement('div');
  document.body.appendChild(div);
  div.style.position = 'absolute';
  div.style.left = '-1000';
  div.style.top = '-1000';

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
  return React__default.createElement("div", {
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
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? '' : _ref2$className,
      props = _objectWithoutPropertiesLoose(_ref2, ["children", "zoomin", "zoomout", "className"]);

  var context = React.useContext(PresentationContext);
  var zoom = zoomin ? 'in' : zoomout ? 'out' : null;
  var ref = React.useRef(null);
  useResizeObserver({
    ref: ref,
    onResize: function onResize() {
      if (!zoom) return;
      if (!ref.current) return;
      if (!context) return;
      var rect = getRect(ref.current);
      addPortal(context, {
        zoom: zoom,
        rect: rect
      });
    }
  });
  return React__default.createElement("div", Object.assign({
    className: "inline-block " + className,
    ref: ref
  }, props), children);
}

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

var timeline = function timeline(strings) {
  for (var _len = arguments.length, subs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    subs[_key - 1] = arguments[_key];
  }

  var translate = function translate(sub) {
    return function (s) {
      return Object.prototype.hasOwnProperty.call(sub, s) ? sub[s] : Object.prototype.hasOwnProperty.call(defaultTranslations, s) ? defaultTranslations[s] : s;
    };
  };

  var fillWithLastUntilHasLength = function fillWithLastUntilHasLength(array, length) {
    var last = array[array.length - 1];
    return [].concat(array, Array.from({
      length: length - array.length
    }).map(function () {
      return last;
    }));
  };

  var lines = strings.flatMap(function (part, i) {
    var lines = part.split('\n').filter(function (line) {
      return line.trim() !== '';
    });
    if (lines.length === 0) return [];
    var firsts = lines.slice(0, lines.length - 1);
    var last = lines[lines.length - 1];
    return [].concat(firsts.map(function (l) {
      return {
        text: l,
        sub: {}
      };
    }), [{
      text: last,
      sub: subs[i]
    }]);
  });
  var charactersInterpreted = lines.map(function (_ref) {
    var text = _ref.text,
        sub = _ref.sub;
    var trimmed = text.trim();
    var splitted = trimmed.split(/\s+(.+)/);
    return {
      label: splitted[0],
      text: splitted[1],
      sub: sub
    };
  }).map(function (_ref2) {
    var label = _ref2.label,
        sub = _ref2.sub,
        text = _ref2.text;
    var numbers = [];
    var number = 0;
    text.split('').forEach(function (step, i) {
      var prev = numbers[numbers.length - 1];
      var nextChar = text[i + 1];

      if (step === ' ') {
        numbers.push(prev);
        return;
      }

      if (step === '+' || step === '-') {
        if (step === '+') {
          number += 1;
        } else {
          number -= 1;
        }

        numbers.push(number);
        return;
      }

      if (step === '.') {
        if (Array.isArray(prev)) {
          throw new Error('Cannot use a dot . in a timeline specification immediately following another dot');
        }

        if (typeof prev === 'string') {
          throw new Error('Cannot use a dot . if it is surrounded by non-numbers');
        }

        if (isNaN(prev)) return;
        var to;

        if (nextChar && !isNaN(parseInt(nextChar))) {
          to = parseInt(nextChar);
        } else {
          to = sub.length;
        }

        var rangeInBetween = range(to - prev - 1).map(function (n) {
          return n + prev + 1;
        });

        if (rangeInBetween.length === 0) {
          numbers.push(prev);
          return;
        }

        numbers.push(rangeInBetween);
        return;
      }

      var n = parseInt(step);

      if (!isNaN(n)) {
        number = n;
        numbers.push(number);
        return;
      }

      numbers.push(step);
    });
    return {
      label: label,
      numbers: numbers,
      sub: sub
    };
  });
  var numberOfUnexpandedSteps = Math.max.apply(Math, charactersInterpreted.map(function (obj) {
    return obj.numbers.length;
  }));
  var expanded = charactersInterpreted.map(function (_ref3) {
    var label = _ref3.label,
        numbers = _ref3.numbers,
        sub = _ref3.sub;
    var expandedSteps = range(numberOfUnexpandedSteps).flatMap(function (index) {
      var length = Math.max.apply(Math, charactersInterpreted.map(function (_ref4) {
        var numbers = _ref4.numbers;
        var element = numbers[index];

        if (Array.isArray(element)) {
          return element.length;
        } else {
          return 1;
        }
      }));
      var numberOrNumbers;

      if (numbers[index] !== undefined) {
        numberOrNumbers = numbers[index];
      } else {
        var last = numbers[numbers.length - 1];

        if (Array.isArray(last)) {
          numberOrNumbers = last[last.length - 1];
        } else {
          numberOrNumbers = last;
        }
      }

      if (Array.isArray(numberOrNumbers)) {
        return fillWithLastUntilHasLength(numberOrNumbers, length);
      } else {
        return fillWithLastUntilHasLength([numberOrNumbers], length);
      }
    });
    return {
      label: label,
      translated: expandedSteps.map(translate(sub || {}))
    };
  });
  var output = range(expanded[0].translated.length).map(function (stepIndex) {
    return Object.fromEntries(expanded.map(function (_ref5) {
      var label = _ref5.label,
          translated = _ref5.translated;
      return [label, translated[stepIndex]];
    }));
  });
  return output;
};

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
