<template>
  <div class="wrong">
    <HeaderTop :title="paperInfo.title" class="paper_header">
      <a href="javascript:" slot="left" class="go_back" @click="toBack()">
        <i class="iconfont iconfanhui"></i>
      </a>

      <div class="header_message" slot="right" @click="toPaperCard">
        <img src="../../common/imgs/wrong-card.png">
        <span>错题卡</span>
      </div>
    </HeaderTop>

    <!--试卷问题及选项区域-->
    <div class="paper_container" v-show="showPaperContainer">
      <!--单选题列表-->
      <section class="que" v-for="(item, index) in singleQueList" :key="'single'+ item.id"
               v-show="index == currentIndex">
        <div class="content">
          <span class="que_type">
            (单选题)<img :src="judgeIsCollect(item.id) === -1 ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect(item.id)"/>
          </span>
          <span class="que_content">{{index + 1}}.&nbsp;{{item.title}}</span>

          <div class="single_option" v-for="(option, optionIndex) in item.options"
               :key="'single'+ item.id + optionIndex">
            <mu-radio :value="option.optionKey" v-model="singleAnswerList[index]" disabled
                      :label="option.optionKey+':'+option.optionValue" v-if="option.optionValue"></mu-radio>
          </div>

          <div class="answer_row">正确答案：<span class="correct_answer">{{item.rightOption[0]}}</span></div>
          <div class="answer_row">是否正确：<span :class="[item.rightOption[0] === singleAnswerList[index] ? 'correct_answer' : 'your_answer']">{{item.rightOption[0] === singleAnswerList[index] ? '正确' : '错误'}}</span></div>
          <div class="answer_row">答案解析：<span class="correct_answer">{{item.analysis || '暂无解析呀老哥，给个解析呗'}}</span></div>
        </div>
      </section>

      <!--多选题列表-->
      <section class="que" v-for="(item, index) in multipleQueList" :key="'multiple'+ item.id"
               v-show="(index + singleQueList.length) == currentIndex">
        <div class="content">
          <span class="que_type">
            (多选题)<img :src="judgeIsCollect(item.id) === -1 ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect(item.id)"/>
          </span>
          <span class="que_content">{{index + 1 + singleQueList.length}}.&nbsp;{{item.title}}</span>

          <div class="multiple_option" v-for="(option, optionIndex) in item.options"
               :key="'multiple'+ item.id + optionIndex">
            <mu-checkbox :value="option.optionKey" v-model="multiAnswerList[index]" disabled :label="option.optionKey+':'+option.optionValue" v-if="option.optionValue"></mu-checkbox>
          </div>

          <div class="answer_row">正确答案：<span class="correct_answer">{{item.rightOption}}</span></div>
          <!--<div class="answer_row">你的答案：<span :class="[item.isCorrect == '1' ? 'correct_answer' : 'your_answer']">{{item.stuAnswer || '你太优秀了，该题无作答'}}</span></div>-->
          <div class="answer_row">是否正确：<span :class="[item.rightOption.toString() === multiAnswerList[index].toString() ? 'correct_answer' : 'your_answer']">{{item.rightOption.toString() == multiAnswerList[index].toString() ? '正确' : '错误'}}</span></div>
          <div class="answer_row answer_explain">答案解析：<span class="correct_answer">{{item.analysis || '暂无解析呀老哥，给个解析呗'}}</span></div>
        </div>
      </section>

      <!--判断题列表-->
      <section class="que" v-for="(item, index) in judgeQueList" :key="'judge'+ item.id"
               v-show="(index + singleQueList.length + multipleQueList.length) == currentIndex">
        <div class="content">
          <span class="que_type">
            (判断题)<img :src="judgeIsCollect(item.id) === -1 ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect(item.id)"/>
          </span>
          <span class="que_content">{{index + 1 + singleQueList.length + multipleQueList.length}}.&nbsp;{{item.title}}</span>

          <div class="judge_option" v-for="(option, optionIndex) in [{'value':'1','label':'T'},{'value':'0','label':'F'}]"
               :key="'judge'+ item.id + optionIndex">
            <mu-radio :value="option.value" v-model="judgeAnswerList[index].toString()" disabled :label="option.label" v-if="option.label"></mu-radio>
          </div>
          <div class="answer_row">正确答案：<span class="correct_answer">{{item.judgeAnswer === 1 ? 'T' : 'F'}}</span></div>
          <!--<div class="answer_row">你的答案：<span :class="[item.isCorrect == '1' ? 'correct_answer' : 'your_answer']">{{item.stuAnswer || '你太优秀了，该题无作答'}}</span></div>-->
          <div class="answer_row">是否正确：<span :class="[item.judgeAnswer === judgeAnswerList[index] ? 'correct_answer' : 'your_answer']">{{item.judgeAnswer === judgeAnswerList[index] ? '正确' : '错误'}}</span></div>
          <div class="answer_row">答案解析：<span class="correct_answer">{{item.analysis || '暂无解析呀老哥，给个解析呗'}}</span></div>
        </div>
      </section>


      <!--上一题和下一题按钮-->
      <div class="paper_button">
        <mt-button type="primary" @click.native="preItem"
                   :disabled="currentIndex < 1">{{currentIndex < 1 ? '无' :
          '上一题'}}
        </mt-button>
        <mt-button type="primary" @click.native="nextItem" :disabled="currentIndex == queNumInfo-1">
          {{currentIndex == queNumInfo-1 ? '到底了哥' : '下一题'}}
        </mt-button>
      </div>
    </div>

    <!--试卷答题卡区域-->
    <div class="paper_card" v-show="showPaperCard">

      <div class="card_title">
        错题卡（注意：绿色为答对题，红色为答错题）
      </div>

      <div class="card_options">
        <!--答题卡单选题-->
        <div class="options">
          <div class="options_title" style="padding-top: 15px" v-if="singleQueList.length">
            单选题(每题{{paperInfo.singleScore}}分)
          </div>

          <div class="row">
            <div class="item" v-for="(singleItem, singleIndex) in singleQueList" :key="singleIndex">
              <div @click="toPaperQue(singleIndex + 1)"
                   :class="[singleItem.rightOption[0] === singleAnswerList[singleIndex] ? 'correct_flag' : 'error_flag']"><span>{{singleIndex + 1}}</span></div>
            </div>
          </div>
        </div>

        <!--答题卡多选题-->
        <div class="options">
          <div class="options_title" v-if="multipleQueList.length">
            多选题(每题{{paperInfo.multipleScore}}分)
          </div>

          <div class="row">
            <div class="item" v-for="(multipleItem, multipleIndex) in multipleQueList" :key="multipleIndex">
              <div @click="toPaperQue(multipleIndex + 1 + singleQueList.length)"
                   :class="[multipleItem.rightOption.toString() === multiAnswerList[multipleIndex].toString() ? 'correct_flag' : 'error_flag']">
                <span>{{multipleIndex + 1 + singleQueList.length}}</span>
              </div>
            </div>
          </div>
        </div>

        <!--答题卡判断题-->
        <div class="options">
          <div class="options_title" v-if="judgeQueList.length">
            判断题(每题{{paperInfo.judgeScore}}分)
          </div>

          <div class="row">
            <div class="item" v-for="(judgeItem, judgeIndex) in judgeQueList" :key="judgeIndex">
              <div @click="toPaperQue(judgeIndex + 1 + singleQueList.length + multipleQueList.length)"
                   :class="[judgeItem.judgeAnswer === judgeAnswerList[judgeIndex] ? 'correct_flag' : 'error_flag']">
                <span>{{judgeIndex + 1 + singleQueList.length + multipleQueList.length}}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {Toast, MessageBox} from 'mint-ui'
  import {getPaperWrongDetailByExamId, updateStudentQuestion,getStudentQuestionCollect} from '../../api'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: "",
    data() {
      return {
        //学号
        sno: this.$store.state.userInfo.studentId,
        //路由传值examId
        examId: this.$route.params.examId,
        //试卷信息
        paperInfo: {},
        //试卷问题类型数量
        queNumInfo: 0,
        //单选题数组
        singleQueList: [],
        //多选题数组
        multipleQueList: [],
        //判断题数组
        judgeQueList: [],
        //是否显示paperContainer,默认进入页面为true
        showPaperContainer: true,
        //是否显示paperCard答题卡，默认进入页面为false，当点击答题卡区域为true
        showPaperCard: false,
        isCollect:'0',
        percentage:0, //进度条值
        singleAnswerList:[],
        multiAnswerList:[],
        judgeAnswerList:[],
        studentQuestionCollectList:[]
      }
    },
    created(){
      this.getPaperWrongDetailByExamId()
      this.getStudentQuestionCollect()
    },
    computed:{
      ...mapState([
        'currentIndex'//当前题数
      ])
    },
    methods: {
      ...mapActions([
        'nextQue',//点击下一题
        'prevQue',//点击上一题
        'cardQue',//点击答题卡序号
        'refreshCurrentIndex'
      ]),
      async getStudentQuestionCollect(){
        const result = await  getStudentQuestionCollect(this.sno)
        this.studentQuestionCollectList = result.data
      },
      async getPaperWrongDetailByExamId(){
        let result = await getPaperWrongDetailByExamId(this.examId);
        if (result.code === 200) {
          const paperId = result.data.paperId
          const paperTitle = result.data.paperTitle
          this.paperInfo = {"id":paperId,"title":paperTitle}
          this.queNumInfo = result.data.totalQuestion;
          this.singleAnswerList = result.data.singleAnswer
          this.multiAnswerList = result.data.multiAnswer
          this.judgeAnswerList = result.data.judgeAnswer
          this.singleQueList = result.data.singleChoiceList;
          this.multipleQueList = result.data.multiChoiceList;
          this.judgeQueList = result.data.judgeChoiceList;
        }
        else {
          Toast({
            message: result.message,
            duration: 1500
          });
        }
      },
      clickCollect(questionId){
        // if(type === 'single'){
        //   this.singleQueList[index].isCollect = this.singleQueList[index].isCollect == '1' ? '0' : '1'
        // }
        // else if(type === 'multi'){
        //
        // }
        const isCollect = this.judgeIsCollect(questionId)
        this.updateStudentQuestion(this.sno,questionId,isCollect == '1' ? '0' : '1')
      },
      judgeIsCollect(questionId){
        let isCollect = -1
        for (let i = 0; i < this.studentQuestionCollectList.length; i++) {
          if(this.studentQuestionCollectList[i].questionId == questionId){
            isCollect = 1
          }
        }
        return isCollect
      },
      async updateStudentQuestion(studentId,questionId,isCollect){
        let result = await updateStudentQuestion(studentId,questionId,isCollect)
        if(result.code === 200){
                Toast({
                  message:'收藏成功',
                  duration: 1000,
                  position:'bottom'
                });
        }else{
                Toast({
                  message:'收藏失败',
                  duration: 1000,
                  position:'bottom'
                });
        }
        this.getStudentQuestionCollect()
      },
      // clickCollect(isCollect, index, answerId){
      //   if (this.isCollect == '0') {
      //     this.isCollect = '1';
      //     if (this.currentIndex < this.queNumInfo.singleNum){
      //       this.singleQueList[this.currentIndex].isCollect = '1';
      //     }
      //     else if (this.currentIndex < (this.queNumInfo.singleNum + this.queNumInfo.multipleNum)) {
      //       this.multipleQueList[this.currentIndex - this.queNumInfo.singleNum].isCollect = '1';
      //     }
      //     else if (this.currentIndex < (this.queNumInfo.singleNum + this.queNumInfo.multipleNum + this.queNumInfo.judgeNum)) {
      //       this.judgeQueList[this.currentIndex - this.queNumInfo.singleNum - this.queNumInfo.multipleNum].isCollect = '1';
      //     }
      //     if (this.updatePaperAnswerIsCollect(answerId, '1')) {
      //       Toast({
      //         message:'收藏成功',
      //         duration: 1000,
      //         position:'bottom'
      //       });
      //     }
      //   }
      //   else {
      //     this.isCollect = '0';
      //     if (this.currentIndex < this.queNumInfo.singleNum){
      //       this.singleQueList[this.currentIndex].isCollect = '0';
      //     }
      //     else if (this.currentIndex < (this.queNumInfo.singleNum + this.queNumInfo.multipleNum)) {
      //       this.multipleQueList[this.currentIndex - this.queNumInfo.singleNum].isCollect = '0';
      //     }
      //     else if (this.currentIndex < (this.queNumInfo.singleNum + this.queNumInfo.multipleNum + this.queNumInfo.judgeNum)) {
      //       this.judgeQueList[this.currentIndex - this.queNumInfo.singleNum - this.queNumInfo.multipleNum].isCollect = '0';
      //     }
      //     if (this.updatePaperAnswerIsCollect(answerId, '0')) {
      //       Toast({
      //         message:'已取消收藏',
      //         duration: 1000,
      //         position:'bottom'
      //       });
      //     }
      //   }
      // },
      //点击上一题
      preItem() {
        this.prevQue();
      },
      //点击下一题
      nextItem() {
        this.nextQue();
      },
      //点击显示答题卡
      toPaperCard() {
        this.showPaperContainer = false;
        this.showPaperCard = true;
      },
      //点击显示试卷问题
      toPaperQue(index) {
        this.cardQue(index);
        this.showPaperCard = false;
        this.showPaperContainer = true;
      },
      toBack(){
        //清除sessionStorage数据
        sessionStorage.removeItem("currentIndex");
        //清除vuex数据
        this.refreshCurrentIndex(0);
        this.$router.goBack();
      }
    },
    components: {
      HeaderTop
    },
    watch:{
/*      singleQueList:{
        handler: function (newVal) {
          console.log(newVal)
        },
        deep: true    //深度监听
      }*/
      currentIndex() {
        this.percentage = parseInt((this.currentIndex+1)/this.queNumInfo.totalNum*100);
        // if (this.currentIndex < this.queNumInfo.singleNum){
        //   this.isCollect = this.singleQueList[this.currentIndex].isCollect;
        // }
        // else if (this.currentIndex < (this.queNumInfo.singleNum + this.queNumInfo.multipleNum)) {
        //   this.isCollect = this.multipleQueList[this.currentIndex - this.queNumInfo.singleNum].isCollect;
        // }
        // else if (this.currentIndex < (this.queNumInfo.singleNum + this.queNumInfo.multipleNum + this.queNumInfo.judgeNum)) {
        //   this.isCollect = this.judgeQueList[this.currentIndex - this.queNumInfo.singleNum - this.queNumInfo.multipleNum].isCollect;
        // }
        sessionStorage.removeItem("currentIndex");
        sessionStorage.setItem("currentIndex",this.currentIndex)
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .wrong
    width 100%
    padding-top 45px
    background-color #f5f5f5
    min-height 900px
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
    .wrong_sub_title
      width 100%
      height 35px
      display flex
      flex-direction row-reverse
      align-items center
      background-color #4ab8a1
      font-size 16px
      > span
        display inline-block
        color #f5f5f5
      .wrong_statistics
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
          .answer_explain
            display inline
            padding-bottom 20px
          .answer_row
            height 28px
            line-height 28px
            .correct_answer
              color #4ab8a1
            .your_answer
              color #FF0000
          > span
            display block
          .que_type, .que_score
            color #4ab8a1
          .que_type
            display flex
            justify-content space-between
            align-items center
            >img
              height 18px
              width 18px
              padding-right 15px
          .que_content
            padding-bottom 10px
        .single_option,.multiple_option,.judge_option,.fill_option
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
        justify-content center
        align-items center
        font-size 16px
        color #fff
        background-color #778899
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
              .correct_flag
                border 1px solid #4ab8a1
                background-color #4ab8a1
                color #fff
              .error_flag
                border 1px solid #FF0000
                background-color #FF0000
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
