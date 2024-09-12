<template>
  <BlogNav :="navConfig" />
  <main class="blog-content">
    <RouterView v-slot="{ Component }" class="content-wrapper">
      <template v-if="Component">
        <Transition mode="out-in">
          <Suspense>
            <component :is="Component"></component>
          </Suspense>
        </Transition>
      </template>
    </RouterView>
    <Suspense>
      <SideCard />
    </Suspense>
  </main>
</template>

<script setup lang="ts">
import BlogNav, { type NavProps } from '@/views/components/BlogNav.vue';
import SideCard from '@/views/components/SideCard.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const navConfig: NavProps = {
  title: "LynnSha1ng's Blog",
  items: {
    labeled: [
      {
        label: '标签',
        iconClass: 'icon-24gf-tags2',
        to: { name: 'home' },
      },
      {
        label: '归档',
        iconClass: 'icon-boxtag-fill',
        to: { name: 'home' },
      },
    ],
    unlabeled: [
      {
        label: '测试',
        iconClass: 'icon-boxtag-fill',
        to: { name: 'home' },
      },
      {
        iconClass: 'icon-caidan',
        to: { name: 'home' },
        mobileOnly: true,
      },
    ],
  },
};
</script>

<style lang="scss">
.blog-content {
  @include flex;
  column-gap: 12px;
  padding: 12px;
  padding-top: 12px + 60; // + BlogNav h 60px

  .content-wrapper {
    flex: 1;
    min-height: calc(100dvh - 72px - 12px); // - pt 72px, add pd 12px
    border-radius: 12px;
    background-color: var(--bg-2);
  }
}
</style>
