import { readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { doGenDataWork } from './_template.js';

const LIMIT = parseInt(process.env.VITE_LIST_LIMIT!);

const INFO_DIR = process.env.INFO_DATA_DIR!;
const STAT_DIR = process.env.STAT_DATA_DIR!;

export async function genStatData() {
  const cateStatMap = new Map<string, number>();
  const tagStatMap = new Map<string, number>();

  const postTotal = await doGenDataWork({
    sourceDir: INFO_DIR,

    targetDir: STAT_DIR,

    async work(batch) {
      let listIndex = 1;
      const batchNoSuffix = batch.map(filename => basename(filename, '.json'));
      for (let i = 0; i < batchNoSuffix.length; i += LIMIT) {
        const list = batchNoSuffix.slice(i, i + LIMIT);
        const path = join(STAT_DIR, `list-${listIndex}.json`);
        await writeFile(path, JSON.stringify(list, null, 2));
        listIndex += 1;
      }

      const readPromises = batchNoSuffix.map(async filename => {
        const content = await readFile(join(INFO_DIR, `${filename}.json`), 'utf8');
        return {
          name: filename,
          ...JSON.parse(content),
        };
      });
      const readResults = await Promise.all(readPromises);

      for (const item of readResults) {
        const cate = item.category;
        if (!cateStatMap.has(cate)) {
          cateStatMap.set(cate, 0);
        }
        cateStatMap.set(cate, cateStatMap.get(cate)! + 1);

        for (const tag of item.tag) {
          if (!tagStatMap.has(tag)) {
            tagStatMap.set(tag, 0);
          }
          tagStatMap.set(tag, tagStatMap.get(tag)! + 1);
        }
      }
    },
  });

  await writeFile(
    join(STAT_DIR, 'stat.json'),
    JSON.stringify(
      {
        total: {
          post: postTotal,
          cate: Array.from(cateStatMap.entries()).length,
          tag: Array.from(tagStatMap.entries()).length,
        },
        cate: Object.fromEntries(cateStatMap),
        tag: Object.fromEntries(tagStatMap),
      },
      null,
      2,
    ),
  );

  console.log('成功生成stat数据。');
}
