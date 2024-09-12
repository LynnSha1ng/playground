import { genPostData } from './post.js';
import { genStatData } from './stat.js';

(async function () {
  await genPostData();
  await genStatData();
})();
