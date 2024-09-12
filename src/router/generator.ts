import type { RouteRecordRaw } from 'vue-router';

/**
 * 自动生成路由配置（不包括根路由`/`）。
 *
 * 约定如下：
 * - /src/views目录下，每个目录代表一个路由，目录名即为路由的name和path字段，可嵌套。
 * - 支持动态路由，将目录名用中括号包裹即可。
 *   例如，目录`[profile]`生成的`name`为`:profile`，`path`为`(/):profile`。
 * - 路由目录下，对应导入的路由组件必须命名为`index.vue`。
 *   如需额外配置（即除`name`, `path`, `component`,`children`以外的字段），
 *   可在其同级添加一个route.config.ts文件，默认导出类型为`AdditionalRouteConfig`的对象。
 *
 * 注意：所有路由均为懒加载。
 */
export const generateRoutes = (): RouteRecordRaw[] => {
  const views = import.meta.glob('@/views/**/index.vue');
  const configs: Record<string, Promise<AdditionalRouteConfig>> = import.meta.glob(
    '@/views/**/route.config.ts',
    {
      eager: true,
      import: 'default',
    },
  );

  // 必须根据目录层级排序，否则后面通过数组下标引用时会张冠李戴
  const pathDepth = (path: string) => path.match(/\//g)!.length;
  const viewPaths = Object.keys(views).sort((a, b) => pathDepth(a) - pathDepth(b));
  const viewPathsCore = viewPaths.map(path => path.substring(11, path.length - 10));

  const configPaths = Object.keys(configs);
  const configPathsCore: (string | undefined)[] = configPaths.map(path =>
    path.substring(11, path.length - 16),
  );

  const configMap: typeof configs = {};
  for (let i = 0; i < viewPathsCore.length; i++) {
    if (configPathsCore.every(path => path === void 0)) break;
    for (let j = 0; j < configPathsCore.length; j++) {
      if (configPathsCore[j] === void 0) continue;
      if (viewPathsCore[i] === configPathsCore[j]) {
        configMap[viewPaths[i]] = configs[configPaths[j]];
        configPathsCore[j] = void 0;
        break;
      }
    }
  }

  const rawPaths = viewPathsCore.map(path =>
    path
      .replace(/\[(.*?)\]/g, ':$1')
      .split('/')
      .filter(Boolean),
  );

  const routes: RouteRecordRaw[] = [];
  rawPaths.forEach((pathArr, i) => {
    let currentRecord = routes;
    pathArr.forEach((path, j) => {
      // 寻找当前路由是否已存在，是则进入其下一级，否则在当级添加新路由
      const existingRecord = currentRecord.find(record => 'name' in record && record.name === path);
      if (existingRecord !== void 0) {
        currentRecord = existingRecord.children as RouteRecordRaw[];
      } else {
        const newRecord: RouteRecordRaw = {
          path: j === 0 ? `/${path}` : path,
          name: path,
          component: views[viewPaths[i]],
          children: [],
        };
        currentRecord.push(Object.assign(newRecord, configMap[viewPaths[i]]));
        currentRecord = newRecord.children;
      }
    });
  });

  return routes;
};
