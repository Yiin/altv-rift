var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __markAsModule = (target) =>
  __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])((fn = 0))), res;
  };
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __reExport = (target, module, desc) => {
  if ((module && typeof module === "object") || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {
          get: () => module[key],
          enumerable:
            !(desc = __getOwnPropDesc(module, key)) || desc.enumerable,
        });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(
    __markAsModule(
      __defProp(
        module != null ? __create(__getProtoOf(module)) : {},
        "default",
        module && module.__esModule && "default" in module
          ? { get: () => module.default, enumerable: true }
          : { value: module, enumerable: true }
      )
    ),
    module
  );
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) =>
      x.done
        ? resolve(x.value)
        : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// <define:process>
var env, define_process_default;
var init_define_process = __esm({
  "<define:process>"() {
    env = {};
    define_process_default = { env };
  },
});

// ../node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "../node_modules/has-symbols/shams.js"(exports, module) {
    init_define_process();
    ("use strict");
    module.exports = function hasSymbols() {
      if (
        typeof Symbol !== "function" ||
        typeof Object.getOwnPropertySymbols !== "function"
      ) {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (sym in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (
        typeof Object.getOwnPropertyNames === "function" &&
        Object.getOwnPropertyNames(obj).length !== 0
      ) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  },
});

// ../node_modules/has-tostringtag/shams.js
var require_shams2 = __commonJS({
  "../node_modules/has-tostringtag/shams.js"(exports, module) {
    init_define_process();
    ("use strict");
    var hasSymbols = require_shams();
    module.exports = function hasToStringTagShams() {
      return hasSymbols() && !!Symbol.toStringTag;
    };
  },
});

// ../node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "../node_modules/has-symbols/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  },
});

// ../node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "../node_modules/function-bind/implementation.js"(exports, module) {
    init_define_process();
    ("use strict");
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var slice = Array.prototype.slice;
    var toStr = Object.prototype.toString;
    var funcType = "[object Function]";
    module.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slice.call(arguments, 1);
      var bound;
      var binder = function () {
        if (this instanceof bound) {
          var result = target.apply(this, args.concat(slice.call(arguments)));
          if (Object(result) === result) {
            return result;
          }
          return this;
        } else {
          return target.apply(that, args.concat(slice.call(arguments)));
        }
      };
      var boundLength = Math.max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs.push("$" + i);
      }
      bound = Function(
        "binder",
        "return function (" +
          boundArgs.join(",") +
          "){ return binder.apply(this,arguments); }"
      )(binder);
      if (target.prototype) {
        var Empty = function Empty2() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  },
});

// ../node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "../node_modules/function-bind/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  },
});

// ../node_modules/has/src/index.js
var require_src = __commonJS({
  "../node_modules/has/src/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var bind = require_function_bind();
    module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
  },
});

// ../node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "../node_modules/get-intrinsic/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var undefined2;
    var $SyntaxError = SyntaxError;
    var $Function = Function;
    var $TypeError = TypeError;
    var getEvalledConstructor = function (expressionSyntax) {
      try {
        return $Function(
          '"use strict"; return (' + expressionSyntax + ").constructor;"
        )();
      } catch (e) {}
    };
    var $gOPD = Object.getOwnPropertyDescriptor;
    if ($gOPD) {
      try {
        $gOPD({}, "");
      } catch (e) {
        $gOPD = null;
      }
    }
    var throwTypeError = function () {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD
      ? (function () {
          try {
            arguments.callee;
            return throwTypeError;
          } catch (calleeThrows) {
            try {
              return $gOPD(arguments, "callee").get;
            } catch (gOPDthrows) {
              return throwTypeError;
            }
          }
        })()
      : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto =
      Object.getPrototypeOf ||
      function (x) {
        return x.__proto__;
      };
    var needsEval = {};
    var TypedArray =
      typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      "%AggregateError%":
        typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%":
        typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols
        ? getProto([][Symbol.iterator]())
        : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": Error,
      "%eval%": eval,
      "%EvalError%": EvalError,
      "%Float32Array%":
        typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%":
        typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%":
        typeof FinalizationRegistry === "undefined"
          ? undefined2
          : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%":
        typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%":
        typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols
        ? getProto(getProto([][Symbol.iterator]()))
        : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%":
        typeof Map === "undefined" || !hasSymbols
          ? undefined2
          : getProto(new Map()[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": Object,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": RangeError,
      "%ReferenceError%": ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%":
        typeof Set === "undefined" || !hasSymbols
          ? undefined2
          : getProto(new Set()[Symbol.iterator]()),
      "%SharedArrayBuffer%":
        typeof SharedArrayBuffer === "undefined"
          ? undefined2
          : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols
        ? getProto(""[Symbol.iterator]())
        : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%":
        typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%":
        typeof Uint8ClampedArray === "undefined"
          ? undefined2
          : Uint8ClampedArray,
      "%Uint16Array%":
        typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%":
        typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
    };
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": [
        "AsyncGeneratorFunction",
        "prototype",
        "prototype",
      ],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"],
    };
    var bind = require_function_bind();
    var hasOwn = require_src();
    var $concat = bind.call(Function.call, Array.prototype.concat);
    var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
    var $replace = bind.call(Function.call, String.prototype.replace);
    var $strSlice = bind.call(Function.call, String.prototype.slice);
    var rePropName =
      /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError(
          "invalid intrinsic syntax, expected closing `%`"
        );
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError(
          "invalid intrinsic syntax, expected opening `%`"
        );
      }
      var result = [];
      $replace(string, rePropName, function (match, number, quote, subString) {
        result[result.length] = quote
          ? $replace(subString, reEscapeChar, "$1")
          : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError(
            "intrinsic " +
              name +
              " exists, but is not available. Please file an issue!"
          );
        }
        return {
          alias,
          name: intrinsicName,
          value,
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic(
        "%" + intrinsicBaseName + "%",
        allowMissing
      );
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if (
          (first === '"' ||
            first === "'" ||
            first === "`" ||
            last === '"' ||
            last === "'" ||
            last === "`") &&
          first !== last
        ) {
          throw new $SyntaxError(
            "property names with quotes must have matching quotes"
          );
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError(
                "base intrinsic for " +
                  name +
                  " exists, but the property is not available."
              );
            }
            return void 0;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  },
});

// ../node_modules/call-bind/index.js
var require_call_bind = __commonJS({
  "../node_modules/call-bind/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var bind = require_function_bind();
    var GetIntrinsic = require_get_intrinsic();
    var $apply = GetIntrinsic("%Function.prototype.apply%");
    var $call = GetIntrinsic("%Function.prototype.call%");
    var $reflectApply =
      GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
    var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
    var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
    var $max = GetIntrinsic("%Math.max%");
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = null;
      }
    }
    module.exports = function callBind(originalFunction) {
      var func = $reflectApply(bind, $call, arguments);
      if ($gOPD && $defineProperty) {
        var desc = $gOPD(func, "length");
        if (desc.configurable) {
          $defineProperty(func, "length", {
            value:
              1 + $max(0, originalFunction.length - (arguments.length - 1)),
          });
        }
      }
      return func;
    };
    var applyBind = function applyBind2() {
      return $reflectApply(bind, $apply, arguments);
    };
    if ($defineProperty) {
      $defineProperty(module.exports, "apply", { value: applyBind });
    } else {
      module.exports.apply = applyBind;
    }
  },
});

// ../node_modules/call-bind/callBound.js
var require_callBound = __commonJS({
  "../node_modules/call-bind/callBound.js"(exports, module) {
    init_define_process();
    ("use strict");
    var GetIntrinsic = require_get_intrinsic();
    var callBind = require_call_bind();
    var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
    module.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = GetIntrinsic(name, !!allowMissing);
      if (
        typeof intrinsic === "function" &&
        $indexOf(name, ".prototype.") > -1
      ) {
        return callBind(intrinsic);
      }
      return intrinsic;
    };
  },
});

// ../node_modules/is-arguments/index.js
var require_is_arguments = __commonJS({
  "../node_modules/is-arguments/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var hasToStringTag = require_shams2()();
    var callBound = require_callBound();
    var $toString = callBound("Object.prototype.toString");
    var isStandardArguments = function isArguments(value) {
      if (
        hasToStringTag &&
        value &&
        typeof value === "object" &&
        Symbol.toStringTag in value
      ) {
        return false;
      }
      return $toString(value) === "[object Arguments]";
    };
    var isLegacyArguments = function isArguments(value) {
      if (isStandardArguments(value)) {
        return true;
      }
      return (
        value !== null &&
        typeof value === "object" &&
        typeof value.length === "number" &&
        value.length >= 0 &&
        $toString(value) !== "[object Array]" &&
        $toString(value.callee) === "[object Function]"
      );
    };
    var supportsStandardArguments = (function () {
      return isStandardArguments(arguments);
    })();
    isStandardArguments.isLegacyArguments = isLegacyArguments;
    module.exports = supportsStandardArguments
      ? isStandardArguments
      : isLegacyArguments;
  },
});

