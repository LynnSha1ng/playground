import Dexie, { type EntityTable } from 'dexie';

interface BlogPost {
  name: string;
  category: string;
  tag: string[];
  birthTime: string;
  ver: number;

  title: string;
  description: string;
  mTime: string;
  cont?: string;
}

interface BlogPagination {
  type: string;
  index: number;
  firstEntry: string;
  ver: number;
}

const db = new Dexie('Blog') as Dexie & {
  post: EntityTable<BlogPost, 'name'>;
  pagination: EntityTable<BlogPagination, 'index'>;
};

db.version(1).stores({
  post: 'name, category, *tag, birthTime, ver',
  pagination: '[type+index], firstEntry, ver',
});

export type { BlogPost };
export { db };

/* 控制台调试用，清空所有IndexedDB数据：

try {
  const DBs = await indexedDB.databases();
  for (const db of DBs) {
    const name = db.name;
    if (name) {
      indexedDB.deleteDatabase(name);
      console.log(`已删除数据库: ${name}`);
    }
  }
} catch (err) {
  console.error(err);
}

*/
