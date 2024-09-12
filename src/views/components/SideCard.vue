<template>
  <aside class="side-info">
    <div class="info-card --blogger">
      <img class="avatar" src="/images/avatar.jpg" alt="头像" />
      <h3 class="blogger-name">临郢夏望</h3>
      <span class="bio">谦逊对待未知</span>
      <ul class="post-stats">
        <li class="stat-item" v-for="(label, key) of statMap" :key="`stat-item-${key}`">
          <span class="stat-label">{{ label }}</span>
          <span class="stat-total">{{ total![key] }}</span>
        </li>
      </ul>
      <ul class="contacts">
        <li class="contact-icon iconfont icon-QQ"></li>
        <li class="contact-icon iconfont icon-mail"></li>
        <li class="contact-icon iconfont icon-github"></li>
        <li class="contact-icon iconfont icon-tuite"></li>
      </ul>
    </div>

    <div class="info-card">
      <h3>
        <i class="title-icon iconfont icon-wenjianjia"></i>
        <span class="card-title">分类</span>
      </h3>
      <ul class="categories">
        <li class="category-item" v-for="(total, label) of cate" :key="`cate-item-${label}`">
          <span>{{ label }}</span>
        </li>
      </ul>
    </div>

    <div class="info-card">
      <h3>
        <i class="title-icon iconfont icon-24gf-tags2"></i>
        <span class="card-title">标签</span>
      </h3>
      <ul class="tags">
        <li class="tag-item" v-for="(total, label) of tag" :key="`tag-item-${label}`">
          <span class="tag-label">{{ label }}</span>
          <span class="tag-total">{{ total }}</span>
        </li>
      </ul>
    </div>

    <div class="info-card">
      <h3>
        <i class="title-icon iconfont icon-youlian-f"></i>
        <span class="card-title">友链</span>
      </h3>
    </div>

    <div class="info-card">
      <h3>
        <i class="title-icon iconfont icon-caidan"></i>
        <span class="card-title">标题</span>
      </h3>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Stat } from '@/api';

// import { ref,watch, onMounted, onBeforeMount } from 'vue';
import { fetchStat, fetchPostInfo } from '@/api';

const statMap = {
  post: '文章',
  cate: '分类',
  tag: '标签',
};

let total: Stat['total'] | null = null;
let cate: Record<string, number> | null = null;
let tag: Record<string, number> | null = null;
await (async () => {
  const stats = await fetchStat();
  total = stats.total;
  cate = stats.details.cate;
  tag = stats.details.tag;
})();
</script>

<style lang="scss" scoped>
.side-info {
  @include flex(null, null, column);
  row-gap: 12px;
  width: 300px;
  @include screenBelow($lg) {
    display: none;
  }
}

.info-card {
  @include flex(null, null, column);
  row-gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background-color: var(--bg-2);

  &.--blogger {
    align-items: center;
  }
}

.card-title {
  margin-inline-start: 4px;
}

.title-icon {
  font-size: 1.08em;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.bio {
  color: var(--text-grey);
  font-size: small;
}

.post-stats {
  @include flex(space-around, null, null);
  width: 100%;
  margin-top: 8px;
}

.stat-item {
  @include flex(null, center, column);
  row-gap: 8px;
}

.stat-label {
  font-size: small;
}

.stat-total {
  font-size: large;
  font-weight: bold;
}

.contacts {
  @include flex;
  gap: 20px;
}

.contact-icon {
  font-size: 1.5em;
  cursor: pointer;
}

.categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.category-item {
}

.tags {
  @include flex(null, null, row wrap);
  gap: 8px;
}

.tag-item {
  @include flex;
  column-gap: 2px;
  padding: 8px;
  border-radius: 8px;
  font-size: small;
  font-weight: bold;
  transition: background-color 0.25s;

  &:hover {
    background-color: var(--bg-3);
  }
}

.tag-total {
  color: var(--text-grey);
  font-size: x-small;
  font-weight: normal;
  transform: translate3d(0, -0.25em, 0);
}
</style>
