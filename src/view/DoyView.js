/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import $Scope, { $rootScope } from '../core/$Scope';
import atom from '../core/atom';
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
    autoRenderEnabled: boolean = true;
    needRender: boolean = false;
    $scope: $Scope;
    constructor(props: Object, context: Object, options: Options = {name: ''}) {
        super(props, context);
        this.$scope = (this.context.$curScope || $rootScope).$new({props: Object.assign(atom({}), props), ...(options.data || {})}, options.name);
        //$FlowIgnore
        this.$scope.$$wrapper = this;

        this._bindEvent();
    }

    componentWillMount() {
        this.$scope.$fire('view.loaded', null, true);
    }

    componentWillUnmount() {
        this.$scope.$fire('view.unloaded', null, true);

        this.unmount = true;
        this._delayDestroy();
    }

    componentWillReceiveProps(nextProps: Object) {
        if (!shallowEquals(this.props, nextProps)) {
            this.$scope.store.props = Object.assign(atom({}), nextProps);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    getChildContext() {
        return { $curScope: this.$scope };
    }

    enableAutoRender(enable: boolean): void {
        if (enable === this.autoRenderEnabled) {
            return;
        }

        this.autoRenderEnabled = enable;
        if (this.autoRenderEnabled && this.needRender) {
            this.$scope.$apply();
            this.needRender = false;
        }
    }

    _bindEvent() {
        this.$scope.$on($Scope.NEED_RENDER, () => {
            if (!this.unmount) {
                if (this.autoRenderEnabled) {
                    return this.forceUpdate();
                }

                this.needRender = true;
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
