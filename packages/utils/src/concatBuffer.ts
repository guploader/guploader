/**
 * @description 拼接buffer
 * @export
 * @param {ArrayBuffer} buf1
 * @param {ArrayBuffer} buf2
 * @returns {ArrayBuffer}
 */
export default function concatBuffer(
  buf1: ArrayBuffer,
  buf2: ArrayBuffer
): ArrayBuffer {
  const tmp = new Uint8Array(buf1.byteLength + buf2.byteLength);
  tmp.set(new Uint8Array(buf1), 0);
  tmp.set(new Uint8Array(buf2), buf1.byteLength);
  return tmp.buffer;
}
