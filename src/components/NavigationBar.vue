<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
const { t } = useI18n()
</script>

<template>
  <nav class="mb-6 w-full flex justify-between">
    <router-link class="icon-btn mx-2" to="/" :title="t('button.home')">
      <span class="font-semibold">Luca Xue</span>
    </router-link>
    <div class="flex">
      <router-link class="icon-btn mx-2" to="/about" :title="t('button.home')">
        About
      </router-link>

      <router-link class="icon-btn mx-2" to="/blogs" :title="t('button.home')">
        Blogs
      </router-link>

      <router-link class="icon-btn mx-2" to="/projects" :title="t('button.home')">
        Projects
      </router-link>

      <a class="icon-btn mx-2" rel="noreferrer" href="https://twitter.com/luca_xue" target="_blank" title="Twitter">
        <carbon-logo-twitter />
      </a>

      <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/lucaxue" target="_blank" title="GitHub">
        <carbon-logo-github />
      </a>

      <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
        <carbon-moon v-if="isDark" />
        <carbon-sun v-else />
      </button>
    </div>
  </nav>
</template>
