<script setup lang='ts'>
import VueUtterances from 'vue-utterances'
import { isDark } from '~/composables'
import { formatDate } from '~/utils'

defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      document.querySelector(decodeURIComponent(location.hash))
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const handleAnchors = (
    event: MouseEvent & { target: HTMLElement },
  ) => {
    const link = event.target.closest('a')
    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return
      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }
  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })
  navigate()
  setTimeout(navigate, 500)
})
</script>

<template>
  <div v-if="frontmatter.display ?? frontmatter.title" class="m-auto my-10 prose text-left px-7">
    <h1 class="mb-0 !text-4xl !font-bold">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p v-if="frontmatter.date" class="opacity-50 !-mt-4">
      {{ formatDate(frontmatter.date) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p v-if="frontmatter.subtitle" class="opacity-50 !-mt-6 italic">
      {{ frontmatter.subtitle }}
    </p>
  </div>
  <article ref="content">
    <slot />
  </article>
  <VueUtterances
    v-if="route.path.startsWith('/posts/')"
    :key="isDark"
    class="max-w-screen-md px-4 m-auto mt-8 md:px-5 md:pr-21"
    repo="lucaxue/lucaxue.dev"
    label="💬 comment"
    :theme="isDark ? 'photon-dark' : 'github-light'"
    issue-term="pathname"
  />
  <div v-if="route.path !== '/'" class="m-auto my-8 prose">
    <router-link
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono no-underline opacity-50 hover:opacity-75"
    >
      cd ..
    </router-link>
  </div>
</template>
