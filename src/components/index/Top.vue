<template>
  <header class="header">
    <img src="../../assets/nav.png" alt="" class="header-nav">
    <img src="../../assets/nav.png" alt="" class="header-nav-mobile" @click.stop="toggleSideBox">
    <router-link to="/" class="header-title" @click.native="clearSelect">lijiawei's Blog</router-link>
  </header>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'top',
  data(){
    return {}
  },
  methods: {
    ...mapMutations({
      toggleSideBox: 'toggle_side_box',
      setSelectTags: 'set_select_tags'
    }),
    clearSelect(){
      this.setSelectTags([]);
    },
  }

}
</script>
<style lang="less" scoped>
  .header{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #C2CCB8;
    background-color: white;
    &-nav{
      display: block;
      float: left;
      margin-top: 14px;
      margin-left: 10px;
      line-height: 60px;
      cursor: pointer;
    }
    &-nav-mobile{
      display: none;
    }
    &-title{
      margin-left: 10px;
      color: #0288D9;
      font-size: 20px;
      text-decoration: none;
      font-weight: bold;
    }
  }
  @media screen and (max-width: 850px){
    .header{
      text-align: center;
      &-title{
        margin-left: 0;
      }
      &-nav{
        display: none;
      }
      &-nav-mobile{
        display: block;
        float: left;
        margin-top: 14px;
        margin-left: 10px;
        line-height: 60px;
        cursor: pointer;
      }
    }
  }
</style>
