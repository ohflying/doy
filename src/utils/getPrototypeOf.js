/* @flow */

export default function getPrototypeOf(target: any, property: string) {
    return Object.getPrototypeOf(target)[property];
}
