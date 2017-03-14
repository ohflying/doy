/**
 * Author: Jeejen.Dong
 * Date  : 17/2/14
 **/

import $ScopeEventManager from './$ScopeEventManager';
import observable from './observable';
import { Reporter } from './why';

class $Scope {
    static NEED_RENDER = '_$$needRender';
    constructor(parentScope: $Scope, defaultStore: Object = {}, name: String = "") {
        this.childScopes = [];
        this._canWatch = false;
        this._name = name;
        this._destroyed = false;
        this.eventManager = new $ScopeEventManager(this);

        this.store = observable(defaultStore || {}, this._getObservableOption(), 'store');
        this._setParentScope(parentScope);
    }

    $apply() {
        if (!this._destroyed) {
            this.$fire($Scope.NEED_RENDER);
        }
    }

    $watch(modal: String, listener: Function): void {
        return this.eventManager.addEventListener(`\$\$${modal.replace(/\./g, '$')}`, listener);
    }

    $on(eventName: String, listener: Function): void {
        return this.eventManager.addEventListener(eventName, listener);
    }

    $emit(eventName: String, payload: Object = {}, sync: Boolean = false): void {
        return this.eventManager.emit(eventName, payload, sync);
    }

    $broadcast(eventName: String, payload: Object = {}, sync: Boolean = false): void {
        return this.eventManager.broadcast(eventName, payload, sync);
    }

    $fire(eventName: String, payload: Object = {}, sync: Boolean = false): void {
        return this.eventManager.fire(eventName, payload, sync);
    }

    $new(defaultStore: Object = {}, name: String = ""): void {
        return new $Scope(this, defaultStore, name);
    }

    $destroy(): void {
        this.parentScope._removeChildScope(this);
        this.eventManager.destroy();

        this._destroyed = true;
    }

    $startWatch(): void {
        this.store.$$notify();
        this._canWatch = true;
    }

    $endWatch(): void {
        this._canWatch = false;
    }

    _getObservableOption(): void {
        let watchNames = [];
        let _self = this;
        return {
            changed: (name) => {
                let eventName = `\$\$${name}`;
                Reporter.print(`$Scope[${this._name}].Store[${eventName}] has changed!`);
                if (_self.eventManager.isExisted(eventName)) {
                    _self.$fire(eventName);
                }
            },
            watch: (name) => {
                let eventName = `\$\$${name}`;
                if (_self._canWatch && !watchNames.includes(eventName)) {
                    Reporter.print(`$Scope[${this._name}].Store[${eventName}] has watched!`);
                    _self.eventManager.addEventListener(eventName, () => {
                        _self.$apply();
                    });

                    watchNames.push(eventName);
                }
            }
        }
    }

    _setParentScope(scope: $Scope): void {
        this.parentScope = scope == ROOT ? null : (scope || $rootScope);
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