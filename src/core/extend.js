/**
 * Author: Jeejen.Dong
 * Date  : 17/2/15
 **/

import React from 'react';
import { AppState } from 'react-native';
import $Scope, { $rootScope } from './$Scope';
import atom from './atom';
import { isObservable } from '../types/ObservableObject';
import shallowEquals from '../utils/shallowEquals';

const VIEW_LIFECYCLE_EVENT = {
    LOADED: 'view.loaded',
    ENTER: 'view.enter',
    LEAVE: 'view.leave',
    UNLOADED: 'view.unloaded',
};

function copyProperty(obj: Object, maxDeepCount: Number = 2, curDeepIndex: Number = 1) {
    if (!obj || typeof obj != 'object') {
        return obj;
    }

    let newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj.hasOwnProperty(key)) {
            let value = obj[key];
            if (curDeepIndex <= maxDeepCount && !isObservable(value) && typeof value === 'object') {
                newObj[key] = copyProperty(obj[key], maxDeepCount, curDeepIndex + 1);
            } else {
                newObj[key] = obj[key];
            }
        }
    });

    return newObj;
}

export default function extend(options: Object = { template: null, inheritor: null}): React.Component {
    class _DoyView extends React.Component {
        $scope: $Scope = null;

        constructor(props: Object, context: Object) {
            super(props, context);

            this.$scope = (this.context.$curScope || $rootScope).$new({ props: atom(copyProperty(this.props))}, options.name);
            if (options.inheritor) {
                options.inheritor(this.$scope, this.$scope.store);
            }

            this._bindEvent();
        }

        componentWillMount() {
            this.$scope.$fire(VIEW_LIFECYCLE_EVENT.LOADED);
            AppState.addEventListener('change', this._handlerAppStateChanged.bind(this));

            this._handlerAppStateChanged(AppState.currentState);
        }

        componentWillUnmount() {
            AppState.removeEventListener('change', this._handlerAppStateChanged.bind(this));
            this.$scope.$fire(VIEW_LIFECYCLE_EVENT.UNLOADED, {}, true);
            this.unmount = true;

            this._delayDestroy();
        }

        componentWillReceiveProps(nextProps: Object) {
            if (!shallowEquals(this.$scope.store.props, nextProps)) {
                this.$scope.store.props = atom(copyProperty(nextProps));
            }
        }

        shouldComponentUpdate(nextProps, nextState) {
            return this.props !== nextProps || this.state !== nextState;
        }

        getChildContext() {
            return { $curScope: this.$scope };
        }

        _bindEvent() {
            this.$scope.$on($Scope.NEED_RENDER, () => {
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
            setTimeout(() => {this.$scope.$destroy()});
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