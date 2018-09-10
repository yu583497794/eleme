<template>
  <div class="cartcontrol">
    <transition name="move">
      <!-- 一层平移，一层滚动 -->
      <!-- 此处参考了博客： -->
      <!-- vue2中的过渡效果 - CSDN博客 https://blog.csdn.net/github_38861674/article/details/76686168 -->
      <div class="cart-decrease" v-show="food.count > 0"
      @click="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
export default {
  name: 'cartcontrol',
  data () {
    return {
    };
  },
  props: {
    food: {
      type: Object
    }
  },
  created () {
    // console.log(this.food);
  },
  methods: {
    addCart (event) {
      // 移动端点击也只触发一次
      if (!event._constructed) {
        return;
      }
      // 此时food.count修改不会引起decrease-icon和count的变化
      if (!this.food.count) {
        // 为this.food增加count属性,此时会观测到变化
        Vue.set(this.food, 'count', 1);
        // this.food.count = 1;
      } else {
        this.food.count++;
      }
      this.$emit('cart-add', event.target);
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count > 0) {
        this.food.count--;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      .inner
        // 一定要设置为inline-block否则会没有高度
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all .4s ease
        transform: rotate(0deg)
      &.move-enter,&.move-leave-to
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          // 进入前和离开后icon的旋转角度
          transform: rotate(180deg)
      &.move-enter-active,&.move-leave-active
        // transition: all .4s linear  只能应用到div.decrease上，不能继承到i.inner,所以需要另外在i.icon上写transition: all .4s ease
        transition: all .4s ease
      // move-enter-to相当于move-transition
      // &.move-enter-to,&.move-leave
      //   opacity: 1
      //   transform: translate3d(0, 0, 0)
      //   .inner
      //     transition: all .4s linear
      //     transform: rotate(360deg)
    .cart-count
      display: inline-block
      vertical-align: top
      text-align: center
      width: 12px
      padding-top: 6px
      font-size: 10px
      line-height:24px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