// ../node_modules/is-generator-function/index.js
var require_is_generator_function = __commonJS({
  "../node_modules/is-generator-function/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var toStr = Object.prototype.toString;
    var fnToStr = Function.prototype.toString;
    var isFnRegex = /^\s*(?:function)?\*/;
    var hasToStringTag = require_shams2()();
    var getProto = Object.getPrototypeOf;
    var getGeneratorFunc = function () {
      if (!hasToStringTag) {
        return false;
      }
      try {
        return Function("return function*() {}")();
      } catch (e) {}
    };
    var GeneratorFunction;
    module.exports = function isGeneratorFunction(fn) {
      if (typeof fn !== "function") {
        return false;
      }
      if (isFnRegex.test(fnToStr.call(fn))) {
        return true;
      }
      if (!hasToStringTag) {
        var str = toStr.call(fn);
        return str === "[object GeneratorFunction]";
      }
      if (!getProto) {
        return false;
      }
      if (typeof GeneratorFunction === "undefined") {
        var generatorFunc = getGeneratorFunc();
        GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
      }
      return getProto(fn) === GeneratorFunction;
    };
  },
});

// ../node_modules/foreach/index.js
var require_foreach = __commonJS({
  "../node_modules/foreach/index.js"(exports, module) {
    init_define_process();
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    module.exports = function forEach(obj, fn, ctx) {
      if (toString.call(fn) !== "[object Function]") {
        throw new TypeError("iterator must be a function");
      }
      var l = obj.length;
      if (l === +l) {
        for (var i = 0; i < l; i++) {
          fn.call(ctx, obj[i], i, obj);
        }
      } else {
        for (var k in obj) {
          if (hasOwn.call(obj, k)) {
            fn.call(ctx, obj[k], k, obj);
          }
        }
      }
    };
  },
});

// ../node_modules/available-typed-arrays/index.js
var require_available_typed_arrays = __commonJS({
  "../node_modules/available-typed-arrays/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var possibleNames = [
      "BigInt64Array",
      "BigUint64Array",
      "Float32Array",
      "Float64Array",
      "Int16Array",
      "Int32Array",
      "Int8Array",
      "Uint16Array",
      "Uint32Array",
      "Uint8Array",
      "Uint8ClampedArray",
    ];
    var g = typeof globalThis === "undefined" ? global : globalThis;
    module.exports = function availableTypedArrays() {
      var out = [];
      for (var i = 0; i < possibleNames.length; i++) {
        if (typeof g[possibleNames[i]] === "function") {
          out[out.length] = possibleNames[i];
        }
      }
      return out;
    };
  },
});

// ../node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js
var require_getOwnPropertyDescriptor = __commonJS({
  "../node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js"(
    exports,
    module
  ) {
    init_define_process();
    ("use strict");
    var GetIntrinsic = require_get_intrinsic();
    var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  },
});

// ../node_modules/is-typed-array/index.js
var require_is_typed_array = __commonJS({
  "../node_modules/is-typed-array/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var forEach = require_foreach();
    var availableTypedArrays = require_available_typed_arrays();
    var callBound = require_callBound();
    var $toString = callBound("Object.prototype.toString");
    var hasToStringTag = require_shams2()();
    var g = typeof globalThis === "undefined" ? global : globalThis;
    var typedArrays = availableTypedArrays();
    var $indexOf =
      callBound("Array.prototype.indexOf", true) ||
      function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i;
          }
        }
        return -1;
      };
    var $slice = callBound("String.prototype.slice");
    var toStrTags = {};
    var gOPD = require_getOwnPropertyDescriptor();
    var getPrototypeOf = Object.getPrototypeOf;
    if (hasToStringTag && gOPD && getPrototypeOf) {
      forEach(typedArrays, function (typedArray) {
        var arr = new g[typedArray]();
        if (Symbol.toStringTag in arr) {
          var proto = getPrototypeOf(arr);
          var descriptor = gOPD(proto, Symbol.toStringTag);
          if (!descriptor) {
            var superProto = getPrototypeOf(proto);
            descriptor = gOPD(superProto, Symbol.toStringTag);
          }
          toStrTags[typedArray] = descriptor.get;
        }
      });
    }
    var tryTypedArrays = function tryAllTypedArrays(value) {
      var anyTrue = false;
      forEach(toStrTags, function (getter, typedArray) {
        if (!anyTrue) {
          try {
            anyTrue = getter.call(value) === typedArray;
          } catch (e) {}
        }
      });
      return anyTrue;
    };
    module.exports = function isTypedArray(value) {
      if (!value || typeof value !== "object") {
        return false;
      }
      if (!hasToStringTag || !(Symbol.toStringTag in value)) {
        var tag = $slice($toString(value), 8, -1);
        return $indexOf(typedArrays, tag) > -1;
      }
      if (!gOPD) {
        return false;
      }
      return tryTypedArrays(value);
    };
  },
});

