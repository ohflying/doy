/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

import ObservableObject from './ObservableObject';

export default class ObservableArray extends ObservableObject {
    constructor(defaultTarget: Object, targetName: string, parent: ObservableObject) {
        super(defaultTarget, targetName, parent);

        this.$$atom = true;
        this.$$ignoreProps = ['length'];
    }

    _cloneToSelf(defaultTarget: Object) {
        super._cloneToSelf(defaultTarget);

        ['length'].forEach((key) => {
            this[key] = defaultTarget[key];
        });
    }
}