// 购物车
<template>
  <div class="wrapper">
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount}">
              <i class="icon-shopping_cart" :class="{highlight:totalCount}"></i>
            </div>
            <div class="num" v-show="totalCount">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight:totalPrice > 0}">￥{{totalPrice}}</div>
          <!-- 虽然在属性声明中是delivery-price但是有减号会输出NAN -->
          <!-- 如果使用'delivery-price'会直接输出字符串-->
          <!-- 因此使用驼峰式命名 -->
          <div class="desc">另需配送费￥{{deliveryPrice}}</div>
        </div>
        <!-- 阻止事件的冒泡 -->
        <div class="content-right" @click.stop.prevent="pay">
          <!-- 或者使用定义的computed方法来获取class -->
          <span class="pay" :class="totalPrice < minPrice ? 'not-enough' : 'enough'">
            {{payDesc}}
          </span>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop" @beforeEnter="beforeDrop" @enter="dropping" @afterEnter="afterDrop">
          <div v-for="(ball,$index) in balls" :key="$index" v-show="ball.show" class="ball">
            <!-- hook 表明只是用来被js选择而没有真实的含义 -->
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food,$index) in selectFoods" :key="$index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.count*food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import cartcontrol from 'components/cartcontrol/cartcontrol.vue';
import BScroll from 'better-scroll';
export default {
  data () {
    return {
      balls: [
        {
          show: false,
          el: {}
        },
        {
          show: false,
          el: {}
        },
        {
          show: false,
          el: {}
        },
        {
          show: false,
          el: {}
        },
        {
          show: false,
          el: {}
        }
      ],
      dropBalls: [],
      fold: true
    };
  },
  props: {
    'select-foods': {
      type: Array,
      default () {
        return [];
      }
    },
    'delivery-price': {
      type: Number,
      default: 0
    },
    'min-price': {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 均依赖于selectFoods
    totalPrice () {
      // eslint-disable-next-line
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount () {
      // eslint-disable-next-line
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差${diff}起送`;
      } else {
        return '去结算';
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    },
    listShow: {
      // 在计算listShow的同时改变了this.fold
      // 计算属性默认只有getter,不过在需要时也可以提供一个setter
      // 当你读取一个变量的时候会触发该变量的getter.
      // 当你修改该变量时候会触发他的setter.
      get () {
        if (!this.totalCount) {
          return false;
        }
        let show = !this.fold;
        return show;
      }// ,
      // set () {
      //   if (!this.totalCount) {
      //     console.log('0000000000');
      //     this.fold = true;
      //   }
      // }
    }
  },
  methods: {
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeDrop (el) {
      let count = this.dropBalls.length;
      while (count--) {
        let ball = this.dropBalls[count];
        if (ball.show) {
          // getBoundingClientRect用于获取某个元素相对于视窗的位置集合
          // 返回一个rectObject
          // ball.el对应于触发+的元素
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          // 初始位置相当于购物车向上和向下移动到ball.el
          el.style.webkitTransform = `translate3d(0, ${y}px,0)`;
          el.style.transform = `translate3d(0, ${y}px, 0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    dropping (el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      // $nextTick(() => {}) 与DOM相关操作写在该函数回调中
      // 确保DOM已渲染
      this.$nextTick(() => {
        el.style.webkitTransition = 'all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)';
        el.style.transition = 'all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)';
        el.style.webkitTransform = 'translate3d(0, 0, 0)';
        el.style.transform = 'translate3d(0, 0, 0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransition = 'all 0.4s linear';
        inner.style.transition = 'all .4s linear';
        inner.style.webkitTransform = 'translate3d(0, 0, 0)';
        inner.style.transform = 'translate3d(0, 0, 0)';
      });
    },
    afterDrop (el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    hideList () {
      this.fold = true;
    },
    pay () {
      if (!this.totalPrice) {
        window.alert('您尚未选择任何商品');
      } else {
        if (this.totalPrice < this.minPrice) {
          window.alert(`支付￥${this.totalPrice + this.deliveryPrice}`);
        } else {
          window.alert(`支付￥${this.totalPrice}`);
        }
      }
    }
  },
  watch: {
    listShow (newVal, oldVal) {
      if (newVal === true) {
        if (!this.scroll) {
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          });
        } else {
          this.scroll.refresh();
        }
      }
    },
    totalCount (newVal, oldVal) {
      if (!newVal) {
        this.fold = true;
      }
    }
  },
  components: {
    cartcontrol
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .shopcart
    // 固定在屏幕相对位置
    position: fixed
    height: 48px
    width: 100%
    left: 0
    bottom: 0
    z-index: 50
    .content
      display: flex
      background: #141d27
      // inline-block 注意！
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          // 36-12(圆的轮廓)=24 24/2
          margin: 0 12px 2px 12px
          padding: 6px
          width: 56px
          height: 56px
          // 56*2=112=116-2*2(margin-bottom)
          // width=border+padding+content-width
          box-sizing: border-box
          border-radius: 50%
          // 若不设置背景色，则超出wrapper的部分不显示
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              display: inline-block
              width: 44px
              height: 44px
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            line-height: 16px
            height: 16px
            box-sizing: border-box
            border-radius: 6px
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4)
            background: rgb(240, 20, 20)
            text-align: center
            font-size: 9px
            font-weight: 700
            color: rgb(255, 255, 255)
        .price,.desc
          display: inline-block
          // 如此不受line-height基线影响
          vertical-align: top
          // 使用line-height配合margin-top实现垂直居中，是因为考虑使用border画分割线。若使用height和line-height则不符合要求
          line-height: 24px
          margin-top: 12px
          box-sizing: border-box
        .price
          font-size: 16px
          font-weight: 700
          padding-right: 12px
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          &.highlight
            color: rgb(255, 255, 255)
        .desc
          padding-left: 12px
          padding-right: 12px
          font-weight: 200
          font-size: 12px
      .content-right
        flex: 0 0 105px
        width: 105px
        // font-size:0
        .pay
          display: inline-block
          line-height: 48px
          height:48px
          width: 100%
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 200)
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index:-1
      width: 100%
      opacity: 1
      transform: translate3d(0,-100%,0)
      &.fold-enter,&.fold-leave-to
        opacity: 0
        transform: translate3d(0,0,0)
      &.fold-enter-active,&.fold-leave-active
        transition: all 0.5s ease
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160,220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          // 内容高度为48px，wrong
          // height: 48px
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          padding: 12px 0
          .name
            // position: absolute
            // left: 0
            // top: 0
            font-size: 14px
            line-height: 24px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    // 应小于shopcart的z-index即50
    z-index: 40
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    filter: blur(10px)
    &.fade-enter-active,&.fade-leave-active
      transition: all .5s ease
    &.fade-enter,&fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
