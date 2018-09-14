<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <p class="score">{{seller.score}}</p>
          <h1 class="score-title">综合评分</h1>
          <h2 class="percent">高于周边商家{{seller.rankRate}}%</h2>
        </div>
        <div class="overview-right">
          <div class="content">
            <div class="score-wrapper">
              <span class="title">食物得分</span>
              <span class="star-wrapper">
                <star :score="seller.foodScore" :size=36></star>
              </span>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <span class="star-wrapper">
                <star :score="seller.serviceScore" :size=36></star>
              </span>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="delivery-time-wrapper score-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery-time">{{seller.deliveryTime}}</span>
            </div>
          </div>
        </div>
      </div>
      <split></split>
      <div class="ratingselect-wrapper">
        <ratingselect :ratings="ratings" @ratingtype-select="typeSelect"
        @content-toggle="contentToggle"></ratingselect>
      </div>
      <ul v-show="ratings && ratings.length > 0" class="rating-list">
        <li v-show="needShow(rating)" v-for="(rating,$index) in ratings" :key="$index" class="rating-item">
          <span class="avatar">
            <img :src="randomImage()" width="28" height="28">
          </span>
          <span class="name">{{rating.username}}</span>
          <div class="score-delivery">
            <span class="star-wrapper">
              <star :size=24 :score="rating.score"></star>
            </span>
            <span v-show="rating.deliveryTime" class="delivery-time">{{rating.deliveryTime}}分钟送达</span>
          </div>
          <p class="text">
            {{rating.text}}
          </p>
          <div class="desc">
            <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
            <ul v-show="rating.recommend.length>0" class="recommend-list">
              <li v-for="(recommend,$index) in rating.recommend" :key="$index" class="recommend-item">{{recommend}}</li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-show="ratings.length===0 || !ratings" class="no-rating">
        暂无评价
      </div>
    </div>
    <div class="shopcart-wrapper">
      <shopcart></shopcart>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star';
import split from 'components/split/split';
import ratingselect from 'components/ratingselect/ratingselect';
import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart';
// eslint-disable-next-line
const POSITIVE = 0;
// eslint-disable-next-line
const NEGATIVE = 1;
const ALL = 2;
export default {
  data () {
    return {
      ratings: [],
      // seller: {},
      selectedType: ALL,
      onlyContent: false
    };
  },
  props: {
    'seller': {
      type: Object,
      default: {}
    }
  },
  created () {
    this.$http.get('/api/ratings').then((response) => {
      response = response.body;
      if (response.errno === 0) {
        this.ratings = response.data;
      }
    });
    // this.$http.get('/api/seller').then((response) => {
    //   response = response.body;
    //   if (response.errno === 0) {
    //     this.seller = response.data;
    //   }
    // });
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        });
      }
    });
  },
  components: {
    star,
    split,
    ratingselect,
    shopcart
  },
  methods: {
    randomImage () {
      return 'http://7xr4g8.com1.z0.glb.clouddn.com/' + parseInt(1 + 900 * Math.random());
    },
    typeSelect (type) {
      this.selectedType = type;
      this.scroll.refresh();
    },
    contentToggle (onlyContent) {
      this.onlyContent = onlyContent;
      this.scroll.refresh();
    },
    needShow (rating) {
      if (!rating.text && this.onlyContent) {
        return false;
      } else {
        if (this.selectedType === ALL || this.selectedType === rating.rateType) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ratings
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    background: #fff
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        margin: 0 auto
        border-right: 1px solid rgba(7, 17, 27, 0.2)
        text-align: center
        .score
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
          margin-bottom: 6px
        .score-title
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
          margin-bottom: 8px
        .percent
          line-height: 10px
          font-size: 10px
          color: rgba(7, 17, 27, 0.4)
          margin-bottom: 6px
      .overview-right
        flex: 1
        text-align: center
        .content
          display: inline-block
          .score-wrapper
            margin-bottom: 8px
            font-size: 0
            .title
              display: inline-block
              margin-right: 12px
              vertical-align: top
              line-height: 18px
              font-size: 12px
              color: rgb(7, 17, 27)
            .star-wrapper
              display: inline-block
              margin-right: 12px
              vertical-align: top
            .score
              display: inline-block
              vertical-align: top
              line-height: 18px
              font-size: 12px
              color: rgb(255, 153, 0)
          .delivery-time-wrapper
            text-align: left
            .delivery-time
              display: inline-block
              line-height: 18px
              font-size: 12px
              color: rgb(147, 153, 159)
    .rating-list
      background: #fff
      padding: 0 18px
      .rating-item
        position: relative
        padding: 18px 0
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .avatar
          position: absolute
          top: 18px
          left: 0
          width: 28px
          height: 28px
          box-sizing: border-box
          border-radius: 50%
          overflow: hidden
        .name
          margin-left: 40px
          margin-bottom: 4px
          line-height: 12px
          font-size: 10px
          color: rgb(7, 17,27)
        .score-delivery
          margin-left: 40px
          margin-bottom: 6px
          font-size: 0
          .star-wrapper
            display: inline-block
            vertical-align: top
          .delivery-time
            vertical-align: top
            display: inline-block
            margin-left: 6px
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147, 153, 159)
        .text
          margin-bottom: 8px
          margin-left: 40px
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
        .desc
          margin-left: 40px
          font-size: 0
          .icon-thumb_up,.icon-thumb_up
            vertical-align: top
            display: inline-block
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(183, 187, 191)
          .recommend-list
            display: inline-block
            vertical-align: top
            overflow: hidden
            // white-space: nowrap
            .recommend-item
              display: inline-block
              padding: 0 6px
              margin-left: 8px
              line-height: 16px
              width: 50px
              font-size: 9px
              color: rgb(147, 153, 159)
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 2px
              background: rgb(255, 255, 255)
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
    .shopcart-wrapper
      position: absolute
      bottom: 0
      left: 0
</style>