// ../node_modules/which-typed-array/index.js
var require_which_typed_array = __commonJS({
  "../node_modules/which-typed-array/index.js"(exports, module) {
    init_define_process();
    ("use strict");
    var forEach = require_foreach();
    var availableTypedArrays = require_available_typed_arrays();
    var callBound = require_callBound();
    var $toString = callBound("Object.prototype.toString");
    var hasToStringTag = require_shams2()();
    var g = typeof globalThis === "undefined" ? global : globalThis;
    var typedArrays = availableTypedArrays();
    var $slice = callBound("String.prototype.slice");
    var toStrTags = {};
    var gOPD = require_getOwnPropertyDescriptor();
    var getPrototypeOf = Object.getPrototypeOf;
    if (hasToStringTag && gOPD && getPrototypeOf) {
      forEach(typedArrays, function (typedArray) {
        if (typeof g[typedArray] === "function") {
          var arr = new g[typedArray]();
          if (Symbol.toStringTag in arr) {
            var proto = getPrototypeOf(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor) {
              var superProto = getPrototypeOf(proto);
              descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            toStrTags[typedArray] = descriptor.get;
          }
        }
      });
    }
    var tryTypedArrays = function tryAllTypedArrays(value) {
      var foundName = false;
      forEach(toStrTags, function (getter, typedArray) {
        if (!foundName) {
          try {
            var name = getter.call(value);
            if (name === typedArray) {
              foundName = name;
            }
          } catch (e) {}
        }
      });
      return foundName;
    };
    var isTypedArray = require_is_typed_array();
    module.exports = function whichTypedArray(value) {
      if (!isTypedArray(value)) {
        return false;
      }
      if (!hasToStringTag || !(Symbol.toStringTag in value)) {
        return $slice($toString(value), 8, -1);
      }
      return tryTypedArrays(value);
    };
  },
});

// ../node_modules/util/support/types.js
var require_types = __commonJS({
  "../node_modules/util/support/types.js"(exports) {
    init_define_process();
    ("use strict");
    var isArgumentsObject = require_is_arguments();
    var isGeneratorFunction = require_is_generator_function();
    var whichTypedArray = require_which_typed_array();
    var isTypedArray = require_is_typed_array();
    function uncurryThis(f) {
      return f.call.bind(f);
    }
    var BigIntSupported = typeof BigInt !== "undefined";
    var SymbolSupported = typeof Symbol !== "undefined";
    var ObjectToString = uncurryThis(Object.prototype.toString);
    var numberValue = uncurryThis(Number.prototype.valueOf);
    var stringValue = uncurryThis(String.prototype.valueOf);
    var booleanValue = uncurryThis(Boolean.prototype.valueOf);
    if (BigIntSupported) {
      bigIntValue = uncurryThis(BigInt.prototype.valueOf);
    }
    var bigIntValue;
    if (SymbolSupported) {
      symbolValue = uncurryThis(Symbol.prototype.valueOf);
    }
    var symbolValue;
    function checkBoxedPrimitive(value, prototypeValueOf) {
      if (typeof value !== "object") {
        return false;
      }
      try {
        prototypeValueOf(value);
        return true;
      } catch (e) {
        return false;
      }
    }
    exports.isArgumentsObject = isArgumentsObject;
    exports.isGeneratorFunction = isGeneratorFunction;
    exports.isTypedArray = isTypedArray;
    function isPromise(input) {
      return (
        (typeof Promise !== "undefined" && input instanceof Promise) ||
        (input !== null &&
          typeof input === "object" &&
          typeof input.then === "function" &&
          typeof input.catch === "function")
      );
    }
    exports.isPromise = isPromise;
    function isArrayBufferView(value) {
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        return ArrayBuffer.isView(value);
      }
      return isTypedArray(value) || isDataView(value);
    }
    exports.isArrayBufferView = isArrayBufferView;
    function isUint8Array(value) {
      return whichTypedArray(value) === "Uint8Array";
    }
    exports.isUint8Array = isUint8Array;
    function isUint8ClampedArray(value) {
      return whichTypedArray(value) === "Uint8ClampedArray";
    }
    exports.isUint8ClampedArray = isUint8ClampedArray;
    function isUint16Array(value) {
      return whichTypedArray(value) === "Uint16Array";
    }
    exports.isUint16Array = isUint16Array;
    function isUint32Array(value) {
      return whichTypedArray(value) === "Uint32Array";
    }
    exports.isUint32Array = isUint32Array;
    function isInt8Array(value) {
      return whichTypedArray(value) === "Int8Array";
    }
    exports.isInt8Array = isInt8Array;
    function isInt16Array(value) {
      return whichTypedArray(value) === "Int16Array";
    }
    exports.isInt16Array = isInt16Array;
    function isInt32Array(value) {
      return whichTypedArray(value) === "Int32Array";
    }
    exports.isInt32Array = isInt32Array;
    function isFloat32Array(value) {
      return whichTypedArray(value) === "Float32Array";
    }
    exports.isFloat32Array = isFloat32Array;
    function isFloat64Array(value) {
      return whichTypedArray(value) === "Float64Array";
    }
    exports.isFloat64Array = isFloat64Array;
    function isBigInt64Array(value) {
      return whichTypedArray(value) === "BigInt64Array";
    }
    exports.isBigInt64Array = isBigInt64Array;
    function isBigUint64Array(value) {
      return whichTypedArray(value) === "BigUint64Array";
    }
    exports.isBigUint64Array = isBigUint64Array;
    function isMapToString(value) {
      return ObjectToString(value) === "[object Map]";
    }
    isMapToString.working =
      typeof Map !== "undefined" && isMapToString(new Map());
    function isMap(value) {
      if (typeof Map === "undefined") {
        return false;
      }
      return isMapToString.working
        ? isMapToString(value)
        : value instanceof Map;
    }
    exports.isMap = isMap;
    function isSetToString(value) {
      return ObjectToString(value) === "[object Set]";
    }
    isSetToString.working =
      typeof Set !== "undefined" && isSetToString(new Set());
    function isSet(value) {
      if (typeof Set === "undefined") {
        return false;
      }
      return isSetToString.working
        ? isSetToString(value)
        : value instanceof Set;
    }
    exports.isSet = isSet;
    function isWeakMapToString(value) {
      return ObjectToString(value) === "[object WeakMap]";
    }
    isWeakMapToString.working =
      typeof WeakMap !== "undefined" && isWeakMapToString(new WeakMap());
    function isWeakMap(value) {
      if (typeof WeakMap === "undefined") {
        return false;
      }
      return isWeakMapToString.working
        ? isWeakMapToString(value)
        : value instanceof WeakMap;
    }
    exports.isWeakMap = isWeakMap;
    function isWeakSetToString(value) {
      return ObjectToString(value) === "[object WeakSet]";
    }
    isWeakSetToString.working =
      typeof WeakSet !== "undefined" && isWeakSetToString(new WeakSet());
    function isWeakSet(value) {
      return isWeakSetToString(value);
    }
    exports.isWeakSet = isWeakSet;
    function isArrayBufferToString(value) {
      return ObjectToString(value) === "[object ArrayBuffer]";
    }
    isArrayBufferToString.working =
      typeof ArrayBuffer !== "undefined" &&
      isArrayBufferToString(new ArrayBuffer());
    function isArrayBuffer(value) {
      if (typeof ArrayBuffer === "undefined") {
        return false;
      }
      return isArrayBufferToString.working
        ? isArrayBufferToString(value)
        : value instanceof ArrayBuffer;
    }
    exports.isArrayBuffer = isArrayBuffer;
    function isDataViewToString(value) {
      return ObjectToString(value) === "[object DataView]";
    }
    isDataViewToString.working =
      typeof ArrayBuffer !== "undefined" &&
      typeof DataView !== "undefined" &&
      isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
    function isDataView(value) {
      if (typeof DataView === "undefined") {
        return false;
      }
      return isDataViewToString.working
        ? isDataViewToString(value)
        : value instanceof DataView;
    }
    exports.isDataView = isDataView;
    var SharedArrayBufferCopy =
      typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
    function isSharedArrayBufferToString(value) {
      return ObjectToString(value) === "[object SharedArrayBuffer]";
    }
    function isSharedArrayBuffer(value) {
      if (typeof SharedArrayBufferCopy === "undefined") {
        return false;
      }
      if (typeof isSharedArrayBufferToString.working === "undefined") {
        isSharedArrayBufferToString.working = isSharedArrayBufferToString(
          new SharedArrayBufferCopy()
        );
      }
      return isSharedArrayBufferToString.working
        ? isSharedArrayBufferToString(value)
        : value instanceof SharedArrayBufferCopy;
    }
    exports.isSharedArrayBuffer = isSharedArrayBuffer;
    function isAsyncFunction(value) {
      return ObjectToString(value) === "[object AsyncFunction]";
    }
    exports.isAsyncFunction = isAsyncFunction;
    function isMapIterator(value) {
      return ObjectToString(value) === "[object Map Iterator]";
    }
    exports.isMapIterator = isMapIterator;
    function isSetIterator(value) {
      return ObjectToString(value) === "[object Set Iterator]";
    }
    exports.isSetIterator = isSetIterator;
    function isGeneratorObject(value) {
      return ObjectToString(value) === "[object Generator]";
    }
    exports.isGeneratorObject = isGeneratorObject;
    function isWebAssemblyCompiledModule(value) {
      return ObjectToString(value) === "[object WebAssembly.Module]";
    }
    exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
    function isNumberObject(value) {
      return checkBoxedPrimitive(value, numberValue);
    }
    exports.isNumberObject = isNumberObject;
    function isStringObject(value) {
      return checkBoxedPrimitive(value, stringValue);
    }
    exports.isStringObject = isStringObject;
    function isBooleanObject(value) {
      return checkBoxedPrimitive(value, booleanValue);
    }
    exports.isBooleanObject = isBooleanObject;
    function isBigIntObject(value) {
      return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
    }
    exports.isBigIntObject = isBigIntObject;
    function isSymbolObject(value) {
      return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
    }
    exports.isSymbolObject = isSymbolObject;
    function isBoxedPrimitive(value) {
      return (
        isNumberObject(value) ||
        isStringObject(value) ||
        isBooleanObject(value) ||
        isBigIntObject(value) ||
        isSymbolObject(value)
      );
    }
    exports.isBoxedPrimitive = isBoxedPrimitive;
    function isAnyArrayBuffer(value) {
      return (
        typeof Uint8Array !== "undefined" &&
        (isArrayBuffer(value) || isSharedArrayBuffer(value))
      );
    }
    exports.isAnyArrayBuffer = isAnyArrayBuffer;
    ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function (
      method
    ) {
      Object.defineProperty(exports, method, {
        enumerable: false,
        value: function () {
          throw new Error(method + " is not supported in userland");
        },
      });
    });
  },
});

// ../node_modules/util/support/isBufferBrowser.js
var require_isBufferBrowser = __commonJS({
  "../node_modules/util/support/isBufferBrowser.js"(exports, module) {
    init_define_process();
    module.exports = function isBuffer(arg) {
      return (
        arg &&
        typeof arg === "object" &&
        typeof arg.copy === "function" &&
        typeof arg.fill === "function" &&
        typeof arg.readUInt8 === "function"
      );
    };
  },
});

// ../node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "../node_modules/inherits/inherits_browser.js"(exports, module) {
    init_define_process();
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true,
            },
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  },
});

