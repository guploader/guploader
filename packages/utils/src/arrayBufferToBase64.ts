/**
 * @description ArrayBuffer 转换为base64
 * @export
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
export default function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
