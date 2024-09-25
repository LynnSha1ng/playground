<template>
  <aside class="side-info">
    <div class="info-card --blogger">
      <img class="avatar" src="/images/avatar.jpg" alt="头像" />
      <h3 class="blogger-name">临郢夏望</h3>
      <span class="bio">谦逊对待未知</span>
      <ul class="post-stats">
        <li class="stat-item" v-for="(label, key) of statMap" :key="`stat-item-${key}`">
          <span class="stat-label">{{ label }}</span>
          <span class="stat-total">{{ total ? total[key] : '*' }}</span>
        </li>
      </ul>
      <ul class="contacts">
        <li class="contact-icon iconfont icon-QQ"></li>
        <li class="contact-icon iconfont icon-mail"></li>
        <li class="contact-icon iconfont icon-github"></li>
        <li class="contact-icon iconfont icon-tuite"></li>
      </ul>
    </div>

    <div class="info-card" v-if="$route.name !== 'categories'">
      <h3>
        <i class="title-icon iconfont icon-wenjianjia"></i>
        <span class="card-title">分类</span>
      </h3>
      <ul class="categories" v-if="cate">
        <li class="category-item" v-for="[label, total] of cateShown" :key="`cate-item-${label}`">
          <span class="category-label">{{ label }}</span>
          <span class="category-total">（{{ total }}）</span>
        </li>
        <li class="category-item">
          <span class="category-label">测试超级长的分类名字</span>
          <span class="category-total">（10）</span>
        </li>
      </ul>
      <router-link custom :to="{ name: 'categories' }" v-slot="{ navigate }">
        <span class="has-more" v-if="cateHasMore" @click="navigate" role="link">查看更多</span>
      </router-link>
    </div>

    <div class="info-card" v-if="$route.name !== 'tags'">
      <h3>
        <i class="title-icon iconfont icon-24gf-tags2"></i>
        <span class="card-title">标签</span>
      </h3>
      <ul class="tags" v-if="tag">
        <li class="tag-item" v-for="[label, total] of tagShown" :key="`tag-item-${label}`">
          <span class="tag-label">{{ label }}</span>
          <sup class="tag-total">{{ total }}</sup>
        </li>
      </ul>
      <router-link custom :to="{ name: 'tags' }" v-slot="{ navigate }">
        <span class="has-more" v-if="tagHasMore" @click="navigate" role="link">查看更多</span>
      </router-link>
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
import { fetchStat } from '@/api';

const statMap = {
  post: '文章',
  cate: '分类',
  tag: '标签',
};

const { total, cate, tag } = await fetchStat();
const getShownData = (raw: Record<string, number>, shownCount: number) => {
  let shownData: [string, number][] | undefined = void 0;
  let hasMore: boolean | undefined = void 0;
  if (raw) {
    const rawEntries = Object.entries(raw);
    shownData = rawEntries.slice(0, shownCount);
    hasMore = rawEntries.length > shownCount;
  }
  return {
    shownData,
    hasMore,
  };
};
const { shownData: cateShown, hasMore: cateHasMore } = getShownData(cate, 5);
const { shownData: tagShown, hasMore: tagHasMore } = getShownData(tag, 75);
</script>

<style lang="scss" scoped>
.side-info {
  @include flex(null, null, column);
  order: 1; // 确保路由切换时始终渲染在右侧
  flex-shrink: 0;
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
  text-align: center;
}

.stat-label {
  display: block;
  margin-block-end: 8px;
  font-size: small;
}

.stat-total {
  display: block;
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
  @include flex(null, null, column);
  row-gap: 8px;
}

.category-item {
  @include flex(space-between, center);
  padding: 8px;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.25s;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-3);
  }
}

.category-label {
  @include line-clamp(1);
}

.tags {
  @include flex(null, null, row wrap);
  gap: 8px;
}

.tag-item {
  padding: 8px;
  border-radius: 8px;
  font-size: small;
  font-weight: bold;
  transition: background-color 0.25s;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-3);
  }
}

.tag-label {
  margin-inline-end: 4px;
}

.tag-total {
  color: var(--text-grey);
  font-size: x-small;
  font-weight: normal;
}

.has-more {
  color: var(--text-grey);
  font-size: small;
  text-align: center;
  cursor: pointer;
}
</style>
