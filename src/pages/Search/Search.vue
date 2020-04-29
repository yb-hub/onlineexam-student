<template>
  <div class="search">
    <HeaderTop title="试卷搜索"/>
    <form class="search_form" @submit.prevent="">
      <input type="search" placeholder="请输入试卷关键字" class="search_input" v-model="keyword" @input="search">
      <input type="submit" class="search_submit" value="搜索"
             :class="isSelect?'opacity':''" @touchstart="toggleSelect" @touchend="toggleSelect">
    </form>
    <section class="search_no_login" v-if="!userInfo.studentId">
      <i class="iconfont iconsousuo1"></i>
      <h3>登录后即可搜索</h3>
      <mt-button @click="$router.push('/login')">立即登录</mt-button>
    </section>

    <!--关键字搜索试卷列表-->
    <section class="list" v-show="!noSearchPapers">
      <ul class="list_container">
        <router-link :to="'/home/paper/detail/' + item.id" tag="li"
                     v-for="item in searchPapers" :key="item.id" class="list_li">
          <section class="item_left">
            <img src="../../common/imgs/paper.png" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class="item_right_text">
              <p>
                <span>{{item.title}}</span>
                <span>试卷类型：{{item.type == 1 ? '小测试' : item.type == 2 ? '期中考试' : '期末考试'}}</span>
              </p>
              <p>
                <span>考试时长：{{Math.round(item.limitTime)}}分钟</span>
<!--                <span>参加人数：{{item.participateNum}}人</span>-->
              </p>
              <p></p>
              <p>
                <span>发布时间：{{item.updateTime | date-format}}</span>
                <Star :score="item.difficultyDegree" :size="24" />
              </p>
            </div>
          </section>
        </router-link>
      </ul>
    </section>

    <section class="search__login" v-if="userInfo.studentId">
      <img src="../../common/imgs/nopapersearch.png" alt="">
      <h3>{{tips}}</h3>
    </section>
  </div>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import Star from '../../components/Star/Star.vue'
  import {mapState} from 'vuex'
  import {Toast} from 'mint-ui'
  import {queryPaperByKeyword} from '../../api'
  export default {
    name: "",
    data() {
      return {
        keyword: '',
        isSelect:false,
        searchPapers:[],
        noSearchPapers:true,
        tips:'输入关键字即可搜索'
      }
    },
    methods: {
      search(){
        if (!this.$store.state.userInfo.studentId){
          Toast({
            message:'请先登录系统',
            duration: 1000
          });
        }
        else{
          if (!this.keyword) {
/*            Toast({
              message:'输入试卷关键字为空！',
              duration: 1000
            });*/
            this.noSearchPapers = true;
            this.tips = '输入试卷关键字为空';
          }
          else {
            this.keyword = this.keyword.trim();
            this.getSearchPapers();
          }
        }
      },
      async getSearchPapers(){
        let result = await queryPaperByKeyword(this.keyword);
        if (result.code === 200){
          this.searchPapers = result.data;
          this.noSearchPapers = false;
          this.tips = '搜索成功';
        }
        else {
          this.noSearchPapers = true;
          this.tips = '该关键字暂无搜索结果';
        }
      },
      toggleSelect(){
        this.isSelect = !this.isSelect;
      }
    },
    components:{
      HeaderTop,
      Star
    },
    computed:{
      ...mapState(['userInfo'])
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .opacity
    opacity 0.4
    background #e5e5e5
  .search
    width 100%
    overflow hidden
    padding-bottom 50px
    padding-top 45px
    background-color #f5f5f5
    .search_form
      clearFix()
      background-color #fff
      padding 12px 8px
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #4ab8a1
          font-size 16px
          color #fff
          background-color #4ab8a1

    .list
      .list_container
        background-color: #fff;
        .list_li
          display: flex;
          justify-content: center;
          padding: 10px
          border-bottom: 1px solid $bc;
          .item_left
            margin-right: 10px
            .restaurant_img
              width 50px
              height 50px
              display block
          .item_right
            font-size 12px
            flex 1
            .item_right_text
              p
                line-height 12px
                margin-bottom 6px
                display flex
                justify-content space-between
                &:last-child
                  margin-bottom 0
    .search_none
      margin: 0 auto
      color: #333
      background-color: #fff
      text-align: center
      margin-top: 0.125rem
    .search_no_login
      padding-top 100px
      width 60%
      margin 0 auto
      text-align center
      >i
        display block
        font-size 100px
        color #4ab8a1
      >h3
        padding 20px 0
        font-size 17px
        color #6a6a6a
      >button
        display inline-block
        background #4ab8a1
        font-size 14px
        color #fff
        border 0
        outline none
        border-radius 5px
        padding 10px 20px
    .search__login
      display flex
      flex-direction column
      align-items center
      padding-top 80px
      >img
        width 200px
        height 200px
      >h3
        padding 20px 0
        font-size 17px
        color #4ab8a1
        font-weight bold
</style>
