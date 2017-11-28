// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

Vue.use(VueResource)
Vue.use(VueRouter)

const routes = [
  { path: '', component: App, name: 'home' },
  { path: '/movies/:movieId', component: App, name: 'movie' },
  { path: '/search/:name', component: App, name: 'search' }
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  router
}).$mount('#app')
