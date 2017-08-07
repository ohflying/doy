/* @flow */

import ObservableObject from './ObservableObject';
import definedUnEnumerableProperty from '../utils/definedUnEnumerableProperty';
import getPrototypeOf from '../utils/getPrototypeOf';

export default class ObservableMap extends ObservableObject {
    constructor(defaultTarget: Map<*, *>, targetName: string, parent: ?ObservableObject) {
        super(defaultTarget, targetName, parent, true, defaultTarget);
    }

    clear() {
        return this.$$notify(getPrototypeOf(this, 'clear').bind(this)());
    }

    delete(key: any) {
        return this.$$notify(getPrototypeOf(this, 'delete').bind(this)(key));
    }

    set(key: any, value: any) {
        return this.$$notify(getPrototypeOf(this, 'set').bind(this)(key, value));
    }

    $$patchTo(target: Object): Object {
        target = target || new Map();
        super.$$patchTo(target);
        ['clear', 'delete', 'set'].forEach((key) => {
            //$FlowIgnore
            definedUnEnumerableProperty(target, key, this[key]);
        });

        return target;
    }
}
