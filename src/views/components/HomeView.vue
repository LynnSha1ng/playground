<template>
  <div class="recent-posts">
    <ul class="post-list">
      <li class="post-item" v-for="item of data">
        <div class="post-cover"><img src="/images/cover-default.jpg" alt="" /></div>
        <div class="post-info">
          <h3 class="post-title">
            {{ item.title }}
          </h3>
          <p class="post-desc">
            {{ item.description }}
          </p>
          <div class="post-meta">
            <span class="publish-time"
              ><i class="meta-icon iconfont icon-caidan"></i>发表于{{
                formatDate(item.birthTime)
              }}</span
            >
            <span class="last-modify-time"
              ><i class="meta-icon iconfont icon-caidan"></i>最后修改于{{
                formatDate(item.mTime)
              }}</span
            >
            <span class="category"
              ><i class="meta-icon iconfont icon-boxtag-fill"></i>{{ item.category }}</span
            >
            <ul class="tags">
              <i class="meta-icon iconfont icon-24gf-tags2"></i>
              <li class="tag" v-for="tag in item.tag">{{ tag }}</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <button @click="test">click</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, onWatcherCleanup, onMounted } from 'vue';
import { fetchStat, fetchRecentPosts } from '@/api';
import { db, type BlogPost } from '@/db';
import { localStorageUtils, formatDate } from '@/utils/tool';
import { useOffsetPagination } from '@vueuse/core';

const { total } = await fetchStat();
const data = ref<BlogPost[] | undefined>(await fetchRecentPosts(1, total.post).response);
const { currentPage, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
  total: total.post,
  pageSize: parseInt(import.meta.env.VITE_LIST_LIMIT),
  onPageChange: async ({ currentPage }) => {
    const { response, cancel } = fetchRecentPosts(currentPage, total.post);
    onWatcherCleanup(cancel);
    const pageData = await response;
    if (pageData) data.value = pageData;
  },
});
const test = () => {
  currentPage.value = (currentPage.value % 2) + 1;
};
</script>

<style lang="scss" scoped>
.post-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @include screenBelow($xl2) {
    grid-template-columns: 1fr;
  }
}

.post-item {
  @include flex(null, null, column);
  overflow: hidden;
  max-width: 520px;
  min-height: 368px;
  border-radius: 12px;
  background-color: var(--bg-2);

  @include screenBelow($xl2) {
    max-width: none;
  }

  @include screenBetween($sm, $xl2) {
    flex-direction: row;
    align-items: center;
    min-height: 268px;

    &:nth-child(even) {
      flex-direction: row-reverse;
    }
  }
}

.post-cover {
  height: 200px;

  img {
    object-fit: cover;
  }

  @include screenBetween($sm, $xl2) {
    flex-basis: 45%;
    height: 100%;
  }
}

.post-info {
  padding: 16px 40px 0;
  line-height: 2;

  @include screenBetween($sm, $xl2) {
    flex-basis: 55%;
    padding-top: 0;
  }

  @include screenBelow($sm) {
    padding-bottom: 16px;
  }
}

.post-title {
  @include line-clamp(2);
}

.post-desc {
  @include line-clamp(2);
  font-size: small;
}

.post-meta {
  color: var(--text-grey);
  font-size: small;
  @include inline-separator('|');
}

.meta-icon {
  margin-inline-end: 4px;
}

.tags {
  @include inline-separator('•', 6px);
}
</style>
