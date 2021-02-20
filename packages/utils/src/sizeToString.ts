const byteReduce = (
  byte: number
): {
  val: string;
  unit: string;
} => {
  function getNextLevel(byte: number, level = 0): any {
    if (byte >= 1024) {
      return getNextLevel(byte / 1024, level + 1);
    } else {
      const units: any = {
        0: 'B',
        1: 'KB',
        2: 'MB',
        3: 'GB',
        4: 'TB',
        5: 'PB',
      };
      return {
        val: Number(byte).toFixed(2),
        unit: units[level] || 'unknown',
      };
    }
  }
  return getNextLevel(byte);
};

/**
 * @description 格式化数据大小
 * @export
 * @param {number} size
 * @returns {string}
 */
export default function sizeToStr(size: number): string {
  const res = byteReduce(size);
  return res.val + res.unit;
}
