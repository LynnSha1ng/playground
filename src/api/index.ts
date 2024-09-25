import type { Collection, InsertType, PromiseExtended } from 'dexie';
import type { BlogPost } from '@/db';
import type { ResponseWithCancelFn } from '@/utils/tool';

import { db } from '@/db';
import { localStorageUtils, promiseWithCancelFn } from '@/utils/tool';

interface FetchOptions {
  localSrc: 'LocalStorage' | 'IndexedDB';
  storageKey?: string | string[];
  query?: () => PromiseExtended;
}

interface StoredData<T> {
  ver: number;
  data: T;
}

interface PostStat {
  total: {
    post: number;
    cate: number;
    tag: number;
  };
  cate: Record<string, number>;
  tag: Record<string, number>;
}

interface PostInfo {
  title: string;
  description: string;
  category: string;
  tag: string[];
  birthTime: string;
  mTime: string;
}

const currentResVer = parseInt(import.meta.env.VITE_RESOURCE_VER);
const LIMIT = parseInt(import.meta.env.VITE_LIST_LIMIT);

function _fetch<T>(url: string): ResponseWithCancelFn<T> {
  const controller = new AbortController();
  const response = fetch(import.meta.env.BASE_URL + url, { signal: controller.signal })
    .then(res => {
      if (!res.ok) {
        throw new Error(`请求'${url}'失败, 状态码: ${res.status}`);
      }
      const contentType = res.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        return res.json() as Promise<T>;
      } else {
        throw new Error(`意外的Content-Type: ${contentType}`);
      }
    })
    .catch((err: Error) => {
      if (err.name === 'AbortError') {
        console.log(`${url}：取消请求`);
      } else {
        console.error(err);
      }
      return void 0;
    });
  return {
    response,
    cancel: () => controller.abort(),
  };
}

/**
 * 从localStorage获取最新数据，若数据非最新则返回undefined
 */
function _getLatestDataFromLocalStorage<T>(storageKey: string | string[]): T | undefined {
  if (Array.isArray(storageKey)) {
    const local: Map<string, StoredData<T> | undefined> = new Map();
    const result: any = {};
    let latest = true;

    for (const key of storageKey) {
      local.set(key, localStorageUtils.getItem(key));
    }

    for (const [key, data] of local) {
      if (data === void 0 || data.ver !== currentResVer) {
        latest = false;
        break;
      } else {
        result[key] = data!.data;
      }
    }

    if (latest) return result;
    else return void 0;
  } else {
    const local = localStorageUtils.getItem(storageKey) as StoredData<T> | undefined;
    if (local !== void 0 && local.ver === currentResVer) return local.data;
    else return void 0;
  }
}

/**
 * 将最新数据存入localStorage
 */
function _storeLatestDataToLocalStorage<T>(
  data: T | undefined,
  storageKey: string | string[],
): void {
  if (data === void 0) {
    throw new Error('没有数据可储存');
  }
  if (Array.isArray(storageKey)) {
    for (const key of storageKey) {
      localStorageUtils.setItem(key, {
        ver: currentResVer,
        data: (<Record<string, any>>data)[key],
      } as StoredData<T>);
    }
  } else {
    localStorageUtils.setItem(storageKey, {
      ver: currentResVer,
      data,
    });
  }
}

function fetchData<T>(url: string, options: FetchOptions): ResponseWithCancelFn<T> {
  if (options.localSrc === 'LocalStorage') {
    const latestData = _getLatestDataFromLocalStorage<T>(options.storageKey!);
    if (latestData !== void 0) {
      // console.log('使用localStorage');
      return {
        response: new Promise(resolve => resolve(latestData)),
        cancel: () => {},
      };
    } else {
      // console.log('localStorage数据非最新，使用fetch');
      const { response, cancel } = _fetch<T>(url);
      return {
        response: response.then(data => {
          _storeLatestDataToLocalStorage<T>(data, options.storageKey!);
          return data;
        }),
        cancel,
      };
    }
  }
  //IndexedDB
  else {
    return promiseWithCancelFn<T>(
      options.query!().then((data: T & { ver: number }) => {
        if (data !== void 0 && data.ver === currentResVer) {
          // console.log('使用最新IndexedDB数据');
          const { ver, ...dataRest } = data;
          return <T>dataRest;
        } else {
          // console.log('Indexed数据非最新，使用fetch');
          const { response } = _fetch<T>(url);
          return response.then(async data => {
            await db.post.put({ ...data, ver: currentResVer } as InsertType<BlogPost, 'name'>);
            return data;
          });
        }
      }),
      () => console.log('取消IndexedDB查询'),
    );
  }
}

