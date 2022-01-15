<script setup lang='ts'>
import { formatDate } from '~/utils'
defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})
const route = useRoute()
</script>

<template>
  <div v-if="frontmatter.display ?? frontmatter.title" class="prose m-auto my-10 px-5 text-left">
    <h1 class="mb-0">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p v-if="frontmatter.date" class="opacity-50 !-mt-4">
      {{ formatDate(frontmatter.date) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p v-if="frontmatter.subtitle" class="opacity-50 !-mt-6 italic">
      {{ frontmatter.subtitle }}
    </p>
  </div>
  <article>
    <slot />
  </article>
  <div v-if="route.path !== '/'" class="prose m-auto my-8">
    <router-link
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono no-underline opacity-50 hover:opacity-75"
    >
      cd ..
    </router-link>
  </div>
</template>
