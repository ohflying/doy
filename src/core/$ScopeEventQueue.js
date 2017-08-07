/* @flow */

import $Scope from './$Scope';
import $ScopeEvent from './$ScopeEvent';

type EventWrapper = {
    types: Array<number>,
    event: $ScopeEvent
}

const STATE: { IDLE: number, RUNNING: number } = {
    IDLE: 1,
    RUNNING: 2
};

const EMIT_TYPE: { CHILDREN: number, PARENT: number, SELF: number } = {
    SELF: 1,
    CHILDREN: 2,
    PARENT: 3
};

const EMPTY = () => {};

const isEqualArray = function(first, second) {
    if (first.length !== second.length) {
        return false;
    }

    return first.every((value, index) => {
        return value === second[index];
    });
};

export default class $ScopeEventQueue {
    // private
    _scope: $Scope;
    _queue: Array<EventWrapper> = [];
    _state: number = STATE.IDLE;
    _destroyed: boolean = false;

    constructor(scope: $Scope): void {
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
            return console.warn(`receive a new event[${event.name}], but the EventQueue has destroyed, please check your source logic`);
        }

        let eventWrapper: EventWrapper = {
            types: emitTypes,
            event: event
        };

        if (this._canFilterEvent(eventWrapper)) { //filter
            return EMPTY;
        }

        let oldEvents = this._getEmitActionInQueue(eventWrapper);
        oldEvents.forEach((event) => {
            let index = this._queue.indexOf(event);
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
        return this._queue.filter((event) => {
            return isEqualArray(event.types, eventWrapper.types) && event.event.equals(eventWrapper.event);
        });
    }

    _runQueue(): void {
        setTimeout(() => this._doNextEmitAction());
    }

    _doNextEmitAction(): any {
        if (this._queue.length <= 0) {
            this._state = STATE.IDLE;
            return;
        }

        this._state = STATE.RUNNING;

        let wrapper = this._queue.splice(0, 1)[0];
        if (wrapper) {
            wrapper.types.forEach((type: number) => {
                this._sendEvent((scope: $Scope, recursionIndex: number) => {
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

    _sendEvent(getScopesFn: (scope: $Scope, recursionIndex: number) => ?Array<$Scope>, event: $ScopeEvent): void {
        let recursionIndex = 0;
        const _run = (scopes: ?Array<$Scope>, event: $ScopeEvent) => {
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
                            setTimeout(() => _do());
                        }
                    });
                }

                let nextScopes = getScopesFn(scope, ++recursionIndex);
                if (nextScopes) {
                    setTimeout(() => _run(nextScopes, event));
                }
            });
        }

        //$FlowFixMe: the getScopeFn can't be null
        _run(getScopesFn(this._scope, recursionIndex), event);
    }

    destroy(): void {
        this._destroyed = true;
        this._queue = [];
    }
}
