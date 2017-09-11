/* @flow */

import $Scope from './$Scope';
import $ScopeEventQueue from './$ScopeEventQueue';

export default class $ScopeEventManager {
    _eventQueue: $ScopeEventQueue;
    _listeners: Map<string, Array<ScopeEventListener>> = new Map();
    _destroyed: boolean = false;
    constructor($scope: $Scope) {
        this._eventQueue = new $ScopeEventQueue($scope);
    }

    addEventListener(eventName: string, listener: ScopeEventListener): ?Disposer {
        if (this._destroyed) {
            return console.warn('the EventManager has destroyed, please check your source logic');
        }

        let listeners = this._listeners.get(eventName) || [];
        listeners.push(listener);

        this._listeners.set(eventName, listeners);

        let self = this;
        return function disposer() {
            let els = self._listeners.get(eventName);
            if (!els) {
                return;
            }

            let index = els.indexOf(listener);
            if (index < 0) {
                return;
            }

            els.splice(index, 1);
        };
    }

    isExisted(eventName: string): boolean {
        let listeners = this._listeners.get(eventName);
        return !!listeners && listeners.length > 0;
    }

    getListenersByEventName(eventName: string): ?Array<ScopeEventListener> {
        return this._listeners.get(eventName);
    }

    emit(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this._eventQueue.emit(eventName, payload, sync);
    }

    broadcast(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this._eventQueue.broadcast(eventName, payload, sync);
    }

    fire(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this._eventQueue.fire(eventName, payload, sync);
    }

    destroy(): void {
        this._destroyed = true;
        this._eventQueue.destroy();
    }
}
