<script setup>
import { Icon } from "@iconify/vue"

const navLists = [
  {
    name: "Dashboard",
    path: "/",
    icon: "ant-design:home-outlined",
  },
  {
    name: "Cari Kendaraan",
    path: "/report",
    icon: "carbon:report-data",
  },
  {
    name: "Input",
    path: "/input",
    icon: "fluent:money-calculator-24-regular",
  },
]
</script>

<template>
  <nav
    class="print:hidden fixed bottom-0 left-0 w-full lg:border-r-[3px] lg:border-r-slate-900 lg:max-w-[20vw] lg:top-0 bg-orange-400 dark:bg-slate-800 dark:border-r-slate-200/20"
  >
    <ul class="flex items-center justify-center lg:flex-col">
      <li
        class="hidden lg:flex lg:items-center lg:px-8 lg:w-full lg:my-6 lg:gap-2"
      >
        <Icon
          class="mx-auto lg:mx-0 text-4xl text-white"
          icon="icon-park-outline:parking"
        />
        <p class="text-white text-xl font-bold capitalize">parking app</p>
      </li>

      <li v-for="(nav, i) in navLists" :key="i" class="w-full">
        <RouterLink
          class="block py-1 lg:flex lg:px-8 lg:py-4 lg:gap-x-2 lg:items-center"
          :to="nav.path"
        >
          <Icon class="mx-auto lg:mx-0 text-4xl" :icon="nav.icon" />
          <p class="hidden lg:block">{{ nav.name }}</p>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped type="text/tailwindcss">
a {
  @apply transition-colors text-slate-50 hover:bg-slate-50 hover:text-orange-400 active:bg-slate-50 active:text-orange-400 dark:hover:text-slate-700;
}

a.link-active,
a.link-exact-active {
  @apply bg-slate-50 text-orange-400 hover:bg-slate-200 hover:text-orange-600 dark:text-slate-700 dark:hover:text-slate-800;
}
</style>
