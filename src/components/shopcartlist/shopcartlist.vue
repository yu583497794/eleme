<template>
  <div class="shopcartlist">
    <div class="header-wrapper">
      <span class="cart">购物车</span>
      <span class="clear-all">清空</span>
    </div>
    <ul>
      <li v-for="food in selectFoods" :key="food" class="cart-food">
        <div class="food-wrapper">
          <div class="food-desc">
            <span class="food-name">{{food.name}}</span>
            <span class="food-price">￥{{food.count*food.price}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cart-add="addCart"/>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import cartcontrol from 'components/cartcontrol/cartcontrol.vue';
export default {
  name: 'shopcartlist',
  data () {
    return {

    };
  },
  components: {
    cartcontrol
  },
  props: {
    selectFoods: {
      type: Array
    }
  },
  methods: {
    addCart (target) {
      this._drop(target);
    },
    _drop (target) {
      return 0;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl'
  .shopcartlist
    position: fixed
    bottom: 46px
    left: 0
    width: 100%
    max-height: 283px
    .header-wrapper
      height: 40px
      background: #f3f5f7
      border-1px(rgba(7,17,27,0.1))
      .cart
        margin-left: 18px
        font-size: 14px
        line-height: 40px;
        color: rgb(7, 17, 27)
      .clear-all
        margin-right: 18px
        float: right
        font-size: 12px
        line-height: 40px
        color: rgb(0, 160, 220)
    .cart-food
      height: 48px
      background: rgb(255, 255, 255)
      .food-wrapper
        margin:0 18px
        display: relative
        font-size: 0
        border-1px(rgba(7,17,27,0.1))
        .food-desc
          display: flex
          justify-content: space-between
          margin-right: 84px
          .food-name,.food-price
            display: inline-block
            flex: 1
            line-height: 48px
            height: 48px
            font-size: 14px
            &.food-name
              color: rgb(7, 17, 27)
            &.food-price
              text-align: right
              color: rgb(240, 20,20)
              font-weight: 700
        .cartcontrol-wrapper
          position: absolute
          right: 0
          top: 6px
          display: inline-block;
          padding-left: 12px
          vertical-align: top
</style>
