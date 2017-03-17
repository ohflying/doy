/**
 * Author: Jeejen.Dong
 * Date  : 17/2/16
 **/

import $Scope from './$Scope';
import $ScopeEventQueue from './$ScopeEventQueue';

export default class $ScopeEventManager {
    constructor($scope: $Scope) {
        this._eventQueue = new $ScopeEventQueue($scope);
        this._listeners = new Map();
        this._destroyed = false;
    }

    addEventListener(eventName: String, listener: Function): Function {
        if (this._destroyed) {
            return console.warn('the EventManager has destroyed, please check your source logic');
        }

        let listeners = this._listeners.get(eventName) || [];
        listeners.push(listener);

        this._listeners.set(eventName, listeners);

        return function disposer() {
            let els = listeners.get(eventName);
            if (!els) {
                return;
            }

            let index = els.indexOf(listener);
            if (index < 0) {
                return;
            }

            els.splice(index, 1);
        }
    }

    isExisted(eventName: String): Boolean {
        let listeners = this._listeners.get(eventName);
        return listeners && listeners.length > 0;
    }

    getListenersByEventName(eventName: String): Array {
        return this._listeners.get(eventName);
    }

    emit(eventName: String, payload: Object = null, sync: Boolean = false): void {
        return this._eventQueue.emit(eventName, payload, sync);
    }

    broadcast(eventName: String, payload: Object = null, sync: Boolean = false): void {
        return this._eventQueue.broadcast(eventName, payload, sync);
    }

    fire(eventName: String, payload: Object = null, sync: Boolean = false): void {
        return this._eventQueue.fire(eventName, payload, sync);
    }

    destroy(): void {
        this._destroyed = true;
        this._eventQueue.destroy();
    }
}