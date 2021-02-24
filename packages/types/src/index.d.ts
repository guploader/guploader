import { EventEmitter } from 'events';

export interface MyWorker {
  tasks: number;
  buzy: boolean;
  instance: Worker;
}

export interface WorkerMessage {
  channel: string;
  payload?: any;
}

export type WorkerMessages = [WorkerMessage, PostMessageOptions?];

export interface WorkersProvider extends EventEmitter {
  workers: MyWorker[];
  cpus: number;
  messages: WorkerMessages[];
  onmessage(e: MessageEvent): void;
  send(message: WorkerMessage, transfer?: PostMessageOptions): void;
  run(): void;
  destroy(): void;
  removeMessage(message: WorkerMessage): void;
  removeMessagesByChannel(channel: string): void;
}

export interface QZFile {
  file: File;
  batch: string;
  blockSize: number;
  chunkSize: number;
  blocks: Block[];
  name: string;
  lastModified: number;
  ext: string;
  size: number;
  type: string;
  slice(start: number, end: number): Blob;
  getBlocks(): Block[];
  getBlockByIndex(index: number): Block;
}

export interface HttpClient {
  post: <T>(props: HttpClientProps, extrnal1?: any) => Promise<T>;
}

export interface QZFileProps {
  file: File;
  blockSize?: number;
  chunkSize?: number;
  batch?: string;
}

export interface Block {
  startByte: number;
  endByte: number;
  file: QZFile;
  index: number;
  size: number;
  blob: Blob;
  getChunks: () => Chunk[];
  getChunkByIndex: (index: number) => Chunk;
}

export interface Chunk {
  startByte: number;
  endByte: number;
  size: number;
  block: Block;
  blob: Blob;
  index: number;
}

export interface QETagBase {
  file: QZFile;
  hash: string;
  pureHash: string;
  hashs: ArrayBuffer[];
  raceToStop: boolean;
  calc(): PromiseLike<this>;
  set(hash: string): void;
  get(): string;
}

export interface QETagNormal extends QETagBase {
  concurrency: number;
}

export interface QETagWorker extends QETagBase {
  channel: string;
  workers: WorkersProvider;
}

export interface HttpClientProps {
  url: string;
  data: any;
  config?: any;
  credentials?: 'include' | 'omit' | 'same-origin' | undefined;
}

export interface Plugin {
  name: string;
  apply: (runner: any, options?: any) => void;
}

export interface UploaderOptions {
  entry: File;
  /**
   * 服务基础配置
   */
  clientConfig?: {
    /**
     * api 地址配置，默认 api.6pan.cn
     */
    baseURL?: string;
    /**
     * fetch 上传类型基础配置，默认如下
     */
    headers?: {
      [key: string]: string;
    };
  };
  /**
   * api path配置
   */
  apis?: {
    /**
     * 获取文件上传token服务
     */
    token?: string;
    /**
     * 生成文件块服务
     */
    mkblk?: string;
    /**
     * 生成块内片服务
     */
    bput?: string;
    /**
     * 生成文件命令
     */
    mkfile?: string;
  };
  /**
   * 如您使用的是Auth认证，指定的Auth请求头名称
   */
  AuthorizationTokenKey?: string;
  /**
   * 如您使用的是localstorage储存的Auth信息，uploader将会从以下key获取值填入 AuthorizationToken 请求头中
   */
  AuthorizationStorageKey?: string;
  /**
   * 最大重试次数
   */
  chunkRetry?: number;
  /**
   * 分片和计算hash使用的块大小，默认如下，无需更改
   */
  blockSize?: number;
  chunkSize?: number;
  /**
   * 并发上传数（块级上传，非必须,默认如下）
   */
  concurrency?: number;
  /**
   * 可并发执行任务数（非必须，默认3即可）
   * 此参数主要在worker任务中起作用
   * 基本表示一个worker线程在非忙时可承担的最大任务数
   * 设置大了意义不大
   */
  taskConcurrencyInWorkers?: number;

  presets?: Plugin[];

  plugins?: Plugin[];
}

export interface UploaderRawOptions {
  entry: File;
  /**
   * 服务基础配置
   */
  clientConfig: {
    /**
     * api 地址配置，默认 api.6pan.cn
     */
    baseURL: string;
    /**
     * fetch 上传类型基础配置，默认如下
     */
    headers: {
      [key: string]: string;
    };
  };
  /**
   * api path配置
   */
  apis: {
    /**
     * 获取文件上传token服务
     */
    token: string;
    /**
     * 生成文件块服务
     */
    mkblk: string;
    /**
     * 生成块内片服务
     */
    bput: string;
    /**
     * 生成文件命令
     */
    mkfile: string;
  };
  /**
   * 如您使用的是Auth认证，指定的Auth请求头名称
   */
  AuthorizationTokenKey: string;
  /**
   * 如您使用的是localstorage储存的Auth信息，uploader将会从以下key获取值填入 AuthorizationToken 请求头中
   */
  AuthorizationStorageKey: string;
  /**
   * 最大重试次数
   */
  chunkRetry: number;
  /**
   * 分片和计算hash使用的块大小，默认如下，无需更改
   */
  blockSize: number;
  chunkSize: number;
  /**
   * 并发上传数（块级上传，非必须,默认如下）
   */
  concurrency: number;
  /**
   * 可并发执行任务数（非必须，默认3即可）
   * 此参数主要在worker任务中起作用
   * 基本表示一个worker线程在非忙时可承担的最大任务数
   * 设置大了意义不大
   */
  taskConcurrencyInWorkers: number;

  presets: Plugin[];

  plugins: Plugin[];
}

export interface Uploader {
  options: UploaderRawOptions;
  getPlugins: <T = any>(name: string) => T;
}
