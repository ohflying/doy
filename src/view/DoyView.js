/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import $Scope, { $rootScope } from '../core/$Scope';
import shallowEquals from '../utils/shallowEquals';
import unwrapModule from '../utils/unwrapModule';

class DoyView extends React.Component<*, *, *> {
    static childContextTypes = {
        $curScope: PropTypes.instanceOf($Scope)
    };

    static contextTypes = {
        $curScope: PropTypes.instanceOf($Scope)
    };

    unmount: boolean = false;
    $scope: $Scope;
    constructor(props: Object, context: Object, options: Options = {name: ''}) {
        super(props, context);
        this.$scope = (this.context.$curScope || $rootScope).$new({props: Object.assign({}, props), ...(options.data || {})}, options.name);

        this._bindEvent();
    }

    componentWillUnmount() {
        this.unmount = true;
        this._delayDestroy();
    }

    componentWillReceiveProps(nextProps: Object) {
        if (!shallowEquals(this.props, nextProps)) {
            this.$scope.store.props = Object.assign({}, nextProps);
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
            if (!this.unmount) {
                this.forceUpdate();
            }
        });
    }

    _delayDestroy() {
        setTimeout(() => {
            this.$scope.$destroy();
        });
    }

    renderAction(template: any) {
        if (typeof template === 'function') {
            // lazy load
            if (template.length <= 0) {
                return this.renderAction(unwrapModule(template()));
            }

            return this.$scope.$action(() => {
                return template(this.$scope, this.$scope.store, this);
            });
        }

        if (React.isValidElement(template)) {
            return template;
        }

        return null;
    }
}

export default DoyView;
