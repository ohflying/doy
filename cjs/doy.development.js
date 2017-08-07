'use strict';

function getOwnKeys(obj) {
    return Object.keys(obj).filter(function (key) {
        return !key.startsWith || !key.startsWith('$$');
    });
}

function objectEquals(first, second) {
    var keysF = getOwnKeys(first);
    var keysS = getOwnKeys(second);

    if (keysF.length !== keysS.length) {
        return false;
    }

    return keysF.every(function (key) {
        return first[key] === second[key];
    });
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function shallowEquals(first, second) {
    if (first === second || first !== first && second !== second) {
        // eslint-disable-line
        return true;
    }

    if ((typeof first === 'undefined' ? 'undefined' : _typeof(first)) !== (typeof second === 'undefined' ? 'undefined' : _typeof(second)) || (typeof first === 'undefined' ? 'undefined' : _typeof(first)) !== 'object') {
        return false;
    }

    return objectEquals(first, second);
}

var $ScopeEvent = function () {
    function $ScopeEvent(name) {
        var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        classCallCheck(this, $ScopeEvent);

        this._name = name;
        this._payload = payload;
        this._sync = sync;
        this._disposed = false;
        this._stoped = false;
    }
    // private


    createClass($ScopeEvent, [{
        key: 'valid',
        value: function valid() {
            return !this._disposed && !this._stoped;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this._disposed = true;
        }
    }, {
        key: 'stopPropagation',
        value: function stopPropagation() {
            this._stoped = true;
        }
    }, {
        key: 'equals',
        value: function equals(event) {
            if ((typeof event === 'undefined' ? 'undefined' : _typeof(event)) !== _typeof(this)) {
                return false;
            }

            return this.name === event.name && shallowEquals(this.payload, event.payload);
        }
    }, {
        key: 'name',
        get: function get$$1() {
            return this._name;
        }
    }, {
        key: 'payload',
        get: function get$$1() {
            return this._payload;
        }
    }, {
        key: 'sync',
        get: function get$$1() {
            return this._sync;
        }
    }], [{
        key: 'create',
        value: function create(eventName, payload) {
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return new $ScopeEvent(eventName, payload, sync);
        }
    }]);
    return $ScopeEvent;
}();

var STATE = {
    IDLE: 1,
    RUNNING: 2
};

var EMIT_TYPE = {
    SELF: 1,
    CHILDREN: 2,
    PARENT: 3
};

var EMPTY = function EMPTY() {};

var isEqualArray = function isEqualArray(first, second) {
    if (first.length !== second.length) {
        return false;
    }

    return first.every(function (value, index) {
        return value === second[index];
    });
};

var $ScopeEventQueue = function () {
    // private
    function $ScopeEventQueue(scope) {
        classCallCheck(this, $ScopeEventQueue);
        this._queue = [];
        this._state = STATE.IDLE;
        this._destroyed = false;

        this._scope = scope;
    }

    createClass($ScopeEventQueue, [{
        key: 'emit',
        value: function emit(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this._push([EMIT_TYPE.SELF, EMIT_TYPE.PARENT], $ScopeEvent.create(eventName, payload, sync));
        }
    }, {
        key: 'broadcast',
        value: function broadcast(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this._push([EMIT_TYPE.SELF, EMIT_TYPE.CHILDREN], $ScopeEvent.create(eventName, payload, sync));
        }
    }, {
        key: 'fire',
        value: function fire(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this._push([EMIT_TYPE.SELF], $ScopeEvent.create(eventName, payload, sync));
        }
    }, {
        key: '_push',
        value: function _push(emitTypes, event) {
            var _this = this;

            if (this._destroyed) {
                return console.warn('receive a new event[' + event.name + '], but the EventQueue has destroyed, please check your source logic');
            }

            var eventWrapper = {
                types: emitTypes,
                event: event
            };

            if (this._canFilterEvent(eventWrapper)) {
                //filter
                return EMPTY;
            }

            var oldEvents = this._getEmitActionInQueue(eventWrapper);
            oldEvents.forEach(function (event) {
                var index = _this._queue.indexOf(event);
                if (index >= 0) {
                    _this._queue.splice(index, 1);
                }
            });

            this._queue.push(eventWrapper);

            if (this._state !== STATE.RUNNING) {
                this._runQueue();
            }

            return function disposer() {
                event.dispose();
            };
        }
    }, {
        key: '_canFilterEvent',
        value: function _canFilterEvent(eventWrapper) {
            if (eventWrapper.types.length > 1 || eventWrapper.types[0] !== EMIT_TYPE.SELF) {
                return false;
            }
            return !this._scope.eventManager.isExisted(eventWrapper.event.name);
        }
    }, {
        key: '_getEmitActionInQueue',
        value: function _getEmitActionInQueue(eventWrapper) {
            return this._queue.filter(function (event) {
                return isEqualArray(event.types, eventWrapper.types) && event.event.equals(eventWrapper.event);
            });
        }
    }, {
        key: '_runQueue',
        value: function _runQueue() {
            var _this2 = this;

            setTimeout(function () {
                return _this2._doNextEmitAction();
            });
        }
    }, {
        key: '_doNextEmitAction',
        value: function _doNextEmitAction() {
            var _this3 = this;

            if (this._queue.length <= 0) {
                this._state = STATE.IDLE;
                return;
            }

            this._state = STATE.RUNNING;

            var wrapper = this._queue.splice(0, 1)[0];
            if (wrapper) {
                wrapper.types.forEach(function (type) {
                    _this3._sendEvent(function (scope, recursionIndex) {
                        if (type === EMIT_TYPE.SELF) {
                            return recursionIndex === 0 ? [scope] : null;
                        } else if (type === EMIT_TYPE.CHILDREN) {
                            return scope.childScopes;
                        } else if (type === EMIT_TYPE.PARENT && scope.parentScope) {
                            return [scope.parentScope];
                        }
                    }, wrapper.event);
                });
            }

            this._runQueue();
        }
    }, {
        key: '_sendEvent',
        value: function _sendEvent(getScopesFn, event) {
            var recursionIndex = 0;
            function _run(scopes, event) {
                var _this4 = this;

                if (!scopes || !event.valid()) {
                    return;
                }

                scopes.forEach(function (scope) {
                    if (!scope) {
                        return;
                    }

                    var listeners = scope.eventManager.getListenersByEventName(event.name);
                    if (listeners) {
                        listeners.forEach(function (listener) {
                            if (!listener) {
                                return;
                            }

                            var _do = function _do() {
                                if (!_this4._destroyed) listener(event);
                            };

                            if (event.sync) {
                                _do();
                            } else {
                                setTimeout(function () {
                                    return _do();
                                });
                            }
                        });
                    }

                    var nextScopes = getScopesFn(scope, ++recursionIndex);
                    if (nextScopes) {
                        setTimeout(function () {
                            return _run(nextScopes, event);
                        });
                    }
                });
            }

            //$FlowFixMe: the getScopeFn can't be null
            _run(getScopesFn(this._scope, recursionIndex), event);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._destroyed = true;
            this._queue = [];
        }
    }]);
    return $ScopeEventQueue;
}();

var $ScopeEventManager = function () {
    function $ScopeEventManager($scope) {
        classCallCheck(this, $ScopeEventManager);
        this._listeners = new Map();
        this._destroyed = false;

        this._eventQueue = new $ScopeEventQueue($scope);
    }

    /**
     * add event listener to array
     * @param eventName
     * @param listener
     * @returns {function(this:$ScopeEventManager)}
     */

    // private


    createClass($ScopeEventManager, [{
        key: 'addEventListener',
        value: function addEventListener(eventName, listener) {
            var _this = this;

            if (this._destroyed) {
                return console.warn('the EventManager has destroyed, please check your source logic');
            }

            var listeners = this._listeners.get(eventName) || [];
            listeners.push(listener);

            this._listeners.set(eventName, listeners);

            return function () {
                var els = _this._listeners.get(eventName);
                if (!els) {
                    return;
                }

                var index = els.indexOf(listener);
                if (index < 0) {
                    return;
                }

                els.splice(index, 1);
            };
        }

        /**
         * whether listener has been registered
         * @param eventName
         * @returns {Array.<ScopeEventListener>|boolean}
         */

    }, {
        key: 'isExisted',
        value: function isExisted(eventName) {
            var listeners = this._listeners.get(eventName);
            return listeners && listeners.length > 0;
        }
    }, {
        key: 'getListenersByEventName',
        value: function getListenersByEventName(eventName) {
            return this._listeners.get(eventName);
        }
    }, {
        key: 'emit',
        value: function emit(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this._eventQueue.emit(eventName, payload, sync);
        }
    }, {
        key: 'broadcast',
        value: function broadcast(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this._eventQueue.broadcast(eventName, payload, sync);
        }
    }, {
        key: 'fire',
        value: function fire(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this._eventQueue.fire(eventName, payload, sync);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._destroyed = true;
            this._eventQueue.destroy();
        }
    }]);
    return $ScopeEventManager;
}();

function transformName(targetName, propertyKey) {
    return (targetName || '') + (propertyKey ? (targetName ? '.' : '') + propertyKey : '');
}

function isObjectExtensible(obj) {
    if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return false;
    }

    return Object.isExtensible(obj);
}

