<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
const { t } = useI18n()
</script>

<template>
  <header class="mb-6 px-5 w-full flex justify-between">
    <router-link class="icon-btn mx-2" to="/" :title="t('button.home')">
      <uil-home-alt class="mt-1" />
    </router-link>

    <nav class="flex">
      <router-link class="icon-btn mx-2" to="/posts" :title="t('button.home')">
        <span class="sm:block hidden">Blog</span>
        <uil-file-alt class="sm:hidden mt-1" />
      </router-link>

      <router-link class="icon-btn mx-2" to="/projects" :title="t('button.home')">
        <span class="sm:block hidden">Projects</span>
        <uil-lightbulb-alt class="sm:hidden mt-1" />
      </router-link>

      <a class="icon-btn mx-2" rel="noreferrer" href="https://twitter.com/luca_xue" target="_blank" title="Twitter">
        <uil-twitter-alt class="mt-1" />
      </a>

      <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/lucaxue" target="_blank" title="GitHub">
        <uil-github-alt class="mt-1" />
      </a>

      <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
        <uil-moon v-if="isDark" class="mt-1" />
        <uil-sun v-else class="mt-1" />
      </button>
    </nav>
  </header>
</template>
