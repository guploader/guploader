import * as Interface from '@guploader/types';

export default class Uploader {
  options: Interface.UploaderRawOptions;
  // file: Interface.QZFile;
  plugins = new Map();
  constructor(options: Interface.UploaderRawOptions) {
    this.options = options;
    this.options.presets.forEach((plugin) => {
      plugin.apply(this);
      this.plugins.set(plugin.name, plugin);
    });

    this.options.plugins.forEach((plugin) => {
      plugin.apply(this);
      this.plugins.set(plugin.name, plugin);
    });
  }

  getPlugins<T = any>(name: string): T {
    return this.plugins.get(name);
  }
}
