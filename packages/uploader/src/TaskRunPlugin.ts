import { Plugin } from '@guploader/types';
import Uploader from './Uploader';

export default class TaskRunPlugin implements Plugin {
  name = 'TaskRunPlugin';
  apply(uploader: Uploader) {
    uploader.hooks.upload
      .for('upload.uploading')
      .tapAsync(this.name, (runner, callback) => {
        runner.run(callback);
      });
  }
}
