<template>
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
import SideCard from '@/views/components/SideCard.vue';
</script>

<style lang="scss">
.blog-content {
  @include flex;
  flex-grow: 1;
  column-gap: 12px;
  padding: 0 12px;

  .content-wrapper {
    @include flex(null, null, column);
    flex-grow: 1;
    border-radius: 12px;
  }
}
</style>
