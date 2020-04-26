<template>
  <section class="profile_info">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="个人信息">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <!--个人信息展示-->
    <mt-cell title="头像（点击可预览）">
      <viewer>
<!--        <img :src="userInfo.stuImgSrc ? userInfo.stuImgSrc : require('../../common/imgs/profile.jpg')"-->
<!--             alt="头像" class="profile_img">-->
        <img src="../../common/imgs/yingmu.jpg" alt="头像" class="profile_img">
      </viewer>
      <i class="iconfont iconjiantou"></i>
    </mt-cell>
    <mt-cell title="学号" :value="userInfo.studentId"/>
    <mt-cell title="姓名" :value="userInfo.name"/>
    <mt-cell title="性别" :value="userInfo.sex===1 ?'男' : userInfo.sex!=null ? '女' : ''"/>
    <mt-cell title="邮箱" :value="userInfo.email || '暂无绑定邮箱'"/>
    <mt-cell title="手机号" :value="userInfo.phoneNumber || '暂无绑定手机号'"/>
    <mt-cell title="注册时间" :value="userInfo.createTime | date-format"/>
    <mt-cell title="账号状态" :value="userInfo.isDelete ===0 ? '正常' : '禁用'"/>
  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {mapState} from 'vuex'
  export default {
    name: "",
    data() {
      return {}
    },
    methods: {},
    components:{
      HeaderTop
    },
    computed:{
      ...mapState(['userInfo'])
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .profile_info
    width 100%
    padding-top 45px
    .iconfont
      font-size 25px
    .profile_img
      width 24px
      height 24px
      border-radius 50%
</style>
