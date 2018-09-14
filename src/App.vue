<template>
  <div id="app">
    <detail :seller="seller" :detailShow="detailShow" @hideDetail="hideDetail"></detail>
    <v-header :seller='seller' :detailShow="detailShow" @showDetail="showDetail"/>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="seller">商家</router-link>
      </div>
    </div>
    <!-- 将组件内容缓存在内存里 -->
    <keep-alive>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view :seller="seller" @selectedFoods="selcFoodsFun" @drop="_drop"></router-view>
    </keep-alive>
    <keep-alive>
      <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"
      ref="shopcart"></shopcart>
    </keep-alive>
  </div>
</template>

<script type="text/ecmasript-6">
import header from './components/header/header.vue';
import detail from './components/detail/detail.vue';
import shopcart from 'components/shopcart/shopcart';
import {urlParse} from './common/js/util';
const ERR_OK = 0;
export default {
  data () {
    return {
      // 需要把seller对象传递给子组件 header
      seller: {
        id: (() => {
          // 立即执行函数
          let queryParam = urlParse();
          // console.log(queryParam);
          return queryParam.id;
        })()
      },
      detailShow: false,
      selectFoods: []
    };
  },
  created () {
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        // 想向已有对象上添加一些属性 (已有对象即data中声明的seller{id:XXX}}))
        // 使用 Object.assign() 或 _.extend() 方法来添加属性。
        // Object.assign(targetObj, srcObj, srcObj) 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
        // 但是，添加到对象上的新属性不会触发更新。
        // 在这种情况下可以创建一个新的对象，让它包含原对象的属性和新的属性
        // 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
        // this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
        this.seller = Object.assign({}, this.seller, response.data);
        // this.seller = response.data;
        // console.log(this.seller);
      }
    });
  },
  components: {
    // v-header：header 支持简写 header
    'v-header': header,
    'detail': detail,
    'shopcart': shopcart
  },
  methods: {
    showDetail () {
      this.detailShow = true;
    },
    hideDetail () {
      this.detailShow = false;
    },
    selcFoodsFun (foods) {
      this.selectFoods = foods;
    },
    // cartcontrol--($emit)>>goods--($emit)>>App--($refs)>>shopcart
    _drop (target) {
      // 让下落动画异步执行 优化体验
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./common/stylus/mixin.styl"
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex:1
      text-align: center
      // 字符&指向父选择器
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
