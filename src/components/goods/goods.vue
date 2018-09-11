<template>
  <div class="goods">
    <!-- ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, $index) in goods" :key="item" class="menu-item" :class="{'current': currentIndex === $index}"
        @click="selectMenu($index, $event)">
          <span class="text border-1px">
            <span class="icon" v-show="item.type>=0" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="item in  goods" :key="item">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc" v-show="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="sellCount">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cart-add="cartAdd"/>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"
    ref="shopcart"></shopcart>
    <food :food="selectedFood" ref="food" @add-food="cartAdd"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import food from 'components/food/food';
export default {
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      shopcartlist: true,
      selectedFood: {}
    };
  },
  props: {
    'seller': {
      type: Object
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
    },
    // 将已选的food数组传递给购物车
    selectFoods () {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created () {
    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === 0) {
        this.goods = response.data;
        // 如此才能正确地计算menu的高度
        // 因为 ref 本身是作为渲染结果被创建的，在初始渲染的时候不能访问它们,它们还不存在！
        // 操作原生dom时一定要保证dom已经渲染好了
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  methods: {
    // better-scroll https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/api.html#offtype-fn
    _initScroll () {
      // $refs一个对象，持有注册过 ref 特性 的所有 DOM 元素和组件实例。
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodWrapper, {
        // 探针
        // 有时候我们需要知道滚动的位置。
        // 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
        // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
        // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
        // 如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
        probeType: 3,
        click: true
      });
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    // 计算每部分高度
    _calculateHeight () {
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        // clientHeight，只读属性，元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu (index, event) {
      // 浏览器原生event不包含属性_constructed
      // Element.clientHeight - Web API 接口 | MDN https://developer.mozilla.org/zh-CN/docs/Web/API/Element/clientHeight
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el);
    },
    cartAdd (target) {
      this._drop(target);
    },
    // 通过事件监听$emit("cart-add",event.target)，把enent.target从子组件传递给父组件
    // @cart-add="cartAdd",事件cart-add触发父组件cartAdd方法
    // 注册shopcart组件的ref引用，并在cartAdd方法中调用该组件的方法，传递target即el
    _drop (target) {
      // 让下落动画异步执行 优化体验
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    selectFood (food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"
  .goods
    display: flex
    position:absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        // color: rgb(240, 20, 20)
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          font-weight: 700
          background: #ffffff
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: middle
          margin-right: 2px
          background-size:12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        // 默认为横向排列
        display: flex
        // 如果使用padding则下划线贯穿整个item
        margin: 18px
        // 上下margin会合并为一个，若不设置padding-bottom则下划线紧贴item
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            line-height: 14px
            height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc,.extra
            // height: 10px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            margin-bottom: 8px
            .sellCount
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: red
            .old
              font-size: 10px
              color: rgb(147, 153, 159)
              text-decoration: line-through
          .cartcontrol-wrapper
            position: absolute
            bottom: 12px
            right: 0
</style>
