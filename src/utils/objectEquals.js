/* @flow */

import getOwnKeys from './getOwnKeys';

export default function objectEquals(first: Object, second: Object): boolean {
    let keysF = getOwnKeys(first);
    let keysS = getOwnKeys(second);

    if (keysF.length !== keysS.length) {
        return false;
    }

    return keysF.every((key) => {
        return first[key] === second[key];
    });
}
