<template>
  <div class="admin">
    <div class="admin-list">
      <list></list>
    </div>
    <div class="admin-editor">
      <editor></editor>
    </div>
    <div class="admin-quit">
      <i class="fa fa-power-off" @click="quit"></i>
    </div>
  </div>
</template>
<script>
import List from './List.vue';
import Editor from './Editor.vue';

export default {
  name: "admin",
  components: {
    List,
    Editor
  },
  data(){
    return {

    }
  },
  methods:{
    quit(){
      this.$confirm("此操作将退出博客系统，是否继续", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.commit("delete_token");
        this.$router.push("/admin/login");
      }).catch(() => {
        
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .admin{
    &-list{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: 500px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &-editor{
      margin-left: 500px;
    }
    &-quit{
      position: absolute;
      top: 22px;
      right: 25px;
      font-size: 28px;
      cursor: pointer;
      color: #0089D7;
    }
  }
</style>
