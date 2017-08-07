/* @flow */

import $ScopeEventManager from './$ScopeEventManager';
import observable from './observable';
import { Reporter } from './why';

class $Scope {
    // static
    static NEED_RENDER: string = '_$$needRender';

    // protected
    _name: string;
    _canWatch: boolean = false;
    _destroyed: boolean = false;

    // public
    parentScope: ?$Scope;
    childScopes: Array<$Scope> = [];
    eventManager: $ScopeEventManager;
    store: Object;

    constructor(parentScope: $Scope | Object, defaultStore: Object = {}, name: string = ''): void {
        this._name = name;
        this.eventManager = new $ScopeEventManager(this);
        this._setParentScope(parentScope);

        Object.defineProperty(this, 'store', {
            writable: false,
            enumerable: true,
            configurable: true,
            value: observable(defaultStore || {}, this._getObservableOption(), 'store', null)
        });
    }

    $apply(): void {
        if (!this._destroyed) {
            this.$fire($Scope.NEED_RENDER);
        }
    }

    $watch(modal: string, listener: ScopeEventListener): ?Disposer {
        return this.eventManager.addEventListener(`$$${modal.replace(/\./g, '$')}`, listener);
    }

    $on(eventName: string, listener: ScopeEventListener): ?Disposer {
        return this.eventManager.addEventListener(eventName, listener);
    }

    $emit(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this.eventManager.emit(eventName, payload, sync);
    }

    $broadcast(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this.eventManager.broadcast(eventName, payload, sync);
    }

    $fire(eventName: string, payload: ?Object = null, sync: boolean = false): ?Disposer {
        return this.eventManager.fire(eventName, payload, sync);
    }

    $new(defaultStore: any, name: string = ''): $Scope {
        return new $Scope(this, defaultStore, name);
    }

    $destroy(): void {
        if (this.parentScope) {
            this.parentScope._removeChildScope(this);
        }

        this.eventManager.destroy();

        this._destroyed = true;
    }

    $action(fn: () => any): void {
        try {
            this.store.$$notify();
            this._canWatch = true;
            return fn();
        } finally {
            this._canWatch = false;
        }
    }

    _getObservableOption(): ObservableOption {
        let watchNames = new Set();
        let _self = this;
        return {
            changed: (name) => {
                let eventName = `$$${name}`;
                Reporter.print(`[CHANGED] $Scope[${this._name}].Store[${eventName}]`);
                if (_self.eventManager.isExisted(eventName)) {
                    _self.$fire(eventName);
                }

                //apply render!
                if (watchNames.has(eventName)) {
                    _self.$apply();
                }
            },
            watch: (name) => {
                let eventName = `$$${name}`;
                if (_self._canWatch && !watchNames.has(eventName)) {
                    Reporter.print(`[WATCH] $Scope[${this._name}].Store[${eventName}]`);
                    watchNames.add(eventName);
                }
            }
        };
    }

    _setParentScope(scope: $Scope | Object): void {
        this.parentScope = scope === ROOT ? null : (scope || $rootScope);
        if (this.parentScope) {
            this.parentScope._addChildScope(this);
        }
    }

    _addChildScope(childScope: $Scope): void {
        if (this.childScopes.includes(childScope)) {
            return;
        }

        this.childScopes.push(childScope);
    }

    _removeChildScope(childScope: $Scope): void {
        let index = this.childScopes.indexOf(childScope);
        if (index < 0) {
            return;
        }

        this.childScopes.splice(index, 1);
    }
}

const ROOT: Object = {};

export const $rootScope: $Scope = new $Scope(ROOT);

export default $Scope;