function definedUnEnumerableProperty(obj, property, value) {
    if (isObjectExtensible(obj)) {
        Object.defineProperty(obj, property, {
            writable: false,
            enumerable: false,
            configurable: true,
            value: value
        });
    }
}

var ObservableObject = function () {
    function ObservableObject(defaultTarget) {
        var targetName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var atom = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var value = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        classCallCheck(this, ObservableObject);
        this.$$observable = true;

        //$FlowFixMe
        this.$$atom = atom || (defaultTarget || {}).$$atom || false;
        this.$$parent = parent;
        this.$$targetName = targetName;
        this.$$name = transformName(parent ? parent.$$name : '', targetName);
        this.$$defaultTarget = defaultTarget;
        this.$$value = value;
    }
    // public


    createClass(ObservableObject, [{
        key: '$$notify',
        value: function $$notify(result) {
            this.$$value = this.$$value;
            return result;
        }
    }, {
        key: '$$patchTo',
        value: function $$patchTo(target) {
            var _this = this;

            target = target || {};
            Object.keys(this).concat('$$notify').forEach(function (key) {
                //$FlowIgnore
                definedUnEnumerableProperty(target, key, _this[key]);
            });

            return target;
        }
    }]);
    return ObservableObject;
}();

var isObservable = function isObservable(obj) {
    return obj && obj.$$observable;
};

