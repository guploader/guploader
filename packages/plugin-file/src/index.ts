import { IPlugin, IPluginHooks } from '@guploader/plugin';
import QZFile from '@guploader/file';
import { QZFileProps } from '@guploader/file/lib/file';

export default class FilePlugin implements IPlugin {
  apply(hooks: IPluginHooks) {
    hooks.file.tap('file-stat-plugin', function (params) {
      return new QZFile(params as QZFileProps);
    });
  }
}