export function fetchPostList(index: number) {
  return fetchData<string[]>(`data/stat/list-${index}.json`, {
    localSrc: 'LocalStorage',
    storageKey: `post-li-${index}`,
  });
}

export async function fetchStat() {
  const { response } = fetchData<PostStat>('data/stat/stat.json', {
    localSrc: 'LocalStorage',
    storageKey: ['total', 'cate', 'tag'],
  });
  const stat = await response;
  return stat!;
}

export function fetchPostInfo(name: string) {
  return fetchData<PostInfo>(`data/info/${name}.json`, {
    localSrc: 'IndexedDB',
    query: () => db.post.get(name),
  });
}

export function fetchPostCont(name: string) {
  return fetchData<string>(`data/cont/${name}.json`, {
    localSrc: 'IndexedDB',
    query: () => db.post.get(name),
  });
}

async function _checkAndInitDB(total: number) {
  const pageCount = Math.ceil(total / LIMIT);
  const latestCount = await db.post.where('ver').equals(currentResVer).count();
  if (latestCount < total) {
    for (let i = 1; i <= pageCount; i++) {
      const { response: listRes } = fetchPostList(i);
      const postNameList = await listRes;

      const infoPromises = postNameList!.map(name => fetchPostInfo(name).response);
      await Promise.all(infoPromises);
    }

    await db.post.where('ver').below(currentResVer).delete();
  }
}

async function _fetchSinglePage(
  type: 'all' | 'category' | 'tag',
  total: number,
  params: {
    index: number;
    category?: string;
    tag?: string;
  },
) {
  const { index, category, tag } = params;
  const page = await db.pagination.get([type, index]);

  let result: BlogPost[];
  let collection: Collection<BlogPost, string, InsertType<BlogPost, 'name'>>;

  await _checkAndInitDB(total);

  if (page === void 0 || page.ver !== currentResVer) {
    // console.log('offset & limit');
    switch (type) {
      case 'all':
        collection = db.post.orderBy('birthTime').reverse();
        break;
      case 'category':
        collection = db.post
          .orderBy('birthTime')
          .reverse()
          .and(post => post.category === category);
        break;
      case 'tag':
        collection = db.post
          .orderBy('birthTime')
          .reverse()
          .and(post => post.tag.includes(tag!));
        break;
    }

    result = await collection
      .offset((index! - 1) * LIMIT)
      .limit(LIMIT)
      .toArray();
    await db.pagination.put({
      type,
      index,
      firstEntry: result[0].birthTime,
      ver: currentResVer,
    });
  } else {
    // console.log('cursor');
    switch (type) {
      case 'all':
        collection = db.post.where('birthTime').belowOrEqual(page.firstEntry);
        break;
      case 'category':
        collection = db.post
          .where('birthTime')
          .belowOrEqual(page.firstEntry)
          .and(post => post.category === category);
        break;
      case 'tag':
        collection = db.post
          .where('birthTime')
          .belowOrEqual(page.firstEntry)
          .and(post => post.tag.includes(tag!));
        break;
    }

    result = await collection.limit(LIMIT).reverse().toArray();
  }

  // console.log(`第${index}页: `,result);
  return result;
}

export function fetchRecentPosts(index: number, total: number): ResponseWithCancelFn<BlogPost[]> {
  return promiseWithCancelFn(_fetchSinglePage('all', total, { index }), () =>
    console.log('recent: 取消请求'),
  );
}

export function fetchPostsByTag(
  tag: string,
  index: number,
  total: number,
): ResponseWithCancelFn<BlogPost[]> {
  return promiseWithCancelFn(_fetchSinglePage('tag', total, { index, tag }), () =>
    console.log('tag: 取消请求'),
  );
}

export function fetchPostsByCategory(
  category: string,
  index: number,
  total: number,
): ResponseWithCancelFn<BlogPost[]> {
  return promiseWithCancelFn(_fetchSinglePage('tag', total, { index, category }), () =>
    console.log('cate: 取消请求'),
  );
}
