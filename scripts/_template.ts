import { readdir, access, mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';

interface GenDataWorkOptions {
  sourceDir: string;
  targetDir: string | string[];
  work: (batch: string[]) => Promise<void>;
}

async function batchWork(target: any[], fn: (batch: any[]) => Promise<any>) {
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE!);
  for (let i = 0; i < target.length; i += BATCH_SIZE) {
    const batch = target.slice(i, i + BATCH_SIZE);
    await fn(batch);
  }
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
      await batchWork(deletePromises, batch => Promise.all(batch));
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
 */
export async function doGenDataWork(options: GenDataWorkOptions) {
  const { sourceDir, targetDir, work } = options;

  try {
    if (typeof targetDir === 'string') {
      await checkTarget(targetDir);
    } else {
      await Promise.all(targetDir.map(checkTarget));
    }

    const files = await readdir(sourceDir);
    await batchWork(files, work);
    return files.length;
  } catch (err) {
    console.error(err);
  }
}
