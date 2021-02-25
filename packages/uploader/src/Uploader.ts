import { SyncHook, HookMap, AsyncSeriesBailHook } from '@guploader/tapable';
import * as Interface from '@guploader/types';
import UploadProcess from './UploadProcess';

const hooks = [
  'upload.run.pre',
  'upload.run',
  'upload.run.post',
  'upload.uploading.pre',
  'upload.uploading',
  'upload.uploading.post',
  'upload.done.pre',
  'upload.done',
  'upload.done.post',
];

const topHooks = [
  'initialize',
  // inner hooks
  'stop',
  'failed',
];

export default class Uploader {
  options: Interface.UploaderRawOptions;
  hooks: {
    initialize: SyncHook<[]>;
    failed: SyncHook<[Error]>;
    stop: SyncHook<[string]>;
    upload: HookMap<AsyncSeriesBailHook<UploadProcess, any>>;
  };
  running = false;
  canceled = false;
  stoping = false;
  stopReasion = 'stop';
  constructor() {
    /** @type {Interface.UploaderRawOptions} */
    this.options = {} as Interface.UploaderRawOptions;
    this.hooks = {
      initialize: new SyncHook([]),
      failed: new SyncHook(['error']),
      stop: new SyncHook(['stopReason']),
      upload: new HookMap(() => new AsyncSeriesBailHook(['uploadProcess'])),
    };

    hooks.forEach((hook) => {
      this.hooks.upload
        .for(hook)
        .withOptions({
          stage: -999,
        })
        .tap('Uploader', () => {
          if (this.stoping) {
            throw new Error('stop');
          }
        });
      this.hooks.upload
        .for(hook)
        .withOptions({
          stage: 999,
        })
        .tap('Uploader', () => {
          if (this.stoping) {
            throw new Error('stop');
          }
        });
    });
  }

  stop() {
    if (!this.running) {
      return;
    }
    this.hooks.stop.call(this.stopReasion);
  }

  cancel() {
    if (!this.running) {
      return;
    }
    this.hooks.stop.call(this.stopReasion);
  }

  upload() {
    if (this.running) {
      return;
    }

    this.stoping = false;

    const uploadProcess = new UploadProcess(this);

    this.hooks.stop.tap('Uploader', (reason) => {
      this.stoping = true;
      this.stopReasion = reason;
    });

    let promise = Promise.resolve();

    hooks.forEach((hook) => {
      promise = promise.then(() => {
        return this.hooks.upload.for(hook).promise(uploadProcess);
      });
    });

    promise.catch((e) => {
      this.hooks.failed.call(e);
    });
  }
}
