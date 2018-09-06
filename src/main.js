// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// 定义（路由）组件 从其他的文件import进来
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';

import 'common/stylus/index.styl';

Vue.config.productionTip = false;
// 使用模块化机制编程，导入Vue和VueRouter，
// 要调用 Vue.use(VueRouter)
Vue.use(VueRouter);
// 注册VueResource
Vue.use(VueResource);
/* eslint-disable no-new */
// new Vue({
//   // App vue 挂载到body子元素div（id=app）上
//   el: '#app',
//   VueRouter,
//   components: { App },
//   template: '<App/>'
// });

const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];
// 创建router实例，然后传入routes配置
// VueRouter配置传入对象，routes是该对象中的一个key
let router = new VueRouter({
  linkActiveClass: 'active',
  routes: routes
});
// 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
/* eslint-disable */
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
router.push('/goods');
