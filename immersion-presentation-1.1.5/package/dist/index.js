function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Citation = _interopDefault(require('citation-js'));
var memoize = _interopDefault(require('memoizee'));
var svgPathParse = require('svg-path-parse');
var gsap$2 = _interopDefault(require('gsap'));
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
  _host: "http://" + (typeof window !== 'undefined' ? window.location.hostname : 'example.com') + ":3001",
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
          return Promise.resolve(result.json()).then(function (error) {
            if (error.name === 'CompilationError') {
              throw new Error("Could not compile '" + error.tex + "': " + error.latexErrors.join('\n'));
            } else {
              throw new Error(error.message);
            }
          });
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
        throw new Error("Could not find SVG in compiled LaTeX " + tex);
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
    }, function (e) {
      console.error("%cLaTeXError: " + e.message, 'color: #AD1457');
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
var isBrowser = typeof window !== 'undefined';
var useIsomorphicLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;

var _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
    _numbersExp = /(?:(-)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
    _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
    _selectorExp = /(^[#\.][a-z]|[a-y][a-z])/i,
    _DEG2RAD = Math.PI / 180,
    _sin = Math.sin,
    _cos = Math.cos,
    _abs = Math.abs,
    _sqrt = Math.sqrt,
    _isString = function _isString(value) {
  return typeof value === 'string';
},
    _isNumber = function _isNumber(value) {
  return typeof value === 'number';
},
    _roundingNum = 1e5,
    _round = function _round(value) {
  return ~~(value * _roundingNum + (value < 0 ? -0.5 : 0.5)) / _roundingNum;
};

function getRawPath(value) {
  value = _isString(value) && _selectorExp.test(value) ? document.querySelector(value) || value : value;
  var e = value.getAttribute ? value : 0,
      rawPath;

  if (e && (value = value.getAttribute('d'))) {
    if (!e._gsPath) {
      e._gsPath = {};
    }

    rawPath = e._gsPath[value];
    return rawPath && !rawPath._dirty ? rawPath : e._gsPath[value] = stringToRawPath(value);
  }

  return !value ? console.warn('Expecting a <path> element or an SVG path data string') : _isString(value) ? stringToRawPath(value) : _isNumber(value[0]) ? [value] : value;
}
function reverseSegment(segment) {
  var i = 0,
      y;
  segment.reverse();

  for (; i < segment.length; i += 2) {
    y = segment[i];
    segment[i] = segment[i + 1];
    segment[i + 1] = y;
  }

  segment.reversed = !segment.reversed;
}

var _createPath = function _createPath(e, ignore) {
  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
      attr = [].slice.call(e.attributes),
      i = attr.length,
      name;
  ignore = ',' + ignore + ',';

  while (--i > -1) {
    name = attr[i].nodeName.toLowerCase();

    if (ignore.indexOf(',' + name + ',') < 0) {
      path.setAttributeNS(null, name, attr[i].nodeValue);
    }
  }

  return path;
},
    _typeAttrs = {
  rect: 'rx,ry,x,y,width,height',
  circle: 'r,cx,cy',
  ellipse: 'rx,ry,cx,cy',
  line: 'x1,x2,y1,y2'
},
    _attrToObj = function _attrToObj(e, attrs) {
  var props = attrs ? attrs.split(',') : [],
      obj = {},
      i = props.length;

  while (--i > -1) {
    obj[props[i]] = +e.getAttribute(props[i]) || 0;
  }

  return obj;
};

function convertToPath(element, swap) {
  var type = element.tagName.toLowerCase(),
      circ = 0.552284749831,
      data,
      x,
      y,
      r,
      ry,
      path,
      rcirc,
      rycirc,
      points,
      w,
      h,
      x2,
      x3,
      x4,
      x5,
      x6,
      y2,
      y3,
      y4,
      y5,
      y6,
      attr;

  if (type === 'path' || !element.getBBox) {
    return element;
  }

  path = _createPath(element, 'x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points');
  attr = _attrToObj(element, _typeAttrs[type]);

  if (type === 'rect') {
    r = attr.rx;
    ry = attr.ry;
    x = attr.x;
    y = attr.y;
    w = attr.width - r * 2;
    h = attr.height - ry * 2;

    if (r || ry) {
      x2 = x + r * (1 - circ);
      x3 = x + r;
      x4 = x3 + w;
      x5 = x4 + r * circ;
      x6 = x4 + r;
      y2 = y + ry * (1 - circ);
      y3 = y + ry;
      y4 = y3 + h;
      y5 = y4 + ry * circ;
      y6 = y4 + ry;
      data = 'M' + x6 + ',' + y3 + ' V' + y4 + ' C' + [x6, y5, x5, y6, x4, y6, x4 - (x4 - x3) / 3, y6, x3 + (x4 - x3) / 3, y6, x3, y6, x2, y6, x, y5, x, y4, x, y4 - (y4 - y3) / 3, x, y3 + (y4 - y3) / 3, x, y3, x, y2, x2, y, x3, y, x3 + (x4 - x3) / 3, y, x4 - (x4 - x3) / 3, y, x4, y, x5, y, x6, y2, x6, y3].join(',') + 'z';
    } else {
      data = 'M' + (x + w) + ',' + y + ' v' + h + ' h' + -w + ' v' + -h + ' h' + w + 'z';
    }
  } else if (type === 'circle' || type === 'ellipse') {
    if (type === 'circle') {
      r = ry = attr.r;
      rycirc = r * circ;
    } else {
      r = attr.rx;
      ry = attr.ry;
      rycirc = ry * circ;
    }

    x = attr.cx;
    y = attr.cy;
    rcirc = r * circ;
    data = 'M' + (x + r) + ',' + y + ' C' + [x + r, y + rycirc, x + rcirc, y + ry, x, y + ry, x - rcirc, y + ry, x - r, y + rycirc, x - r, y, x - r, y - rycirc, x - rcirc, y - ry, x, y - ry, x + rcirc, y - ry, x + r, y - rycirc, x + r, y].join(',') + 'z';
  } else if (type === 'line') {
    data = 'M' + attr.x1 + ',' + attr.y1 + ' L' + attr.x2 + ',' + attr.y2;
  } else if (type === 'polyline' || type === 'polygon') {
    points = (element.getAttribute('points') + '').match(_numbersExp) || [];
    x = points.shift();
    y = points.shift();
    data = 'M' + x + ',' + y + ' L' + points.join(',');

    if (type === 'polygon') {
      data += ',' + x + ',' + y + 'z';
    }
  }

  path.setAttribute('d', rawPathToString(path._gsRawPath = stringToRawPath(data)));

  if (swap && element.parentNode) {
    element.parentNode.insertBefore(path, element);
    element.parentNode.removeChild(element);
  }

  return path;
}

function arcToSegment(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
  if (lastX === x && lastY === y) {
    return;
  }

  rx = _abs(rx);
  ry = _abs(ry);

  var angleRad = angle % 360 * _DEG2RAD,
      cosAngle = _cos(angleRad),
      sinAngle = _sin(angleRad),
      PI = Math.PI,
      TWOPI = PI * 2,
      dx2 = (lastX - x) / 2,
      dy2 = (lastY - y) / 2,
      x1 = cosAngle * dx2 + sinAngle * dy2,
      y1 = -sinAngle * dx2 + cosAngle * dy2,
      x1_sq = x1 * x1,
      y1_sq = y1 * y1,
      radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);

  if (radiiCheck > 1) {
    rx = _sqrt(radiiCheck) * rx;
    ry = _sqrt(radiiCheck) * ry;
  }

  var rx_sq = rx * rx,
      ry_sq = ry * ry,
      sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);

  if (sq < 0) {
    sq = 0;
  }

  var coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt(sq),
      cx1 = coef * (rx * y1 / ry),
      cy1 = coef * -(ry * x1 / rx),
      sx2 = (lastX + x) / 2,
      sy2 = (lastY + y) / 2,
      cx = sx2 + (cosAngle * cx1 - sinAngle * cy1),
      cy = sy2 + (sinAngle * cx1 + cosAngle * cy1),
      ux = (x1 - cx1) / rx,
      uy = (y1 - cy1) / ry,
      vx = (-x1 - cx1) / rx,
      vy = (-y1 - cy1) / ry,
      temp = ux * ux + uy * uy,
      angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt(temp)),
      angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));

  if (isNaN(angleExtent)) {
    angleExtent = PI;
  }

  if (!sweepFlag && angleExtent > 0) {
    angleExtent -= TWOPI;
  } else if (sweepFlag && angleExtent < 0) {
    angleExtent += TWOPI;
  }

  angleStart %= TWOPI;
  angleExtent %= TWOPI;

  var segments = Math.ceil(_abs(angleExtent) / (TWOPI / 4)),
      rawPath = [],
      angleIncrement = angleExtent / segments,
      controlLength = 4 / 3 * _sin(angleIncrement / 2) / (1 + _cos(angleIncrement / 2)),
      ma = cosAngle * rx,
      mb = sinAngle * rx,
      mc = sinAngle * -ry,
      md = cosAngle * ry,
      i;

  for (i = 0; i < segments; i++) {
    angle = angleStart + i * angleIncrement;
    x1 = _cos(angle);
    y1 = _sin(angle);
    ux = _cos(angle += angleIncrement);
    uy = _sin(angle);
    rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
  }

  for (i = 0; i < rawPath.length; i += 2) {
    x1 = rawPath[i];
    y1 = rawPath[i + 1];
    rawPath[i] = x1 * ma + y1 * mc + cx;
    rawPath[i + 1] = x1 * mb + y1 * md + cy;
  }

  rawPath[i - 2] = x;
  rawPath[i - 1] = y;
  return rawPath;
}

