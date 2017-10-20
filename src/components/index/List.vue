<template>
<div class="list">
  <Side :isInList="true"></Side>
  <Loading v-if="isLoading" :loadingMsg="loadingMsg"></Loading>
</div>
</template>
<script>
import Loading from '../common/Loading.vue';
import Side from '../common/Side.vue';

export default {
  name: 'list',
  components:{
      Side,
      Loading
  },
  data(){
      return {
          isLoading: true,
          loadingMsg: "加载中..."
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
