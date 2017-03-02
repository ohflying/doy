/**
 * Author: Jeejen.Dong
 * Date  : 17/3/2
 **/
import ObservableObject from './ObservableObject';

export default class ObservableSet extends ObservableObject {
    constructor(defaultTarget: Set, targetName: String, parent: ObservableObject) {
        super(defaultTarget, targetName, parent);

        this.$$atom = true;
        this.$$value = this.$$defaultTarget;
    }

    $$cloneToSelf(defaultTarget) {
    }

    add(value) {
        return this.$$notify(this.$$value.add(value));
    }

    clear() {
        return this.$$notify(this.$$value.clear());
    }

    delete(value) {
        return this.$$notify(this.$$value.delete(value));
    }
}