var isAtom = function isAtom(obj) {
    return obj && obj.$$atom;
};

var isExtensible = function isExtensible(obj) {
    return obj && obj.$$extensible;
};

function getPrototypeOf(target, property) {
    return Object.getPrototypeOf(target)[property];
}

var ObservableArray = function (_ObservableObject) {
    inherits(ObservableArray, _ObservableObject);

    function ObservableArray(defaultTarget, targetName, parent) {
        classCallCheck(this, ObservableArray);
        return possibleConstructorReturn(this, (ObservableArray.__proto__ || Object.getPrototypeOf(ObservableArray)).call(this, defaultTarget, targetName, parent, true, defaultTarget));
    }

    createClass(ObservableArray, [{
        key: 'pop',
        value: function pop() {
            return this.$$notify(getPrototypeOf(this, 'pop').bind(this)());
        }
    }, {
        key: 'push',
        value: function push(items) {
            return this.$$notify(getPrototypeOf(this, 'push').bind(this)(items));
        }
    }, {
        key: 'reverse',
        value: function reverse() {
            return this.$$notify(getPrototypeOf(this, 'reverse').bind(this)());
        }
    }, {
        key: 'shift',
        value: function shift() {
            return this.$$notify(getPrototypeOf(this, 'shift').bind(this)());
        }
    }, {
        key: 'splice',
        value: function splice(start, deleteCount, items) {
            if (items) {
                return this.$$notify(getPrototypeOf(this, 'splice').bind(this)(start, deleteCount, items));
            } else {
                return this.$$notify(getPrototypeOf(this, 'splice').bind(this)(start, deleteCount));
            }
        }
    }, {
        key: 'unshift',
        value: function unshift(items) {
            return this.$$notify(getPrototypeOf(this, 'unshift').bind(this)(items));
        }
    }, {
        key: '$$patchTo',
        value: function $$patchTo(target) {
            var _this2 = this;

            target = target || [];
            get(ObservableArray.prototype.__proto__ || Object.getPrototypeOf(ObservableArray.prototype), '$$patchTo', this).call(this, target);
            ['pop', 'push', 'reverse', 'shift', 'splice', 'unshift'].forEach(function (key) {
                //$FlowIgnore
                definedUnEnumerableProperty(target, key, _this2[key]);
            });

            return target;
        }
    }]);
    return ObservableArray;
}(ObservableObject);

