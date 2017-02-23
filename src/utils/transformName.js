/**
 * Author: Jeejen.Dong
 * Date  : 17/2/22
 **/

export default function transformName(targetName, propertyKey) {
    return (targetName || "") + (propertyKey ? ((targetName ? "$" : "") + propertyKey) : "");
}