// ../node_modules/util/util.js
var require_util = __commonJS({
  "../node_modules/util/util.js"(exports) {
    init_define_process();
    var getOwnPropertyDescriptors =
      Object.getOwnPropertyDescriptors ||
      function getOwnPropertyDescriptors2(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };
    var formatRegExp = /%[sdj%]/g;
    exports.format = function (f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(" ");
      }
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function (x2) {
        if (x2 === "%%") return "%";
        if (i >= len) return x2;
        switch (x2) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return Number(args[i++]);
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
          default:
            return x2;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += " " + x;
        } else {
          str += " " + inspect(x);
        }
      }
      return str;
    };
    exports.deprecate = function (fn, msg) {
      if (
        typeof define_process_default !== "undefined" &&
        define_process_default.noDeprecation === true
      ) {
        return fn;
      }
      if (typeof define_process_default === "undefined") {
        return function () {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (define_process_default.throwDeprecation) {
            throw new Error(msg);
          } else if (define_process_default.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    };
    var debugs = {};
    var debugEnvRegex = /^$/;
    if (define_process_default.env.NODE_DEBUG) {
      debugEnv = define_process_default.env.NODE_DEBUG;
      debugEnv = debugEnv
        .replace(/[|\\{}()[\]^$+?.]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/,/g, "$|^")
        .toUpperCase();
      debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
    }
    var debugEnv;
    exports.debuglog = function (set) {
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (debugEnvRegex.test(set)) {
          var pid = define_process_default.pid;
          debugs[set] = function () {
            var msg = exports.format.apply(exports, arguments);
            console.error("%s %d: %s", set, pid, msg);
          };
        } else {
          debugs[set] = function () {};
        }
      }
      return debugs[set];
    };
    function inspect(obj, opts) {
      var ctx = {
        seen: [],
        stylize: stylizeNoColor,
      };
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        ctx.showHidden = opts;
      } else if (opts) {
        exports._extend(ctx, opts);
      }
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;
    inspect.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39],
    };
    inspect.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      regexp: "red",
    };
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
      if (style) {
        return (
          "[" +
          inspect.colors[style][0] +
          "m" +
          str +
          "[" +
          inspect.colors[style][1] +
          "m"
        );
      } else {
        return str;
      }
    }
    function stylizeNoColor(str, styleType) {
      return str;
    }
    function arrayToHash(array) {
      var hash = {};
      array.forEach(function (val, idx) {
        hash[val] = true;
      });
      return hash;
    }
    function formatValue(ctx, value, recurseTimes) {
      if (
        ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        value.inspect !== exports.inspect &&
        !(value.constructor && value.constructor.prototype === value)
      ) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
      if (
        isError(value) &&
        (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)
      ) {
        return formatError(value);
      }
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ": " + value.name : "";
          return ctx.stylize("[Function" + name + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), "date");
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
      var base = "",
        array = false,
        braces = ["{", "}"];
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (isFunction(value)) {
        var n = value.name ? ": " + value.name : "";
        base = " [Function" + n + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError(value)) {
        base = " " + formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
        }
      }
      ctx.seen.push(value);
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function (key) {
          return formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            key,
            array
          );
        });
      }
      ctx.seen.pop();
      return reduceToSingleString(output, base, braces);
    }
    function formatPrimitive(ctx, value) {
      if (isUndefined(value)) return ctx.stylize("undefined", "undefined");
      if (isString(value)) {
        var simple =
          "'" +
          JSON.stringify(value)
            .replace(/^"|"$/g, "")
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"') +
          "'";
        return ctx.stylize(simple, "string");
      }
      if (isNumber(value)) return ctx.stylize("" + value, "number");
      if (isBoolean(value)) return ctx.stylize("" + value, "boolean");
      if (isNull(value)) return ctx.stylize("null", "null");
    }
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(
            formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              String(i),
              true
            )
          );
        } else {
          output.push("");
        }
      }
      keys.forEach(function (key) {
        if (!key.match(/^\d+$/)) {
          output.push(
            formatProperty(ctx, value, recurseTimes, visibleKeys, key, true)
          );
        }
      });
      return output;
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || {
        value: value[key],
      };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize("[Getter/Setter]", "special");
        } else {
          str = ctx.stylize("[Getter]", "special");
        }
      } else {
        if (desc.set) {
          str = ctx.stylize("[Setter]", "special");
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str
                .split("\n")
                .map(function (line) {
                  return "  " + line;
                })
                .join("\n")
                .substr(2);
            } else {
              str =
                "\n" +
                str
                  .split("\n")
                  .map(function (line) {
                    return "   " + line;
                  })
                  .join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, "name");
        } else {
          name = name
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"')
            .replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function (prev, cur) {
        numLinesEst++;
        if (cur.indexOf("\n") >= 0) numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      if (length > 60) {
        return (
          braces[0] +
          (base === "" ? "" : base + "\n ") +
          " " +
          output.join(",\n  ") +
          " " +
          braces[1]
        );
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    exports.types = require_types();
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    exports.types.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return isObject(d) && objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    exports.types.isDate = isDate;
    function isError(e) {
      return (
        isObject(e) &&
        (objectToString(e) === "[object Error]" || e instanceof Error)
      );
    }
    exports.isError = isError;
    exports.types.isNativeError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return (
        arg === null ||
        typeof arg === "boolean" ||
        typeof arg === "number" ||
        typeof arg === "string" ||
        typeof arg === "symbol" ||
        typeof arg === "undefined"
      );
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = require_isBufferBrowser();
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    function pad(n) {
      return n < 10 ? "0" + n.toString(10) : n.toString(10);
    }
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    function timestamp() {
      var d = new Date();
      var time = [
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds()),
      ].join(":");
      return [d.getDate(), months[d.getMonth()], time].join(" ");
    }
    exports.log = function () {
      console.log(
        "%s - %s",
        timestamp(),
        exports.format.apply(exports, arguments)
      );
    };
    exports.inherits = require_inherits_browser();
    exports._extend = function (origin, add) {
      if (!add || !isObject(add)) return origin;
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    var kCustomPromisifiedSymbol =
      typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
    exports.promisify = function promisify(original) {
      if (typeof original !== "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
          throw new TypeError(
            'The "util.promisify.custom" argument must be of type Function'
          );
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true,
        });
        return fn;
      }
      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function (resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(function (err, value) {
          if (err) {
            promiseReject(err);
          } else {
            promiseResolve(value);
          }
        });
        try {
          original.apply(this, args);
        } catch (err) {
          promiseReject(err);
        }
        return promise;
      }
      Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
      if (kCustomPromisifiedSymbol)
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true,
        });
      return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
    };
    exports.promisify.custom = kCustomPromisifiedSymbol;
    function callbackifyOnRejected(reason, cb) {
      if (!reason) {
        var newReason = new Error("Promise was rejected with a falsy value");
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }
    function callbackify(original) {
      if (typeof original !== "function") {
        throw new TypeError('The "original" argument must be of type Function');
      }
      function callbackified() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        var maybeCb = args.pop();
        if (typeof maybeCb !== "function") {
          throw new TypeError("The last argument must be of type Function");
        }
        var self = this;
        var cb = function () {
          return maybeCb.apply(self, arguments);
        };
        original.apply(this, args).then(
          function (ret) {
            define_process_default.nextTick(cb.bind(null, null, ret));
          },
          function (rej) {
            define_process_default.nextTick(
              callbackifyOnRejected.bind(null, rej, cb)
            );
          }
        );
      }
      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(
        callbackified,
        getOwnPropertyDescriptors(original)
      );
      return callbackified;
    }
    exports.callbackify = callbackify;
  },
});

// index.ts
init_define_process();
import alt10 from "alt-client";

// extensions/Vector3.ts
init_define_process();
import { Vector3 } from "alt-client";
Vector3.prototype.radiansToDirection = function () {
  return new Vector3(
    -Math.sin(this.z) * Math.abs(Math.cos(this.x)),
    Math.cos(this.z) * Math.abs(Math.cos(this.x)),
    Math.sin(this.x)
  );
};
Vector3.prototype.cross = function (vector, y, z) {
  if (typeof vector === "number") vector = new Vector3(vector, y, z);
  return new Vector3(
    this.y * vector.z - this.z * vector.y,
    this.z * vector.x - this.x * vector.z,
    this.x * vector.y - this.y * vector.x
  );
};

// controllers/CodeEditorController.ts
init_define_process();
var import_util = __toModule(require_util());
import alt5 from "alt-client";

// WebView.ts
init_define_process();
import alt from "alt-client";

// ../shared/RPC/RPC.ts
init_define_process();

// ../shared/Deferred.ts
init_define_process();
var _a;
var Deferred = class {
  constructor() {
    this.resolved = false;
    this[_a] = "Deferred";
    this.promise = new Promise((resolve, reject) => {
      this.res = resolve;
      this.rej = reject;
    });
  }
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
  resolve(value) {
    if (!this.resolved) {
      this.res(value);
      this.resolved = true;
    }
    return this;
  }
  reject(reason) {
    if (!this.resolved) {
      this.rej(reason);
      this.resolved = true;
    }
    return this;
  }
  finally(onFinally) {
    return this.promise.finally(onFinally);
  }
};
_a = Symbol.toStringTag;

