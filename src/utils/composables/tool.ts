import type { EffectScope } from 'vue';

import { effectScope, onScopeDispose } from 'vue';

export function createSharedComposable(composable: (...args: any[]) => any) {
  let subscribers = 0;
  let state: EffectScope['run'] | undefined;
  let scope: EffectScope | undefined;

  const dispose = () => {
    subscribers -= 1;
    if (scope && subscribers <= 0) {
      scope.stop();
      state = scope = void 0;
    }
  };

  return (...args: any[]) => {
    subscribers++;
    if (!state) {
      scope = effectScope(true);
      state = scope.run(() => composable(...args));
    }
    onScopeDispose(dispose);
    return state;
  };
}
