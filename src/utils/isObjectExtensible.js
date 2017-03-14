/**
 * Author: Jeejen.Dong
 * Date  : 17/3/14
 **/

export default function isObjectExtensible(obj) {
    if (obj === null || typeof obj != 'object') {
        return false;
    }

    return Object.isExtensible(obj);
};
