import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useStatStore = defineStore('stat', async () => {
  const staticStat = ref<any>();
  const fetchStatData = async () => {
    const response = await fetch('/data/stat/stat.json');
    staticStat.value = await response.json();
  };
  await fetchStatData();
  return {
    staticStat,
  };
});
