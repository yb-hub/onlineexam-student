<template>
  <section class="single_collection">
    <HeaderTop title="收藏题目详情">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconfanhui"></i>
      </a>
    </HeaderTop>

    <div class="content_container">
      <div class="content">
            <span class="que_type">
              (单选题)<img :src="isCollect == 0 ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect"/>
            </span>
        <span class="que_content">{{item.title}}</span>

<!--        <img :src="item.pictureSrc" alt="" style="width: 100%" v-if="item.pictureSrc">-->

        <div class="single_option" v-for="(option, optionIndex) in item.options"
             :key="'single'+ item.id + optionIndex">
          <mu-radio :value="option.optionKey" v-model="item.rightOption[0]" disabled
                    :label="option.optionKey+':'+option.optionValue" v-if="option.optionValue"></mu-radio>
        </div>

        <div class="answer_row">正确答案：<span class="correct_answer">{{item.rightOption[0]}}</span></div>
<!--        <div class="answer_row">你的答案：<span :class="[item.isCorrect == '1' ? 'correct_answer' : 'your_answer']">{{item.stuAnswer || '你太优秀了，该题无作答'}}</span></div>-->
        <div class="answer_row">答案解析：<span class="correct_answer">{{item.analysis || '暂无解析呀老哥，给个解析呗'}}</span></div>
      </div>
    </div>
  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {getQuestionById, updateStudentQuestion} from '../../api'
  import {Toast} from 'mint-ui'
  export default {
    name: "",
    data() {
      return {
        sno: this.$store.state.userInfo.studentId,
        questionId:this.$route.params.questionId,
        item:{},
        isCollect: 1
      }
    },
    created(){
      this.getSingleByAnswerId();
    },
    methods: {
      async getSingleByAnswerId(){
        let result = await getQuestionById(this.questionId);
        if (result.code  === 200){
          this.item = result.data;
        }
        else {
          Toast({
            message:result.message,
            duration: 1500
          });
        }
      },

      async updateStudentQuestion(studentId,questionId,isCollect) {
        let result = await updateStudentQuestion(studentId, questionId, isCollect)
        if (result.code === 200) {
          this.isCollect = this.isCollect == 0 ? 1 : 0
          Toast({
            message: '收藏成功',
            duration: 1000,
            position: 'bottom'
          });
        } else {
          Toast({
            message: '收藏失败',
            duration: 1000,
            position: 'bottom'
          });
        }
      },
      clickCollect(){
        this.updateStudentQuestion(this.sno,this.questionId,this.isCollect == 0 ? 1 : 0)
      }
    },
    components:{
      HeaderTop
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .single_collection
    width 100%
    padding-top 45px
    background-color #f5f5f5
    .go_back
      width 40px
    .content_container
      width 90%
      margin 15px auto
      background-color #f5f5f5
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
</style>
