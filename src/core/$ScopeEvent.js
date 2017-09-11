/* @flow */

import shallowEquals from '../utils/shallowEquals';

export default class $ScopeEvent {
    _name: string;
    _payload: ?Object;
    _sync: boolean;
    _disposed: boolean = false;
    _stoped: boolean = false;
    constructor(name: string, payload: ?Object = null, sync: boolean = false) {
        this._name = name;
        this._payload = payload;
        this._sync = sync;
    }

    get name(): string {
        return this._name;
    }

    get payload(): ?Object {
        return this._payload;
    }

    get sync(): boolean {
        return this._sync;
    }

    valid(): boolean {
        return !this._disposed && !this._stoped;
    }

    dispose(): void {
        this._disposed = true;
    }

    stopPropagation(): void {
        this._stoped = true;
    }

    equals(event: $ScopeEvent): boolean {
        if (typeof event !== typeof this) {
            return false;
        }

        return this.name === event.name && shallowEquals(this.payload, event.payload);
    }

    static create(eventName: string, payload: ?Object, sync: boolean = false): $ScopeEvent {
        return new $ScopeEvent(eventName, payload, sync);
    }
}
