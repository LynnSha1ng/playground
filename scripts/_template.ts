import { readdir, access, mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';

interface GenDataWorkOptions {
  sourceDir: string;
  targetDir: string | string[];
  work: (batch: string[]) => Promise<void>;
  errMsg: (i: number) => string;
}

/**
 * 检查目录是否存在，是则清空，否则创建
 *
 * @param target 目标目录
 */
async function checkTarget(target: string) {
  try {
    await access(target);
    const targetFiles = await readdir(target);
    if (targetFiles.length !== 0) {
      const deletePromises = targetFiles.map(filename => {
        return unlink(join(target, filename));
      });
      await Promise.all(deletePromises);
    }
  } catch (_) {
    await mkdir(target, { recursive: true });
  }
}

/**
 * 生成数据的总体流程，成功后返回在源目录中处理的的文件个数
 *
 * @param options 配置对象
 * @param options.sourceDir 源目录
 * @param options.targetDir 一个或多个目标目录，用于生成数据前的检查
 * @param options.work 对每一批文件执行的操作
 * @param options.errMsg 返回错误消息的函数
 */
export async function doGenDataWork(options: GenDataWorkOptions) {
  const BATCH_SIZE = parseInt(process.env.VITE_BATCH_SIZE!);
  const { sourceDir, targetDir, work, errMsg } = options;

  let batchIndex = 1;

  try {
    if (typeof targetDir === 'string') {
      await checkTarget(targetDir);
    } else {
      for (const target of targetDir) {
        await checkTarget(target);
      }
    }

    const files = await readdir(sourceDir);
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      await work(batch);
      batchIndex += 1;
    }
    return files.length;
  } catch (err) {
    console.error(errMsg(batchIndex), '\n', err);
  }
}
