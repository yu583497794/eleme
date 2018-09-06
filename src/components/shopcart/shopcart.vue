<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo">
            <i class="icon-shopping_cart"></i>
          </div>
        </div>
        <div class="price">￥0</div>
        <!-- 虽然在属性声明中是delivery-price但是有减号会输出NAN -->
        <!-- 如果使用'delivery-price'会直接输出字符串-->
        <!-- 因此使用驼峰式命名 -->
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <span class="pay">
          ￥{{minPrice}}起送
        </span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    'delivery-price': {
      type: Number,
      default: 0
    },
    'min-price': {
      type: Number,
      default: 0
    }
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
            .icon-shopping_cart
              display: inline-block
              width: 44px
              height: 44px
              line-height: 44px
              font-size: 24px
              color: #80858a
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
        .desc
          padding-left: 12px
          padding-right: 12px
          font-weight: 200
          font-size: 12px
      .content-right
        flex: 0 0 105px
        background: #2b333b
        padding: 0 8px
        // font-size:0
        .pay
          display: inline-block
          line-height: 48px
          height:48px
          width: 100%
          text-align: center
          font-size: 12px
          font-weight: 700
</style>