function stringToRawPath(d) {
  var a = (d + '').replace(_scientific, function (m) {
    var n = +m;
    return n < 0.0001 && n > -0.0001 ? 0 : n;
  }).match(_svgPathExp) || [],
      path = [],
      relativeX = 0,
      relativeY = 0,
      twoThirds = 2 / 3,
      elements = a.length,
      points = 0,
      errorMessage = 'ERROR: malformed path: ' + d,
      i,
      j,
      x,
      y,
      command,
      isRelative,
      segment,
      startX,
      startY,
      difX,
      difY,
      beziers,
      prevCommand,
      flag1,
      flag2,
      line = function line(sx, sy, ex, ey) {
    difX = (ex - sx) / 3;
    difY = (ey - sy) / 3;
    segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
  };

  if (!d || !isNaN(a[0]) || isNaN(a[1])) {
    console.log(errorMessage);
    return path;
  }

  for (i = 0; i < elements; i++) {
    prevCommand = command;

    if (isNaN(a[i])) {
      command = a[i].toUpperCase();
      isRelative = command !== a[i];
    } else {
      i--;
    }

    x = +a[i + 1];
    y = +a[i + 2];

    if (isRelative) {
      x += relativeX;
      y += relativeY;
    }

    if (!i) {
      startX = x;
      startY = y;
    }

    if (command === 'M') {
      if (segment) {
        if (segment.length < 8) {
          path.length -= 1;
        } else {
          points += segment.length;
        }
      }

      relativeX = startX = x;
      relativeY = startY = y;
      segment = [x, y];
      path.push(segment);
      i += 2;
      command = 'L';
    } else if (command === 'C') {
      if (!segment) {
        segment = [0, 0];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      segment.push(x, y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, relativeX += a[i + 5] * 1, relativeY += a[i + 6] * 1);
      i += 6;
    } else if (command === 'S') {
      difX = relativeX;
      difY = relativeY;

      if (prevCommand === 'C' || prevCommand === 'S') {
        difX += relativeX - segment[segment.length - 4];
        difY += relativeY - segment[segment.length - 3];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      segment.push(difX, difY, x, y, relativeX += a[i + 3] * 1, relativeY += a[i + 4] * 1);
      i += 4;
    } else if (command === 'Q') {
      difX = relativeX + (x - relativeX) * twoThirds;
      difY = relativeY + (y - relativeY) * twoThirds;

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      relativeX += a[i + 3] * 1;
      relativeY += a[i + 4] * 1;
      segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
      i += 4;
    } else if (command === 'T') {
      difX = relativeX - segment[segment.length - 4];
      difY = relativeY - segment[segment.length - 3];
      segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
      i += 2;
    } else if (command === 'H') {
      line(relativeX, relativeY, relativeX = x, relativeY);
      i += 1;
    } else if (command === 'V') {
      line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
      i += 1;
    } else if (command === 'L' || command === 'Z') {
      if (command === 'Z') {
        x = startX;
        y = startY;
        segment.closed = true;
      }

      if (command === 'L' || _abs(relativeX - x) > 0.5 || _abs(relativeY - y) > 0.5) {
        line(relativeX, relativeY, x, y);

        if (command === 'L') {
          i += 2;
        }
      }

      relativeX = x;
      relativeY = y;
    } else if (command === 'A') {
      flag1 = a[i + 4];
      flag2 = a[i + 5];
      difX = a[i + 6];
      difY = a[i + 7];
      j = 7;

      if (flag1.length > 1) {
        if (flag1.length < 3) {
          difY = difX;
          difX = flag2;
          j--;
        } else {
          difY = flag2;
          difX = flag1.substr(2);
          j -= 2;
        }

        flag2 = flag1.charAt(1);
        flag1 = flag1.charAt(0);
      }

      beziers = arcToSegment(relativeX, relativeY, +a[i + 1], +a[i + 2], +a[i + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX * 1, (isRelative ? relativeY : 0) + difY * 1);
      i += j;

      if (beziers) {
        for (j = 0; j < beziers.length; j++) {
          segment.push(beziers[j]);
        }
      }

      relativeX = segment[segment.length - 2];
      relativeY = segment[segment.length - 1];
    } else {
      console.log(errorMessage);
    }
  }

  i = segment.length;

  if (i < 6) {
    path.pop();
    i = 0;
  } else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
    segment.closed = true;
  }

  path.totalPoints = points + i;
  return path;
}
function rawPathToString(rawPath) {
  if (_isNumber(rawPath[0])) {
    rawPath = [rawPath];
  }

  var result = '',
      l = rawPath.length,
      sl,
      s,
      i,
      segment;

  for (s = 0; s < l; s++) {
    segment = rawPath[s];
    result += 'M' + _round(segment[0]) + ',' + _round(segment[1]) + ' C';
    sl = segment.length;

    for (i = 2; i < sl; i++) {
      result += _round(segment[i++]) + ',' + _round(segment[i++]) + ' ' + _round(segment[i++]) + ',' + _round(segment[i++]) + ' ' + _round(segment[i++]) + ',' + _round(segment[i]) + ' ';
    }

    if (segment.closed) {
      result += 'z';
    }
  }

  return result;
}

var gsap,
    _toArray,
    _lastLinkedAnchor,
    _coreInitted,
    PluginClass,
    _getGSAP = function _getGSAP() {
  return gsap || typeof window !== 'undefined' && (gsap = window.gsap) && gsap.registerPlugin && gsap;
},
    _atan2 = Math.atan2,
    _cos$1 = Math.cos,
    _sin$1 = Math.sin,
    _sqrt$1 = Math.sqrt,
    _PI = Math.PI,
    _2PI = _PI * 2,
    _angleMin = _PI * 0.3,
    _angleMax = _PI * 0.7,
    _bigNum = 1e20,
    _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
    _selectorExp$1 = /(^[#\.][a-z]|[a-y][a-z])/gi,
    _commands = /[achlmqstvz]/gi,
    _log = function _log(message) {
  return console && console.warn(message);
},
    _bonusValidated = 1,
    _getAverageXY = function _getAverageXY(segment) {
  var l = segment.length,
      x = 0,
      y = 0,
      i;

  for (i = 0; i < l; i++) {
    x += segment[i++];
    y += segment[i];
  }

  return [x / (l / 2), y / (l / 2)];
},
    _getSize = function _getSize(segment) {
  var l = segment.length,
      xMax = segment[0],
      xMin = xMax,
      yMax = segment[1],
      yMin = yMax,
      x,
      y,
      i;

  for (i = 6; i < l; i += 6) {
    x = segment[i];
    y = segment[i + 1];

    if (x > xMax) {
      xMax = x;
    } else if (x < xMin) {
      xMin = x;
    }

    if (y > yMax) {
      yMax = y;
    } else if (y < yMin) {
      yMin = y;
    }
  }

  segment.centerX = (xMax + xMin) / 2;
  segment.centerY = (yMax + yMin) / 2;
  return segment.size = (xMax - xMin) * (yMax - yMin);
},
    _getTotalSize = function _getTotalSize(rawPath, samplesPerBezier) {
  if (samplesPerBezier === void 0) {
    samplesPerBezier = 3;
  }

  var j = rawPath.length,
      xMax = rawPath[0][0],
      xMin = xMax,
      yMax = rawPath[0][1],
      yMin = yMax,
      inc = 1 / samplesPerBezier,
      l,
      x,
      y,
      i,
      segment,
      k,
      t,
      inv,
      x1,
      y1,
      x2,
      x3,
      x4,
      y2,
      y3,
      y4;

  while (--j > -1) {
    segment = rawPath[j];
    l = segment.length;

    for (i = 6; i < l; i += 6) {
      x1 = segment[i];
      y1 = segment[i + 1];
      x2 = segment[i + 2] - x1;
      y2 = segment[i + 3] - y1;
      x3 = segment[i + 4] - x1;
      y3 = segment[i + 5] - y1;
      x4 = segment[i + 6] - x1;
      y4 = segment[i + 7] - y1;
      k = samplesPerBezier;

      while (--k > -1) {
        t = inc * k;
        inv = 1 - t;
        x = (t * t * x4 + 3 * inv * (t * x3 + inv * x2)) * t + x1;
        y = (t * t * y4 + 3 * inv * (t * y3 + inv * y2)) * t + y1;

        if (x > xMax) {
          xMax = x;
        } else if (x < xMin) {
          xMin = x;
        }

        if (y > yMax) {
          yMax = y;
        } else if (y < yMin) {
          yMin = y;
        }
      }
    }
  }

  rawPath.centerX = (xMax + xMin) / 2;
  rawPath.centerY = (yMax + yMin) / 2;
  rawPath.left = xMin;
  rawPath.width = xMax - xMin;
  rawPath.top = yMin;
  rawPath.height = yMax - yMin;
  return rawPath.size = (xMax - xMin) * (yMax - yMin);
},
    _sortByComplexity = function _sortByComplexity(a, b) {
  return b.length - a.length;
},
    _sortBySize = function _sortBySize(a, b) {
  var sizeA = a.size || _getSize(a),
      sizeB = b.size || _getSize(b);

  return Math.abs(sizeB - sizeA) < (sizeA + sizeB) / 20 ? b.centerX - a.centerX || b.centerY - a.centerY : sizeB - sizeA;
},
    _offsetSegment = function _offsetSegment(segment, shapeIndex) {
  var a = segment.slice(0),
      l = segment.length,
      wrap = l - 2,
      i,
      index;
  shapeIndex = shapeIndex | 0;

  for (i = 0; i < l; i++) {
    index = (i + shapeIndex) % wrap;
    segment[i++] = a[index];
    segment[i] = a[index + 1];
  }
},
    _getTotalMovement = function _getTotalMovement(sb, eb, shapeIndex, offsetX, offsetY) {
  var l = sb.length,
      d = 0,
      wrap = l - 2,
      index,
      i,
      x,
      y;
  shapeIndex *= 6;

  for (i = 0; i < l; i += 6) {
    index = (i + shapeIndex) % wrap;
    y = sb[index] - (eb[i] - offsetX);
    x = sb[index + 1] - (eb[i + 1] - offsetY);
    d += _sqrt$1(x * x + y * y);
  }

  return d;
},
    _getClosestShapeIndex = function _getClosestShapeIndex(sb, eb, checkReverse) {
  var l = sb.length,
      sCenter = _getAverageXY(sb),
      eCenter = _getAverageXY(eb),
      offsetX = eCenter[0] - sCenter[0],
      offsetY = eCenter[1] - sCenter[1],
      min = _getTotalMovement(sb, eb, 0, offsetX, offsetY),
      minIndex = 0,
      copy,
      d,
      i;

  for (i = 6; i < l; i += 6) {
    d = _getTotalMovement(sb, eb, i / 6, offsetX, offsetY);

    if (d < min) {
      min = d;
      minIndex = i;
    }
  }

  if (checkReverse) {
    copy = sb.slice(0);
    reverseSegment(copy);

    for (i = 6; i < l; i += 6) {
      d = _getTotalMovement(copy, eb, i / 6, offsetX, offsetY);

      if (d < min) {
        min = d;
        minIndex = -i;
      }
    }
  }

  return minIndex / 6;
},
    _getClosestAnchor = function _getClosestAnchor(rawPath, x, y) {
  var j = rawPath.length,
      closestDistance = _bigNum,
      closestX = 0,
      closestY = 0,
      segment,
      dx,
      dy,
      d,
      i,
      l;

  while (--j > -1) {
    segment = rawPath[j];
    l = segment.length;

    for (i = 0; i < l; i += 6) {
      dx = segment[i] - x;
      dy = segment[i + 1] - y;
      d = _sqrt$1(dx * dx + dy * dy);

      if (d < closestDistance) {
        closestDistance = d;
        closestX = segment[i];
        closestY = segment[i + 1];
      }
    }
  }

  return [closestX, closestY];
},
    _getClosestSegment = function _getClosestSegment(bezier, pool, startIndex, sortRatio, offsetX, offsetY) {
  var l = pool.length,
      index = 0,
      minSize = Math.min(bezier.size || _getSize(bezier), pool[startIndex].size || _getSize(pool[startIndex])) * sortRatio,
      min = _bigNum,
      cx = bezier.centerX + offsetX,
      cy = bezier.centerY + offsetY,
      size,
      i,
      dx,
      dy,
      d;

  for (i = startIndex; i < l; i++) {
    size = pool[i].size || _getSize(pool[i]);

    if (size < minSize) {
      break;
    }

    dx = pool[i].centerX - cx;
    dy = pool[i].centerY - cy;
    d = _sqrt$1(dx * dx + dy * dy);

    if (d < min) {
      index = i;
      min = d;
    }
  }

  d = pool[index];
  pool.splice(index, 1);
  return d;
},
    _subdivideSegmentQty = function _subdivideSegmentQty(segment, quantity) {
  var tally = 0,
      max = 0.999999,
      l = segment.length,
      newPointsPerSegment = quantity / ((l - 2) / 6),
      ax,
      ay,
      cp1x,
      cp1y,
      cp2x,
      cp2y,
      bx,
      by,
      x1,
      y1,
      x2,
      y2,
      i,
      t;

  for (i = 2; i < l; i += 6) {
    tally += newPointsPerSegment;

    while (tally > max) {
      ax = segment[i - 2];
      ay = segment[i - 1];
      cp1x = segment[i];
      cp1y = segment[i + 1];
      cp2x = segment[i + 2];
      cp2y = segment[i + 3];
      bx = segment[i + 4];
      by = segment[i + 5];
      t = 1 / ((Math.floor(tally) || 1) + 1);
      x1 = ax + (cp1x - ax) * t;
      x2 = cp1x + (cp2x - cp1x) * t;
      x1 += (x2 - x1) * t;
      x2 += (cp2x + (bx - cp2x) * t - x2) * t;
      y1 = ay + (cp1y - ay) * t;
      y2 = cp1y + (cp2y - cp1y) * t;
      y1 += (y2 - y1) * t;
      y2 += (cp2y + (by - cp2y) * t - y2) * t;
      segment.splice(i, 4, ax + (cp1x - ax) * t, ay + (cp1y - ay) * t, x1, y1, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, x2, y2, cp2x + (bx - cp2x) * t, cp2y + (by - cp2y) * t);
      i += 6;
      l += 6;
      tally--;
    }
  }

  return segment;
},
    _equalizeSegmentQuantity = function _equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe) {
  var dif = end.length - start.length,
      longer = dif > 0 ? end : start,
      shorter = dif > 0 ? start : end,
      added = 0,
      sortMethod = map === 'complexity' ? _sortByComplexity : _sortBySize,
      sortRatio = map === 'position' ? 0 : typeof map === 'number' ? map : 0.8,
      i = shorter.length,
      shapeIndices = typeof shapeIndex === 'object' && shapeIndex.push ? shapeIndex.slice(0) : [shapeIndex],
      reverse = shapeIndices[0] === 'reverse' || shapeIndices[0] < 0,
      log = shapeIndex === 'log',
      eb,
      sb,
      b,
      x,
      y,
      offsetX,
      offsetY;

  if (!shorter[0]) {
    return;
  }

  if (longer.length > 1) {
    start.sort(sortMethod);
    end.sort(sortMethod);
    offsetX = longer.size || _getTotalSize(longer);
    offsetX = shorter.size || _getTotalSize(shorter);
    offsetX = longer.centerX - shorter.centerX;
    offsetY = longer.centerY - shorter.centerY;

    if (sortMethod === _sortBySize) {
      for (i = 0; i < shorter.length; i++) {
        longer.splice(i, 0, _getClosestSegment(shorter[i], longer, i, sortRatio, offsetX, offsetY));
      }
    }
  }

  if (dif) {
    if (dif < 0) {
      dif = -dif;
    }

    if (longer[0].length > shorter[0].length) {
      _subdivideSegmentQty(shorter[0], (longer[0].length - shorter[0].length) / 6 | 0);
    }

    i = shorter.length;

    while (added < dif) {
      x = longer[i].size || _getSize(longer[i]);
      b = _getClosestAnchor(shorter, longer[i].centerX, longer[i].centerY);
      x = b[0];
      y = b[1];
      shorter[i++] = [x, y, x, y, x, y, x, y];
      shorter.totalPoints += 8;
      added++;
    }
  }

  for (i = 0; i < start.length; i++) {
    eb = end[i];
    sb = start[i];
    dif = eb.length - sb.length;

    if (dif < 0) {
      _subdivideSegmentQty(eb, -dif / 6 | 0);
    } else if (dif > 0) {
      _subdivideSegmentQty(sb, dif / 6 | 0);
    }

    if (reverse && fillSafe !== false && !sb.reversed) {
      reverseSegment(sb);
    }

    shapeIndex = shapeIndices[i] || shapeIndices[i] === 0 ? shapeIndices[i] : 'auto';

    if (shapeIndex) {
      if (sb.closed || Math.abs(sb[0] - sb[sb.length - 2]) < 0.5 && Math.abs(sb[1] - sb[sb.length - 1]) < 0.5) {
        if (shapeIndex === 'auto' || shapeIndex === 'log') {
          shapeIndices[i] = shapeIndex = _getClosestShapeIndex(sb, eb, !i || fillSafe === false);

          if (shapeIndex < 0) {
            reverse = true;
            reverseSegment(sb);
            shapeIndex = -shapeIndex;
          }

          _offsetSegment(sb, shapeIndex * 6);
        } else if (shapeIndex !== 'reverse') {
          if (i && shapeIndex < 0) {
            reverseSegment(sb);
          }

          _offsetSegment(sb, (shapeIndex < 0 ? -shapeIndex : shapeIndex) * 6);
        }
      } else if (!reverse && (shapeIndex === 'auto' && Math.abs(eb[0] - sb[0]) + Math.abs(eb[1] - sb[1]) + Math.abs(eb[eb.length - 2] - sb[sb.length - 2]) + Math.abs(eb[eb.length - 1] - sb[sb.length - 1]) > Math.abs(eb[0] - sb[sb.length - 2]) + Math.abs(eb[1] - sb[sb.length - 1]) + Math.abs(eb[eb.length - 2] - sb[0]) + Math.abs(eb[eb.length - 1] - sb[1]) || shapeIndex % 2)) {
        reverseSegment(sb);
        shapeIndices[i] = -1;
        reverse = true;
      } else if (shapeIndex === 'auto') {
        shapeIndices[i] = 0;
      } else if (shapeIndex === 'reverse') {
        shapeIndices[i] = -1;
      }

      if (sb.closed !== eb.closed) {
        sb.closed = eb.closed = false;
      }
    }
  }

  if (log) {
    _log('shapeIndex:[' + shapeIndices.join(',') + ']');
  }

  start.shapeIndex = shapeIndices;
  return shapeIndices;
},
    _pathFilter = function _pathFilter(a, shapeIndex, map, precompile, fillSafe) {
  var start = stringToRawPath(a[0]),
      end = stringToRawPath(a[1]);

  if (!_equalizeSegmentQuantity(start, end, shapeIndex || shapeIndex === 0 ? shapeIndex : 'auto', map, fillSafe)) {
    return;
  }

  a[0] = rawPathToString(start);
  a[1] = rawPathToString(end);

  if (precompile === 'log' || precompile === true) {
    _log('precompile:["' + a[0] + '","' + a[1] + '"]');
  }
},
    _offsetPoints = function _offsetPoints(text, offset) {
  if (!offset) {
    return text;
  }

  var a = text.match(_numExp) || [],
      l = a.length,
      s = '',
      inc,
      i,
      j;

  if (offset === 'reverse') {
    i = l - 1;
    inc = -2;
  } else {
    i = ((parseInt(offset, 10) || 0) * 2 + 1 + l * 100) % l;
    inc = 2;
  }

  for (j = 0; j < l; j += 2) {
    s += a[i - 1] + ',' + a[i] + ' ';
    i = (i + inc) % l;
  }

  return s;
},
    _equalizePointQuantity = function _equalizePointQuantity(a, quantity) {
  var tally = 0,
      x = parseFloat(a[0]),
      y = parseFloat(a[1]),
      s = x + ',' + y + ' ',
      max = 0.999999,
      newPointsPerSegment,
      i,
      l,
      j,
      factor,
      nextX,
      nextY;
  l = a.length;
  newPointsPerSegment = quantity * 0.5 / (l * 0.5 - 1);

  for (i = 0; i < l - 2; i += 2) {
    tally += newPointsPerSegment;
    nextX = parseFloat(a[i + 2]);
    nextY = parseFloat(a[i + 3]);

    if (tally > max) {
      factor = 1 / (Math.floor(tally) + 1);
      j = 1;

      while (tally > max) {
        s += (x + (nextX - x) * factor * j).toFixed(2) + ',' + (y + (nextY - y) * factor * j).toFixed(2) + ' ';
        tally--;
        j++;
      }
    }

    s += nextX + ',' + nextY + ' ';
    x = nextX;
    y = nextY;
  }

  return s;
},
    _pointsFilter = function _pointsFilter(a) {
  var startNums = a[0].match(_numExp) || [],
      endNums = a[1].match(_numExp) || [],
      dif = endNums.length - startNums.length;

  if (dif > 0) {
    a[0] = _equalizePointQuantity(startNums, dif);
  } else {
    a[1] = _equalizePointQuantity(endNums, -dif);
  }
},
    _buildPointsFilter = function _buildPointsFilter(shapeIndex) {
  return !isNaN(shapeIndex) ? function (a) {
    _pointsFilter(a);

    a[1] = _offsetPoints(a[1], parseInt(shapeIndex, 10));
  } : _pointsFilter;
},
    _parseShape = function _parseShape(shape, forcePath, target) {
  var isString = typeof shape === 'string',
      e,
      type;

  if (!isString || _selectorExp$1.test(shape) || (shape.match(_numExp) || []).length < 3) {
    e = _toArray(shape)[0];

    if (e) {
      type = (e.nodeName + '').toUpperCase();

      if (forcePath && type !== 'PATH') {
        e = convertToPath(e, false);
        type = 'PATH';
      }

      shape = e.getAttribute(type === 'PATH' ? 'd' : 'points') || '';

      if (e === target) {
        shape = e.getAttributeNS(null, 'data-original') || shape;
      }
    } else {
      _log('WARNING: invalid morph to: ' + shape);

      shape = false;
    }
  }

  return shape;
},
    _populateSmoothData = function _populateSmoothData(rawPath, tolerance) {
  var j = rawPath.length,
      limit = 0.2 * (tolerance || 1),
      smooth,
      segment,
      x,
      y,
      x2,
      y2,
      i,
      l,
      a,
      a2,
      isSmooth,
      smoothData;

  while (--j > -1) {
    segment = rawPath[j];
    isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
    smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
    isSmooth.length = 4;
    l = segment.length - 2;

    for (i = 6; i < l; i += 6) {
      x = segment[i] - segment[i - 2];
      y = segment[i + 1] - segment[i - 1];
      x2 = segment[i + 2] - segment[i];
      y2 = segment[i + 3] - segment[i + 1];
      a = _atan2(y, x);
      a2 = _atan2(y2, x2);
      smooth = Math.abs(a - a2) < limit;

      if (smooth) {
        smoothData[i - 2] = a;
        smoothData[i + 2] = a2;
        smoothData[i - 1] = _sqrt$1(x * x + y * y);
        smoothData[i + 3] = _sqrt$1(x2 * x2 + y2 * y2);
      }

      isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
    }

    if (segment[l] === segment[0] && segment[l + 1] === segment[1]) {
      x = segment[0] - segment[l - 2];
      y = segment[1] - segment[l - 1];
      x2 = segment[2] - segment[0];
      y2 = segment[3] - segment[1];
      a = _atan2(y, x);
      a2 = _atan2(y2, x2);

      if (Math.abs(a - a2) < limit) {
        smoothData[l - 2] = a;
        smoothData[2] = a2;
        smoothData[l - 1] = _sqrt$1(x * x + y * y);
        smoothData[3] = _sqrt$1(x2 * x2 + y2 * y2);
        isSmooth[l - 2] = isSmooth[l - 1] = true;
      }
    }
  }

  return rawPath;
},
    _parseOriginFactors = function _parseOriginFactors(v) {
  var a = v.trim().split(' '),
      x = ~v.indexOf('left') ? 0 : ~v.indexOf('right') ? 100 : isNaN(parseFloat(a[0])) ? 50 : parseFloat(a[0]),
      y = ~v.indexOf('top') ? 0 : ~v.indexOf('bottom') ? 100 : isNaN(parseFloat(a[1])) ? 50 : parseFloat(a[1]);
  return {
    x: x / 100,
    y: y / 100
  };
},
    _shortAngle = function _shortAngle(dif) {
  return dif !== dif % _PI ? dif + (dif < 0 ? _2PI : -_2PI) : dif;
},
    _morphMessage = 'Use MorphSVGPlugin.convertToPath() to convert to a path before morphing.',
    _tweenRotation = function _tweenRotation(start, end, i, linkedPT) {
  var so = this._origin,
      eo = this._eOrigin,
      dx = start[i] - so.x,
      dy = start[i + 1] - so.y,
      d = _sqrt$1(dx * dx + dy * dy),
      sa = _atan2(dy, dx),
      angleDif,
      _short;

  dx = end[i] - eo.x;
  dy = end[i + 1] - eo.y;
  angleDif = _atan2(dy, dx) - sa;
  _short = _shortAngle(angleDif);

  if (!linkedPT && _lastLinkedAnchor && Math.abs(_short + _lastLinkedAnchor.ca) < _angleMin) {
    linkedPT = _lastLinkedAnchor;
  }

  return this._anchorPT = _lastLinkedAnchor = {
    _next: this._anchorPT,
    t: start,
    sa: sa,
    ca: linkedPT && _short * linkedPT.ca < 0 && Math.abs(_short) > _angleMax ? angleDif : _short,
    sl: d,
    cl: _sqrt$1(dx * dx + dy * dy) - d,
    i: i
  };
},
    _initCore = function _initCore(required) {
  gsap = _getGSAP();
  PluginClass = PluginClass || gsap && gsap.plugins.morphSVG;

  if (gsap && PluginClass) {
    _toArray = gsap.utils.toArray;
    PluginClass.prototype._tweenRotation = _tweenRotation;
    _coreInitted = 1;
  } else if (required) {
    _log('Please gsap.registerPlugin(MorphSVGPlugin)');
  }
};

var MorphSVGPlugin = {
  version: '3.0.5',
  name: 'morphSVG',
  register: function register(core, Plugin) {
    gsap = core;
    PluginClass = Plugin;

    _initCore();
  },
  init: function init(target, value, tween, index, targets) {
    var cs = target.nodeType ? window.getComputedStyle(target) : {},
        fill = cs.fill + '',
        fillSafe = !(fill === 'none' || (fill.match(_numExp) || [])[3] === '0' || cs.fillRule === 'evenodd'),
        origins = (value.origin || '50 50').split(','),
        type,
        p,
        pt,
        shape,
        isPoly,
        shapeIndex,
        map,
        startSmooth,
        endSmooth,
        start,
        end,
        i,
        j,
        l,
        startSeg,
        endSeg,
        precompiled,
        sData,
        eData,
        originFactors,
        useRotation,
        offset;

    if (!_coreInitted) {
      _initCore(1);
    }

    type = (target.nodeName + '').toUpperCase();
    isPoly = type === 'POLYLINE' || type === 'POLYGON';

    if (type !== 'PATH' && !isPoly && !value.prop) {
      _log('Cannot morph a <' + type + '> element. ' + _morphMessage);

      return false;
    }

    p = type === 'PATH' ? 'd' : 'points';

    if (typeof value === 'string' || value.getBBox || value[0]) {
      value = {
        shape: value
      };
    }

    if (!value.prop && typeof target.setAttribute !== 'function') {
      return false;
    }

    shape = _parseShape(value.shape || value.d || value.points || '', p === 'd', target);

    if (isPoly && _commands.test(shape)) {
      _log('A <' + type + '> cannot accept path data. ' + _morphMessage);

      return false;
    }

    shapeIndex = value.shapeIndex || value.shapeIndex === 0 ? value.shapeIndex : 'auto';
    map = value.map || MorphSVGPlugin.defaultMap;
    this._prop = value.prop;
    this._render = value.render || MorphSVGPlugin.defaultRender;
    this._apply = 'updateTarget' in value ? value.updateTarget : MorphSVGPlugin.defaultUpdateTarget;
    this._rnd = Math.pow(10, isNaN(value.precision) ? 2 : +value.precision);
    this._tween = tween;

    if (shape) {
      this._target = target;
      precompiled = typeof value.precompile === 'object';
      start = this._prop ? target[this._prop] : target.getAttribute(p);

      if (!this._prop && !target.getAttributeNS(null, 'data-original')) {
        target.setAttributeNS(null, 'data-original', start);
      }

      if (p === 'd' || this._prop) {
        start = stringToRawPath(precompiled ? value.precompile[0] : start);
        end = stringToRawPath(precompiled ? value.precompile[1] : shape);

        if (!precompiled && !_equalizeSegmentQuantity(start, end, shapeIndex, map, fillSafe)) {
          return false;
        }

        if (value.precompile === 'log' || value.precompile === true) {
          _log('precompile:["' + rawPathToString(start) + '","' + rawPathToString(end) + '"]');
        }

        useRotation = (value.type || MorphSVGPlugin.defaultType) !== 'linear';

        if (useRotation) {
          start = _populateSmoothData(start, value.smoothTolerance);
          end = _populateSmoothData(end, value.smoothTolerance);

          if (!start.size) {
            _getTotalSize(start);
          }

          if (!end.size) {
            _getTotalSize(end);
          }

          originFactors = _parseOriginFactors(origins[0]);
          this._origin = start.origin = {
            x: start.left + originFactors.x * start.width,
            y: start.top + originFactors.y * start.height
          };

          if (origins[1]) {
            originFactors = _parseOriginFactors(origins[1]);
          }

          this._eOrigin = {
            x: end.left + originFactors.x * end.width,
            y: end.top + originFactors.y * end.height
          };
        }

        this._rawPath = target._gsRawPath = start;
        j = start.length;

        while (--j > -1) {
          startSeg = start[j];
          endSeg = end[j];
          startSmooth = startSeg.isSmooth || [];
          endSmooth = endSeg.isSmooth || [];
          l = startSeg.length;
          _lastLinkedAnchor = 0;

          for (i = 0; i < l; i += 2) {
            if (endSeg[i] !== startSeg[i] || endSeg[i + 1] !== startSeg[i + 1]) {
              if (useRotation) {
                if (startSmooth[i] && endSmooth[i]) {
                  sData = startSeg.smoothData;
                  eData = endSeg.smoothData;
                  offset = i + (i === l - 4 ? 7 - l : 5);
                  this._controlPT = {
                    _next: this._controlPT,
                    i: i,
                    j: j,
                    l1s: sData[i + 1],
                    l1c: eData[i + 1] - sData[i + 1],
                    l2s: sData[offset],
                    l2c: eData[offset] - sData[offset]
                  };
                  pt = this._tweenRotation(startSeg, endSeg, i + 2);

                  this._tweenRotation(startSeg, endSeg, i, pt);

                  this._tweenRotation(startSeg, endSeg, offset - 1, pt);

                  i += 4;
                } else {
                  this._tweenRotation(startSeg, endSeg, i);
                }
              } else {
                pt = this.add(startSeg, i, startSeg[i], endSeg[i]);
                pt = this.add(startSeg, i + 1, startSeg[i + 1], endSeg[i + 1]) || pt;
              }
            }
          }
        }
      } else {
        pt = this.add(target, 'setAttribute', target.getAttribute(p) + '', shape + '', index, targets, 0, _buildPointsFilter(shapeIndex), p);
      }

      if (useRotation) {
        this.add(this._origin, 'x', this._origin.x, this._eOrigin.x);
        pt = this.add(this._origin, 'y', this._origin.y, this._eOrigin.y);
      }

      if (pt) {
        this._props.push('morphSVG');

        pt.end = shape;
        pt.endProp = p;
      }
    }

    return _bonusValidated;
  },
  render: function render(ratio, data) {
    var rawPath = data._rawPath,
        controlPT = data._controlPT,
        anchorPT = data._anchorPT,
        rnd = data._rnd,
        target = data._target,
        pt = data._pt,
        s,
        space,
        easeInOut,
        segment,
        l,
        angle,
        i,
        j,
        x,
        y,
        sin,
        cos,
        offset;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }

    if (ratio === 1 && data._apply) {
      pt = data._pt;

      while (pt) {
        if (pt.end) {
          if (data._prop) {
            target[data._prop] = pt.end;
          } else {
            target.setAttribute(pt.endProp, pt.end);
          }
        }

        pt = pt._next;
      }
    } else if (rawPath) {
      while (anchorPT) {
        angle = anchorPT.sa + ratio * anchorPT.ca;
        l = anchorPT.sl + ratio * anchorPT.cl;
        anchorPT.t[anchorPT.i] = data._origin.x + _cos$1(angle) * l;
        anchorPT.t[anchorPT.i + 1] = data._origin.y + _sin$1(angle) * l;
        anchorPT = anchorPT._next;
      }

      easeInOut = ratio < 0.5 ? 2 * ratio * ratio : (4 - 2 * ratio) * ratio - 1;

      while (controlPT) {
        i = controlPT.i;
        segment = rawPath[controlPT.j];
        offset = i + (i === segment.length - 4 ? 7 - segment.length : 5);
        angle = _atan2(segment[offset] - segment[i + 1], segment[offset - 1] - segment[i]);
        sin = _sin$1(angle);
        cos = _cos$1(angle);
        x = segment[i + 2];
        y = segment[i + 3];
        l = controlPT.l1s + easeInOut * controlPT.l1c;
        segment[i] = x - cos * l;
        segment[i + 1] = y - sin * l;
        l = controlPT.l2s + easeInOut * controlPT.l2c;
        segment[offset - 1] = x + cos * l;
        segment[offset] = y + sin * l;
        controlPT = controlPT._next;
      }

      target._gsRawPath = rawPath;

      if (data._apply) {
        s = '';
        space = ' ';

        for (j = 0; j < rawPath.length; j++) {
          segment = rawPath[j];
          l = segment.length;
          s += 'M' + (segment[0] * rnd | 0) / rnd + space + (segment[1] * rnd | 0) / rnd + ' C';

          for (i = 2; i < l; i++) {
            s += (segment[i] * rnd | 0) / rnd + space;
          }
        }

        if (data._prop) {
          target[data._prop] = s;
        } else {
          target.setAttribute('d', s);
        }
      }
    }

    if (data._render && rawPath) {
      data._render.call(data._tween, rawPath, target);
    }
  },
  kill: function kill(property) {
    this._pt = this._rawPath = 0;
  },
  getRawPath: getRawPath,
  stringToRawPath: stringToRawPath,
  rawPathToString: rawPathToString,
  pathFilter: _pathFilter,
  pointsFilter: _pointsFilter,
  getTotalSize: _getTotalSize,
  equalizeSegmentQuantity: _equalizeSegmentQuantity,
  convertToPath: function convertToPath$1(targets, swap) {
    return _toArray(targets).map(function (target) {
      return convertToPath(target, swap !== false);
    });
  },
  defaultType: 'linear',
  defaultUpdateTarget: true,
  defaultMap: 'size'
};
_getGSAP() && gsap.registerPlugin(MorphSVGPlugin);

var gsap$1,
    _toArray$1,
    _win,
    _isEdge,
    _coreInitted$1,
    _windowExists = function _windowExists() {
  return typeof window !== 'undefined';
},
    _getGSAP$1 = function _getGSAP() {
  return gsap$1 || _windowExists() && (gsap$1 = window.gsap) && gsap$1.registerPlugin && gsap$1;
},
    _numExp$1 = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
    _types = {
  rect: ['width', 'height'],
  circle: ['r', 'r'],
  ellipse: ['rx', 'ry'],
  line: ['x2', 'y2']
},
    _round$1 = function _round(value) {
  return Math.round(value * 10000) / 10000;
},
    _parseNum = function _parseNum(value) {
  return parseFloat(value || 0);
},
    _getAttributeAsNumber = function _getAttributeAsNumber(target, attr) {
  return _parseNum(target.getAttribute(attr));
},
    _sqrt$2 = Math.sqrt,
    _getDistance = function _getDistance(x1, y1, x2, y2, scaleX, scaleY) {
  return _sqrt$2(Math.pow((_parseNum(x2) - _parseNum(x1)) * scaleX, 2) + Math.pow((_parseNum(y2) - _parseNum(y1)) * scaleY, 2));
},
    _warn = function _warn(message) {
  return console.warn(message);
},
    _hasNonScalingStroke = function _hasNonScalingStroke(target) {
  return target.getAttribute('vector-effect') === 'non-scaling-stroke';
},
    _bonusValidated$1 = 1,
    _parse = function _parse(value, length, defaultStart) {
  var i = value.indexOf(' '),
      s,
      e;

  if (i < 0) {
    s = defaultStart !== undefined ? defaultStart + '' : value;
    e = value;
  } else {
    s = value.substr(0, i);
    e = value.substr(i + 1);
  }

  s = ~s.indexOf('%') ? _parseNum(s) / 100 * length : _parseNum(s);
  e = ~e.indexOf('%') ? _parseNum(e) / 100 * length : _parseNum(e);
  return s > e ? [e, s] : [s, e];
},
    _getLength = function _getLength(target) {
  target = _toArray$1(target)[0];

  if (!target) {
    return 0;
  }

  var type = target.tagName.toLowerCase(),
      style = target.style,
      scaleX = 1,
      scaleY = 1,
      length,
      bbox,
      points,
      prevPoint,
      i,
      rx,
      ry;

  if (_hasNonScalingStroke(target)) {
    scaleY = target.getScreenCTM();
    scaleX = _sqrt$2(scaleY.a * scaleY.a + scaleY.b * scaleY.b);
    scaleY = _sqrt$2(scaleY.d * scaleY.d + scaleY.c * scaleY.c);
  }

  try {
    bbox = target.getBBox();
  } catch (e) {
    _warn("Some browsers won't measure invisible elements (like display:none or masks inside defs).");
  }

  var _ref = bbox || {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
      x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height;

  if ((!bbox || !width && !height) && _types[type]) {
    width = _getAttributeAsNumber(target, _types[type][0]);
    height = _getAttributeAsNumber(target, _types[type][1]);

    if (type !== 'rect' && type !== 'line') {
      width *= 2;
      height *= 2;
    }

    if (type === 'line') {
      x = _getAttributeAsNumber(target, 'x1');
      y = _getAttributeAsNumber(target, 'y1');
      width = Math.abs(width - x);
      height = Math.abs(height - y);
    }
  }

  if (type === 'path') {
    prevPoint = style.strokeDasharray;
    style.strokeDasharray = 'none';
    length = target.getTotalLength() || 0;

    if (scaleX !== scaleY) {
      _warn("Warning: <path> length cannot be measured when vector-effect is non-scaling-stroke and the element isn't proportionally scaled.");
    }

    length *= (scaleX + scaleY) / 2;
    style.strokeDasharray = prevPoint;
  } else if (type === 'rect') {
    length = width * 2 * scaleX + height * 2 * scaleY;
  } else if (type === 'line') {
    length = _getDistance(x, y, x + width, y + height, scaleX, scaleY);
  } else if (type === 'polyline' || type === 'polygon') {
    points = target.getAttribute('points').match(_numExp$1) || [];

    if (type === 'polygon') {
      points.push(points[0], points[1]);
    }

    length = 0;

    for (i = 2; i < points.length; i += 2) {
      length += _getDistance(points[i - 2], points[i - 1], points[i], points[i + 1], scaleX, scaleY) || 0;
    }
  } else if (type === 'circle' || type === 'ellipse') {
    rx = width / 2 * scaleX;
    ry = height / 2 * scaleY;
    length = Math.PI * (3 * (rx + ry) - _sqrt$2((3 * rx + ry) * (rx + 3 * ry)));
  }

  return length || 0;
},
    _getPosition = function _getPosition(target, length) {
  target = _toArray$1(target)[0];

  if (!target) {
    return [0, 0];
  }

  if (!length) {
    length = _getLength(target) + 1;
  }

  var cs = _win.getComputedStyle(target),
      dash = cs.strokeDasharray || '',
      offset = _parseNum(cs.strokeDashoffset),
      i = dash.indexOf(',');

  if (i < 0) {
    i = dash.indexOf(' ');
  }

  dash = i < 0 ? length : _parseNum(dash.substr(0, i)) || 1e-5;

  if (dash > length) {
    dash = length;
  }

  return [Math.max(0, -offset), Math.max(0, dash - offset)];
},
    _initCore$1 = function _initCore() {
  if (_windowExists()) {
    _win = window;
    _coreInitted$1 = gsap$1 = _getGSAP$1();
    _toArray$1 = gsap$1.utils.toArray;
    _isEdge = ((_win.navigator || {}).userAgent || '').indexOf('Edge') !== -1;
  }
};

var DrawSVGPlugin = {
  version: '3.0.5',
  name: 'drawSVG',
  register: function register(core) {
    gsap$1 = core;

    _initCore$1();
  },
  init: function init(target, value, tween, index, targets) {
    if (!target.getBBox) {
      return false;
    }

    if (!_coreInitted$1) {
      _initCore$1();
    }

    var length = _getLength(target) + 1,
        start,
        end,
        overage,
        cs;
    this._style = target.style;
    this._target = target;

    if (value + '' === 'true') {
      value = '0 100%';
    } else if (!value) {
      value = '0 0';
    } else if ((value + '').indexOf(' ') === -1) {
      value = '0 ' + value;
    }

    start = _getPosition(target, length);
    end = _parse(value, length, start[0]);
    this._length = _round$1(length + 10);

    if (start[0] === 0 && end[0] === 0) {
      overage = Math.max(0.00001, end[1] - length);
      this._dash = _round$1(length + overage);
      this._offset = _round$1(length - start[1] + overage);
      this._offsetPT = this.add(this, '_offset', this._offset, _round$1(length - end[1] + overage));
    } else {
      this._dash = _round$1(start[1] - start[0]) || 0.000001;
      this._offset = _round$1(-start[0]);
      this._dashPT = this.add(this, '_dash', this._dash, _round$1(end[1] - end[0]) || 0.00001);
      this._offsetPT = this.add(this, '_offset', this._offset, _round$1(-end[0]));
    }

    if (_isEdge) {
      cs = _win.getComputedStyle(target);

      if (cs.strokeLinecap !== cs.strokeLinejoin) {
        end = _parseNum(cs.strokeMiterlimit);
        this.add(target.style, 'strokeMiterlimit', end, end + 0.01);
      }
    }

    this._live = _hasNonScalingStroke(target) || ~(value + '').indexOf('live');

    this._props.push('drawSVG');

    return _bonusValidated$1;
  },
  render: function render(ratio, data) {
    var pt = data._pt,
        style = data._style,
        length,
        lengthRatio,
        dash,
        offset;

    if (pt) {
      if (data._live) {
        length = _getLength(data._target) + 11;

        if (length !== data._length) {
          lengthRatio = length / data._length;
          data._length = length;
          data._offsetPT.s *= lengthRatio;
          data._offsetPT.c *= lengthRatio;

          if (data._dashPT) {
            data._dashPT.s *= lengthRatio;
            data._dashPT.c *= lengthRatio;
          } else {
            data._dash *= lengthRatio;
          }
        }
      }

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      dash = data._dash;
      offset = data._offset;
      length = data._length;
      style.strokeDashoffset = data._offset;

      if (ratio === 1 || !ratio) {
        if (dash - offset < 0.001 && length - dash <= 10) {
          style.strokeDashoffset = offset + 1;
        }

        style.strokeDasharray = offset < 0.001 && length - dash <= 10 ? 'none' : offset === dash ? '0px, 999999px' : dash + 'px,' + length + 'px';
      } else {
        style.strokeDasharray = dash + 'px,' + length + 'px';
      }
    }
  },
  getLength: _getLength,
  getPosition: _getPosition
};
_getGSAP$1() && gsap$1.registerPlugin(DrawSVGPlugin);

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
                return Promise.resolve(gsap$2.to(element, {
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
                  return Promise.resolve(gsap$2.to(path, {
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
                return Promise.resolve(gsap$2.to(element, {
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
gsap$2.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

function colorFromGroupId(id) {
  if (id === 'g0') return 'black';
  return '#' + id.slice(1);
}

var whiteListedColors = ['#00d56f'];
var DEFAULT_TIMING = 0.4;

var allColors = ['#ff8a80', '#ea80fc', '#b388ff', '#8c9eff', '#82b1ff', '#80d8ff', '#84ffff', '#a7ffeb', '#b9f6ca', '#ccff90', '#f4ff81', '#ffff8d', '#ffe57f', '#ffd180', '#ff9e80'];

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
  useIsomorphicLayoutEffect(function () {
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

  var resolved;

  if (typeof type === 'function') {
    resolved = type(_extends({}, props));
  } else if (typeof type === 'object' && type.$$typeof === Symbol["for"]('react.forward_ref') && typeof (type === null || type === void 0 ? void 0 : type.render) === 'function') {
    resolved = type.render(props, node === null || node === void 0 ? void 0 : node.ref);
  } else {
    console.log('static analysis: type was not function ...', node, type);
  }

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

    var props = _objectWithoutPropertiesLoose(_ref4, ["slide", "steps"]);

    var accumulatedInfo = infos[infos.length - 1];

    var newInfo = _extends({}, accumulatedInfo);

    for (var key in props) {
      newInfo[key] = props[key];
    }

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

  if (typeof slide.props.children !== 'function') {
    findElementsInTree(slide, function (node) {
      return typeof node.type === 'function' && node.type === Morph;
    }).forEach(function (node) {
      if (node.props.replace) {
        if (node.props.children) {
          allLaTeX.push(wrapMathBasedOnProps(node.props, node.props.children));
        }
      }
    });
    return {
      animations: [],
      allLaTeX: allLaTeX
    };
  }

  if (!slide.props.steps) return defaultResult;
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
  var props = _extends({}, _ref);

  if (props.embed) {
    return React__default.createElement(PresentationEmbedWrapper, Object.assign({}, props));
  }

  return React__default.createElement(reactRouterDom.BrowserRouter, null, React__default.createElement(reactRouterDom.Switch, null, React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: '/storage'
  }, React__default.createElement(Storage, null)), React__default.createElement(reactRouterDom.Route, {
    path: '/presenter/:slideIndex?/:stepIndex?'
  }, React__default.createElement(PresentationRouteWrapper, Object.assign({}, props, {
    mode: 'presenter'
  }))), React__default.createElement(reactRouterDom.Route, {
    path: '/fullscreen/:slideIndex?/:stepIndex?'
  }, React__default.createElement(PresentationRouteWrapper, Object.assign({}, props, {
    mode: 'fullscreen'
  }))), React__default.createElement(reactRouterDom.Route, {
    path: '/overview'
  }, React__default.createElement(PresentationOverview, Object.assign({}, props))), React__default.createElement(reactRouterDom.Route, {
    path: '/:slideIndex?/:stepIndex?',
    exact: false
  }, React__default.createElement(PresentationRouteWrapper, Object.assign({}, props, {
    mode: 'edit'
  })))));
}

function PresentationEmbedWrapper(_ref2) {
  var _props$embedOptions, _props$embedOptions2;

  var props = _extends({}, _ref2);

  var _useState = React.useState(props === null || props === void 0 ? void 0 : (_props$embedOptions = props.embedOptions) === null || _props$embedOptions === void 0 ? void 0 : _props$embedOptions.slideIndex),
      slideIndex = _useState[0],
      setSlideIndex = _useState[1];

  var _useState2 = React.useState(props === null || props === void 0 ? void 0 : (_props$embedOptions2 = props.embedOptions) === null || _props$embedOptions2 === void 0 ? void 0 : _props$embedOptions2.slideIndex),
      stepIndex = _useState2[0],
      setStepIndex = _useState2[1];

  return React__default.createElement(PresentationUI, Object.assign({}, props, {
    mode: 'embed',
    stepIndex: stepIndex || 0,
    slideIndex: slideIndex || 0,
    setSlideAndStep: function setSlideAndStep(slide, step) {
      setSlideIndex(slide);
      setStepIndex(step);
    }
  }));
}

function PresentationRouteWrapper(_ref3) {
  var props = _extends({}, _ref3);

  var match = reactRouterDom.useRouteMatch();
  var history = reactRouterDom.useHistory();

  var setSlideAndStep = function setSlideAndStep(slideIndex, stepIndex, notify) {
    if (notify === void 0) {
      notify = true;
    }

    history.push(reactRouterDom.generatePath(match.path, {
      slideIndex: slideIndex,
      stepIndex: stepIndex
    }));

    if (notify) {
      try {
        ws.send(JSON.stringify({
          slideIndex: slideIndex,
          stepIndex: stepIndex
        }));
      } catch (e) {
        console.log('Could not send message to ', ws);
      }
    }
  };

  var ws = React.useMemo(function () {
    return new WebSocket("ws://" + window.location.hostname + ":3003");
  }, []);

  ws.onmessage = function (message) {
    try {
      var _JSON$parse = JSON.parse(message.data),
          _slideIndex = _JSON$parse.slideIndex,
          _stepIndex = _JSON$parse.stepIndex;

      setSlideAndStep(_slideIndex, _stepIndex, false);
    } catch (e) {
      console.log('Could not parse', message.data, e);
    }
  };

  var _useParams = reactRouterDom.useParams(),
      _useParams$slideIndex = _useParams.slideIndex,
      slideIndexString = _useParams$slideIndex === void 0 ? '0' : _useParams$slideIndex,
      _useParams$stepIndex = _useParams.stepIndex,
      stepIndexString = _useParams$stepIndex === void 0 ? '0' : _useParams$stepIndex;

  var slideIndex = parseInt(slideIndexString);
  var stepIndex = parseInt(stepIndexString);
  return React__default.createElement(PresentationUI, Object.assign({}, props, {
    stepIndex: stepIndex,
    slideIndex: slideIndex,
    setSlideAndStep: setSlideAndStep
  }));
}

var PresentationContext = React__default.createContext(null);

function PresentationUI(_ref4) {
  var children = _ref4.children,
      render = _ref4.render,
      bibUrl = _ref4.bibUrl,
      _ref4$preamble = _ref4.preamble,
      preamble = _ref4$preamble === void 0 ? '' : _ref4$preamble,
      _ref4$compileHost = _ref4.compileHost,
      compileHost = _ref4$compileHost === void 0 ? '' : _ref4$compileHost,
      mode = _ref4.mode,
      embedOptions = _ref4.embedOptions,
      _ref4$setSlideAndStep = _ref4.setSlideAndStep,
      setSlideAndStep = _ref4$setSlideAndStep === void 0 ? function () {} : _ref4$setSlideAndStep,
      slideIndex = _ref4.slideIndex,
      stepIndex = _ref4.stepIndex;
  var reactSlides = React__default.Children.toArray(children);

  var _useMemo = React.useMemo(function () {
    return getSlidesInfo(reactSlides);
  }, [children]),
      slidesInfo = _useMemo.slidesInfo,
      citationMap = _useMemo.citationMap;

  useIsomorphicLayoutEffect(function () {
    LaTeX.setPreamble(preamble);

    if (compileHost) {
      console.log('setting host to', compileHost);
      LaTeX.setHost(compileHost);
    }
  }, []);

  var _useState3 = React.useState({}),
      transitions = _useState3[0],
      setTransitions = _useState3[1];

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

  if (slideIndex >= slidesInfo.length) {
    setSlideAndStep(slidesInfo.length - 1, slidesInfo[slidesInfo.length - 1].steps.length - 1);
    return null;
  }

  if (stepIndex >= slidesInfo[slideIndex].steps.length) {
    setSlideAndStep(slideIndex, slidesInfo[slideIndex].steps.length - 1);
    return null;
  }

  if (mode === 'presenter') {
    var slides = [[slideIndex, stepIndex], getNext(slideIndex, stepIndex)].map(function (_ref5, index) {
      var slideIndex = _ref5[0],
          stepIndex = _ref5[1];
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

  if (mode === 'fullscreen') {
    return React__default.createElement("div", {
      className: 'flex justify-center items-center bg-white h-screen'
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

  if (mode === 'embed') {
    if (!(embedOptions === null || embedOptions === void 0 ? void 0 : embedOptions.render)) {
      return React__default.createElement("div", null, "Specify embed render function");
    }

    return embedOptions.render({
      next: next,
      prev: prev,
      slideIndex: slideIndex,
      slidesInfo: slidesInfo,
      stepIndex: stepIndex,
      presentation: React__default.createElement(CitationProvider, {
        citationMap: citationMap,
        bibUrl: bibUrl
      }, render({
        slideIndex: slideIndex,
        stepIndex: stepIndex,
        slidesInfo: slidesInfo,
        slides: threeSlides
      }))
    });
  }

  return React__default.createElement(CitationProvider, {
    citationMap: citationMap,
    bibUrl: bibUrl
  }, React__default.createElement("div", {
    className: 'flex h-screen bg-gray-100 items-center pl-2'
  }, render({
    slideIndex: slideIndex,
    stepIndex: stepIndex,
    slidesInfo: slidesInfo,
    slides: threeSlides
  }), React__default.createElement(Tabs, null, React__default.createElement(Tab, {
    label: 'Presenter notes'
  }, slidesInfo[slideIndex].presenterNotes ? React__default.createElement("div", {
    className: 'text-sm p-2'
  }, slidesInfo[slideIndex].presenterNotes) : React__default.createElement("div", {
    className: 'text-gray-500 text-sm m-2 text-center'
  }, "no presenter notes")), React__default.createElement(Tab, {
    label: 'Animation editor'
  }, slidesInfo[slideIndex].animations.length ? React__default.createElement(AnimationEditor, {
    animations: slidesInfo[slideIndex].animations
  }) : React__default.createElement("div", {
    className: 'text-gray-500 text-sm m-2 text-center'
  }, "no animations")))));
}

function Tabs(_ref6) {
  var children = _ref6.children;
  return React__default.createElement("div", {
    className: 'text-gray-800 w-full h-screen overflow-y-scroll ml-2'
  }, children);
}

function Tab(_ref7) {
  var label = _ref7.label,
      children = _ref7.children;

  var _useState4 = React.useState(true),
      show = _useState4[0],
      setShow = _useState4[1];

  if (!children) return null;
  return React__default.createElement("div", {
    className: 'w-full'
  }, React__default.createElement("div", {
    className: 'p-1 px-2 font-bold cursor-pointer sticky top-0 z-50',
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

function PresentationOverview(_ref8) {
  var children = _ref8.children,
      render = _ref8.render,
      bibUrl = _ref8.bibUrl,
      _ref8$preamble = _ref8.preamble,
      preamble = _ref8$preamble === void 0 ? '' : _ref8$preamble,
      compileHost = _ref8.compileHost;
  useIsomorphicLayoutEffect(function () {
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

function RenderSlide(_ref9) {
  var children = _ref9.children,
      _ref9$steps = _ref9.steps,
      steps = _ref9$steps === void 0 ? [] : _ref9$steps,
      render = _ref9.render;
  var TIMING = 0.5;

  var _ref10 = React.useContext(PresentationContext) || {},
      _ref10$stepIndex = _ref10.stepIndex,
      stepIndex = _ref10$stepIndex === void 0 ? 0 : _ref10$stepIndex,
      _ref10$i = _ref10.i,
      i = _ref10$i === void 0 ? 0 : _ref10$i,
      _ref10$slideIndex = _ref10.slideIndex,
      slideIndex = _ref10$slideIndex === void 0 ? 0 : _ref10$slideIndex,
      transition = _ref10.transition,
      _ref10$slidesInfo = _ref10.slidesInfo,
      slidesInfo = _ref10$slidesInfo === void 0 ? [] : _ref10$slidesInfo;

  var _useState5 = React.useState({
    transition: TIMING + "s transform, " + TIMING + "s opacity",
    transform: 'scale(1) translate3d(0px, 0px, 0px)',
    opacity: 0
  }),
      style = _useState5[0],
      setStyle = _useState5[1];

  var updateStyle = function updateStyle(style) {
    return setStyle(function (s) {
      return _extends({}, s, style);
    });
  };

  React.useEffect(function () {
    var _ref11 = transition || {},
        _ref11$after = _ref11.after,
        after = _ref11$after === void 0 ? {
      transform: "translate3d(-100%, 0px, 0px)",
      opacity: 0,
      zIndex: 0
    } : _ref11$after,
        _ref11$before = _ref11.before,
        before = _ref11$before === void 0 ? {
      transform: "translate3d(100%, 0px, 0px)",
      opacity: 0,
      zIndex: 0
    } : _ref11$before;

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
        className: 'presentation inline-block relative flex-shrink-0 flex flex-col text-white bg-blue',
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
        className: 'ml-6 mt-6 text-white font-semibold text-2xl flex items-center theme-font-open'
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

function Presentation$1(props) {
  var h = 900;
  var w = 1200;
  return React__default.createElement(RenderPresentation, Object.assign({}, props, {
    render: function render(_ref) {
      var slides = _ref.slides,
          slideIndex = _ref.slideIndex,
          slidesInfo = _ref.slidesInfo;
      var info = slidesInfo[slideIndex].info;
      return React__default.createElement("div", {
        className: 'presentation inline-block relative flex-shrink-0 flex flex-col text-black',
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
        className: 'flex justify-end text-xs theme-gray'
      }, React__default.createElement("div", {
        className: 'px-2 py-1'
      }, slideIndex + 1))));
    }
  }));
}
function Slide$1(_ref2) {
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
        className: 'ml-6 mt-6 theme-dark-gray font text-2xl flex lucida'
      }, typeof info.header == 'string' ? info.header.split(/(\|\|)/g).map(function (e) {
        return e === '||' ? React__default.createElement("br", null) : e;
      }) : info.header), React__default.createElement("div", {
        className: "flex-grow p-6 " + className,
        style: slideStyle
      }, children)));
    }
  }));
}
function OverviewSlide(_ref4) {
  var image = _ref4.image,
      title = _ref4.title,
      section = _ref4.section,
      children = _ref4.children,
      _ref4$styles = _ref4.styles,
      styles = _ref4$styles === void 0 ? {
    title: {
      color: '#918F90'
    },
    section: {
      color: '#767374'
    },
    activeSection: {
      color: '#E39000'
    }
  } : _ref4$styles;

  var _ref5 = React.useContext(PresentationContext) || {},
      _ref5$slidesInfo = _ref5.slidesInfo,
      slidesInfo = _ref5$slidesInfo === void 0 ? [] : _ref5$slidesInfo;

  var sections = slidesInfo.map(function (i) {
    return [i.info.section, i.info];
  }).filter(function (v) {
    return !!v[0];
  }).filter(function (v, i, a) {
    return a.map(function (w) {
      return w[0];
    }).indexOf(v[0]) === i;
  }).map(function (v) {
    return v[1];
  });
  title = title || slidesInfo[0].info.title;
  image = image || slidesInfo[0].info.image;
  styles = slidesInfo[0].info.styles || styles;
  return React__default.createElement(Slide$1, {
    hideNavigation: true,
    className: 'flex flex-col items-stretch lucida',
    style: {
      padding: '120px'
    }
  }, React__default.createElement("div", {
    className: 'flex-grow'
  }, React__default.createElement("div", {
    style: _extends({
      fontSize: '2.5rem'
    }, styles.title)
  }, title)), React__default.createElement("div", {
    className: 'flex items-stretch'
  }, image, React__default.createElement("div", {
    className: 'ml-10 flex flex-col justify-between',
    style: {
      fontSize: '90%'
    }
  }, sections.map(function (s) {
    return React__default.createElement("div", {
      key: s.section,
      className: 'my-2',
      style: _extends({}, section && s.section == section ? styles.activeSection : styles.section)
    }, React__default.createElement("span", {
      className: 'inline-block mb-2'
    }, s.section), React__default.createElement("br", null), React__default.createElement("span", {
      className: 'opacity-75'
    }, s.sectionsubtitle || ''));
  }))), children);
}
function QuestionSlide$1(_ref6) {
  var _ref6$title = _ref6.title,
      title = _ref6$title === void 0 ? 'Questions?' : _ref6$title,
      children = _ref6.children;
  return React__default.createElement(Slide$1, {
    className: 'bg-blue text-gray-100 text-3xl flex items-center justify-center p-0',
    hideNavigation: true
  }, title, children);
}
function List$1(_ref7) {
  var children = _ref7.children,
      step = _ref7.step,
      props = _objectWithoutPropertiesLoose(_ref7, ["children", "step"]);

  var childArray = React__default.Children.toArray(children);
  return React__default.createElement("ul", Object.assign({}, props), childArray.map(function (child, i) {
    return React__default.createElement(Show, {
      key: i,
      when: i < step || step === undefined
    }, child);
  }));
}
function Item$1(_ref8) {
  var children = _ref8.children,
      name = _ref8.name,
      props = _objectWithoutPropertiesLoose(_ref8, ["children", "name"]);

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
function Cite$1(_ref9) {
  var id = _ref9.id,
      hidden = _ref9.hidden;
  return React__default.createElement(RenderCite, {
    id: id,
    render: function render(_ref10) {
      var text = _ref10.text,
          number = _ref10.number;
      if (hidden) return React__default.createElement("span", null);
      return React__default.createElement("span", {
        title: text || 'Loading ...'
      }, "[", number || '??', "]");
    }
  });
}
function BibliographySlide$1() {
  var stride = 4;
  return React__default.createElement(RenderBibliography, {
    render: function render(items) {
      return React__default.createElement(Slide$1, {
        steps: range(Math.ceil(items.length / stride))
      }, function (step) {
        if (!items) return React__default.createElement("div", null, "Loading");
        var start = stride * step;
        var end = start + stride;
        return React__default.createElement("ul", {
          className: 'list-none text-sm'
        }, items.slice(start, end).map(function (_ref11) {
          var id = _ref11.id,
              n = _ref11.n,
              html = _ref11.html;
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
function Box$1(_ref12) {
  var title = _ref12.title,
      children = _ref12.children,
      className = _ref12.className,
      smallTitle = _ref12.smallTitle,
      style = _ref12.style;
  return React__default.createElement("div", {
    className: "theme-border theme-shadow " + (className || ''),
    style: style
  }, React__default.createElement("div", {
    className: 'p-2'
  }, title && React__default.createElement("span", {
    className: "pr-2 text-green font-semibold " + (smallTitle ? 'text-xs block' : '')
  }, title, "."), children));
}
function Qed$1(props) {
  return React__default.createElement("div", Object.assign({
    className: 'flex justify-end'
  }, props), React__default.createElement("div", {
    className: 'inline-block w-3 h-3 m-1 border-2 border-black'
  }));
}

var principiae = {
  __proto__: null,
  Presentation: Presentation$1,
  Slide: Slide$1,
  OverviewSlide: OverviewSlide,
  QuestionSlide: QuestionSlide$1,
  List: List$1,
  Item: Item$1,
  Cite: Cite$1,
  BibliographySlide: BibliographySlide$1,
  Box: Box$1,
  Qed: Qed$1
};

gsap$2.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

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
    textSvg.id = textEle.id;
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
          gsap$2.set(ele, _extends({}, rest));
        } else {
          console.log('timing is ', rest.seconds, TIMING);
          gsap$2.to(ele, _extends({
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
      height = _ref3$height === void 0 ? 'auto' : _ref3$height,
      _ref3$style = _ref3.style,
      style = _ref3$style === void 0 ? {} : _ref3$style,
      _ref3$className = _ref3.className,
      className = _ref3$className === void 0 ? '' : _ref3$className;
  var element = React.useRef(null);
  React.useEffect(function () {

    (function () {
      try {
        return Promise.resolve(memoizedFetch(src.startsWith('/') ? src : '/' + src)).then(function (text) {
          var div = element.current;
          if (!div) return;
          div.innerHTML = text;
          div.querySelector('svg').style.opacity = '0';
          div.querySelector('svg').style.width = width;
          div.querySelector('svg').style.height = height;
          return Promise.resolve(Promise.all(Array.from(div.querySelectorAll('text')).map(function (textEle) {
            try {
              if (textEle.matches('.dont-replace *') || textEle.matches('.ignore-latex *')) {
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

            div.querySelector('svg').style.transition = '0.3s opacity';
            div.querySelector('svg').style.opacity = '1';
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
    style: style,
    className: className,
    ref: element
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

var _internalTimeline = function _internalTimeline(strings) {
  for (var _len = arguments.length, subs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    subs[_key - 1] = arguments[_key];
  }

  var defaultAbbreviations = timeline.abbreviations;

  var translate = function translate(sub) {
    return function (s) {
      return Object.prototype.hasOwnProperty.call(sub, s) ? sub[s] : Object.prototype.hasOwnProperty.call(defaultAbbreviations, s) ? defaultAbbreviations[s] : s;
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
      sub: sub,
      text: text
    };
  });
  var numberOfUnexpandedSteps = Math.max.apply(Math, charactersInterpreted.map(function (obj) {
    return obj.numbers.length;
  }));

  var getLength = function getLength(index) {
    return Math.max.apply(Math, charactersInterpreted.map(function (_ref3) {
      var numbers = _ref3.numbers;
      var element = numbers[index];

      if (Array.isArray(element)) {
        return element.length;
      } else {
        return 1;
      }
    }));
  };

  var expanded = charactersInterpreted.map(function (_ref4) {
    var label = _ref4.label,
        numbers = _ref4.numbers,
        sub = _ref4.sub;
    var expandedSteps = range(numberOfUnexpandedSteps).flatMap(function (index) {
      var length = getLength(index);
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
      expandedSteps: expandedSteps,
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
  return {
    charactersInterpreted: charactersInterpreted,
    expanded: expanded,
    output: output,
    numberOfUnexpandedSteps: numberOfUnexpandedSteps,
    lengths: range(numberOfUnexpandedSteps).map(function (_, i) {
      return getLength(i);
    })
  };
};
var timeline = Object.assign(function (strings) {
  for (var _len2 = arguments.length, subs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    subs[_key2 - 1] = arguments[_key2];
  }

  return _internalTimeline.apply(void 0, [strings].concat(subs)).output;
}, {
  abbreviations: {
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
    }
  }
});

function formulas(strings) {
  for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return String.raw.apply(String, [strings].concat(rest)).split('\n').map(function (l) {
    return l.trim();
  }).filter(function (l) {
    return l !== '';
  });
}

var themes = {
  modern: modern,
  principiae: principiae
};

exports.AnimateSVG = AnimateSVG;
exports.CitationContext = CitationContext;
exports.DisplayMath = DisplayMath;
exports.InlineMath = InlineMath;
exports.M = M;
exports.MObject = MObject;
exports.Morph = Morph;
exports.Notes = Notes;
exports.Portal = Portal;
exports.PresentationContext = PresentationContext;
exports.RenderPresentation = RenderPresentation;
exports.Show = Show;
exports._internalTimeline = _internalTimeline;
exports.formulas = formulas;
exports.getSlidesInfo = getSlidesInfo;
exports.m = m;
exports.range = range;
exports.themes = themes;
exports.timeline = timeline;
//# sourceMappingURL=index.js.map
