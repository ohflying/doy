/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import ObservableObject from './ObservableObject';

export default class ObservableMap extends ObservableObject {
    constructor(defaultTarget: Map, targetName: String, parent: ObservableObject) {
        super(defaultTarget, targetName, parent);

        this.$$atom = true;
        this.$$value = this.$$defaultTarget;
    }

    $$cloneToSelf(defaultTarget) {
    }

    clear() {
        return this.$$notify(this.$$value.clear());
    }

    delete(key) {
        return this.$$notify(this.$$value.delete(key));
    }

    set(key,value) {
        return this.$$notify(this.$$value.set(key, value));
    }
}