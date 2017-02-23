/**
 * Author: Jeejen.Dong
 * Date  : 17/2/17
 **/

export default function referenceCopy(src, dst) {
    Object.keys(src).forEach((key) => {
        let value = src[key];

        if (value != null && typeof value === 'object') {
            dst[key] = referenceCopy(value, {});
        } else {
            dst[key] = value;
        }
    });

    return dst;
}