/* @flow */

import objectEquals from './objectEquals';

export default function shallowEquals(first: any, second: any): boolean {
    if (first === second || (first !== first && second !== second)) { // eslint-disable-line
        return true;
    }

    if (typeof first !== typeof second || typeof first !== 'object') {
        return false;
    }

    return objectEquals(first, second);
}