// ../shared/RPC/RPC.ts
var GenericRPC = class {
  constructor(eventEmitter, options) {
    this.eventEmitter = eventEmitter;
    this.options = options;
    this.waitingPromises = new Map();
    this.chunks = new Map();
    this.errorHandlers = [];
    this.promiseId = 0;
    this.timeoutHandler = () => {
      var _a2, _b;
      for (const index of Array.from(this.waitingPromises.keys())) {
        const value = this.waitingPromises.get(index);
        if (!value || value[3]) continue;
        if (
          Date.now() - value[0] >
          ((_b = (_a2 = this.options) == null ? void 0 : _a2.timeout) != null
            ? _b
            : 3e4)
        ) {
          value[2].reject("Timeout " + value[1]);
          this.waitingPromises.delete(index);
        }
      }
    };
    this.registeredMethods = new Map();
    this.lastRegisteredMethod = 0;
    this.replHandler = (promiseId, ...args) => {
      var _a2;
      this.log("repl accepted " + promiseId + " " + JSON.stringify(args));
      const promise = this.waitingPromises.get(promiseId);
      if (!promise) return;
      (_a2 = promise[2]) == null
        ? void 0
        : _a2.resolve(args.length > 1 ? args : args[0]);
      this.pop(promiseId);
    };
    this.chunkHandler = (chunkId, subId, data) => {
      if (!this.chunks.has(chunkId)) this.chunks.set(chunkId, []);
      const chunks = this.chunks.get(chunkId);
      chunks.push([subId, data]);
    };
    this.chunkedReplHandler = (promiseId, chunkId, total) => {
      if (!this.chunks.has(chunkId))
        throw new Error("Unknown chunked message received");
      const chunks = this.chunks.get(chunkId);
      if (chunks.length !== total)
        throw new Error("Invalid chunked message length received");
      const data = chunks
        .sort((a, b) => a[0] - b[0])
        .reduce((prev, curr) => prev + curr[1], "");
      this.chunks.delete(chunkId);
      this.replHandler(promiseId, data);
    };
    this.errorHandler = (promiseId, error) => {
      var _a2;
      this.log("error repl accepted " + promiseId + " " + error);
      const promise = this.waitingPromises.get(promiseId);
      if (!promise) return;
      this.errorHandlers.forEach((h) => h(error));
      (_a2 = promise[2]) == null
        ? void 0
        : _a2.reject(
            error ? "RPC error: " + error : "RPC method execution failed"
          );
      this.pop(promiseId);
    };
    var _a2, _b, _c, _d;
    eventEmitter.on(
      (_a2 = options == null ? void 0 : options.replKeyword) != null
        ? _a2
        : "$repl",
      this.replHandler
    );
    eventEmitter.on(
      (_b = options == null ? void 0 : options.errorKeyword) != null
        ? _b
        : "$err",
      this.errorHandler
    );
    eventEmitter.on(
      (_c = options == null ? void 0 : options.chunkKeyword) != null
        ? _c
        : "$chunk",
      this.chunkHandler
    );
    eventEmitter.on(
      (_d = options == null ? void 0 : options.chunkedReplKeyword) != null
        ? _d
        : "$chunkedRepl",
      this.chunkedReplHandler
    );
    this.timeoutId = setInterval(
      this.timeoutHandler,
      (options == null ? void 0 : options.timeout) ? options.timeout / 5 : 6e3
    );
  }
  destroy() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
    console.log(
      "RPC " +
        ((_a2 = this.options) == null ? void 0 : _a2.name) +
        " was destroyed!"
    );
    clearInterval(this.timeoutId);
    if (!this.eventEmitter.valid) return;
    this.eventEmitter.off(
      (_c = (_b = this.options) == null ? void 0 : _b.replKeyword) != null
        ? _c
        : "$repl",
      this.replHandler
    );
    this.eventEmitter.off(
      (_e = (_d = this.options) == null ? void 0 : _d.errorKeyword) != null
        ? _e
        : "$err",
      this.errorHandler
    );
    this.eventEmitter.off(
      (_g = (_f = this.options) == null ? void 0 : _f.chunkKeyword) != null
        ? _g
        : "$chunk",
      this.chunkHandler
    );
    this.eventEmitter.off(
      (_i = (_h = this.options) == null ? void 0 : _h.chunkedReplKeyword) !=
        null
        ? _i
        : "$chunkedRepl",
      this.chunkedReplHandler
    );
  }
  static waitFor(eventEmitter, event) {
    return new Promise((resolve) => {
      function handler(...args) {
        resolve(args.length === 1 ? args[0] : args);
        eventEmitter.off(event, handler);
      }
      eventEmitter.on(event, handler);
    });
  }
  isValid() {
    var _a2;
    return (_a2 = this.eventEmitter.valid) != null ? _a2 : true;
  }
  log(msg, ...args) {}
  registerMethod(event, callback) {
    if (!this.eventEmitter.valid) return -1;
    const handler = (promiseId, ...args) =>
      __async(this, null, function* () {
        var _a2;
        try {
          const res = yield callback(...args);
          this.answer(promiseId, res);
        } catch (e) {
          this.error(
            promiseId,
            String((_a2 = e == null ? void 0 : e.stack) != null ? _a2 : e)
          );
        }
      });
    const id = this.lastRegisteredMethod++;
    this.registeredMethods.set(id, [event, handler]);
    this.eventEmitter.on(event, handler);
    return id;
  }
  unregisterMethod(id) {
    if (!this.eventEmitter.valid) return;
    const method = this.registeredMethods.get(id);
    if (!method) return;
    this.eventEmitter.off(method[0], method[1]);
    this.registeredMethods.delete(id);
  }
  request(event, ...args) {
    this.log("requested " + event, this.eventEmitter);
    const promise = new Deferred();
    const id = this.push(promise, event);
    this.eventEmitter.emit(event, id, ...args);
    return promise;
  }
  requestWithoutTimeout(event, ...args) {
    this.log("requested " + event, this.eventEmitter);
    const promise = new Deferred();
    const id = this.push(promise, event, true);
    this.eventEmitter.emit(event, id, ...args);
    return promise;
  }
  push(promise, name = "", disableTimeout) {
    this.waitingPromises.set(this.promiseId, [
      Date.now(),
      name,
      promise,
      disableTimeout,
    ]);
    return this.promiseId++;
  }
  pop(promiseId) {
    this.waitingPromises.delete(promiseId);
  }
  answer(promiseId, ...value) {
    this.log("answer called " + promiseId);
    Promise.all(value).then((values) => {
      var _a2, _b;
      return this.eventEmitter.emit(
        (_b = (_a2 = this.options) == null ? void 0 : _a2.replKeyword) != null
          ? _b
          : "$repl",
        promiseId,
        ...values
      );
    });
  }
  error(promiseId, error) {
    var _a2, _b;
    this.log("error called " + promiseId);
    this.eventEmitter.emit(
      (_b = (_a2 = this.options) == null ? void 0 : _a2.errorKeyword) != null
        ? _b
        : "$err",
      promiseId,
      error
    );
  }
  on(event, handler) {
    if (!this.eventEmitter.valid) return;
    this.eventEmitter.on(event, handler);
  }
  off(event, handler) {
    if (!this.eventEmitter.valid) return;
    this.eventEmitter.off(event, handler);
  }
  onError(handler) {
    this.errorHandlers.push(handler);
  }
  offError(handler) {
    this.errorHandlers = this.errorHandlers.filter((e) => e !== handler);
  }
  emit(event, ...args) {
    this.eventEmitter.emit(event, ...args);
  }
};

// WebView.ts
var webview = new alt.WebView(
  true ? "http://resource/dist/frontend/index.html" : "localhost:3000"
);
var webviewRPC = new GenericRPC(webview, {
  name: "client-webview",
});
webview.on("load", () => {
  webviewRPC.registerMethod("get", (key) => {
    return alt.LocalStorage.get(key);
  });
  webview.on("save", (key, value) => {
    alt.LocalStorage.set(key, value);
    alt.LocalStorage.save();
  });
  webview.emit("ready");
});

// controllers/CodeEditorController.ts

// Server.ts
init_define_process();
import alt2 from "alt-client";
var serverRPC = new GenericRPC(
  {
    emit: alt2.emitServer,
    on: alt2.onServer,
    off: alt2.offServer,
  },
  {
    name: "client-server",
  }
);

// controllers/MouseController.ts
init_define_process();
import alt4 from "alt-client";

// controllers/ControlsController.ts
init_define_process();
import alt3 from "alt-client";
var _ControlsController = class {
  constructor() {}
  _blockers = [];
  get count() {
    return this._blockers.length;
  }
  block(name) {
    this._blockers.push(name);
    alt3.toggleGameControls(false);
  }
  unblock(name) {
    this._blockers = this._blockers.filter((b) => b != name);
    if (!this._blockers.length) alt3.toggleGameControls(true);
  }
};
var ControlsController = _ControlsController;
__publicField(ControlsController, "instance", new _ControlsController());

// controllers/MouseController.ts
var _MouseController = class {
  constructor() {
    alt4.on("keydown", this.onKeydown);
  }
  _state = false;
  get state() {
    return this._state;
  }
  onKeydown = (key) => {
    if (key !== 113) return;
    this.toggleMouse();
  };
  toggleMouse(newState) {
    if (this._state === newState && newState != null) return;
    alt4.showCursor((this._state = newState ?? !this._state));
    if (this._state) {
      webview.focus();
      ControlsController.instance.block("mouse");
    } else {
      webview.unfocus();
      ControlsController.instance.unblock("mouse");
    }
    alt4.emit("cursorState", this._state);
  }
};
var MouseController = _MouseController;
__publicField(MouseController, "instance", new _MouseController());

