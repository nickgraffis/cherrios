"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SimpleMdeReact = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _easymde = _interopRequireDefault(require("easymde"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _id = 0;

var generateId = function generateId() {
  return "simplemde-editor-".concat(++_id);
};

var getElementByIdAsync = function getElementByIdAsync(id) {
  return new Promise(function (resolve) {
    var getElement = function getElement() {
      var element = document.getElementById(id);

      if (element) {
        resolve(element);
      } else {
        requestAnimationFrame(getElement);
      }
    };

    getElement();
  });
};

var useHandleEditorInstanceLifecycle = function useHandleEditorInstanceLifecycle(_ref) {
  var options = _ref.options,
      id = _ref.id,
      currentValueRef = _ref.currentValueRef;

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      editor = _useState2[0],
      setEditor = _useState2[1];

  var imageUploadCallback = (0, _react.useCallback)(function (file, onSuccess, onError) {
    var imageUpload = options === null || options === void 0 ? void 0 : options.imageUploadFunction;

    if (imageUpload) {
      var _onSuccess = function _onSuccess(url) {
        onSuccess(url);
      };

      imageUpload(file, _onSuccess, onError);
    }
  }, [options === null || options === void 0 ? void 0 : options.imageUploadFunction]);
  var editorRef = (0, _react.useRef)(editor);
  editorRef.current = editor;
  (0, _react.useEffect)(function () {
    // if this effect is getting called again means options has changed hence old instance shall be removed
    // ref used to avoid endless loop
    if (editorRef.current) {
      var _editorRef$current, _editorRef$current2;

      (_editorRef$current = editorRef.current) === null || _editorRef$current === void 0 ? void 0 : _editorRef$current.toTextArea(); // @ts-expect-error

      (_editorRef$current2 = editorRef.current) === null || _editorRef$current2 === void 0 ? void 0 : _editorRef$current2.cleanup();
    }

    (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var initialOptions, imageUploadFunction;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getElementByIdAsync(id);

            case 2:
              _context.t0 = _context.sent;
              _context.t1 = currentValueRef.current;
              initialOptions = {
                element: _context.t0,
                initialValue: _context.t1
              };
              imageUploadFunction = (options === null || options === void 0 ? void 0 : options.imageUploadFunction) ? imageUploadCallback : undefined;
              setEditor(new _easymde.default(Object.assign({}, initialOptions, options, {
                imageUploadFunction: imageUploadFunction
              })));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [currentValueRef, id, imageUploadCallback, options]);
  var codemirror = (0, _react.useMemo)(function () {
    return editor === null || editor === void 0 ? void 0 : editor.codemirror;
  }, [editor === null || editor === void 0 ? void 0 : editor.codemirror]);
  return {
    editor: editor,
    codemirror: codemirror
  };
};

var SimpleMdeReact = /*#__PURE__*/_react.default.forwardRef(function (props, _ref9) {
  var events = props.events,
      value = props.value,
      options = props.options,
      children = props.children,
      extraKeys = props.extraKeys,
      getLineAndCursor = props.getLineAndCursor,
      getMdeInstance = props.getMdeInstance,
      getCodemirrorInstance = props.getCodemirrorInstance,
      onChange = props.onChange,
      anId = props.id,
      rest = (0, _objectWithoutProperties2.default)(props, ["events", "value", "options", "children", "extraKeys", "getLineAndCursor", "getMdeInstance", "getCodemirrorInstance", "onChange", "id"]);
  var id = (0, _react.useMemo)(function () {
    return anId !== null && anId !== void 0 ? anId : generateId();
  }, [anId]);
  var elementWrapperRef = (0, _react.useRef)(null);
  var nonEventChangeRef = (0, _react.useRef)(true); // This is to not pass value as a dependency e.g. to keep event handlers referentially
  // stable and do not `off` and `on` on each value change
  // plus to avoid unnecessary EasyEde editor recreation on each value change while still, if it has to be remounted
  // due to options and other deps change, to preserve that last value and not the default one from the first render.

  var currentValueRef = (0, _react.useRef)(value);
  currentValueRef.current = value;

  var _useHandleEditorInsta = useHandleEditorInstanceLifecycle({
    options: options,
    id: id,
    currentValueRef: currentValueRef
  }),
      editor = _useHandleEditorInsta.editor,
      codemirror = _useHandleEditorInsta.codemirror;

  (0, _react.useEffect)(function () {
    // If change comes from the event we don't need to update `SimpleMDE` value as it already has it
    // Otherwise we shall set it as it comes from `props` set from the outside. E.g. by some reset button and whatnot
    if (nonEventChangeRef.current) {
      editor === null || editor === void 0 ? void 0 : editor.value(value !== null && value !== void 0 ? value : "");
    }

    nonEventChangeRef.current = true;
  }, [editor, value]);
  var onCodemirrorChangeHandler = (0, _react.useCallback)(function () {
    if ((editor === null || editor === void 0 ? void 0 : editor.value()) !== currentValueRef.current) {
      var _editor$value;

      nonEventChangeRef.current = false;
      onChange === null || onChange === void 0 ? void 0 : onChange((_editor$value = editor === null || editor === void 0 ? void 0 : editor.value()) !== null && _editor$value !== void 0 ? _editor$value : "");
    }
  }, [editor, onChange]);
  (0, _react.useEffect)(function () {
    // For some reason it doesn't work out of the box, this makes sure it's working correctly
    if (options === null || options === void 0 ? void 0 : options.autofocus) {
      codemirror === null || codemirror === void 0 ? void 0 : codemirror.focus();
      codemirror === null || codemirror === void 0 ? void 0 : codemirror.setCursor(codemirror === null || codemirror === void 0 ? void 0 : codemirror.lineCount(), 0);
    }
  }, [codemirror, options === null || options === void 0 ? void 0 : options.autofocus]);
  var getCursorCallback = (0, _react.useCallback)(function () {
    // https://codemirror.net/doc/manual.html#api_selection
    codemirror && (getLineAndCursor === null || getLineAndCursor === void 0 ? void 0 : getLineAndCursor(codemirror.getDoc().getCursor()));
  }, [codemirror, getLineAndCursor]);
  (0, _react.useEffect)(function () {
    getCursorCallback();
  }, [getCursorCallback]);
  (0, _react.useEffect)(function () {
    editor && (getMdeInstance === null || getMdeInstance === void 0 ? void 0 : getMdeInstance(editor));
  }, [editor, getMdeInstance]);
  (0, _react.useEffect)(function () {
    codemirror && (getCodemirrorInstance === null || getCodemirrorInstance === void 0 ? void 0 : getCodemirrorInstance(codemirror));
  }, [codemirror, getCodemirrorInstance, getMdeInstance]);
  (0, _react.useEffect)(function () {
    // https://codemirror.net/doc/manual.html#option_extraKeys
    if (extraKeys && codemirror) {
      codemirror.setOption("extraKeys", Object.assign({}, extraKeys, codemirror.getOption("extraKeys")));
    }
  }, [codemirror, extraKeys]);
  (0, _react.useEffect)(function () {
    var _elementWrapperRef$cu;

    var toolbarNode = (_elementWrapperRef$cu = elementWrapperRef.current) === null || _elementWrapperRef$cu === void 0 ? void 0 : _elementWrapperRef$cu.getElementsByClassName("editor-toolbarNode")[0];

    var handler = function handler() {
      return codemirror && onCodemirrorChangeHandler();
    };

    toolbarNode === null || toolbarNode === void 0 ? void 0 : toolbarNode.addEventListener("click", handler);
    return function () {
      toolbarNode === null || toolbarNode === void 0 ? void 0 : toolbarNode.removeEventListener("click", handler);
    };
  }, [codemirror, onCodemirrorChangeHandler]);
  (0, _react.useEffect)(function () {
    codemirror === null || codemirror === void 0 ? void 0 : codemirror.on("change", onCodemirrorChangeHandler);
    codemirror === null || codemirror === void 0 ? void 0 : codemirror.on("cursorActivity", getCursorCallback);
    return function () {
      codemirror === null || codemirror === void 0 ? void 0 : codemirror.off("change", onCodemirrorChangeHandler);
      codemirror === null || codemirror === void 0 ? void 0 : codemirror.off("cursorActivity", getCursorCallback);
    };
  }, [codemirror, getCursorCallback, onCodemirrorChangeHandler]);
  var prevEvents = (0, _react.useRef)(events);
  (0, _react.useEffect)(function () {
    var isNotFirstEffectRun = events !== prevEvents.current;
    isNotFirstEffectRun && prevEvents.current && Object.entries(prevEvents.current).forEach(function (_ref3) {
      var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
          event = _ref4[0],
          handler = _ref4[1];

      handler && (codemirror === null || codemirror === void 0 ? void 0 : codemirror.off(event, handler));
    });
    events && Object.entries(events).forEach(function (_ref5) {
      var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
          event = _ref6[0],
          handler = _ref6[1];

      handler && (codemirror === null || codemirror === void 0 ? void 0 : codemirror.on(event, handler));
    });
    prevEvents.current = events;
    return function () {
      events && Object.entries(events).forEach(function (_ref7) {
        var _ref8 = (0, _slicedToArray2.default)(_ref7, 2),
            event = _ref8[0],
            handler = _ref8[1];

        handler && (codemirror === null || codemirror === void 0 ? void 0 : codemirror.off(event, handler));
      });
    };
  }, [codemirror, events]);
  return /*#__PURE__*/_react.default.createElement("div", Object.assign({
    id: "".concat(id, "-wrapper")
  }, rest, {
    ref: function ref(aRef) {
      if (typeof _ref9 === "function") {
        _ref9(aRef);
      } else if (_ref9) {
        _ref9.current = aRef;
      }

      elementWrapperRef.current = aRef;
    }
  }), /*#__PURE__*/_react.default.createElement("textarea", {
    id: id,
    style: {
      display: "none"
    }
  }));
});

exports.SimpleMdeReact = SimpleMdeReact;
SimpleMdeReact.displayName = "SimpleMdeReact";
var _default = SimpleMdeReact;
exports.default = _default;

//# sourceMappingURL=index.js.map