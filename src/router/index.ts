import { createRouter, createWebHistory } from 'vue-router'
import AssetListView from '../views/AssetListView.vue'
import AssetFormView from '../views/AssetFormView.vue'
import AssetDetailView from '../views/AssetDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/assets' },
    { path: '/assets', component: AssetListView },
    { path: '/assets/new', component: AssetFormView },
    { path: '/assets/:id/edit', component: AssetFormView },
    { path: '/assets/:id', component: AssetDetailView }
  ]
})

export default router
