<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>()
</script>

<template>
  <template v-for="section in Object.keys(projects)" :key="section">
    <h4 class="mt-10 font-bold">
      {{ section }}
    </h4>
    <div class="project-grid py-2 -mx-3 gap-2">
      <a
        v-for="item, idx in projects[section]"
        :key="idx"
        class="py-[0.8em] px-[1em] text-lg rounded-sm bg-transparent relative flex items-center transition duration-200 ease-in-out hover:bg-[#88888808]"
        :href="item.link"
        target="_blank"
        rel="noopener"
        style="text-decoration: none !important;"
      >
        <div class="flex-auto">
          <div class="text-normal">{{ item.name }}</div>
          <div class="text-sm opacity-50 font-normal" v-html="item.desc" />
        </div>
      </a>
    </div>
  </template>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>
