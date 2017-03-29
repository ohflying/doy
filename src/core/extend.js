/**
 * Author: Jeejen.Dong
 * Date  : 17/2/15
 **/

import React from 'react';
import { AppState } from 'react-native';
import shallowEqual from 'fbjs/lib/shallowEqual';
import $Scope, { $rootScope } from './$Scope';
import {isObservable} from '../types/ObservableObject';
import atom from './atom';
import { Reporter } from './why';

const VIEW_LIFECYCLE_EVENT = {
    LOADED: 'view.loaded',
    ENTER: 'view.enter',
    LEAVE: 'view.leave',
    UNLOADED: 'view.unloaded',
};

export default function extend(options: Object = { template: null, inheritor: null}): React.Component {
    class _DoyView extends React.Component {
        $scope: $Scope = null;
        constructor(props: Object, context: Object) {
            super(props, context);
            this.displayName = options.name;
            this.handlerAppStateChanged = this._handlerAppStateChanged.bind(this);
            this.$scope = (this.context.$curScope || $rootScope).$new({props: Object.assign(atom({}), props)}, options.name);
            this.$scope.$$wrapper = this;

            if (options.inheritor) {
                options.inheritor(this.$scope, this.$scope.store);
            }

            Reporter.print(`_DoyView[${this.displayName}]`);

            this._bindEvent();
        }

        componentWillMount() {
            this.$scope.$fire(VIEW_LIFECYCLE_EVENT.LOADED, null, true);
            AppState.addEventListener('change', this.handlerAppStateChanged);

            this._handlerAppStateChanged(AppState.currentState);
        }

        componentWillUnmount() {
            AppState.removeEventListener('change', this.handlerAppStateChanged);
            this.$scope.$fire(VIEW_LIFECYCLE_EVENT.UNLOADED, null, true);
            this.unmount = true;

            this._delayDestroy();
        }

        componentWillReceiveProps(nextProps: Object) {
            Reporter.print(`componentWillReceiveProps[${this.displayName}] ${!shallowEqual(this.props, nextProps)} `);

            if (!shallowEqual(this.props, nextProps)) {
                this.$scope.store.props = Object.assign(atom({}), nextProps);
            }
        }

        shouldComponentUpdate() {
            return false;
        }

        getChildContext() {
            return { $curScope: this.$scope };
        }

        _bindEvent() {
            this.$scope.$on($Scope.NEED_RENDER, () => {
                Reporter.print(`View[${this.displayName}] need render!`);
                if (!this.unmount) {
                    this.forceUpdate();
                }
            });
        }

        _handlerAppStateChanged(nextAppState) {
            switch(nextAppState) {
                case 'background':
                    return this.$scope.$fire(VIEW_LIFECYCLE_EVENT.LEAVE);
                case 'active':
                    return this.$scope.$fire(VIEW_LIFECYCLE_EVENT.ENTER);
            }
        }

        _delayDestroy() {
            setTimeout(() => {
                Reporter.print(`${this.displayName} destroyed!`);
                this.$scope.$destroy()
            });
        }

        render() {
            this.$scope.$startWatch();
            let template = options.template(this.$scope, this.$scope.store);
            this.$scope.$endWatch();

            return template;
        }
    }

    _DoyView.childContextTypes = {
        $curScope: React.PropTypes.object
    };

    _DoyView.contextTypes = {
        $curScope: React.PropTypes.object
    };

    return _DoyView;
}