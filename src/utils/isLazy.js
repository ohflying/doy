/* @flow */

export default function isLazy(load?: ?Function): boolean {
    return !!load && load._isLazy === true;
}
