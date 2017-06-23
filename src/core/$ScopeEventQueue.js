/**
 * Author: Jeejen.Dong
 * Date  : 17/2/16
 **/

import $ScopeEvent from './$ScopeEvent';
import $Scope from './$Scope';

const STATE = {
    IDLE: 1,
    RUNNING: 2
};

const EMIT_TYPE = {
    SELF: 1,
    CHILDREN: 2,
    PARENT: 3
};

const EMPTY = function() {};

const isEqualArray = function(first, second) {
    if (first.length != second.length) {
        return false;
    }

    return first.every((value, index) => {
        return value === second[index];
    });
};

export default class $ScopeEventQueue {
    constructor(scope: $Scope) {
        this._scope = scope;
        this._queue = [];
        this._state = STATE.IDLE;
        this._destroyed = false;
    }

    emit(eventName: String, payload: Object = null, sync:Boolean = false): Function {
        return this._push([EMIT_TYPE.SELF, EMIT_TYPE.PARENT], $ScopeEvent.create(eventName, payload, sync));
    }

    broadcast(eventName: String, payload: Object = null, sync:Boolean = false ): Function {
        return this._push([EMIT_TYPE.SELF, EMIT_TYPE.CHILDREN], $ScopeEvent.create(eventName, payload, sync));
    }

    fire(eventName: String, payload: Object = null, sync:Boolean = false): Function {
        return this._push([EMIT_TYPE.SELF], $ScopeEvent.create(eventName, payload, sync));
    }

    _push(emitTypes: Array, event: $ScopeEvent): Function {
        if (this._destroyed) {
            return console.warn(`receive a new event[${event.name}], but the EventQueue has destroyed, please check your source loginc`);
        }

        let scopeEvent = {
            types: emitTypes,
            event: event
        };

        if (this._canFilterEvent(scopeEvent)) { //丢弃
            return EMPTY;
        }

        let oldEvents = this._getEmitActionInQueue(scopeEvent);
        oldEvents.forEach((event) => {
            let index = this._queue.indexOf(event);
            if (index >= 0) {
                this._queue.splice(index, 1);
            }
        });

        this._queue.push(scopeEvent);

        if (this._state !== STATE.RUNNING) {
            this._runQueue();
        }

        return function disposer() {
            event.dispose();
        };
    }

    _canFilterEvent(scopeEvent: Object): Boolean {
        if (scopeEvent.types.length > 1 || scopeEvent.types[0] !== EMIT_TYPE.SELF) {
            return false;
        }
        return !this._scope.eventManager.isExisted(scopeEvent.event.name);
    }

    _getEmitActionInQueue(scopeEvent: Object): $ScopeEvent {
        return this._queue.filter((event) => {
            return isEqualArray(event.types, scopeEvent.types) && event.event.equals(scopeEvent.event);
        });
    }

    _runQueue(): void {
        setTimeout(() => this._doNextEmitAction());
    }

    _doNextEmitAction(): void {
        if (this._queue.length <= 0) {
            return this._state = STATE.IDLE;
        }

        this._state = STATE.RUNNING;

        let wrapper = this._queue.splice(0, 1)[0];
        if (wrapper) {
            wrapper.types.forEach((type) => {
                this._sendEvent((scope, recursionIndex) => {
                    if (type === EMIT_TYPE.SELF) {
                        return recursionIndex == 0 ? [scope] : null;
                    } else if (type === EMIT_TYPE.CHILDREN) {
                        return scope.childScopes;
                    } else if (type === EMIT_TYPE.PARENT) {
                        return [scope.parentScope];
                    }
                }, wrapper.event);
            })
        }

        this._runQueue();
    }

    _sendEvent(getScopesFn: Function, event: Object): void {
        let recursionIndex = 0;
        function _run(scopes, event) {
            if (!scopes || !event.valid()) {
                return;
            }

            scopes.forEach((scope) => {
                if (!scope) {
                    return;
                }

                let listeners = scope.eventManager.getListenersByEventName(event.name);
                if (listeners) {
                    listeners.forEach((listener) => {
                        if (!listener) {
                            return;
                        }

                        const _do = () => {
                            if (!this._destroyed) listener(event);
                        };

                        if (event.sync) {
                            _do();
                        } else {
                            setTimeout(() => { _do();});
                        }
                    });
                }

                let nextScopes = getScopesFn(scope, ++recursionIndex);
                if (nextScopes) {
                    setTimeout(() => _run(nextScopes, event));
                }
            });
        }

        _run(getScopesFn(this._scope, recursionIndex), event);
    }

    destroy(): void {
        this._destroyed = true;
        this._queue = [];
    }
}