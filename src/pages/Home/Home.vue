<template>
  <div class="home">
    <HeaderTop title="在线考试系统">
      <router-link class="header_login" slot="right" :to="userInfo.studentId ? '/profile/info' : '/login'">
        <span class="header_login_text" v-if="!userInfo.studentId">
          登录|注册
        </span>
        <span class="header_login_text" v-else>
          <img src="../../common/imgs/yingmu.jpg" class="profile_img">
        </span>
      </router-link>
    </HeaderTop>

    <Swiper :lunbotuList="rotationImages" :isfull="true" class="swiper"></Swiper>

    <div class="sudoku_row"  >
      <div class="sudoku_item " :class="{opacity:curSelect===item.id}"
           v-for="(item,index) in courseList"
           :key="index" @touchstart="touchstart(item.id)" @touchend="touchend" @click="toPaper(item.id)">
        <img :src='item.remark' width="40" height="40" >
        {{item.name}}
      </div>
    </div>

<!--    <div class="calendar" @click="toCalendar">-->
<!--      <div class="calendar-left">-->
<!--        <div style="float: left;width: 6px;height: 30px;background-color: #4ab8a1"></div>-->
<!--        <i class="iconfont iconrili"></i>-->
<!--        考试日历-->
<!--      </div>-->
<!--&lt;!&ndash;      <div class="calendar-right" v-if="false">&ndash;&gt;-->
<!--&lt;!&ndash;        <i class="iconfont iconxiazai41"></i>&ndash;&gt;-->
<!--&lt;!&ndash;        最新考试信息：{{examCalendar[0].teaName}}{{examCalendar[0].noticeCreateTime | date-format('M')}}月{{examCalendar[0].noticeCreateTime | date-format('D')}}号发布&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--    </div>-->
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import Swiper from '../../components/Swiper/Swiper.vue'
  import {mapState} from 'vuex'

  export default {
    name: "",
    created(){
      this.$store.dispatch('getRotationImages');
      this.$store.dispatch('getCourseList');
    },
    data() {
      return {
        curSelect:null,
      }
    },
    computed:{
      //轮播图的数组
      ...mapState(['examCalendar','rotationImages','userInfo','courseList'])
    },
    methods:{
      touchstart:function(e){
        var list = this.$store.state.courseList;
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].id == e) {
            this.curSelect = i + 1;
          }
        }
        setTimeout(() => {
          this.curSelect = null;
        }, 500)
      },
      touchend:function(){
        this.curSelect = null;
      },
      toCalendar(){
        if (!this.$store.state.userInfo.studentId){
          Toast({
            message:'请先登录系统',
            duration: 1000
          });
        }
        else{
          this.$router.push('/profile/examcalendar')
        }
      },
      toPaper(id){
        if (!this.$store.state.userInfo.studentId){
          Toast({
            message:'请先登录系统',
            duration: 1000
          });
        }
        else{
          this.$router.push('/home/paper/' + id)
        }
      },
    },
    components:{
      HeaderTop,
      Swiper
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .home  //首页
    padding-bottom 56px
    width 100%
    background-color #f5f5f5
    .swiper
      padding-top 45px
      //box-shadow 0px 0px 1px rgba(0,0,0,.5)
    .sudoku_row
      display flex
      align-items center
      width 100%
      flex-wrap wrap
      background-color #fff
      margin-top 6px
      .recommend
        background url("../../common/imgs/corner-mark-recommend.png") no-repeat 0% 0%
        background-size 40px 40px
      .first_recommend
        background url("../../common/imgs/corner-mark-recommend.png") no-repeat 0% 0%, url("../../common/imgs/corner-mark-top-right.png") no-repeat 100% 0%
        background-size 40px 40px
      .sudoku_item
        display flex
        justify-content center
        align-items center
        flex-direction column
        width 33.3%
        padding-top 10px
        padding-bottom 10px
        box-shadow 0px 0px 1px rgba(0,0,0,.5)
        img
          margin-bottom 3px
          display block
    .opacity
      opacity 0.4
      background #e5e5e5
    .calendar
      display flex
      justify-content space-between
      align-items center
      background-color #fff
      margin-top 6px
      height 50px
      &:active
        opacity 0.4
        background #e5e5e5
      //box-shadow 0px 0px 1px rgba(0,0,0,.5)
      .calendar-left
        display flex
        align-items center
        font-size 12px
        .iconrili
          font-size 20px
          padding-left 10px
          padding-right 10px
      .calendar-right
        display flex
        align-items center
        font-size 12px
        padding-right 10px
        color lightcoral
        font-weight bold
        .iconxiazai41
          font-size 20px
          padding-right 10px
          font-weight bolder
</style>
