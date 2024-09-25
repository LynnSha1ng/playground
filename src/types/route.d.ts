import { RouteRecordRaw } from 'vue-router';

declare global {
  export type AdditionalRouteConfig = Omit<
    RouteRecordRaw,
    'path' | 'component' | 'components' | 'children'
  >;
}
