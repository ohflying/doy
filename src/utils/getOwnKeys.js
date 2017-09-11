/* @flow */

export default function getOwnKeys(obj: Object): Array<string> {
    return Object.keys(obj).filter((key) => {
        return !key.startsWith || !key.startsWith('$$');
    });
}
