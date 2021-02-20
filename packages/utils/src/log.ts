/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description 日志
 * @export
 * @param {boolean} debug
 * @return {*}  {*}
 */
export default function log(debug: boolean): any {
  return function (...args: any[]) {
    if (debug) {
      // @ts-ignore
      console.log.apply(null, args);
    }
  };
}
