<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Luca Xue',
  meta: [
    { property: 'og:title', content: 'Luca Xue' },
    // { property: 'og:image', content: '' },
    { name: 'description', content: 'Luca Xue\'s Portfolio' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:creator', content: '@luca_xue' },
  ],
})
</script>

<template>
  <router-view />
</template>
