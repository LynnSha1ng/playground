import Dexie, { type EntityTable } from 'dexie';

interface PostIndex {
  name: string;
  category: string;
  tag: string[];
}

const db = new Dexie('FriendsDatabase') as Dexie & {
  friends: EntityTable<PostIndex, 'name'>;
};

db.version(1).stores({
  post: 'name, category, *tag',
});

export type { PostIndex };
export { db };
