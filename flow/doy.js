declare module 'doy' {
    declare class $ScopeEvent {
        name: string;
        payload: ?Object;
        sync: boolean;
        valid(): boolean;
        dispose(): void;
        stopPropagation(): void;
        equals(event: $ScopeEvent): boolean;
    }

    declare type DoyConfig = {
        contextTypes?: Object,
        childContextTypes?: Object,
        getChildContext?: () => Object
    }

    declare type ExtendOptions = {
        name: string,
        data?: Object,
        config?: DoyConfig,
        inheritor: ?(scope: $Scope, store: Object, wrapper: React.Component<*, *, *>) => void,
        template: ?() => () => any | (scope: $Scope, store: Object, wrapper: React.Component<*, *, *>)
            => React.Component<*, *, *>
    }

    declare type Options = {
        name: string,
        data?: Object
    }

    declare function Disposer(): any;
    declare function ScopeEventListener(event: $ScopeEvent): any;
    declare class $Scope {
        $apply(): any;
        $watch(modal: string, listener: ScopeEventListener): ?Disposer;
        $on(eventName: string, listener: ScopeEventListener): ?Disposer;
        $emit(eventName: string): ?Disposer;
        $emit(eventName: string, payload: Object): ?Disposer;
        $emit(eventName: string, payload: Object, sync: boolean): ?Disposer;
        $broadcast(eventName: string): ?Disposer;
        $broadcast(eventName: string, payload: Object): ?Disposer;
        $broadcast(eventName: string, payload: Object, sync: boolean): ?Disposer;
        $fire(eventName: string): ?Disposer;
        $fire(eventName: string, payload: Object): ?Disposer;
        $fire(eventName: string, payload: Object, sync: boolean): ?Disposer;
        $new(defaultStore: Object): $Scope;
        $new(defaultStore: Object, name: string): $Scope;
        $action(fn: (scope: $Scope, store: Object) => any): any;
        $destroy(): void;
    }

    declare var $rootScope: $Scope;
    declare class DoyView extends React.Component<*, *, *> {
        $scope: $Scope;
        constructor(props: any, context: any, options: Options): void;
        renderAction(template: any): React.Element<*>;
    }

    declare function extend(option: ExtendOptions): React.Component<*, *, *>;
    declare function atom(obj: Object): Object;
    declare function extensible(obj: Object): Object;
    declare function why(enabled: boolean, printFn: Function): any;
}