var ObservableMap = function (_ObservableObject) {
    inherits(ObservableMap, _ObservableObject);

    function ObservableMap(defaultTarget, targetName, parent) {
        classCallCheck(this, ObservableMap);
        return possibleConstructorReturn(this, (ObservableMap.__proto__ || Object.getPrototypeOf(ObservableMap)).call(this, defaultTarget, targetName, parent, true, defaultTarget));
    }

    createClass(ObservableMap, [{
        key: 'clear',
        value: function clear() {
            return this.$$notify(getPrototypeOf(this, 'clear').bind(this)());
        }
    }, {
        key: 'delete',
        value: function _delete(key) {
            return this.$$notify(getPrototypeOf(this, 'delete').bind(this)(key));
        }
    }, {
        key: 'set',
        value: function set$$1(key, value) {
            return this.$$notify(getPrototypeOf(this, 'set').bind(this)(key, value));
        }
    }, {
        key: '$$patchTo',
        value: function $$patchTo(target) {
            var _this2 = this;

            target = target || new Map();
            get(ObservableMap.prototype.__proto__ || Object.getPrototypeOf(ObservableMap.prototype), '$$patchTo', this).call(this, target);
            ['clear', 'delete', 'set'].forEach(function (key) {
                //$FlowIgnore
                definedUnEnumerableProperty(target, key, _this2[key]);
            });

            return target;
        }
    }]);
    return ObservableMap;
}(ObservableObject);

var ObservableSet = function (_ObservableObject) {
    inherits(ObservableSet, _ObservableObject);

    function ObservableSet(defaultTarget, targetName, parent) {
        classCallCheck(this, ObservableSet);
        return possibleConstructorReturn(this, (ObservableSet.__proto__ || Object.getPrototypeOf(ObservableSet)).call(this, defaultTarget, targetName, parent, true, defaultTarget));
    }

    createClass(ObservableSet, [{
        key: 'add',
        value: function add(value) {
            return this.$$notify(getPrototypeOf(this, 'add').bind(this)(value));
        }
    }, {
        key: 'clear',
        value: function clear() {
            return this.$$notify(getPrototypeOf(this, 'clear').bind(this)());
        }
    }, {
        key: 'delete',
        value: function _delete(value) {
            return this.$$notify(getPrototypeOf(this, 'delete').bind(this)(value));
        }
    }, {
        key: '$$patchTo',
        value: function $$patchTo(target) {
            var _this2 = this;

            target = target || new Set();
            get(ObservableSet.prototype.__proto__ || Object.getPrototypeOf(ObservableSet.prototype), '$$patchTo', this).call(this, target);
            ['add', 'clear', 'delete'].forEach(function (key) {
                //$FlowIgnore
                definedUnEnumerableProperty(target, key, _this2[key]);
            });

            return target;
        }
    }]);
    return ObservableSet;
}(ObservableObject);

function isArray(obj) {
    return Array.isArray(obj);
}

function isES6Map(obj) {
    return obj instanceof Map;
}

function isObject$1(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function isES6Set(obj) {
    return obj instanceof Set;
}

var ObservableFactory = function () {
    function ObservableFactory() {
        classCallCheck(this, ObservableFactory);
    }

    createClass(ObservableFactory, null, [{
        key: 'create',
        value: function create(defaultTarget) {
            var targetName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var parentTarget = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            if (!isObjectExtensible(defaultTarget)) {
                return null;
            }

            if (isObservable(defaultTarget)) {
                return Object.assign(defaultTarget, {
                    $$targetName: targetName,
                    $$parent: parentTarget
                });
            }

            if (isArray(defaultTarget)) {
                //$FlowIgnore
                return new ObservableArray(defaultTarget, targetName, parentTarget);
            }

            if (isES6Map(defaultTarget)) {
                return new ObservableMap(defaultTarget, targetName, parentTarget);
            }

            if (isES6Set(defaultTarget)) {
                return new ObservableSet(defaultTarget, targetName, parentTarget);
            }

            if (isObject$1(defaultTarget)) {
                return new ObservableObject(defaultTarget, targetName, parentTarget);
            }

            return null;
        }
    }]);
    return ObservableFactory;
}();

function shallowClone(obj) {
    if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return obj;
    }

    var className = obj.constructor ? obj.constructor.name : '';

    if (className === 'Set' || className === 'Map') {
        return new obj.constructor(obj);
    } else {
        return Object.assign(new obj.constructor(), obj); // eslint-disable-line
    }
}

