/**
 * @description 返回url friendly的base64结构
 * @export
 * @param {string} base64
 * @returns {string}
 */
export default function urlSafeBase64(base64: string): string {
  return base64.replace(/\//g, '_').replace(/\+/g, '-');
}
