/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

import objectEquals from './objectEquals';

export default function shallowEquals(first, second) {
    if (first === second || (first !== first && second !== second)) {
        return true;
    }

    if (typeof first !== typeof second || typeof first !== 'object') {
        return false;
    }

    return objectEquals(first, second);
}