// utils/Utils.ts
init_define_process();
import { RGBA, Vector3 as Vector32 } from "alt-client";
import alt8, { Vector3 as Vector35 } from "alt-client";
import alt9, { Vector3 as Vector36 } from "alt-client";
import natives from "natives";
var Utils;
(function (Utils2) {
  Utils2.AsyncFunction = Object.getPrototypeOf(
    async function () {}
  ).constructor;
  Utils2.Rad2Deg = 180 / Math.PI;
  Utils2.asyncTimeout = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
  Utils2.clamp = clamp;
  function rotationToForward(rot) {
    const adjustedRotation = rot.mul(Math.PI / 180);
    return new Vector32(
      -Math.sin(adjustedRotation.z) * Math.abs(Math.cos(adjustedRotation.x)),
      Math.cos(adjustedRotation.z) * Math.abs(Math.cos(adjustedRotation.x)),
      Math.sin(adjustedRotation.x)
    );
  }
  Utils2.rotationToForward = rotationToForward;
  function render2DText(
    text,
    pos,
    textScale,
    color = new RGBA(255, 255, 255, 255),
    font = 0,
    outline = true
  ) {
    natives.beginTextCommandDisplayText("STRING");
    natives.addTextComponentSubstringPlayerName(text);
    natives.setTextFont(font);
    natives.setTextScale(0, textScale);
    natives.setTextWrap(0, 1);
    natives.setTextCentre(true);
    natives.setTextColour(color.r, color.g, color.b, color.a);
    if (outline) natives.setTextOutline();
    natives.setTextProportional(true);
    natives.endTextCommandDisplayText(pos.x, pos.y, 0);
  }
  Utils2.render2DText = render2DText;
  function drawBoxWithPolygons(
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    red,
    green,
    blue,
    alpha
  ) {
    natives.drawPoly(
      v6.x,
      v6.y,
      v6.z,
      v5.x,
      v5.y,
      v5.z,
      v1.x,
      v1.y,
      v1.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v1.x,
      v1.y,
      v1.z,
      v2.x,
      v2.y,
      v2.z,
      v6.x,
      v6.y,
      v6.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v7.x,
      v7.y,
      v7.z,
      v3.x,
      v3.y,
      v3.z,
      v8.x,
      v8.y,
      v8.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v4.x,
      v4.y,
      v4.z,
      v3.x,
      v3.y,
      v3.z,
      v7.x,
      v7.y,
      v7.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v6.x,
      v6.y,
      v6.z,
      v2.x,
      v2.y,
      v2.z,
      v4.x,
      v4.y,
      v4.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v4.x,
      v4.y,
      v4.z,
      v7.x,
      v7.y,
      v7.z,
      v6.x,
      v6.y,
      v6.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v6.x,
      v6.y,
      v6.z,
      v8.x,
      v8.y,
      v8.z,
      v5.x,
      v5.y,
      v5.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v7.x,
      v7.y,
      v7.z,
      v8.x,
      v8.y,
      v8.z,
      v6.x,
      v6.y,
      v6.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v5.x,
      v5.y,
      v5.z,
      v3.x,
      v3.y,
      v3.z,
      v1.x,
      v1.y,
      v1.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v8.x,
      v8.y,
      v8.z,
      v3.x,
      v3.y,
      v3.z,
      v5.x,
      v5.y,
      v5.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v1.x,
      v1.y,
      v1.z,
      v3.x,
      v3.y,
      v3.z,
      v2.x,
      v2.y,
      v2.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawPoly(
      v2.x,
      v2.y,
      v2.z,
      v3.x,
      v3.y,
      v3.z,
      v4.x,
      v4.y,
      v4.z,
      red,
      green,
      blue,
      alpha
    );
  }
  Utils2.drawBoxWithPolygons = drawBoxWithPolygons;
  function drawBoxWithLines(
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    red,
    green,
    blue,
    alpha
  ) {
    natives.drawLine(
      v1.x,
      v1.y,
      v1.z,
      v2.x,
      v2.y,
      v2.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v1.x,
      v1.y,
      v1.z,
      v3.x,
      v3.y,
      v3.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v3.x,
      v3.y,
      v3.z,
      v4.x,
      v4.y,
      v4.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v4.x,
      v4.y,
      v4.z,
      v2.x,
      v2.y,
      v2.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v5.x,
      v5.y,
      v5.z,
      v8.x,
      v8.y,
      v8.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v8.x,
      v8.y,
      v8.z,
      v7.x,
      v7.y,
      v7.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v7.x,
      v7.y,
      v7.z,
      v6.x,
      v6.y,
      v6.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v5.x,
      v5.y,
      v5.z,
      v6.x,
      v6.y,
      v6.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v5.x,
      v5.y,
      v5.z,
      v1.x,
      v1.y,
      v1.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v6.x,
      v6.y,
      v6.z,
      v2.x,
      v2.y,
      v2.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v7.x,
      v7.y,
      v7.z,
      v4.x,
      v4.y,
      v4.z,
      red,
      green,
      blue,
      alpha
    );
    natives.drawLine(
      v8.x,
      v8.y,
      v8.z,
      v3.x,
      v3.y,
      v3.z,
      red,
      green,
      blue,
      alpha
    );
  }
  Utils2.drawBoxWithLines = drawBoxWithLines;
})(Utils || (Utils = {}));
var Utils_default = Utils;

// ../shared/codeHelpers.ts
init_define_process();
var codeHelpers = {
  asyncTimeout: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

// controllers/CodeEditorController.ts
var AsyncFunction = Utils_default.AsyncFunction;
var _CodeEditorController = class {
  constructor() {
    webviewRPC.registerMethod("eval", async (type, id, code) => {
      if (type === 0) {
        return await _CodeEditorController.evalClientCode(id, code);
      } else if (type === 1) {
        return await _CodeEditorController.evalServerCode(id, code);
      }
    });
    alt5.onServer("codeEditor:log", (id, data) => {
      webview.emit("log", id, data);
    });
    alt5.on("keydown", this.onKeydown);
  }
  _state = false;
  _opacity = false;
  static async evalClientCode(id, code) {
    try {
      const res = await new AsyncFunction(
        "alt",
        "console",
        "native",
        "natives",
        "game",
        ...Object.keys(codeHelpers),
        code
      )(
        _CodeEditorController.patchAlt(id),
        _CodeEditorController.patchConsole(id),
        natives2,
        natives2,
        natives2,
        ...Object.values(codeHelpers)
      );
      return import_util.default.inspect(
        res,
        _CodeEditorController.inspectSettings
      );
    } catch (e) {
      if (e instanceof Error) {
        return _CodeEditorController.colorizeError(String(e.stack));
      }
      return _CodeEditorController.colorizeError(
        import_util.default.inspect(e, {
          ..._CodeEditorController.inspectSettings,
          colors: false,
        })
      );
    }
  }
  static async evalServerCode(id, code) {
    return await serverRPC.request("codeEditor:eval", code, id);
  }
  onKeydown = (key) => {
    if (key === 117) {
      this._state = !this._state;
      if (this._state) {
        ControlsController.instance.block("codeEditor");
        MouseController.instance.toggleMouse(true);
      } else {
        ControlsController.instance.unblock("codeEditor");
        MouseController.instance.toggleMouse(false);
      }
      webview.emit("toggle", "codeEditor", this._state);
    }
    if (key === 116) {
      webview.emit(
        "codeEditor:halfTransparent",
        (this._opacity = !this._opacity)
      );
    }
  };
};
var CodeEditorController = _CodeEditorController;
__publicField(CodeEditorController, "instance", new _CodeEditorController());
__publicField(CodeEditorController, "inspectSettings", {
  colors: true,
  breakLength: 80,
});
__publicField(
  CodeEditorController,
  "colorizeError",
  (text) => "[31;1m[Error] " + text + "[0m"
);
__publicField(
  CodeEditorController,
  "colorizeWarning",
  (text) => "[33;1m[Warning] " + text + "[0m"
);
__publicField(
  CodeEditorController,
  "colorizeInfo",
  (text) => "[36;1m[Info] " + text + "[0m"
);
__publicField(
  CodeEditorController,
  "formatAltLog",
  (text) =>
    text
      .replace(/~k~/g, "[30m")
      .replace(/~r~/g, "[31m")
      .replace(/~g~/g, "[32m")
      .replace(/~y~/g, "[33m")
      .replace(/~b~/g, "[34m")
      .replace(/~m~/g, "[35m")
      .replace(/~c~/g, "[36m")
      .replace(/~w~/g, "[37m")
      .replace(/~lk~/g, "[30;1m")
      .replace(/~lr~/g, "[31;1m")
      .replace(/~lg~/g, "[32;1m")
      .replace(/~ly~/g, "[33;1m")
      .replace(/~lb~/g, "[34;1m")
      .replace(/~lm~/g, "[35;1m")
      .replace(/~lc~/g, "[36;1m")
      .replace(/~lw~/g, "[37;1m") + "[0m"
);
__publicField(
  CodeEditorController,
  "formatArgs",
  (args, colors = true) =>
    args
      .map((e) =>
        typeof e === "string"
          ? e
          : import_util.default.inspect(e, {
              ..._CodeEditorController.inspectSettings,
              colors,
            })
      )
      .join(" ") + "[0m"
);
__publicField(CodeEditorController, "patchAlt", (id) => {
  return {
    ...alt5,
    log: (...args) => {
      alt5.log(...args);
      webview.emit(
        "log",
        id,
        _CodeEditorController.formatAltLog(
          _CodeEditorController.formatArgs(args)
        )
      );
    },
    logWarning: (...args) => {
      alt5.logWarning(...args);
      webview.emit(
        "log",
        id,
        _CodeEditorController.colorizeWarning(
          _CodeEditorController.formatArgs(args, false)
        )
      );
    },
    logError: (...args) => {
      alt5.logError(...args);
      webview.emit(
        "log",
        id,
        _CodeEditorController.colorizeError(
          _CodeEditorController.formatArgs(args, false)
        )
      );
    },
  };
});
__publicField(CodeEditorController, "patchConsole", (id) => {
  return {
    ...console,
    log: (...args) => {
      console.log(...args);
      webview.emit(
        "log",
        id,
        _CodeEditorController.formatAltLog(
          _CodeEditorController.formatArgs(args)
        )
      );
    },
    warn: (...args) => {
      console.warn(...args);
      webview.emit(
        "log",
        id,
        _CodeEditorController.colorizeWarning(
          _CodeEditorController.formatArgs(args, false)
        )
      );
    },
    error: (...args) => {
      console.error(...args);
      webview.emit(
        "log",
        id,
        _CodeEditorController.colorizeError(
          _CodeEditorController.formatArgs(args, false)
        )
      );
    },
    info: (...args) => {
      console.info(...args);
      webview.emit(
        "log",
        id,
        _CodeEditorController.colorizeInfo(
          _CodeEditorController.formatArgs(args, false)
        )
      );
    },
  };
});

// controllers/ModelInspectorController.ts
init_define_process();
import alt7, { Vector3 as Vector34 } from "alt-client";
import natives3 from "natives";

// utils/ScreenToWorld.ts
init_define_process();
import alt6, { Vector3 as Vector33 } from "alt-client";
import native from "natives";
function w2s(position) {
  let result = native.getScreenCoordFromWorldCoord(
    position.x,
    position.y,
    position.z,
    void 0,
    void 0
  );
  if (!result[0]) return void 0;
  return new Vector33((result[1] - 0.5) * 2, (result[2] - 0.5) * 2, 0);
}
function processCoordinates(x, y) {
  const res = native.getActualScreenResolution(0, 0);
  let screenX = res[1];
  let screenY = res[2];
  let relativeX = 1 - (x / screenX) * 2;
  let relativeY = 1 - (y / screenY) * 2;
  if (relativeX > 0) {
    relativeX = -relativeX;
  } else {
    relativeX = Math.abs(relativeX);
  }
  if (relativeY > 0) {
    relativeY = -relativeY;
  } else {
    relativeY = Math.abs(relativeY);
  }
  return { x: relativeX, y: relativeY };
}
function s2w(camPos, relX, relY) {
  let camRot = native.getGameplayCamRot(0);
  let camForward = Utils_default.rotationToForward(camRot);
  let rotUp = camRot.add({ x: 10, y: 0, z: 0 });
  let rotDown = camRot.add({ x: -10, y: 0, z: 0 });
  let rotLeft = camRot.add({ x: 0, y: 0, z: -10 });
  let rotRight = camRot.add({ x: 0, y: 0, z: 10 });
  let camRight = Utils_default.rotationToForward(rotRight).sub(
    Utils_default.rotationToForward(rotLeft)
  );
  let camUp = Utils_default.rotationToForward(rotUp).sub(
    Utils_default.rotationToForward(rotDown)
  );
  let rollRad = -degToRad(camRot.y);
  let camRightRoll = camRight
    .mul(Math.cos(rollRad))
    .sub(camUp.mul(Math.sin(rollRad)));
  let camUpRoll = camRight
    .mul(Math.sin(rollRad))
    .add(camUp.mul(Math.cos(rollRad)));
  let point3D = camPos.add(camForward.mul(10)).add(camRightRoll).add(camUpRoll);
  let point2D = w2s(point3D);
  if (point2D === void 0) {
    return camPos.add(camForward.mul(10));
  }
  let point3DZero = camPos.add(camForward.mul(10));
  let point2DZero = w2s(point3DZero);
  if (point2DZero === void 0) {
    return camPos.add(camForward.mul(10));
  }
  let eps = 1e-3;
  if (
    Math.abs(point2D.x - point2DZero.x) < eps ||
    Math.abs(point2D.y - point2DZero.y) < eps
  ) {
    return camPos.add(camForward.mul(10));
  }
  let scaleX = (relX - point2DZero.x) / (point2D.x - point2DZero.x);
  let scaleY = (relY - point2DZero.y) / (point2D.y - point2DZero.y);
  return camPos
    .add(camForward.mul(10))
    .add(camRightRoll.mul(scaleX))
    .add(camUpRoll.mul(scaleY));
}
function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
function screenToWorld() {
  let x = alt6.getCursorPos().x;
  let y = alt6.getCursorPos().y;
  let absoluteX = x;
  let absoluteY = y;
  let camPos = native.getGameplayCamCoord();
  let processedCoords = processCoordinates(absoluteX, absoluteY);
  let target = s2w(camPos, processedCoords.x, processedCoords.y);
  let dir = target.sub(camPos);
  return camPos.add(dir.mul(300));
}

// controllers/ModelInspectorController.ts
var _ModelInspectorController = class {
  constructor() {
    alt7.everyTick(this.onEveryTick);
    alt7.setInterval(this.cast, 50);
    alt7.on("keydown", this.onKeydown);
  }
  _state = false;
  _currentObject;
  onKeydown = (key) => {
    if (key === 114) {
      this._state = !this._state;
    } else if (this._state && key === 69) {
      const str = this.getString();
      if (str) alt7.log(str);
    }
  };
  getString() {
    if (!this._currentObject) return null;
    const obj = this._currentObject;
    const entity = alt7.Entity.getByScriptID(+obj.id);
    let str = `ScriptID: ${obj.id}~n~Model: ${obj.model}~n~Texture: ${
      obj.textureVariation
    }~n~Coord: ${obj.coord.x.toFixed(3)} ${obj.coord.y.toFixed(
      3
    )} ${obj.coord.z.toFixed(3)}~n~Rot: ${obj.rot.x.toFixed(
      3
    )} ${obj.rot.y.toFixed(3)} ${obj.rot.z.toFixed(3)}~n~`;
    if (entity)
      str += `Entity: ${entity.constructor.name}~n~Entity ID: ${entity.id}~n~`;
    return str;
  }
  onEveryTick = () => {
    if (!this._state) return;
    const resolution = natives3.getActualScreenResolution(0, 0);
    const height = 3 / resolution[2];
    const width = (height * resolution[2]) / resolution[1];
    natives3.drawRect(0.5, 0.5, width, height, 255, 255, 255, 255, true);
    if (!this._currentObject) {
      natives3.beginTextCommandDisplayHelp("STRING");
      natives3.addTextComponentSubstringPlayerName(
        `Use the crosshair or mouse pointer (F2) to select the target object`
      );
      natives3.endTextCommandDisplayHelp(0, false, false, 0);
      return;
    }
    const obj = this._currentObject;
    if (obj.vertexes) {
      Utils_default.drawBoxWithLines(...obj.vertexes, 255, 255, 255, 255);
      Utils_default.drawBoxWithPolygons(...obj.vertexes, 255, 0, 0, 128);
    }
    natives3.beginTextCommandDisplayHelp("STRING");
    natives3.addTextComponentSubstringTextLabel("modelHelp");
    alt7.addGxtText("modelHelp", this.getString());
    natives3.endTextCommandDisplayHelp(0, false, false, 0);
  };
  cast = () => {
    const start = natives3.getGameplayCamCoord();
    const end = MouseController.instance.state
      ? screenToWorld()
      : start.add(
          Utils_default.rotationToForward(natives3.getGameplayCamRot(2)).mul(
            300
          )
        );
    const raycast = natives3.startExpensiveSynchronousShapeTestLosProbe(
      start.x,
      start.y,
      start.z,
      end.x,
      end.y,
      end.z,
      -1,
      alt7.Player.local.scriptID,
      4
    );
    const [, hit, endCoords, , entityHit] =
      natives3.getShapeTestResult(raycast);
    if (!hit) return (this._currentObject = void 0);
    const hasDrawable = natives3.doesEntityHaveDrawable(entityHit);
    const model = hasDrawable ? natives3.getEntityModel(entityHit) : -1;
    let vertexes = void 0;
    if (hasDrawable) {
      const [, minVR, maxVR] = natives3.getModelDimensions(model);
      const [minV, maxV] = [
        new Vector34(-1e-3, -1e-3, -1e-3).add(minVR),
        new Vector34(1e-3, 1e-3, 1e-3).add(maxVR),
      ];
      vertexes = [
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          minV.x,
          minV.y,
          maxV.z
        ),
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          minV.x,
          maxV.y,
          maxV.z
        ),
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          maxV.x,
          minV.y,
          maxV.z
        ),
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          maxV.x,
          maxV.y,
          maxV.z
        ),
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          minV.x,
          minV.y,
          minV.z
        ),
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          minV.x,
          maxV.y,
          minV.z
        ),
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          maxV.x,
          maxV.y,
          minV.z
        ),
        natives3.getOffsetFromEntityInWorldCoords(
          entityHit,
          maxV.x,
          minV.y,
          minV.z
        ),
      ];
    }
    this._currentObject = {
      id: entityHit,
      model,
      coord: natives3.getEntityCoords(
        entityHit,
        !natives3.isEntityDead(entityHit, false)
      ),
      rot: natives3.getEntityRotation(entityHit, 2),
      coordHit: endCoords,
      textureVariation: natives3.getObjectTintIndex(entityHit),
      vertexes,
    };
  };
};
var ModelInspectorController = _ModelInspectorController;
__publicField(
  ModelInspectorController,
  "instance",
  new _ModelInspectorController()
);

