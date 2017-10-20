<template>
  <header class="header">
    <img src="../../assets/nav.png" alt="" class="header-nav" @click="toggleSideBox">
    <router-link to="/" class="header-title" @click="clearSelect">lijiawei's Blog</router-link>
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
      float: left;
      margin-top: 14px;
      margin-left: 10px;
      line-height: 60px;
      cursor: pointer;
    }
    &-title{
      margin-left: 10px;
      color: #0288D9;
      font-size: 20px;
      text-decoration: none;
      font-weight: bold;
    }
  }
</style>
