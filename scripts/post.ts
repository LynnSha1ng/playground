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
        return {
          name: basename(filename, '.md'),
          content,
        };
      });
      const readResults = await Promise.all(readPromises);

      const writePromises = readResults.map(async ({ name, content }) => {
        const data = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/)!;
        if (data === null) {
          const err = new Error('该批次中存在格式错误的文章');
          err.name = 'FormatError';
          throw err;
        }
        const fileStat = await stat(join(DIR, `${name}.md`));
        await writeFile(
          join(INFO_DIR, `${name}.json`),
          JSON.stringify(
            {
              name,
              ...parse(data[1]),
              birthTime: fileStat.birthtime,
              mTime: fileStat.mtime,
            },
            null,
            2,
          ),
        );
        await writeFile(
          join(CONT_DIR, `${name}.json`),
          JSON.stringify(
            {
              name,
              cont: data[2],
            },
            null,
            2,
          ),
        );
      });
      await Promise.all(writePromises);
    },
  });

  console.log('成功生成info、cont数据。');
}
