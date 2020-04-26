<template>
  <section class="score_detail">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="成绩报告">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <!--试卷标题-->
    <div class="paper_title">
      <span>{{paperScoreDetail.paper.title}}</span>
    </div>

    <!--成绩报告图表-->
    <div class="score_chart">
      <RingSchart :chartData="chartDataRingScore"/>
      <BarSchart :chartData="chartDataBarCorrect"/>
      <div class="score_text">
        <p>
          <span>你的分数：<span>{{paperScoreDetail.totalScore}}</span>分</span>
        </p>
      </div>
    </div>

    <!--点击返回顶部按钮-->
    <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import RingSchart from '../../components/Schart/RingSchart.vue'
  import BarSchart from '../../components/Schart/BarSchart.vue'
  import BackToTop from '../../components/BackToTop'
  import {getPaperScoreDetailByExamResultId} from '../../api'
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
        examResultId:this.$route.params.id,
        paperScoreDetail:{},
        chartDataRingScore: [],
        chartDataBarCorrect:[],
      }
    },
    created(){
      Indicator.open({
        text: '报告生成中...',
        spinnerType: 'snake'
      });
      this.getPaperScoreDetailByExamResultId();
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
    methods: {
      // 获取成绩报告数据
      async getPaperScoreDetailByExamResultId(){
        console.log(this.examResultId)
        let result = await getPaperScoreDetailByExamResultId(this.examResultId);
        if (result.code === 200){
          this.chartDataRingScore.push({"name":"单选题","value":result.data.paper.singleScore*result.data.rightSingle});
          this.chartDataRingScore.push({"name":"多选题","value":result.data.paper.multiScore*result.data.rightMulti});
          this.chartDataRingScore.push({"name":"判断题","value":result.data.paper.judgeScore*result.data.rightJudge});
          this.chartDataBarCorrect.push({"name":"单选题","value":result.data.rightSingle})
          this.chartDataBarCorrect.push({"name":"多选题","value":result.data.rightMulti})
          this.chartDataBarCorrect.push({"name":"判断题","value":result.data.rightJudge})
          this.paperScoreDetail = result.data
          setTimeout(() => {
            Indicator.close();
          }, 500)
        }
        else {
          Indicator.close();
          Toast({
            message:result.message,
            duration: 1500
          });
        }
      }
    },
    components:{
      HeaderTop,
      RingSchart,
      BarSchart,
      BackToTop
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .score_detail
    padding-top 45px
    width 100%
    background-color #f5f5f5
    padding-bottom 20px
    .paper_title
      width 100%
      height 35px
      display flex
      justify-content center
      align-items center
      font-size 16px
      color #fff
      background-color #4ab8a1
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
    .score_chart
      .score_text
        padding 15px
        div
          display flex
          justify-content center
          span
            color #FF0000
        .percentage_title
          height 30px
          line-height 30px
          font-weight 120px
        p
          height 28px
          line-height 28px
          display flex
          justify-content space-between
          span
            span
              color #FF0000
</style>
