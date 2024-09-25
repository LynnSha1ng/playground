import type { RouteRecordRaw } from 'vue-router';

/**
 * 自动生成除根路由`/`以外的路由配置。
 *
 * 约定如下：
 * - /src/views目录下，每个目录代表一个路由，目录名即为路由的name和path字段，可嵌套。
 * - 支持动态路由，将目录名用中括号包裹即可。
 *   例如，目录`[profile]`生成的`name`为`:profile`，`path`为`(/):profile`。
 * - 路由目录下必须存在`index.vue`作为导入的路由组件。
 *   如需额外配置（即除`path`, `component`,`children`以外的字段）或覆盖`name`字段，
 *   可在其同级添加一个route.config.ts文件，默认导出类型为`AdditionalRouteConfig`的对象。
 *
 * 注意：所有路由均为懒加载。
 *
 * @param {boolean} options.rootAsParent 若为true,则第一级路由（比如`/home`）应当作为根路由`/`的子路由
 * (即置入根路由的children数组中)，否则与根路由同级并列。默认为false。
 *
 *
 */
export function generateRoutes(
  options = {
    rootAsParent: false,
  },
): RouteRecordRaw[] {
  const viewsRaw = import.meta.glob('@/views/**/index.vue');
  const configsRaw: Record<string, AdditionalRouteConfig> = import.meta.glob(
    '@/views/**/route.config.ts',
    {
      eager: true,
      import: 'default',
    },
  );

  // 必须根据目录深度排序
  const pathDepth = (path: string) => path.split('/').length;
  const viewPaths = Object.keys(viewsRaw).sort((a, b) => pathDepth(a) - pathDepth(b));

  const configMap = new Map<string, AdditionalRouteConfig>(
    Object.entries(configsRaw).map(([path, config]) => [
      path.replace('route.config.ts', 'index.vue'),
      config,
    ]),
  );

  const pathsRaw = viewPaths.map(path =>
    path
      .substring(11, path.length - 10) //移除`/src/views/`和`/index.vue`
      .replace(/\[(.*?)\]/g, ':$1') // 动态路由
      .split('/')
      .filter(Boolean),
  );

  const routes: RouteRecordRaw[] = [];
  for (let i = 0; i < pathsRaw.length; i++) {
    const pathArr = pathsRaw[i];

    let currentRecord = routes;
    for (let j = 0; j < pathArr.length; j++) {
      const path = pathArr[j];

      // 寻找当前路由是否已存在，是则进入其下一级，否则在当级添加新路由并进入其下一级
      const existingRecord = currentRecord.find(record => record.name === path);
      if (existingRecord) {
        currentRecord = existingRecord.children!;
      } else {
        const newRecord: RouteRecordRaw = {
          path: options.rootAsParent ? path : j === 0 ? `/${path}` : path,
          name: path,
          component: viewsRaw[viewPaths[i]],
          children: [],
        };
        Object.assign(newRecord, configMap?.get(viewPaths[i]));
        currentRecord.push(newRecord);
        currentRecord = newRecord.children;
      }
    }
  }

  return routes;
}