// index.ts
import natives6 from "natives";

// controllers/FlyController.ts
init_define_process();
import natives4 from "natives";
var _FlyController = class {
  constructor() {
    alt8.on("keydown", this.onKeydown);
    alt8.on("gameEntityCreate", this.onGameEntityCreate);
    alt8.on("streamSyncedMetaChange", this.onStreamSyncedMetaChange);
  }
  onGameEntityCreate = (entity) => {
    if (!(entity instanceof alt8.Player)) return;
    natives4.freezeEntityPosition(entity.id, entity.getStreamSyncedMeta("fly"));
  };
  onStreamSyncedMetaChange = (entity, key, value) => {
    if (!(entity instanceof alt8.Player)) return;
    if (key !== "fly") return;
    natives4.freezeEntityPosition(entity.id, value);
  };
  onKeydown = (key) => {
    if (key !== 115) return;
    if (this._state) this.stop();
    else this.start(alt8.isKeyDown(16));
  };
  _state = false;
  _everyTick;
  _speed = 1;
  _cam;
  start(freecam = false) {
    if (this._state) return;
    const player = alt8.Player.local;
    if (!freecam && player.vehicle)
      natives4.taskLeaveVehicle(player.scriptID, player.vehicle.scriptID, 16);
    this._state = true;
    if (freecam) {
      this._cam = natives4.createCamWithParams(
        "DEFAULT_SCRIPTED_CAMERA",
        player.pos.x,
        player.pos.y,
        player.pos.z + 1,
        player.rot.x * Utils_default.Rad2Deg,
        player.rot.y * Utils_default.Rad2Deg,
        player.rot.z * Utils_default.Rad2Deg,
        50,
        false,
        2
      );
      natives4.setCamActive(this._cam, true);
      natives4.renderScriptCams(true, false, 0, true, false, 0);
    } else {
      alt8.emitServer("qaTools:fly", true);
      natives4.setEntityCompletelyDisableCollision(
        alt8.Player.local.scriptID,
        false,
        false
      );
    }
    this._everyTick = alt8.everyTick(
      freecam ? this.handleFreecam : this.handle
    );
  }
  stop() {
    if (!this._state) return;
    this._state = false;
    if (this._everyTick) {
      alt8.clearEveryTick(this._everyTick);
      this._everyTick = void 0;
    }
    if (this._cam) {
      natives4.renderScriptCams(false, false, 0, true, false, 0);
      natives4.setCamActive(this._cam, false);
      natives4.destroyCam(this._cam, false);
      this._cam = void 0;
    } else {
      const coord = alt8.Player.local.pos;
      natives4.setEntityCompletelyDisableCollision(
        alt8.Player.local.scriptID,
        true,
        true
      );
      alt8.emitServer("qaTools:fly", false);
      if (!natives4.isDisabledControlPressed(0, 22)) {
        natives4.setEntityCoordsNoOffset(
          alt8.Player.local.scriptID,
          coord.x,
          coord.y,
          natives4.getGroundZFor3dCoord(
            coord.x,
            coord.y,
            coord.z,
            0,
            false,
            false
          )[1],
          false,
          false,
          false
        );
      }
    }
  }
  getNewPos(pos) {
    natives4.hudSuppressWeaponWheelResultsThisFrame();
    for (let blockedKey of _FlyController.blockedKeys) {
      natives4.disableControlAction(0, blockedKey, true);
    }
    let vertSpeed = 0;
    let speed = this._speed;
    if (natives4.isDisabledControlPressed(0, 241)) {
      this._speed = Utils_default.clamp(this._speed + 0.1, 0.1, 10);
    }
    if (natives4.isDisabledControlPressed(0, 242)) {
      this._speed = Utils_default.clamp(this._speed - 0.1, 0.1, 10);
    }
    const posMovementX = natives4.getDisabledControlNormal(0, 218);
    const posMovementY = natives4.getDisabledControlNormal(0, 219);
    if (natives4.isDisabledControlPressed(0, 38)) {
      vertSpeed += this._speed;
    }
    if (natives4.isDisabledControlPressed(0, 44)) {
      vertSpeed -= this._speed;
    }
    if (natives4.isDisabledControlPressed(0, 21)) {
      speed *= 2;
      vertSpeed *= 2;
    }
    if (natives4.isDisabledControlPressed(0, 36)) {
      speed *= 0.5;
      vertSpeed *= 0.5;
    }
    if (ControlsController.instance.count) {
      speed = 0;
      vertSpeed = 0;
    }
    const upVector = { x: 0, y: 0, z: 1 };
    const rot = natives4.getGameplayCamRot(2);
    const rr = new Vector35(rot).toRadians().radiansToDirection();
    const preRightVector = new Vector35(rr.normalize()).cross(upVector);
    const movementVector = {
      x: rr.x * posMovementY * speed,
      y: rr.y * posMovementY * speed,
      z: rr.z * posMovementY * speed,
    };
    const rightVector = {
      x: preRightVector.x * posMovementX * speed,
      y: preRightVector.y * posMovementX * speed,
      z: preRightVector.z * posMovementX * speed,
    };
    return [
      rot,
      new alt8.Vector3(
        pos.x - movementVector.x + rightVector.x,
        pos.y - movementVector.y + rightVector.y,
        pos.z - movementVector.z + vertSpeed
      ),
    ];
  }
  handle = () => {
    if (!this._state) return;
    Utils_default.render2DText(
      "Fly: " + this._speed.toFixed(1),
      new alt8.Vector2(0.95, 0.05),
      0.4
    );
    
    const isControllingVehicle =
      // is driver
      alt8.Player.local.seat === 1
      // is a net owner
      && alt8.Player.local.vehicle?.netOwner === alt8.Player.local;

    const entity = isControllingVehicle
        ? alt8.Player.local.vehicle
        : alt8.Player.local;

    const [rot, newPos] = this.getNewPos(entity.pos);
    natives4.setEntityCoordsNoOffset(
      entity.scriptID,
      newPos.x,
      newPos.y,
      newPos.z,
      true,
      true,
      true
    );
    if (natives4.getFollowPedCamZoomLevel() !== 4)
      natives4.setEntityHeading(entity.scriptID, rot.z);
  };
  handleFreecam = () => {
    if (!this._state || !this._cam) return;
    Utils_default.render2DText(
      "Freecam: " + this._speed.toFixed(1),
      new alt8.Vector2(0.95, 0.05),
      0.4
    );
    const [rot, newPos] = this.getNewPos(natives4.getCamCoord(this._cam));
    natives4.setCamCoord(this._cam, newPos.x, newPos.y, newPos.z);
    natives4.setCamRot(this._cam, rot.x, rot.y, rot.z, 2);
  };
};
var FlyController = _FlyController;
__publicField(FlyController, "instance", new _FlyController());
__publicField(
  FlyController,
  "blockedKeys",
  [30, 31, 21, 36, 22, 44, 38, 71, 72, 59, 60, 42, 43]
);

