import invariant from '@guploader/invariant';
import {
  SyncHook,
  // SyncBailHook,
  // SyncWaterfallHook,
  // SyncLoopHook,
  // AsyncParallelHook,
  // AsyncParallelBailHook,
  // AsyncSeriesHook,
  // AsyncSeriesBailHook,
  // AsyncSeriesWaterfallHook,
  // HookMap,
} from '@guploader/tapable';

export interface IPluginHooks {
  initialize: SyncHook<unknown>;
  file: SyncHook<unknown>;
}

export interface IPlugin {
  apply: (hooks: IPluginHooks) => void;
}

class TapablePluginSystem {
  hooks: IPluginHooks;

  constructor(plugins: IPlugin[] = []) {
    /**
     * 钩子声明、注册
     */
    this.hooks = {
      initialize: new SyncHook<unknown>(['config']),
      file: new SyncHook<unknown>(['file']),
    };

    if (~plugins.length) {
      plugins.forEach((plugin) => this.use(plugin));
    }
  }

  use(plugin: IPlugin): void {
    invariant(plugin.apply, 'plugin.apply cannot be undefined');

    plugin.apply(this.hooks);
  }
}

export default TapablePluginSystem;
