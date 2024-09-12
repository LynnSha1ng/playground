export interface Stat {
  total: {
    post: number;
    cate: number;
    tag: number;
  };
  details: {
    cate: Record<string, number>;
    tag: Record<string, number>;
  };
}

async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`获取数据失败: ${url}, 状态码: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      return response.json();
    } else if (contentType?.includes('text/plain')) {
      return response.text();
    } else {
      throw new Error(`不支持的Content-Type: ${contentType}`);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function fetchPostList(index: number) {
  return fetchData(`/data/stat/list-${index}.json`);
}

export function fetchStat(): Promise<Stat> {
  return fetchData('/playground/data/stat/stat.json');
}

export function fetchPostInfo(name: string) {
  return fetchData(`/data/info/${name}.json`);
}

export function fetchPostCont(name: string) {
  return fetchData(`/data/cont/${name}.txt`);
}
