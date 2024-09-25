<template>
  <BlogNav :="navConfig" />
  <router-view></router-view>
  <BlogFooter />
</template>

<script setup lang="ts">
import BlogNav, { type NavProps } from '@/components/BlogNav.vue';
import BlogFooter from '@/components/BlogFooter.vue';

const navConfig: NavProps = {
  title: "LynnSha1ng's Blog",
  items: {
    labeled: [
      {
        label: '标签',
        iconClass: 'icon-24gf-tags2',
        to: { name: 'tags' },
      },
      {
        label: '归档',
        iconClass: 'icon-boxtag-fill',
        to: { name: 'tags' },
      },
    ],
    unlabeled: [
      {
        label: '测试',
        iconClass: 'icon-boxtag-fill',
        to: { name: 'tags' },
      },
    ],
  },
};
</script>