var JointWrapper = function JointWrapper(target) {
    classCallCheck(this, JointWrapper);
    this.$$joint = true;

    this.target = target;
};

function isPrivateValue(propertyKey) {
    return propertyKey === '$$value';
}

function isObject(obj) {
    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function supportType(obj) {
    if (isExtensible(obj) || !obj.constructor || !obj.constructor.name) {
        //Object
        return true;
    }

    return ['Object', 'Array', 'Map', 'Set'].includes(obj.constructor.name);
}

function needObservable(obj) {
    return isObject(obj) && supportType(obj) && isObjectExtensible(obj) && !isAtom(obj);
}

function jointNewChild(target, options) {
    if (!target || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' || !target.$$parent || !target.$$targetName) {
        return false;
    }

    var newTarget = shallowClone(target);
    target.$$parent[target.$$targetName] = new JointWrapper(observable(newTarget, options, target.$$targetName, target.$$parent));

    jointNewChild(target.$$parent, options);

    return true;
}

function observable(defaultTarget) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var targetName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var parentTarget = arguments[3];

    var target = ObservableFactory.create(defaultTarget, targetName, parentTarget);
    if (!target) {
        return defaultTarget;
    }

    var observableTarget = isObservable(defaultTarget) ? defaultTarget : target.$$patchTo(defaultTarget);

    var handler = function handler(propertyKey) {
        var propertyValue = observableTarget[propertyKey];
        if (!isPrivateValue(propertyKey) && needObservable(propertyValue)) {
            observableTarget[propertyKey] = observable(propertyValue, options, propertyKey, observableTarget);
        }

        //fix In a observable object modified, failed to modify the object of parent
        if (!isPrivateValue(propertyKey) && isObservable(propertyValue) && propertyValue.$$parent !== observableTarget) {
            definedUnEnumerableProperty(observableTarget[propertyKey], '$$parent', observableTarget);
        }

        var descriptor = {
            _value: observableTarget[propertyKey],
            enumerable: !propertyKey.startsWith('$$'),
            get: function get$$1() {
                options && options.watch && options.watch(transformName(observableTarget.$$name, isAtom(observableTarget) || isPrivateValue(propertyKey) ? '' : propertyKey));

                return descriptor._value;
            },
            set: function set$$1(value) {
                var isJoint = false;
                if (value instanceof JointWrapper) {
                    isJoint = value.$$joint;
                    value = value.target;
                }

                var oldValue = descriptor._value;
                if (!isPrivateValue(propertyKey) && oldValue === value) {
                    return true;
                }

                if (!isAtom(observableTarget)) {
                    // re-observer
                    if (isPrivateValue(propertyKey)) {
                        observableTarget = observable(observableTarget, options, observableTarget.$$name, observableTarget.$$parent);
                    } else if (!isAtom(value)) {
                        descriptor._value = observable(value, options, propertyKey, observableTarget);
                    } else {
                        descriptor._value = value;
                    }
                }

                jointNewChild(observableTarget, options);

                //if the target parent not null, the changed event has fired in jointNewChild function;
                if (isJoint) {
                    return true;
                }

                options && options.changed && options.changed(transformName(observableTarget.$$name, isAtom(observableTarget) || isPrivateValue(propertyKey) ? '' : propertyKey));
            }
        };

        Object.defineProperty(observableTarget, propertyKey, descriptor);
    };

    var properties = ['$$value'];
    if (!isAtom(observableTarget)) {
        properties = properties.concat(Object.keys(observableTarget));
    }

    properties.forEach(handler);

    return observableTarget;
}

var Reporter = {
    enabled: false,
    printFn: null,
    print: function print(msg) {
        if (!Reporter.enabled) {
            return;
        }

        var fn = Reporter.printFn || console.log;
        if (fn) {
            try {
                fn(Date.now() + ' ' + msg);
            } catch (e) {
                console.log('print report failed!');
            }
        }
    }
};

