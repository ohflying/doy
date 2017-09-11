/* @flow */

import React from 'react';
import $ScopeEvent from './core/$ScopeEvent';
import $Scope from './core/$Scope';

export type ObservableOption = {
    changed: (name: string) => void,
    watch: (name: string) => void
};

export type DoyConfig = {
    contextTypes?: Object,
    childContextTypes?: Object,
    getChildContext?: () => Object
}

export type ExtendOptions = {
    name: string,
    data?: Object,
    config?: DoyConfig,
    inheritor: ?(scope: $Scope, store: Object, wrapper: React.Component<*, *, *>) => void,
    template: ?() => () => any | (scope: $Scope, store: Object, wrapper: React.Component<*, *, *>)
        => React.Component<*, *, *>
}

export type Options = {
    name: string,
    data?: Object
}

export type EventWrapper = {
    types: Array<number>,
    event: $ScopeEvent
}

export type ScopeEventListener = (event: $ScopeEvent) => void;

export type Disposer = () => void;
