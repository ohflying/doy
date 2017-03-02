/**
 * Author: Jeejen.Dong
 * Date  : 17/3/2
 **/

import getOwnKeys from './getOwnKeys';

export default function objectEquals(first, second) {
    let keysF = getOwnKeys(first);
    let keysS = getOwnKeys(second);

    if (keysF.length != keysS.length) {
        return false;
    }

    return keysF.every((key) => {
        return first[key] === second[key];
    })
};