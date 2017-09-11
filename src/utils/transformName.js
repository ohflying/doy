/* @flow */

export default function transformName(targetName: string, propertyKey: string): string {
    return (targetName || '') + (propertyKey ? ((targetName ? '$' : '') + propertyKey) : '');
}
