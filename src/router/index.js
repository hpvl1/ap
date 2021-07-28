import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import i18n from '../i18n'

import Mainpage from "../views/Mainpage";
import Kb from '../views/Kb'
import KbCategory from '../views/KbCategory'
import Users from '../views/Users'
import User from '../views/User'


import SimpleHeader from '../layouts/SimpleHeader'
import FooterSimple from '../layouts/FooterSimple'
import Sidebar from '../layouts/Sidebar'

import Services from "../views/Services";
import Agreement from "../views/Agreement";
import Policy from "../views/Policy";

import SignIn from '../views/SignIn'
import Forgot from '../views/Forgot'
import Reset from '../views/Reset'
import Error from '../views/Error'

Vue.use(Router);

const isNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: Mainpage,
    },

    {
      path: '/kb',
      name: 'kb',
      meta: {
        requiresAuth: true,
        onlyWorker: true,
        title: i18n.t('main.meta.clients'),
        layout: 'simple',
      },
      components: {
        default: Kb,
        navbar: SimpleHeader,
        footer: FooterSimple,
        sidebar: Sidebar
      },
    },

    {
      path: '/kbcategory',
      name: 'kbcategory',
      meta: {
        requiresAuth: true,
        onlyWorker: true,
        title: i18n.t('main.meta.clients'),
        layout: 'simple',
      },
      components: {
        default: KbCategory,
        navbar: SimpleHeader,
        footer: FooterSimple,
        sidebar: Sidebar
      },
    },

    {
      path: '/users',
      name: 'users',
      meta: {
        requiresAuth: true,
        onlyWorker: true,
        title: i18n.t('main.meta.clients'),
        layout: 'simple',
      },
      components: {
        default: Users,
        navbar: SimpleHeader,
        footer: FooterSimple,
        sidebar: Sidebar
      },
    },
    {
      path: '/users/:id(\\d+)',
      name: 'user',
      meta: {
        requiresAuth: true,
        title: i18n.t('main.meta.client'),
        layout: 'simple',
      },
      components: {
        default: User,
        navbar: SimpleHeader,
        footer: FooterSimple,
        sidebar: Sidebar
      },
      props: { default: true, navbar: false, footer: false },
    },
    

    {
      path: '/login',
      name: 'sign-in',
      meta: {
        layout: 'empty',
        title: i18n.t('main.meta.login'),
      },
      component: SignIn,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import(/* webpackChunkName: "about" */ './views/SignIn.vue'),
      beforeEnter: isNotAuthenticated,
    },
    {
      path: '/forgot',
      name: 'forgot',
      meta: {
        layout: 'empty',
        title: i18n.t('main.meta.forgot'),
      },
      component: Forgot,
      beforeEnter: isNotAuthenticated,
    },
    {
      path: '/reset',
      name: 'reset',
      meta: {
        layout: 'empty',
        title: i18n.t('main.meta.reset'),
      },
      component: Reset,
      beforeEnter: isNotAuthenticated,
    },
    {
      path: '/error',
      name: 'error',
      meta: {
        layout: 'empty',
        title: i18n.t('main.meta.error'),
      },
      component: Error
    },

    {
      path: '/agreement',
      name: 'agreement',
      meta: {
        layout: 'simple',
      },
      components: {
        default: Agreement,
        navbar: SimpleHeader,
        footer: FooterSimple,
        sidebar: Sidebar
      },
    },
    {
      path: '/services',
      name: 'services',
      meta: {
        layout: 'simple',
      },
      components: {
        default: Services,
        navbar: SimpleHeader,
        footer: FooterSimple,
        sidebar: Sidebar
      },
    },
    {
      path: '/policy',
      name: 'policy',
      meta: {
        layout: 'simple',
      },
      components: {
        default: Policy,
        navbar: SimpleHeader,
        footer: FooterSimple,
        sidebar: Sidebar
      },
    },

    {
      path: '*',
      redirect: '/error'
    },
  ]
});

router.beforeEach((to, from, next) => {
  //Set layout
  let layout = (to.meta.layout || 'simple');
  if (layout !== store.getters.layout) {
    store.commit('SET_LAYOUT', layout);
  }

  //Set page title
  let pageTitle = to.meta.title ? `${to.meta.title} | ` : '';
  document.title = `${pageTitle}AkratoPRIME cms`;

  next();
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
      return;
    }
    next();
    return;
  }
  next();
});

export default router
