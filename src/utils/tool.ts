export type ResponseWithCancelFn<T> = {
  response: Promise<T | undefined>;
  cancel: () => void;
};

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const localStorageUtils = {
  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getItem(key: string) {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : void 0;
  },

  removeItem(key: string) {
    localStorage.removeItem(key);
  },
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const diff = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diff / 3.6e6);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return '刚刚';
  }
  if (diffInDays < 1) {
    return `${diffInHours}小时前`;
  }
  if (diffInDays < 7) {
    return `${diffInDays}天前`;
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (year === now.getFullYear()) {
    return `今年${month}月${day}日`;
  }
  return `${year}年${month}月${day}日`;
}

export function promiseWithCancelFn<T>(
  targetPromise: Promise<T | undefined>,
  onCanceled?: () => void,
): ResponseWithCancelFn<T> {
  const controller = new AbortController();
  const { signal } = controller;

  let rejectFn: (reason?: any) => void;

  const onAbort = () => {
    rejectFn(void 0);
    if (typeof onCanceled === 'function') onCanceled();
    signal.removeEventListener('abort', onAbort);
  };
  signal.addEventListener('abort', onAbort);

  const abortPromise = new Promise<undefined>((_, reject) => {
    rejectFn = reject;
  }).catch(_ => _);

  return {
    response: Promise.race([
      targetPromise.then(data => {
        // 获得数据后应取消监听器，否则onCanceled始终执行
        signal.removeEventListener('abort', onAbort);
        return data;
      }),
      abortPromise,
    ]),
    cancel: () => controller.abort(),
  };
}
