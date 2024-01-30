import Router from 'vue-router';
import Vue from 'vue';
Vue.use(Router)
const vueRouter = new Router({
  base: process.env.VUE_APP_PATH,
  mode: process.env.VUE_APP_MODE,
  routes: [{
    path: '/',
    component: () => import( /* webpackChunkName: "views" */ '@/views/index'),
    children: [{
      path: '',
      component: () => import( /* webpackChunkName: "views" */ '@/views/list'),
    },
    {
      path: 'category',
      component: () => import( /* webpackChunkName: "views" */ '@/views/list/category'),
    }, {
      path: 'db',
      component: () => import( /* webpackChunkName: "views" */ '@/views/list/db'),
    }, {
      path: 'map',
      component: () => import( /* webpackChunkName: "views" */ '@/views/list/map'),
    }, {
      path: 'document',
      component: () => import( /* webpackChunkName: "views" */ '@/views/list/document'),
    }, {
      path: 'components',
      component: () => import( /* webpackChunkName: "views" */ '@/views/list/components'),

    }, {
      path: 'record',
      component: () => import( /* webpackChunkName: "views" */ '@/views/list/record'),

    },{
        path: 'portal',
        component: () => import( /* webpackChunkName: "views" */ '@/views/portal/index'),

      }]
  }, {
    path: '/create',
    name: 'create',
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/create')
  }, {
    path: '/build/:path(.*)',
    name: 'build',
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/build')
  }, {
    path: '/view/:path(.*)',
    name: 'view',
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/view')
  }]
})
export default vueRouter;
