import * as Interface from '@guploader/types';
import { getDefaultConfig } from '@guploader/config';
import merge from '@guploader/utils/lib/merge';
import Uploader from './Uploader';
import TaskRunPlugin from './TaskRunPlugin';

export function createUploader(rawOptions: any) {
  let options = getDefaultConfig();
  options = merge(options, rawOptions);
  const uploader = new Uploader();
  uploader.options = options;
  options.plugins.forEach((plugin) => {
    plugin.apply(uploader);
  });
  new TaskRunPlugin().apply(uploader);
  uploader.hooks.initialize.call();
  return uploader;
}
