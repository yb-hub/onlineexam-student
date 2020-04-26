<template>
  <section class="stu_score">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="查看成绩">
      <a href="javascript:" slot="left" class="go_back" @click="$router.push('/profile')">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <!--查看学生全部试卷成绩-->
    <mt-loadmore v-if="scoreList.length" :top-method="loadTop" ref="loadmore" style="margin-top:20px">
      <div class="score_list" v-for="(item, index) in scoreList" :key="item.scoreId">
        <div class="score_list_item" :class="{'corner_new':index == 0}">
          <div class="score_title">
            {{item.paperTitle}}
          </div>
          <div class="score_type">
            试卷类型：{{item.paperType == 1 ? '测试试卷' : '考试试卷'}}
          </div>
          <div class="score_create_time">
            发布时间：{{item.createTime | date-format-simple}}
          </div>
          <div class="score_difficulty">
            <span>难度系数：</span>
            <Star :score="item.paperDifficultyDegree" :size="24" />
          </div>
          <!--<div class="score_create_time">-->
            <!--考试时长：{{Math.round(item.paperDuration/60)}}分钟-->
          <!--</div>-->
          <div class="score_total_score">
            试卷总分：{{item.paperTotalScore}}分
          </div>
          <div class="score_item score_important">
            最终成绩：{{item.totalScore}}分
          </div>
          <div class="score_item score_important">
            是否及格：{{item.totalScore > item.paperTotalScore*0.6 ? '是' : '否'}}
          </div>
          <div class="score_participate">
            <div class="score_participate_left">
              <img src="../../common/imgs/person.png" alt=""><span style="color: #FF0000">{{item.participateNum}}</span>人已参加
            </div>
            <div class="score_participate_right">
              <mt-button size="small" type="primary" @click.native="toScoreDetail(item.id)" :disabled="item.totalScore == null">查看报告</mt-button>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_tips">
        <span>我是有底线的</span>
      </div>
    </mt-loadmore>

    <!--无成绩显示提示图片-->
    <div class="no_score_list animated" v-show="noScoreList">
      <img src="../../common/imgs/nopaper.png" alt="">
      <h3>暂无成绩</h3>
    </div>

    <!--点击返回顶部按钮-->
    <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import Star from '../../components/Star/Star.vue'
  import BackToTop from '../../components/BackToTop'
  import {getPaperScoreByStuId} from '../../api'
  import {Toast, Indicator} from 'mint-ui'
  import { mapState } from 'vuex'
  export default {
    name: "",
    data() {
      return {
        myBackToTopStyle: {
          right: '15px',
          bottom: '15px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
        },
        sno:this.$store.state.userInfo.sno,
        noScoreList:false,
        scoreList:[]
      }
    },
    computed: {
      optionLeft () {
        return {
          direction: 2,
          limitMoveNum: 2,
          // hoverStop: false
        }
      },
      ...mapState(['examCalendar'])
    },
    created(){
      this.getPaperScoreByStuId();
    },
    methods: {
      loadTop() {
        this.getPaperScoreByStuId()
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
      },
      async getPaperScoreByStuId(){
        let result = await getPaperScoreByStuId(this.sno);
        if(result.code === 200){
          this.scoreList = result.data;
          if(this.scoreList.length === 0){
            this.noScoreList = true;
          }
        }
        else {
          Toast({
            message: result.message,
            duration: 1500
          });
        }
      },
      toScoreDetail(id){
        this.$router.push('/profile/stuscore/detail/' + id)
      }
    },
    components:{
      HeaderTop,
      Star,
      BackToTop
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .stu_score
    padding-top 45px
    width 100%
    background-color #f5f5f5
    .notices_run
      display flex
      justify-content center
      align-items center
      background-color rgba(125,125,125,.3)
      color lightcoral
      margin-bottom 20px
      i
        margin-right 10px
        font-weight bolder
      .seamless-warp2
        overflow hidden
        height 30px
        line-height 30px
        width 300px
        font-size 14px
        border-radius 30px
        ul
          width 700px
          li
            float left
            margin-right 10px
    .no_score_list
      display flex
      flex-direction column
      align-items center
      padding-top 100px
      >h3
        font-size 17px
        color #6a6a6a
    .score_list
      width 100%
      display flex
      flex-direction column
      .score_list_item
        width 80%
        margin 0 auto
        margin-bottom 20px
        padding 25px 20px 20px 20px
        background-color #fff
        background-image url("../../common/imgs/corner-score.png"), url("../../common/imgs/paper-right-top.png"), url("../../common/imgs/score-confirm.png"), url("../../common/imgs/corner-complete.png")
        background-size 36px 36px, 40px 40px, 45px 45px, 50px 50px
        background-repeat no-repeat, no-repeat, no-repeat, no-repeat
        background-position 50% 1%, 100% 0%, 87% 50%, 92% 6%
        border-radius 5px
        box-shadow 0 0 3px #ccc
        &.corner_new
          background-image url("../../common/imgs/corner-score.png"), url("../../common/imgs/paper-right-top.png"), url("../../common/imgs/score-confirm.png"), url("../../common/imgs/corner-mark-new.png"), url("../../common/imgs/corner-complete.png")
          background-size 36px 36px, 40px 40px, 45px 45px ,40px 40px, 50px 50px
          background-repeat no-repeat, no-repeat, no-repeat, no-repeat, no-repeat
          background-position 50% 1%, 100% 0%, 87% 50%, 0% 0%, 92% 6%
        .score_title
          height 50px
          line-height 50px
          font-size 16px
          display flex
          justify-content center
        .score_type
          height 30px
          line-height 30px
          font-size 14px
          color #999
        .score_create_time,.score_total_score
          height 30px
          line-height 30px
          font-size 14px
          color #999
        .score_item
          height 30px
          line-height 30px
          font-size 14px
          color #d9534f
        .score_important
          font-weight bold
        .score_difficulty
          height 30px
          line-height 30px
          font-size 14px
          color #999
          .star
            display inline-block
            float none
        .score_participate
          height 50px
          line-height 50px
          font-size 16px
          display flex
          justify-content space-between
          .score_participate_left
            color lightslategray
            display flex
            align-items center
            >img
              width 25px
              height 25px
</style>
