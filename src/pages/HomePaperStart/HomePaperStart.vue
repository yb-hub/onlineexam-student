<template>
  <section class="paper">
    <HeaderTop :title="paperDetail.title" class="paper_header">
      <a href="javascript:" slot="left" class="go_back" @click="toBack">
        <i class="iconfont iconfanhui"></i>
      </a>

      <!--答题卡点击区域-->
      <div class="header_message" slot="right" @click="toPaperCard">
        <img src="../../common/imgs/answer-card2.png">
        <span>答题卡</span>
      </div>
    </HeaderTop>

    <!--考试日期和考试时长-->
    <div class="paper_sub_title_first">
      <span class="paper_date">考试日期：{{currentDate | date-format('YYYY-MM-DD')}}</span>
      <span class="paper_duration">考试时长：{{paperDetail.limitTime}}分钟</span>
    </div>

    <!--时间提醒和当前题数-->
    <div class="paper_sub_title_second">
      <span class="paper_clock"><i class="iconfont iconjishiqi"></i>{{restTime}}</span>
      <span class="paper_statistics"><i class="iconfont icontongji"></i>{{currentIndex + 1}}/{{paperDetail.totalQuestion}}</span>
    </div>

    <!--考卷进度条提醒-->
    <div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
    </div>

    <!-- 缓存路由组件对象 -->
    <!--    <keep-alive>
          <router-view></router-view>
        </keep-alive>-->

    <!--试卷问题及选项区域-->
    <div class="paper_container" v-show="showPaperContainer">
      <!--单选题列表-->
      <section class="que" v-for="(item, index) in paperDetail.singleChoiceList" :key="'single'+ item.id"
               v-show="index == currentIndex">
        <div class="content">
          <span class="que_type">(单选题)</span>
          <span class="que_content">{{index + 1}}.&nbsp;{{item.title}}
            <span class="que_score">[{{paperDetail.singleScore}}分]</span></span>

          <!--<img :src="item.pictureSrc" alt="" style="width: 100%" v-if="item.pictureSrc">-->

          <div class="single_option" v-for="(option, optionIndex) in item.options"
               :key="'single'+ item.id + optionIndex">
            <mu-radio :value="option.optionKey" v-model="singleAnswer"
                      :label="option.optionKey+':'+option.optionValue" v-if="option.optionValue"
                      @change="singleChange"></mu-radio>
          </div>
        </div>
      </section>

      <!--多选题列表-->
      <section class="que" v-for="(item, index) in paperDetail.multiChoiceList" :key="'multiple'+ item.id"
               v-show="(index + paperDetail.totalSingleChoice) == currentIndex">
        <div class="content">
          <span class="que_type">(多选题)</span>
          <span class="que_content">{{index + 1 + paperDetail.totalSingleChoice}}.&nbsp;{{item.title}}<span
            class="que_score">[{{paperDetail.multiScore}}分]</span></span>

          <!--<img :src="item.pictureSrc" alt="" style="width: 100%" v-if="item.pictureSrc">-->

          <div class="multiple_option" v-for="(option, optionIndex) in item.options"
               :key="'multiple'+ item.id + optionIndex">
            <mu-checkbox :value="option.optionKey" v-model="multipleAnswer"
                         :label="option.optionKey+':'+option.optionValue"
                         v-if="option.optionValue" @change="multipleChange"></mu-checkbox>
          </div>
        </div>
      </section>

      <!--判断题列表-->
      <section class="que" v-for="(item, index) in paperDetail.judgeChoiceList" :key="'judge'+ item.id"
               v-show="(index + paperDetail.totalSingleChoice + paperDetail.totalMultiChoice) == currentIndex">
        <div class="content">
          <span class="que_type">(判断题)</span>
          <span class="que_content">{{index + 1 + paperDetail.totalSingleChoice + paperDetail.totalMultiChoice}}.&nbsp;{{item.title}}<span
            class="que_score">[{{paperDetail.judgeScore}}分]</span></span>

          <div class="judge_option"
               v-for="(option, optionIndex) in [{'value':'1','label':'T'},{'value':'0','label':'F'}]"
               :key="'judge'+ item.id + optionIndex">
            <mu-radio :value="option.value" v-model="judgeAnswer" :label="option.label" v-if="option.label"
                      @change="judgeChange"></mu-radio>
          </div>
        </div>
      </section>
      <!--上一题和下一题按钮-->
      <div class="paper_button">
        <mt-button type="primary" @click.native="preItem"
                   :disabled="currentIndex < 1">{{currentIndex < 1 ? '无' :
          '上一题'}}
        </mt-button>
        <mt-button type="primary" @click.native="nextItem" v-if="currentIndex != paperDetail.totalQuestion-1">下一题
        </mt-button>
        <mt-button type="primary" @click.native="clickSubmit" v-if="currentIndex == paperDetail.totalQuestion-1">提交试卷
        </mt-button>
      </div>

    </div>

    <!--试卷答题卡区域-->
    <div class="paper_card" v-show="showPaperCard">

      <div class="card_title">
        <span>答题卡</span>
        <span>已完成({{completeNumber}}/{{paperDetail.totalQuestion}})</span>
      </div>

      <div class="card_options">
        <!--答题卡单选题-->
        <div class="options">
          <div class="options_title" style="padding-top: 15px" v-if="paperDetail.singleScore">
            单选题(每题{{paperDetail.singleScore}}分)
          </div>

          <div class="row">
            <div class="item" v-for="(singleItem, singleIndex) in paperDetail.totalSingleChoice" :key="singleIndex">
              <div @click="toPaperQue(singleItem)"
                   :class="{'complete_flag' : singleAnswers[singleIndex] ? true : false}"><span>{{singleItem}}</span>
              </div>
            </div>
          </div>
        </div>

        <!--答题卡多选题-->
        <div class="options">
          <div class="options_title" v-if="paperDetail.multiScore">
            多选题(每题{{paperDetail.multiScore}}分)
          </div>

          <div class="row">
            <div class="item" v-for="(multipleItem, multipleIndex) in paperDetail.totalMultiChoice"
                 :key="multipleIndex">
              <div @click="toPaperQue(multipleItem + paperDetail.totalSingleChoice)"
                   :class="{'complete_flag' : JSON.stringify(multipleAnswers[multipleIndex]) !== '[]' &&  JSON.stringify(multipleAnswers[multipleIndex]) !== undefined && JSON.stringify(multipleAnswers[multipleIndex]) !== 'null' ? true : false}">
                <span>{{multipleItem + paperDetail.totalSingleChoice}}</span>
              </div>
            </div>
          </div>
        </div>

        <!--答题卡判断题-->
        <div class="options">
          <div class="options_title" v-if="paperDetail.judgeScore">
            判断题(每题{{paperDetail.judgeScore}}分)
          </div>

          <div class="row">
            <div class="item" v-for="(judgeItem, judgeIndex) in paperDetail.totalJudgeChoice" :key="judgeIndex">
              <div @click="toPaperQue(judgeItem + paperDetail.totalSingleChoice + paperDetail.totalMultiChoice)"
                   :class="{'complete_flag' : judgeAnswers[judgeIndex] ? true : false}">
                <span>{{judgeItem + paperDetail.totalSingleChoice + paperDetail.totalMultiChoice}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card_button">
        <mt-button type="primary" @click.native="clickSubmit">提交试卷并查看成绩</mt-button>
      </div>

    </div>

  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {Toast, MessageBox, Indicator} from 'mint-ui'
  import {getPaperDetailByPaperId, reqInsertStudentPaperScore, insertPaperResult} from '../../api'
  import {getNumberPrefix} from '../../utils/common.js'
  import {mapState, mapActions, mapGetters} from 'vuex'

  export default {
    name: '',
    data () {
      return {
        paperDetail: {},
        //学号
        sno: this.$store.state.userInfo.studentId,
        //当前日期
        currentDate: new Date(),
        //路由传值paperId
        paperId: this.$route.params.paperId,
        //试卷信息
        paperInfo: {},
        //试卷问题类型数量
        queNumInfo: {},

        //初始化时间戳
        currentTime: new Date().getTime(),
        restTime: '',
        timer: '',
        //单选题数组
        singleQueList: [],
        //单选题答案
        singleAnswer: '',

        //多选题数组
        multipleQueList: [],
        //多选题答案
        multipleAnswer: [],

        //判断题数组
        judgeQueList: [],
        //判断题答案
        judgeAnswer: '',

        //是否显示paperContainer,默认进入页面为true
        showPaperContainer: true,
        //是否显示paperCard答题卡，默认进入页面为false，当点击答题卡区域为true
        showPaperCard: false,
        timeUsed: 0, //考试花费时间
        percentage: 0 //进度条值
      }
    },
    computed: {
      ...mapState([
        'currentIndex',//当前题数
        'singleAnswers',
        'multipleAnswers',
        'judgeAnswers',
        'firstCurrentTime'
      ]),
      ...mapGetters(['completeNumber'])
    },
    created () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })

      //加入callback回调函数保证在异步获取数据后执行this.countTime();
      this.getPaperDetailByPaperId(() => {

        this.percentage = parseInt((this.currentIndex + 1) / this.paperDetail.totalQuestion * 100)

        //初始化state中单选题答案数组长度
        this.$store.dispatch('initSingleAnswersLength', this.paperDetail.totalSingleChoice)
        //初始化state中多选题答案数组长度
        this.$store.dispatch('initMultipleAnswersLength', this.paperDetail.totalMultiChoice)
        //初始化state中判断题答案数组长度
        this.$store.dispatch('initJudgeAnswersLength', this.paperDetail.totalJudgeChoice)

        //若vuex中state没被赋值过则将最先进入考试的开始时间存入vuex的state
        if (this.firstCurrentTime == 0) {
          //同步记录开始时间
          let firstCurrentTime = this.currentTime
          this.recordFirstCurrentTime(firstCurrentTime)
          sessionStorage.removeItem('firstCurrentTime')
          sessionStorage.setItem('firstCurrentTime', firstCurrentTime)
        }

        //调用计时器方法，在试卷信息数据请求成功后获取考试时长开始计时
        this.countTime()

        //判断是否已经初始化插入数据到学生考试成绩表，防止刷新二次执行插入以及关闭浏览器二次插入数据
        if (!sessionStorage.getItem('sno' + this.sno + 'paperId' + this.paperId)) {
          this.insertStudentPaperScore()
        }
      })
    },
    methods: {
      ...mapActions([
        'nextQue',//点击下一题
        'prevQue',//点击上一题
        'cardQue',//点击答题卡序号
        'recordFirstCurrentTime',//记录当前花费时间
        'recordSingleAnswers',//记录单选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
        'recordMultipleAnswers',//记录多选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
        'recordJudgeAnswers',//记录判断题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
        'recordFillAnswers',//记录填空题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
        'refreshCurrentIndex',
        'refreshSingleAnswers',
        'refreshMultipleAnswers',
        'refreshJudgeAnswers',
        'refreshFillAnswers',
        'refreshFirstCurrentTime',
      ]),
      //插入学生成绩表成绩信息，包含三个字段，考试开始时间、学号和试卷id
      async insertStudentPaperScore () {
        const {sno, paperId} = this
        let result = await reqInsertStudentPaperScore({sno, paperId})
        if (result.statu == 0) {
          sessionStorage.setItem('sno' + this.sno + 'paperId' + this.paperId, result.msg)
        }
        else {
          Toast({
            message: result.msg,
            duration: 1500
          })
        }
      },
      // 根据paperId获取试卷信息和问题数量信息
      async getPaperDetailByPaperId (callback) {
        let result = await getPaperDetailByPaperId(this.paperId)
        if (result.code === 200) {
          this.paperDetail = result.data
          Indicator.close()
          callback && callback()
        }
        else {
          Toast({
            message: result.msg,
            duration: 2000
          })
        }
      },
      //倒计时
      countTime () {

        //定义常量vm代表vue实例，指向当前this
        const vm = this,
          endTime = vm.paperDetail.limitTime * 60 * 1000 + vm.firstCurrentTime,//firstCurrentTime即最先进入考试的时间
          currentTime = new Date().getTime(),
          restTime = endTime - currentTime,
          hours = getNumberPrefix(parseInt(restTime / (1000 * 60 * 60) % 24, 10)),
          minutes = getNumberPrefix(parseInt(restTime / (1000 * 60) % 60, 10)),
          seconds = getNumberPrefix(parseInt(restTime / 1000 % 60, 10))
        vm.restTime = `${hours}:${minutes}:${seconds}`
        vm.timer = setTimeout(function () {
          if (restTime > 0) {
            vm.countTime()
          } else if (restTime <= 0) {
            clearTimeout(vm.timer)
            Toast({
              message: '交卷时间已到，系统将帮您自动交卷',
              duration: 1000
            })
            setTimeout(() => {
              let result = vm.handleSubmit()
              if (result) {
                //等待成绩计算完毕并插入数据库表
                Indicator.open({
                  text: '加载中...',
                  spinnerType: 'fading-circle'
                })
                setTimeout(() => {
                  Indicator.close()
                  //清除sessionStorage数据
                  sessionStorage.removeItem('currentIndex')
                  sessionStorage.removeItem('singleAnswers')
                  sessionStorage.removeItem('multipleAnswers')
                  sessionStorage.removeItem('judgeAnswers')
                  sessionStorage.removeItem('judgeAnswers')
                  sessionStorage.removeItem('fillAnswers')
                  sessionStorage.removeItem('firstCurrentTime')
                  sessionStorage.removeItem('sno' + vm.sno + 'paperId' + vm.paperId, result.msg)
                  //清除vuex数据
                  vm.refreshCurrentIndex(0)
                  vm.refreshSingleAnswers([])
                  vm.refreshMultipleAnswers([])
                  vm.refreshJudgeAnswers([])
                  vm.refreshFillAnswers([])
                  vm.refreshFirstCurrentTime(0)
                  vm.$router.replace('/profile/stuscore')
                }, 3000)
              }
              else {
                Toast({
                  message: '交卷失败，数据库错误，请重新开始考试',
                  duration: 1500
                })
                vm.$router.replace('/home/paper/detail/' + vm.paperId)
              }
            }, 2000)
          }
        }, 1000)
      },
      //用户手动点击提交试卷按钮，弹出确认框
      clickSubmit () {
        MessageBox.confirm('确定要提交试卷吗?').then(action => {
          this.handleSubmit()
        }, () => {
          //点击取消按钮操作
        })
      },
      //最终提交答案，包含用户手动点击提交按钮和到时自动提交
      async handleSubmit () {
        this.timeUsed = new Date().getTime() - this.firstCurrentTime
        clearTimeout(this.timer)
        //将考试答案数据提交给后台
        const submittedPaper = {
          'studentId': this.sno,
          'paperId': this.paperId,
          'singleChoiceAnswer': this.singleAnswers,
          'multiChoiceAnswer': this.multipleAnswers,
          'judgeChoiceAnswer': this.judgeAnswers,
          'usedTime': this.timeUsed
        }
        let result = await insertPaperResult(submittedPaper)
        if (result.code === 200) {
          //等待成绩计算完毕并插入数据库表
          Indicator.open({
            text: '自动计算成绩中...',
            spinnerType: 'double-bounce'
          })
          setTimeout(() => {
            Indicator.close()
            Toast({
              message: '提交成功，请查看成绩',
              duration: 1500
            })
            //清除sessionStorage数据
            sessionStorage.removeItem('currentIndex')
            sessionStorage.removeItem('singleAnswers')
            sessionStorage.removeItem('multipleAnswers')
            sessionStorage.removeItem('judgeAnswers')
            sessionStorage.removeItem('judgeAnswers')
            sessionStorage.removeItem('firstCurrentTime')
            sessionStorage.removeItem('sno' + this.sno + 'paperId' + this.paperId, result.message)
            //清除vuex数据
            this.refreshCurrentIndex(0)
            this.refreshSingleAnswers([])
            this.refreshMultipleAnswers([])
            this.refreshJudgeAnswers([])
            this.refreshFirstCurrentTime(0)
            this.$router.replace('/profile/stuscore')
          }, 4000)
        }
        else {
          Toast({
            message: '交卷失败，数据库错误，请重新开始考试',
            duration: 1500
          })
          this.$router.replace('/home/paper/detail/' + this.paperId)
        }
      },
      //点击上一题
      preItem () {
        this.singleAnswer = ''
        this.multipleAnswer = []
        this.judgeAnswer = ''
        this.prevQue()
        this.getCurrentAnswer()
      },
      //点击下一题
      nextItem () {
        this.singleAnswer = ''
        this.multipleAnswer = []
        this.judgeAnswer = ''
        this.nextQue()
        this.getCurrentAnswer()
      },
      //点击显示答题卡
      toPaperCard () {
        this.showPaperContainer = false
        this.showPaperCard = true
      },
      //点击显示试卷问题
      toPaperQue (index) {
        this.singleAnswer = ''
        this.multipleAnswer = []
        this.judgeAnswer = ''
        this.cardQue(index)
        this.getCurrentAnswer()

        this.showPaperCard = false
        this.showPaperContainer = true
      },
      //点击返回按钮
      toBack () {
        MessageBox.confirm('系统将自动提交试卷，请确认是否离开考试?').then(action => {
          Toast({
            message: '可到我的页面查看成绩',
            duration: 1500
          })
          //提交试卷
          let result = this.handleSubmit()
          if (result) {
            //清除sessionStorage数据
            sessionStorage.removeItem('currentIndex')
            sessionStorage.removeItem('singleAnswers')
            sessionStorage.removeItem('multipleAnswers')
            sessionStorage.removeItem('judgeAnswers')
            sessionStorage.removeItem('judgeAnswers')
            sessionStorage.removeItem('fillAnswers')
            sessionStorage.removeItem('firstCurrentTime')
            sessionStorage.removeItem('sno' + this.sno + 'paperId' + this.paperId, result.msg)
            //清除vuex数据
            this.refreshCurrentIndex(0)
            this.refreshSingleAnswers([])
            this.refreshMultipleAnswers([])
            this.refreshJudgeAnswers([])
            this.refreshFillAnswers([])
            this.refreshFirstCurrentTime(0)
            //返回试卷详情页面
            this.$router.isBack = true
            this.$router.replace('/home')
          }
          else {
            Toast({
              message: '交卷失败，数据库错误，请重新开始考试',
              duration: 1500
            })
            this.$router.isBack = true
            this.$router.replace('/home/paper/detail/' + this.paperId)
          }
        }, () => {
          //点击取消按钮操作
        })

      },
      //单选题点击change事件
      singleChange () {
        const {currentIndex, singleAnswer} = this
        this.recordSingleAnswers({currentIndex, singleAnswer})
      },
      //多选题点击change事件
      multipleChange () {
        const {currentIndex, multipleAnswer} = this
        this.recordMultipleAnswers({currentIndex, multipleAnswer})
      },
      //判断题点击change事件
      judgeChange () {
        const {currentIndex, judgeAnswer} = this
        this.recordJudgeAnswers({currentIndex, judgeAnswer})
      },
      //获取当前题目填写的答案
      getCurrentAnswer () {
        //获取单选题当前答案
        if (this.currentIndex < this.paperDetail.totalSingleChoice) {
          const currentAnswer = this.singleAnswers[this.currentIndex]
          if (currentAnswer) {
            this.singleAnswer = currentAnswer
          } else {
            const {currentIndex, singleAnswer} = this
            this.recordSingleAnswers({currentIndex, singleAnswer})
          }
        }
        //获取多选题当前答案
        else if (this.currentIndex < (this.paperDetail.totalSingleChoice + this.paperDetail.totalMultiChoice)) {
          const currentAnswer = this.multipleAnswers[this.currentIndex - this.paperDetail.totalSingleChoice]
          if (currentAnswer) {
            this.multipleAnswer = currentAnswer
          } else {
            const {currentIndex, multipleAnswer} = this
            this.recordMultipleAnswers({currentIndex, multipleAnswer})
          }
        }
        //获取判断题当前答案
        else if (this.currentIndex < (this.paperDetail.totalSingleChoice + this.paperDetail.totalMultiChoice + this.paperDetail.totalJudgeChoice)) {
          const currentAnswer = this.judgeAnswers[this.currentIndex - this.paperDetail.totalSingleChoice - this.paperDetail.totalMultiChoice]
          if (currentAnswer) {
            this.judgeAnswer = currentAnswer
          } else {
            const {currentIndex, judgeAnswer} = this
            this.recordJudgeAnswers({currentIndex, judgeAnswer})
          }
        }
      }
    },
    components: {
      HeaderTop
    },
    watch: {
      currentIndex () {
        this.percentage = parseInt((this.currentIndex + 1) / this.paperDetail.totalQuestion * 100)
        sessionStorage.removeItem('currentIndex')
        sessionStorage.setItem('currentIndex', this.currentIndex)
      },
      singleAnswers () {
        sessionStorage.removeItem('singleAnswers')
        sessionStorage.setItem('singleAnswers', JSON.stringify(this.singleAnswers))
      },
      multipleAnswers: function () {
        sessionStorage.removeItem('multipleAnswers')
        sessionStorage.setItem('multipleAnswers', JSON.stringify(this.multipleAnswers))
      },
      judgeAnswers () {
        sessionStorage.removeItem('judgeAnswers')
        sessionStorage.setItem('judgeAnswers', JSON.stringify(this.judgeAnswers))
      },
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .paper
    width 100%
    height 800px
    background-color #f5f5f5
    padding-top 45px
    .paper_header
      background-color lightslategrey
      .go_back
        width 40px
      .header_message
        display flex
        flex-direction column
        justify-content center
        align-items center
        > img
          border-radius 2px
          height 24px
          width 24px
        > span
          font-size 12px
    .paper_sub_title_first
      width 100%
      height 35px
      display flex
      justify-content space-between
      align-items center
      background-color #4ab8a1
      font-size 13px
      > span
        display inline-block
        color #f5f5f5
      .paper_date
        padding-left 15px
      .paper_duration
        padding-right 15px
    .paper_sub_title_second
      width 100%
      height 35px
      display flex
      justify-content space-between
      align-items center
      background-color rgba(0, 0, 0, .1)
      > span
        display inline-block
        color lightcoral
      .paper_clock
        padding-left 15px
        .iconjishiqi
          padding-right 10px
      .paper_statistics
        padding-right 15px
        .icontongji
          padding-right 10px
    .paper_container
      width 90%
      margin 15px auto
      margin-bottom 15px
      background-color #f5f5f5
      .que
        .content
          height 24px
          line-height 24px
          > span
            display block
          .que_type, .que_score
            color #4ab8a1
          .que_content
            padding-bottom 10px
        .single_option, .multiple_option, .judge_option, .fill_option
          margin-top 25px
          margin-bottom 25px
      .paper_button
        position fixed
        z-index 100
        left 0
        right 0
        bottom 0
        width 100%
        display flex
        justify-content space-evenly
        .mint-button
          width 40%
          background-color #4ab8a1
    .paper_card
      background-color #f5f5f5
      padding-bottom 50px
      .card_title
        width 100%
        height 35px
        display flex
        justify-content space-between
        align-items center
        font-size 16px
        color #fff
        background-color #778899
        > span:nth-child(1)
          padding-left 15px
        > span:nth-child(2)
          padding-right 15px
      .card_options
        .options
          .options_title
            padding-left 15px
            color #4ab8a1
          .row
            display flex
            align-items center
            width 100%
            flex-wrap wrap
            margin-top 6px
            .item
              display flex
              justify-content center
              align-items center
              width 20%
              padding-top 10px
              padding-bottom 10px
              > div
                display flex
                justify-content center
                align-items center
                width 24px
                height 24px
                border 1px solid #778899
                border-radius 12px
                color #778899
              .complete_flag
                border 1px solid #4ab8a1
                background-color #4ab8a1
                color #fff
      .card_button
        .mint-button
          width 80%
          position fixed
          z-index 100
          left 10%
          right 0
          bottom 0
          background-color #4ab8a1
</style>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .mu-radio-wrapper
    align-items normal
    .mu-radio-ripple-wrapper
      position static
    .mu-radio-label
      white-space normal
      word-break break-all
      word-wrap break-word

  .mu-checkbox-wrapper
    align-items normal
    .mu-checkbox-ripple-wrapper
      position static
    .mu-checkbox-label
      white-space normal
      word-break break-all
      word-wrap break-word
</style>
