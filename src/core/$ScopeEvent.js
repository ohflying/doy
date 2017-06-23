/**
 * Author: Jeejen.Dong
 * Date  : 17/2/16
 **/

import shallowEquals from '../utils/shallowEquals';

export default class $ScopeEvent {
    constructor(name: String, payload: Object = null, sync: Boolean = false) {
        this._name = name;
        this._payload = payload;
        this._sync = sync;
        this._disposed = false;
        this._stoped = false;
    }

    get name(): String {
        return this._name;
    }

    get payload(): Object {
        return this._payload;
    }

    get sync(): Boolean {
        return this._sync;
    }

    valid(): Boolean {
        return !this._disposed && !this._stoped;
    }

    dispose(): void {
        this._disposed = true;
    }

    stopPropagation(): void {
        this._stoped = true;
    }

    equals(event: $ScopeEvent): Boolean {
        if (typeof event != typeof this) {
            return false;
        }

        return this.name === event.name && shallowEquals(this.payload, event.payload);
    }

    static create(eventName: String, payload: Object, sync: Boolean = false): $ScopeEvent {
        return new $ScopeEvent(eventName, payload, sync);
    }
}
