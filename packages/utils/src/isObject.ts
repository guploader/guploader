/**
 * @description 判断是否为js对象
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export default function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
