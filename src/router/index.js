import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import ReportView from "../views/ReportView.vue"
import InputDataView from "../views/InputDataView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/report",
      name: "report",
      component: ReportView,
    },
    {
      path: "/input",
      name: "inputdata",
      component: InputDataView,
    },
  ],
  linkActiveClass: "link-active",
  linkExactActiveClass: "link-exact-active",
})

export default router
