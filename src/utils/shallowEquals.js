/* @flow */

import objectEquals from './objectEquals';

export default function shallowEquals(first: any, second: any): boolean {
    //eslint-disable-next-line
    if (first === second || (first !== first && second !== second)) {
        return true;
    }

    if (typeof first !== typeof second || typeof first !== 'object') {
        return false;
    }

    return objectEquals(first, second);
}
