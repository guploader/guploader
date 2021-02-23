import * as Interface from '@guploader/types';
import Chunk from './chunk';

/**
 * @description 生成上传所需块结构的构造器
 * @export
 * @class Block
 * @implements {Interface.Block}
 */
export default class Block implements Interface.Block {
  /**
   * 块开始位置
   *
   * @type {number}
   * @memberof Block
   */
  public startByte: number;

  /**
   * 块结束位置
   *
   * @type {number}
   * @memberof Block
   */
  public endByte: number;

  /**
   * 父节点引用
   *
   * @type {Interface.QZFile}
   * @memberof Block
   */
  public file: Interface.QZFile;

  /**
   * 储存的片信息
   *
   * @type {Interface.Chunk[]}
   * @memberof Block
   */
  public chunks: Interface.Chunk[];

  /**
   * Creates an instance of Block.
   * @param {Interface.QZFile} file
   * @param {number} startByte
   * @param {number} endByte
   * @memberof Block
   */
  public constructor(
    file: Interface.QZFile,
    startByte: number,
    endByte: number
  ) {
    this.file = file;
    this.startByte = startByte;
    this.endByte = endByte;
    this.chunks = [];
  }

  /**
   * 获取所有片信息（lazy）
   *
   * @return {*}  {Interface.Chunk[]}
   * @memberof Block
   */
  getChunks(): Interface.Chunk[] {
    if (this.chunks.length) {
      return this.chunks;
    }
    let startByte = 0;
    const chunks = [];
    while (startByte < this.size) {
      let endByte = startByte + this.file.chunkSize;
      if (endByte > this.size) {
        endByte = this.size;
      }
      chunks.push(new Chunk(this, startByte, endByte));
      startByte += this.file.chunkSize;
    }
    this.chunks = chunks;
    return chunks;
  }

  /**
   * 按索引获取片信息
   *
   * @param {number} index
   * @return {*}  {Interface.Chunk}
   * @memberof Block
   */
  getChunkByIndex(index: number): Interface.Chunk {
    return this.getChunks()[index];
  }

  /**
   * 获取块大小
   *
   * @readonly
   * @type {number}
   * @memberof Block
   */
  get size(): number {
    return this.endByte - this.startByte;
  }

  /**
   * 获取块在文件中的索引位置
   *
   * @readonly
   * @type {number}
   * @memberof Block
   */
  get index(): number {
    return Math.round(this.startByte / this.file.blockSize);
  }

  /**
   * 获取二进制数据
   *
   * @readonly
   * @type {Blob}
   * @memberof Block
   */
  get blob(): Blob {
    return this.file.slice(this.startByte, this.endByte);
  }
}
