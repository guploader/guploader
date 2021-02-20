/**
 * @description 创建节流函数
 * @export
 * @param {number} time
 * @returns {(fn: any) => void}
 */
export default function createThrottle(time: number): (fn: any) => void {
  let timer: any = null;
  return function throttle(fn: any): void {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, time);
  };
}