// controllers/TPController.ts
init_define_process();
import natives2 from "natives";
import natives5 from "natives";
var _TPController = class {
  constructor() {
    alt9.on("keydown", this.onKeydown);
  }
  static getWaypoint(sprite = 8) {
    const waypoint = natives5.getFirstBlipInfoId(sprite);
    if (natives5.doesBlipExist(waypoint)) {
      const coords = natives5.getBlipInfoIdCoord(waypoint);
      return [coords.x, coords.y, coords.z, waypoint];
    }
  }
  onKeydown = async (key) => {
    if (key !== 120) return;
    const point = _TPController.getWaypoint();
    if (!point) return;
    let [found, z] = natives5.getGroundZFor3dCoord(
      point[0],
      point[1],
      9999999,
      0,
      false,
      false
    );
    if (!found) {
      let i = 0;
      ControlsController.instance.block("tp");
      natives5.setFocusPosAndVel(point[0], point[1], point[2], 0, 0, 0);
      while (!found && i < 100) {
        await Utils_default.asyncTimeout(50);
        [found, z] = natives5.getGroundZFor3dCoord(
          point[0],
          point[1],
          9999999,
          0,
          false,
          false
        );
        i++;
      }
      natives5.clearFocus();
      ControlsController.instance.unblock("tp");
    }
    const dimensions = natives5.getModelDimensions(alt9.Player.local.model);
    alt9.emitServer(
      "qaTools:spawn",
      new Vector36(
        point[0],
        point[1],
        z + (dimensions[2].z - dimensions[1].z) / 2
      )
    );
    return true;
  };
};
var TPController = _TPController;
__publicField(TPController, "instance", new _TPController());

// index.ts
ControlsController.instance;
MouseController.instance;
CodeEditorController.instance;
ModelInspectorController.instance;
FlyController.instance;
TPController.instance;
alt10.on("consoleCommand", (cmd, ...args) => {
  if (cmd != "eval") return;
  alt10.log(
    JSON.stringify(
      new Utils_default.AsyncFunction(
        "alt",
        "natives",
        "native",
        "game",
        args.join(" ")
      )(alt10, natives6, natives6, natives6)
    )
  );
});
alt10.onServer("serverLog", (msg) => {
  alt10.log(msg);
});
alt10.onServer("resourceStop", () => FlyController.instance.stop());
