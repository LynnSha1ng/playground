---
title: Node.js Buffer
description: 测试
category: 编程
tag: [前端, Node.js, Buffer]
---

## 1. 概念

`Buffer`对象用于表示固定长度的字节序列。许多 Node.js API 都支持 `Buffer` 。它是 `Uint8Array` 类的子类，Node.js API 在支持 `Buffer` 的地方也接受纯 `Uint8Array` 。它在全局作用域内可用，但仍然建议显式引用它。

## 2. 特点

- 大小固定
- 性能好，直接操作内存
- 每个元素大小为1字节

## 3. 使用

### 3.1 创建

- `Buffer.alloc(size: number, fill?: string | Uint8Array | number, encoding?: BufferEncoding): Buffer`

      创建一个长度为 size 的 Buffer，以 fill 填充，以 encoding 编码。 fill 默认为0。

- `Buffer.allocUnsafe(size: number): Buffer`

      以这种方式创建的 Buffer 实例的底层内存没有被初始化。新创建的 Buffer 的内容未知，可能包含敏感数据。

- `Buffer.from`

```js
import { Buffer } from 'node:buffer';

/**

 * integer[]

 * 元素值为 0 - 255，超过则截断

 */

const buf1 = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f]);

/**

 * arrayBuffer, byteOffset?, length?

 * arrayBuffer 为 <ArrayBuffer>、<SharedArrayBuffer>，例如 TypedArray 的 buffer 属性。

 * byteOffset 和 length 参数指定了 arrayBuffer 中与 Buffer 共享的内存范围。

 */

const arr = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]);

const buf2 = Buffer.from(arr.buffer, 2, 3); // 取后三个字符

for (let i = 0; i < arr.length; i++) arr[i] += 1;

console.log(buf2.toString()); // 输出 mmp

/**

 * Buffer | Unit8Array

 * 相当于复制 Buffer，不共享内存

 */

const _buf3 = Buffer.alloc(5, 'hello');

const buf3 = Buffer.from(_buf3);

/**

 * object, offsetOrEncoding?, length?

 * object 必须支持 valueOf() 或 Symbol.toPrimitive

 */

//支持 valueOf()

const buf4a = Buffer.from(new String('hello'));

//支持 Symbol.toPrimitive，hint 传参'string'

const buf4b = Buffer.from(
  new (class {
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') return 10;

      if (hint === 'string') return 'hello';

      return true;
    }
  })(),

  'utf8',
);

/**

 * string, encoding?

 */

const buf5 = Buffer.from('hello', 'ascii');
```
