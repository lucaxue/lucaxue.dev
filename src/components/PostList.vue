<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatDate } from '~/utils'

const router = useRouter()

const posts = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter?.date)
  .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date))
</script>

<template>
  <ul>
    <router-link
      v-for="(route, index) in posts"
      :key="route.path"
      style="text-decoration: none !important;"
      :to="route.path"
    >
      <li>
        <div class="text-lg font-normal">
          {{ route.meta.frontmatter.title }}
        </div>
        <div class="opacity-50 text-sm" :class="[index !== posts.length -1 ? 'mb-6' : '']">
          {{ formatDate(route.meta.frontmatter.date) }} <span v-if="route.meta.frontmatter.duration" class="opacity-50">· {{ route.meta.frontmatter.duration }}</span>
        </div>
      </li>
    </router-link>
  </ul>
</template>
