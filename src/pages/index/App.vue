<template>
  <div class="wrap">
    <Top></Top>
    <transition name="fade" mode="out-in">
      <keep-alive exclude="article">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <footer class="footer">
      <p>Copyright @ <a href="https://github.com/lijiawei0602">Li Jia Wei</a></p>
    </footer>
  </div>
</template>
<script>
import Top from '../../components/index/Top.vue';

export default {
  name: "index",
  components: {
    Top
  },
  data(){
    return {

    }
  },
}
</script>
<style lang="less">
  html, body{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .fade-enter-active, .fade-leave-active{
    transition: all .3s;
  }
  .fade-enter, .fade-leave-active{
    opacity: 0;
  }
  .footer{
    // position: static;
    width: 100%;
    left: 0;
    bottom: 25px;
    height: 60px;
    text-align: center;
    line-height: 60px;  
    p{
      margin-bottom: 0;
      font-size: 14px;
      color: #bfbfbf;
      a{
        text-decoration: none;
        color: #0288d9;
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }

  @media screen and (max-width: 850px){
    .fade-enter{
      transform: translate(30px, 0px);
    }
    .fade-leave-active{
      transform: translate(-30px, 0);
    }
  }
</style>

