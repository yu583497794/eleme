<template>
  <div class="cartcontrol">
    <div class="cart-decrease icon-remove_circle_outline" v-show="food.count > 0"
      @click="decreaseCart"></div>
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
      console.log(this.food.count);
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return;
      }
      this.food.count--;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol
    font-size: 0
    .cart-decrease,.cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
    .cart-count
      display: inline-block
      vertical-align: top
      text-align: center
      width: 12px
      padding-top: 6px
      font-size: 10px
      line-height:24px
      color: rgb(147, 153, 159)
</style>
