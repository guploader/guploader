/**
 * @description 判断是否为二进制对象
 * @export
 * @param {*} blob
 * @returns {boolean}
 */
export default function isBlob(blob: any): boolean {
  return Object.prototype.toString.call(blob) === '[object Blob]';
}
