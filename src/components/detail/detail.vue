<template>
  <div class="detail-wrapper">
     <!-- 使用Vue提供的transition封装组件，给任何元素和组件添加进入/离开过渡 -->
    <!-- 条件渲染 v-if -->
    <!-- 条件展示 -->
    <!-- 动态组件 -->
    <!-- 组根节点 -->
    <!-- 自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名 -->
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item, $index) in seller.supports" :key="item">
                <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
                <span class="text">{{seller.supports[$index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">
                {{seller.bulletin}}
              </p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
        <!-- <div class="background"></div> -->
      </div>
    </transition>
    <div class="detail-mask" v-show="detailShow"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star.vue';
export default {
  components: {
    star
  },
  props: {
    seller: {
      type: Object
    },
    detailShow: {
      type: Boolean
    }
  },
  methods: {
    hideDetail () {
      this.$emit('hideDetail');
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin";
  .detail
    position: fixed
    top: 0
    left: 0
    z-index: 100
    width: 100%
    height: 100%
    // overflow: auto
    overflow: hidden
    background: rgba(7, 17, 27, 0.8)
    color: #ffffff
    // 只在iPhone上生效
    //backdrop-filter: blur(10px)
    // 定义进入过渡的开始状态 & 定义离开过渡的结束状态
    &.fade-enter,&.fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
    // 定义进入/离开过渡生效时的状态
    &.fade-enter-active,&.fade-leave-active
      transition: all 0.5s ease
    // 定义进入过渡的结束状态 & 定义离开过渡的开始状态
    &.fade-enter-to,&.&.fade-leave
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
    .detail-wrapper
      min-height: 100%
      width: 100%
      .detail-main
        margin-top: 64px
        padding-bottom: 64px
        .name
          line-height: 16px
          text-align: center
          font-size: 16px
          font-weight: 700
        .star-wrapper
          margin-top: 18px
          padding: 2px 0;
          text-align: center
        .title
          display: flex
          width: 80%
          margin: 28px auto 24px auto
          .line
            flex:1
            position: relative
            top: -6px
            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
          .text
            padding: 0 12px
            font-weight: 700
            font-size: 14px
            line-height: 14px
        .supports
          margin: 0 auto
          width: 80%
          .support-item
            padding: 0 12px 0 12px
            margin-bottom: 12px
            font-size: 0
            &:last-child
              margin-bottom: 0
            .icon
              display: inline-block
              width: 16px
              height: 16px
              vertical-align: top
              margin-right: 6px
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-image('decrease_2')
              &.discount
                bg-image('discount_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              font-size: 12px
              font-weight: 200
              line-height: 16px
        .bulletin
          width: 80%
          margin: 0 auto
          .content
            padding: 0 12px 0 12px
            font-size: 12px
            font-weight: 200
            line-height: 24px
    .detail-close
      position relative
      width: 32px
      height: 32px
      margin: -64px auto 0 auto
      clear: both
      font-size: 32px
    // 无效的
    // .background
    //   position: absolute
    //   width: 100%
    //   height: 100%
    //   top:0
    //   left:0
    //   filter: blur(10px)
    //   background: rgba(7, 17, 27, 0.8)
    //   background-size: 150% 150%
    //   z-index: -1
  .detail-mask
    position: fixed
    z-index: 80
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: rgba(7, 17, 27, 0.6)
    filter: blur(10px)
</style>
