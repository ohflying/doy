/* @flow */

export default function isObjectExtensible(obj: any): boolean {
    if (obj === null || typeof obj !== 'object') {
        return false;
    }

    return Object.isExtensible(obj);
};
