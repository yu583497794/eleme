<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-scroll">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="back">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="food-name">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="new-price">{{food.price}}</span>
              <span class="old-price" v-show="food.oldPrice">{{food.oldPrice}}</span>
            </div>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cart-add="_addFood"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <!-- 商品介绍  -->
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <!-- 商品评价 -->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :ratings="food.ratings" :select-type="selectType" :desc="desc" :only-content="onlyContent"
          @ratingtype-select="ratingTypeSelect" @content-toggle="contentToggle"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating,$index) in food.ratings" :key="$index" class="rating-item">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" width="12" height="12px">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></span>
                {{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import Vue from 'vue';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';
// {a,b,c}可以引入多个方式
import {formatDate} from 'common/js/date';
// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;
export default {
  name: 'food',
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  filters: {
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    // 可以设置为被外部组件调用的方法命名为functionName，私有方法命名为_functionName
    // 通过为组件实例申请ref，在外调用实例方法
    show () {
      this.showFlag = true;
      // 初始化,保证每个点进来都是初始化状态
      this.onlyContent = true;
      this.selectType = ALL;
      // 保证DOM已经被渲染
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    back () {
      this.showFlag = false;
    },
    addFirst (event) {
      if (!event._constructed) {
        return;
      }
      // 点击瞬间消失,增加动画，可获得元素的正确位置
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count = 1;
      }
      this.$emit('add-food', event.target);
    },
    // cartcontrol中`this.$emit('cart-add', event.target);`
    // 即监听事件cart-add传递参数为event.target而非event
    _addFood (target) {
      this.$emit('add-food', target);
    },
    ratingTypeSelect (type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    contentToggle (onlyContent) {
      this.onlyContent = onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    needShow (rateType, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL || rateType === this.selectType) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .food
    position: fixed
    top: 0
    left: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #f3f5f7
    transform: translate3d(0, 0, 0)
    &.move-enter,&.move-leave-to
      transform: translate3d(100%, 0, 0)
    &.move-enter-active,&.move-leave-active
      transition: all 0.2s linear
    .food-content
      background: #fff
      position: relative
      .image-header
        position: relative
        width: 100%
        height: 0
        // 相对于盒子的宽度 宽高相等的容器
        // 需要限定高度，否则根据高度撑开图片
        padding-top: 100%
        img
          position: absolute
          top: 0
          left: 0
          weight: 100%
          height: 100%
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: block
            // 使得按钮的范围加大
            padding: 10px
            font-size: 20px
            color: #fff
      .content
        padding: 18px
        position: relative
        .food-name
          line-height: 14px
          margin-bottom: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          height: 10px
          font-size: 0
          .sell-count,.rating
            font-size: 10px
            color: rgb(147, 153, 159)
            &.sell-count
              margin-right: 12px
        .price
          .new-price,.old-price
            line-height: 24px
            font-weight: 700
            &.new-price
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            &.old-price
              font-size: 10px
              color: rgb(147, 153, 159)
              text-decoration: line-through
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 12px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        background: rgb(0, 160, 220)
        color: #fff
        opacity: 1
        &.fade-enter,&.fade-leave-to
          opacity: 0
        &.fade-enter-active
          transition: all 0.2s linear
    .info
      padding: 18px
      background: #ffffff
      .title
        margin-bottom: 6px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .text
        padding: 0 8px
        font-size: 12px
        line-height: 24px
        font-weight: 200
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      background: #ffffff
      .title
        margin-left: 18px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
    .rating-wrapper
      padding: 0 18px
      background: #ffffff
      .rating-item
        position: relative
        padding: 16px 0
        border-bottom: 1px solid  rgba(7, 17, 27, 0.1)
        font-size: 0
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          span
            line-height: 24px
            font-size: 12px
            &.icon-thumb_up
              color: rgb(0, 160, 220)
            &.icon-thumb_down
              color: rgb(147, 153, 159)
        .user
          position: absolute
          top: 16px
          right: 0
          vertical-align: top
          font-size: 0
          .name
            margin-right: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          img
            vertical-align: top
    .no-rating
      padding: 16px 0
      font-size: 12px
      color: rgb(147, 153, 159)
</style>
