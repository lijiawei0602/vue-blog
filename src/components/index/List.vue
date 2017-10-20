<template>
<div class="list">
  <Side :isInList="true"></Side>
</div>
</template>
<script>
import Side from '../common/Side.vue';

export default {
  name: 'list',
  components:{
      Side
  },
  data(){
      return {

      }
  },
  methods: {

  },

}
</script>
<style lang="less" scoped>
    .list{
        padding: 10px;
        margin: 0 auto;
        margin-top: 60px;
        max-width: 1000px;
    }
</style>
