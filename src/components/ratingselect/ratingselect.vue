<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select($event, 2)" class="block positive" :class="{'active': type === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select($event, 0)" class="block positive" :class="{'active': type === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select($event, 1)" class="block negative" :class="{'active': type === 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':only}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  name: 'ratingselect',
  data () {
    return {
      type: this.selectType,
      only: this.onlyContent
    };
  },
  props: {
    ratings: {
      type: Array,
      default () {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  methods: {
    select (event, type) {
      if (!event._constructed) {
        return;
      }
      this.type = type;
      this.$emit('ratingtype-select', type);
    },
    toggleContent (event) {
      if (!event._constructed) {
        return;
      }
      this.only = !this.only;
      this.$emit('content-toggle', this.only);
    }
  },
  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE;
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .ratingselect
    .rating-type
      margin: 0 18px
      padding: 18px 0
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        border-radius: 1px
        line-height: 16px
        font-size: 12px
        color: rgb(7, 17, 27)
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            color: #fff
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            color: #fff
            background: rgb(77, 85, 93)
        .count
          margin-left: 2px
          font-size: 8px
    .switch
      padding: 12px 18px
      line-height: 24px
      color: rgb(147, 153, 159)
      font-size: 0
      border-bottom: 1px solid  rgba(7, 17, 27, 0.1)
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
