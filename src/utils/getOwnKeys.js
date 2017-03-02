/**
 * Author: Jeejen.Dong
 * Date  : 17/3/2
 **/

export default function getOwnKeys(obj) {
    return Object.keys(obj).filter((key) => {
        return !key.startsWith || !key.startsWith('$$');
    });
}