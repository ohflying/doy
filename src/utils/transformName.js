/* @flow */

export default function transformName(targetName: string, propertyKey: string) {
    return (targetName || '') + (propertyKey ? ((targetName ? '.' : '') + propertyKey) : '');
}
