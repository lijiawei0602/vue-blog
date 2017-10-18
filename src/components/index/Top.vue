<template>
  <header class="header">
    <img src="../../assets/nav.png" alt="">
    <router-link to="/" class="header-title">lijiawei's Blog</router-link>
  </header>
</template>
<script>
export default {
  name: 'top',
  data(){
    return {}
  },

}
</script>
<style lang="less" scoped>
  .header{
    position: fixed;
    top: 0;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #666;
    background-color: white;
  }
</style>
