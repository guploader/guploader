import {
  AsyncParallelBailHook,
  AsyncSeriesBailHook,
  HookMap,
  SyncHook,
  AsyncSeriesLoopHook,
} from '@guploader/tapable';
import Uploader from './Uploader';

// 目标逻辑瀑布流
/**
 * -> 获取hash
 *    -> 获取token
 *      -> 检查taskqueue (loop/暂停/取消操作执行)
 *        -> 开始上传块，并发
 *          -> 串行执行chunk上传（暂停/取消操作执行/promise.race）
 *        -> 结束上传块
 *      -> 完成
 */

const hooks = [
  'uploading.hash.pre',
  'uploading.hash',
  'uploading.hash.post',
  'uploading.token.pre',
  'uploading.token',
  'uploading.token.post',
  // Parallel ，conc number
  'uploading.block.pre',
  'uploading.block',
  // loop retry times
  // mark token if expired and
  'uploading.chunk.pre',
  'uploading.chunk',
  'uploading.chunk.post',
  'uploading.block.post',
];

export default class UploadProcess {
  uploader: Uploader;
  hooks: {
    upload: HookMap<AsyncSeriesBailHook<[UploadProcess], any>>;
  };
  stoping = false;
  constructor(uploader: Uploader) {
    this.uploader = uploader;
    this.uploader.hooks.stop = new SyncHook(['stopReason']);

    this.uploader.hooks.stop.tap('UploadProcess', (reason) => {
      this.uploader.stopReasion = reason;
      this.stoping = true;
    });
    this.hooks = {
      upload: new HookMap(() => new AsyncSeriesBailHook(['UploadProcess'])),
    };
    hooks.forEach((hook) => {
      this.hooks.upload
        .for(hook)
        .withOptions({
          stage: -999,
        })
        .tap('UploadProcess', () => {
          if (this.stoping) {
            throw new Error(this.uploader.stopReasion);
          }
        });
      this.hooks.upload
        .for(hook)
        .withOptions({
          stage: 999,
        })
        .tap('UploadProcess', () => {
          if (this.stoping) {
            throw new Error(this.uploader.stopReasion);
          }
        });
    });
    this.uploader.hooks.stop.tap('UploadProcess', () => {
      this.stoping = true;
    });
  }

  run(callback: any) {
    let promise = Promise.resolve();

    hooks.forEach((hook) => {
      promise = promise.then(() => {
        return this.hooks.upload.for(hook).promise(this);
      });
    });

    promise
      .then(() => {
        callback();
      })
      .catch((e) => {
        this.uploader.hooks.failed.call(e);
      });
  }
}
