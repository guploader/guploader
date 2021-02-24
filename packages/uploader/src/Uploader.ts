import { SyncHook, AsyncSeriesHook } from '@guploader/tapable';
import * as Interface from '@guploader/types';

export default class Uploader {
  entry: File;
  options: Interface.UploaderRawOptions;
  hooks: {
    initialize: SyncHook<[]>;
    failed: SyncHook<[Error]>;
    afterDone: SyncHook<[any]>;
    beforeRun: AsyncSeriesHook<[Uploader]>;
    run: AsyncSeriesHook<[Uploader]>;
    done: AsyncSeriesHook<[any]>;
    beforeDone: AsyncSeriesHook<[any]>;
    additionalPass: AsyncSeriesHook<[]>;
    readCache: AsyncSeriesHook<[Uploader]>;
    writeCache: AsyncSeriesHook<[Uploader, any]>;
    beforeUpload: AsyncSeriesHook<[any]>;
    upload: SyncHook<[any]>;
    uploading: AsyncSeriesHook<[any]>;
    finishUpload: AsyncSeriesHook<[any]>;
    afterUpload: AsyncSeriesHook<[any]>;
  };
  running = false;
  // 状态
  status = '';
  cache: Map<string, any>;
  constructor(entry: File) {
    this.entry = entry;
    /** @type {Interface.UploaderRawOptions} */
    this.options = {} as Interface.UploaderRawOptions;
    this.cache = new Map();
    this.hooks = {
      initialize: new SyncHook([]),
      failed: new SyncHook(['error']),
      beforeDone: new AsyncSeriesHook(['uploadProgress']),
      afterDone: new SyncHook(['uploadProcess']),
      beforeRun: new AsyncSeriesHook(['uploader']),
      run: new AsyncSeriesHook(['uploader']),
      done: new AsyncSeriesHook(['uploadProcess']),
      additionalPass: new AsyncSeriesHook([]),
      readCache: new AsyncSeriesHook(['uploader']),
      writeCache: new AsyncSeriesHook(['uploader', 'stats']),
      beforeUpload: new AsyncSeriesHook(['params']),
      upload: new SyncHook(['params']),
      uploading: new AsyncSeriesHook(['uploadProcess']),
      finishUpload: new AsyncSeriesHook(['uploadProcess']),
      afterUpload: new AsyncSeriesHook(['uploadProcess']),
    };
  }

  upload() {
    if (this.running) {
      return;
    }

    const finalCallback = (err: any, uploadProcess?: any) => {
      this.running = false;
      if (err) {
        this.hooks.writeCache.callAsync(this, uploadProcess, () => {
          this.hooks.failed.call(err);
        });
      }
      this.hooks.afterDone.call(uploadProcess);
    };

    const onUploaded = (err: any, uploadProcess: any) => {
      if (err) {
        return finalCallback(err, uploadProcess);
      }

      this._done(uploadProcess, (err: any) => {
        if (err) {
          return finalCallback(err, uploadProcess);
        }

        this.hooks.done.callAsync(uploadProcess, (err) => {
          if (err) {
            return finalCallback(err, uploadProcess);
          }
          return finalCallback(null, uploadProcess);
        });
      });
    };

    const run = () => {
      this.hooks.beforeRun.callAsync(this, (err) => {
        if (err) {
          return finalCallback(err);
        }

        this.hooks.run.callAsync(this, (err) => {
          if (err) {
            return finalCallback(err);
          }

          this.hooks.readCache.callAsync(this, (err) => {
            if (err) {
              return finalCallback(err);
            }

            this._upload(onUploaded);
          });
        });
      });
    };

    run();
  }

  newUploadProcess(params: any): any {
    return {
      uploader: this,
      params: params,
    };
  }

  _upload(callback: any) {
    callback();

    const params: any = {};

    this.hooks.beforeUpload.callAsync(params, (err) => {
      if (err) {
        callback(err);
      }

      this.hooks.upload.call(params);
      const uploadProcess = this.newUploadProcess(params);

      this.hooks.uploading.callAsync(uploadProcess, (err) => {
        if (err) {
          return callback(err, uploadProcess);
        }

        this.hooks.finishUpload.callAsync(uploadProcess, (err) => {
          if (err) {
            return callback(err, uploadProcess);
          }
          this.hooks.afterUpload.callAsync(uploadProcess, (err) => {
            if (err) {
              return callback(err, uploadProcess);
            }
            return callback(null, uploadProcess);
          });
        });
      });
    });
  }

  _done(uploadProcess: any, callback: any) {
    this.hooks.beforeDone.callAsync(uploadProcess, (err) => {
      callback(err);
    });
  }
}
