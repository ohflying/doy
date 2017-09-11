/* @flow */
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
    if (first.length !== second.length) {
        return false;
    }

    return first.every((value, index) => {
        return value === second[index];
    });
};

export default class $ScopeEventQueue {
    _scope: $Scope;
    // $FixIgnore
    _queue: Array<EventWrapper> = [];
    _state: number = STATE.IDLE;
    _destroyed: boolean = false;
    constructor(scope: $Scope) {
        this._scope = scope;
    }

    emit(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this._push([EMIT_TYPE.SELF, EMIT_TYPE.PARENT], $ScopeEvent.create(eventName, payload, sync));
    }

    broadcast(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this._push([EMIT_TYPE.SELF, EMIT_TYPE.CHILDREN], $ScopeEvent.create(eventName, payload, sync));
    }

    fire(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this._push([EMIT_TYPE.SELF], $ScopeEvent.create(eventName, payload, sync));
    }

    _push(emitTypes: Array<number>, event: $ScopeEvent): ?Disposer {
        if (this._destroyed) {
            return console.warn(`receive a new event[${event.name}], but the EventQueue has destroyed, please check your source loginc`);
        }

        let eventWrapper: EventWrapper = {
            types: emitTypes,
            event: event
        };

        if (this._canFilterEvent(eventWrapper)) { //丢弃
            return EMPTY;
        }

        let oldEventWrappers = this._getEmitActionInQueue(eventWrapper);
        oldEventWrappers.forEach((wrapper) => {
            let index = this._queue.indexOf(wrapper);
            if (index >= 0) {
                this._queue.splice(index, 1);
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

    _canFilterEvent(eventWrapper: EventWrapper): boolean {
        if (eventWrapper.types.length > 1 || eventWrapper.types[0] !== EMIT_TYPE.SELF) {
            return false;
        }
        return !this._scope.eventManager.isExisted(eventWrapper.event.name);
    }

    _getEmitActionInQueue(eventWrapper: EventWrapper): Array<EventWrapper> {
        return this._queue.filter((wrapper) => {
            return isEqualArray(wrapper.types, eventWrapper.types) && wrapper.event.equals(eventWrapper.event);
        });
    }

    _runQueue(): void {
        setTimeout(() => this._doNextEmitAction());
    }

    _doNextEmitAction(): void {
        if (this._queue.length <= 0) {
            this._state = STATE.IDLE;
            return;
        }

        this._state = STATE.RUNNING;

        let wrapper = this._queue.splice(0, 1)[0];
        if (wrapper) {
            wrapper.types.forEach((type) => {
                this._sendEvent((scope, recursionIndex) => {
                    if (type === EMIT_TYPE.SELF) {
                        return recursionIndex === 0 ? [scope] : null;
                    } else if (type === EMIT_TYPE.CHILDREN) {
                        return scope.childScopes;
                    } else if (type === EMIT_TYPE.PARENT) {
                        return [scope.parentScope];
                    }
                }, wrapper.event);
            });
        }

        this._runQueue();
    }

    _sendEvent(getScopesFn: Function, event: Object): void {
        let recursionIndex = 0;
        let self = this;
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
                            if (!self._destroyed) listener(event);
                        };

                        if (event.sync) {
                            _do();
                        } else {
                            setTimeout(() => { _do(); });
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
