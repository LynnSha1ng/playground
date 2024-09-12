import { RouteRecordRaw } from 'vue-router';

declare global {
  export type AdditionalRouteConfig = Omit<
    RouteRecordRaw,
    'name' | 'path' | 'component' | 'components' | 'children'
  >;
}
