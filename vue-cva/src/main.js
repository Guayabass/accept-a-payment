import { createApp, nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue';

import SrCheckoutForm from './components/SrCheckoutForm.vue'
import SrReturn from './components/SrReturn.vue'
import { createPinia } from 'pinia'

const routes = [
  { 
    path: '/', 
    component: SrCheckoutForm, 
    meta: { 
      title: 'Payment'
     } 
  },
  { 
    path: '/return', 
    component: SrReturn, 
    meta: { title: 'Return' } 
  }, 
]

const history = createWebHistory();

const router = new createRouter({
  history,
  routes
});

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title || 'Payment';
  });
});

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app');
