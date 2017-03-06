/**
 * Author: Jeejen.Dong
 * Date  : 17/2/24
 **/


export const Reporter = {
    enabled: true,
    printFn: null,
    print: (msg) => {
        let fn = Reporter.printFn || console.log;
        if (fn) {
            try {
                fn(Date.now() + ' ' + msg);
            } catch (e) {
                console.log('print report failed!');
            }
        }
    }
};
export default function why(enabled, printFn) {
    Reporter.enabled = enabled;
    Reporter.printFn = printFn;
}