/* @flow */

export const Reporter = {
    enabled: false,
    printFn: null,
    print: (msg: any) => {
        if (!Reporter.enabled) {
            return;
        }

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

export default function why(enabled: boolean, printFn: any): void {
    Reporter.enabled = enabled;
    Reporter.printFn = printFn;
}