function why(enabled, printFn) {
    Reporter.enabled = enabled;
    Reporter.printFn = printFn;
}

var $Scope = function () {

    // public


    // protected
    function $Scope(parentScope) {
        var defaultStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        classCallCheck(this, $Scope);
        this._canWatch = false;
        this._destroyed = false;
        this.$$wrapper = null;
        this.childScopes = [];

        this._name = name;
        this.eventManager = new $ScopeEventManager(this);
        this.store = observable(defaultStore || {}, this._getObservableOption(), 'store', null);
        this._setParentScope(parentScope);
    }
    // static


    createClass($Scope, [{
        key: '$apply',
        value: function $apply() {
            if (!this._destroyed) {
                this.$fire($Scope.NEED_RENDER);
            }
        }
    }, {
        key: '$watch',
        value: function $watch(modal, listener) {
            return this.eventManager.addEventListener('$$' + modal.replace(/\./g, '$'), listener);
        }
    }, {
        key: '$on',
        value: function $on(eventName, listener) {
            return this.eventManager.addEventListener(eventName, listener);
        }
    }, {
        key: '$emit',
        value: function $emit(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this.eventManager.emit(eventName, payload, sync);
        }
    }, {
        key: '$broadcast',
        value: function $broadcast(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this.eventManager.broadcast(eventName, payload, sync);
        }
    }, {
        key: '$fire',
        value: function $fire(eventName) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return this.eventManager.fire(eventName, payload, sync);
        }
    }, {
        key: '$new',
        value: function $new(defaultStore) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            return new $Scope(this, defaultStore, name);
        }
    }, {
        key: '$destroy',
        value: function $destroy() {
            if (this.parentScope) {
                this.parentScope._removeChildScope(this);
            }

            this.eventManager.destroy();

            this._destroyed = true;
        }
    }, {
        key: '$startWatch',
        value: function $startWatch() {
            this.store.$$notify();
            this._canWatch = true;
        }
    }, {
        key: '$endWatch',
        value: function $endWatch() {
            this._canWatch = false;
        }
    }, {
        key: '_getObservableOption',
        value: function _getObservableOption() {
            var _this = this;

            var watchNames = new Set();
            var _self = this;
            return {
                changed: function changed(name) {
                    var eventName = '$$' + name;
                    Reporter.print('$Scope[' + _this._name + '].Store[' + eventName + '] has changed!');
                    if (_self.eventManager.isExisted(eventName)) {
                        _self.$fire(eventName);
                    }

                    //apply render!
                    if (watchNames.has(eventName)) {
                        _self.$apply();
                    }
                },
                watch: function watch(name) {
                    var eventName = '$$' + name;
                    if (_self._canWatch && !watchNames.has(eventName)) {
                        Reporter.print('$Scope[' + _this._name + '].Store[' + eventName + '] has watched!');
                        watchNames.add(eventName);
                    }
                }
            };
        }
    }, {
        key: '_setParentScope',
        value: function _setParentScope(scope) {
            this.parentScope = scope === ROOT ? null : scope || $rootScope;
            if (this.parentScope) {
                this.parentScope._addChildScope(this);
            }
        }
    }, {
        key: '_addChildScope',
        value: function _addChildScope(childScope) {
            if (this.childScopes.includes(childScope)) {
                return;
            }

            this.childScopes.push(childScope);
        }
    }, {
        key: '_removeChildScope',
        value: function _removeChildScope(childScope) {
            var index = this.childScopes.indexOf(childScope);
            if (index < 0) {
                return;
            }

            this.childScopes.splice(index, 1);
        }
    }]);
    return $Scope;
}();

$Scope.NEED_RENDER = '_$$needRender';


var ROOT = {};

var $rootScope = new $Scope(ROOT);

function atom(obj) {
    return Object.assign(obj, { '$$atom': true });
}

function extensible(obj) {
    definedUnEnumerableProperty(obj, '$$extensible', true);
    return obj;
}

var index = {
    $rootScope: $rootScope,
    $Scope: $Scope,
    atom: atom,
    extensible: extensible,
    why: why
};

module.exports = index;
//# sourceMappingURL=doy.development.js.map
