<template>
  <header
    :class="{
      'top-nav': true,
      'shadow-bottom': showNav,
    }">
    <h3>
      <router-link :to="{ name: 'home' }">{{ title }}</router-link>
    </h3>

    <ul class="nav-items --pc-only">
      <RouterLink
        v-for="item in items.labeled"
        :key="`nav-item-labeled-${item}`"
        custom
        :to="item.to"
        v-slot="{ navigate }">
        <li class="nav-item underline-grow" @click="navigate" role="link">
          <i :class="['item-icon', 'iconfont', item.iconClass]"></i>
          <span class="item-label"> {{ item.label }}</span>
        </li>
      </RouterLink>
    </ul>

    <ul class="nav-items">
      <RouterLink
        v-for="item in items.unlabeled"
        :key="`nav-item-unlabeled-${item}`"
        custom
        :to="item.to"
        v-slot="{ navigate }">
        <li
          class="nav-item underline-grow item-icon iconfont"
          :class="item.iconClass"
          :title="item.label"
          @click="navigate"
          role="link"></li>
      </RouterLink>
      <li class="nav-item underline-grow item-icon iconfont icon-caidan --mobile-only"></li>
    </ul>
  </header>
  <div class="top-nav-placeholder"></div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface NavItem {
  iconClass: string;
  label: string;
  to: RouteLocationRaw;
}
export interface NavProps {
  title: string;
  items: {
    labeled: NavItem[];
    unlabeled: NavItem[];
  };
}
defineProps<NavProps>();

import { ref, computed } from 'vue';
import { useEventListener, useDebounceFn, useThrottleFn } from '@vueuse/core';

const lastScrollY = ref(0);
const showNav = ref(true);
const navTransY = computed(() => (showNav.value ? '0' : '-100%'));

useEventListener(
  window,
  'scroll',
  useDebounceFn(() => {
    if (window.innerWidth <= 768) return;
    if (window.scrollY - lastScrollY.value < 0) {
      showNav.value = true;
    } else if (window.scrollY - lastScrollY.value > 0 && window.scrollY >= 60) {
      showNav.value = false;
    }
    lastScrollY.value = window.scrollY;
  }, 200),
);

useEventListener(
  window,
  'resize',
  useThrottleFn(() => {
    if (window.innerWidth <= 768) {
      showNav.value = true;
    }
  }, 1000),
);
</script>

<style lang="scss" scoped>
.top-nav-placeholder {
  height: 60px;
}

.top-nav {
  position: fixed;
  z-index: 1145;
  @include flex(space-between, center);
  width: 100%;
  height: 60px;
  max-width: $max;
  padding: 0 20px;
  background-color: color-mix(in oklch, var(--bg-2), transparent 25%);
  transform: translateY(v-bind(navTransY));
  transition-property: background-color, transform, box-shadow;
  transition-duration: 0.35s;
  @include screenBelow($md) {
    padding-right: 0;
  }
}

.nav-items {
  &.--pc-only {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @include screenBelow($md) {
      display: none;
    }
  }
}

.nav-item {
  --color-grow-line: var(--primary);

  display: inline;
  padding: 8px;
  margin-inline: 4px;
  cursor: pointer;

  &:hover {
    color: var(--primary);
  }

  &.--mobile-only {
    @include screenAbove($md) {
      display: none;
    }
  }
}

.item-icon {
  font-size: 1.15rem;
}

.item-label {
  margin-inline-start: 4px;
  font-size: 0.95rem;
}
</style>
