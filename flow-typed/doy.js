/* @flow */
/* eslint-disable */

declare module 'doy' {
    declare type ObservableOption = {
        changed: (name: string) => void,
        watch: (name: string) => void
    };

    declare type ScopeEventListener = (event: $ScopeEvent) => void;

    declare type Disposer = () => void;

    declare class $ScopeEvent {
        name: string;
        payload: ?Object;
        sync: boolean;
        valid(): boolean;
        dispose(): void;
        stopPropagation(): void;
        equals(event: $ScopeEvent): boolean;
        static create(): void;
    }

    declare class $Scope {
        constructor(parentScope: $Scope): $Scope;
        constructor(parentScope: $Scope, defaultStore: Object): $Scope;
        constructor(parentScope: $Scope, defaultStore: Object, name: string): $Scope;

        $watch(modal: string, listener: ScopeEventListener): ?Disposer;
        $on(eventName: string, listener: ScopeEventListener): ?Disposer;
        $emit(eventName: string): ?Disposer;
        $emit(eventName: string, payload: ?Object): ?Disposer;
        $emit(eventName: string, payload: ?Object, sync: boolean): ?Disposer;
        $broadcast(eventName: string): ?Disposer;
        $broadcast(eventName: string, payload: ?Object): ?Disposer;
        $broadcast(eventName: string, payload: ?Object, sync: boolean): ?Disposer;
        $fire(eventName: string): ?Disposer;
        $fire(eventName: string, payload: ?Object): ?Disposer;
        $fire(eventName: string, payload: ?Object, sync: boolean): ?Disposer;
        $new(defaultStore: any): $Scope;
        $new(defaultStore: any, name: string): $Scope;
        $action(fn: () => any): void;
        $destroy(): void;
        $apply(): void;
    }

    declare var $rootScope: $Scope;
    declare function atom(obj: Object): Object;
    declare function extensible<T>(obj: T): T;
    declare function why(enable: boolean, printFn: (...data: string) => void): void;
}