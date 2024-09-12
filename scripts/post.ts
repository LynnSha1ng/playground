import { readFile, writeFile, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { parse } from 'yaml';
import { doGenDataWork } from './_template.js';

const DIR = process.env.POST_DIR!;
const INFO_DIR = process.env.INFO_DATA_DIR!;
const CONT_DIR = process.env.CONT_DATA_DIR!;

export async function genPostData() {
  await doGenDataWork({
    sourceDir: DIR,

    targetDir: [INFO_DIR, CONT_DIR],

    async work(batch) {
      const readPromises = batch.map(async filename => {
        const content = await readFile(join(DIR, filename), 'utf8');
        if (content === null) {
          throw new Error('该批次中存在格式错误的文章');
        }
        return {
          name: basename(filename, '.md'),
          content,
        };
      });
      const readResults = await Promise.all(readPromises);

      const writePromises = readResults.map(async ({ name, content }) => {
        const data = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/)!;
        const fileStat = await stat(join(DIR, `${name}.md`));
        await writeFile(
          join(INFO_DIR, `${name}.json`),
          JSON.stringify(
            {
              ...parse(data[1]),
              birthTime: fileStat.birthtime,
              mTime: fileStat.mtime,
            },
            null,
            2,
          ),
        );
        await writeFile(join(CONT_DIR, `${name}.txt`), data[2]);
      });
      await Promise.all(writePromises);
    },

    errMsg: i => `处理第${i}批文章时出错，停止生成info、cont数据。`,
  });

  console.log('成功生成info、cont数据。');
}
