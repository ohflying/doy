/* @flow */
import $ScopeEvent from '../src/core/$ScopeEvent';

export type ObservableOption = {
    changed: (name: string) => void,
    watch: (name: string) => void
};

export type ScopeEventListener = (event: $ScopeEvent) => void;

export type Disposer = () => void;
