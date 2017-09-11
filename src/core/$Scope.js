/* @flow */

import $ScopeEventManager from './$ScopeEventManager';
import observable from './observable';
import { Reporter } from './why';

class $Scope {
    static NEED_RENDER: string = '_$$needRender';
    store: Object;
    childScopes: Array<$Scope> = [];
    parentScope: ?$Scope;
    eventManager: $ScopeEventManager;
    _name: string;
    _canWatch: boolean = false;
    _destroyed: boolean = false;

    constructor(parentScope: $Scope, defaultStore: Object = {}, name: string = '') {
        this.eventManager = new $ScopeEventManager(this);
        this._name = name;
        this.store = observable(defaultStore || {}, this._getObservableOption(), 'store');
        this._setParentScope(parentScope);
    }

    $apply() {
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

    $new(defaultStore: Object = {}, name: string = ''): $Scope {
        return new $Scope(this, defaultStore, name);
    }

    $destroy(): void {
        this.parentScope && this.parentScope._removeChildScope(this);
        this.eventManager.destroy();

        this._destroyed = true;
    }

    $action(fn: () => any): any {
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
                Reporter.print(`$Scope[${this._name}].Store[${eventName}] has changed!`);
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
                    Reporter.print(`$Scope[${this._name}].Store[${eventName}] has watched!`);
                    watchNames.add(eventName);
                }
            }
        };
    }

    _setParentScope(scope: $Scope): void {
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
