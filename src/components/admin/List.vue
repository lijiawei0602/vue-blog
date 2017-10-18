<template>
  <div class="list">
      <div class="list-topTitle">
        <i class="fa fa-tags"></i>&nbsp;标签
      </div>
      <ul class="list-tags">
          <li v-for="tag in tagList" class="list-tag-item" :key="tag.name" :class="{'list-tag-item-active': selectTagArr.includes(tag.id)}" @click="toggle_select_tag(tag.id)">
              <i class="fa fa-tags"></i>&nbsp;
              <span class="list-tags-name">{{ tag.name }}</span>
              <i class="fa fa-trash-o" @click.stop="deleteTag(tag.id)"></i>
          </li>
      </ul>
      <div class="list-artTitle" @click="createArticle">
        <i class="fa fa-plus"></i>&nbsp;新建文章
      </div>
      <ul class="list-articles">
        <li v-for="(article, index) in articleList" :key="index" @click="chooseArticle(index)" class="list-article-item" :class="{ 'list-article-item-active': currentArticle.index == index }">
          <h1 class="list-article-item-title">{{ article.title | subArtTitle }}</h1>
          <div class="list-article-item-info">
            <i class="fa fa-tag"></i>
            <span v-for="tag in article.tags" :key="tag.name">{{ tag.name }}&nbsp;</span>
            <p class="list-article-item-info-createTime">
              <i class="fa fa-calendar"></i>&nbsp;{{ article.createTime | culTime }}
            </p>
            <p class="list-article-item-info-publish" v-if="article.publish">已发布</p>
          </div>
        </li>
        <pagination :curPage="curPage" :allPage="allPage" @changePage="changePage" v-if="allPage > 0"></pagination>
      </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Pagination from '../common/Pagination.vue';

export default {
  name: "list",
  components: {
    Pagination
  },
  computed: {
    ...mapGetters([
      'tagList',
      'articleList',
      'curPage',
      'allPage',
      'currentArticle',
      'selectTagArr'
    ])
  },
  mounted(){
    this.GET_ALL_TAGS();
    this.GET_ALL_ARTICLES().then(res => {
      console.log(res.data);
    });
  },
  methods: {
    ...mapActions([
        "GET_ALL_TAGS",
        'GET_CURRENT_ARTICLE',
        'GET_ALL_ARTICLES',
        "DELETE_TAG"
    ]),
    ...mapMutations([
        'set_all_page',
        'set_cur_page',
        'toggle_select_tag'
    ]),
    deleteTag(id){
      this.$confirm("此操作将永久删除该标签", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.DELETE_TAG(id).then((res) => {
          if(res.data.success){
            this.$message({
              message: "删除成功",
              type: "success"
            });
          }
        }).catch((err) => {
          this.$message.error(err.response.data.error);
        });
      }).catch(() => {

      });
    },
    createArticle(){
      this.GET_CURRENT_ARTICLE(-1);
    },
    chooseArticle(index){
      if(!this.currentArticle.save){
        this.$message.error("请先保存当前文章");
        return;
      }
      this.GET_CURRENT_ARTICLE(index);
    },
    changePage(cur){
      this.GET_ALL_ARTICLES({
        page: cur,
        tag: this.selectTagArr
      }).then((res) => {
        this.GET_CURRENT_ARTICLE(0);
      });
    }
  },
  watch:{
    selectTagArr(val, oldVal){
      this.GET_ALL_ARTICLES({
        tag: val
      }).then(res => {
      });
    }
  },
  filters: {
    subArtTitle(title){
      if(title.length > 20){
        return title.substring(0,20) + "...";
      }else{
        return title;
      }
    },
    culTime(time){
      var year = time.split("-")[0],
          month = time.split("-")[1],
          day = time.split("-")[2].split("T")[0];
      var other = time.split("-")[2].split("T")[1];
      var clock = other.split(".")[0];

      var newTime = `${year}年${month}月${day} ${clock}`;
      return newTime;
    }
  }
}
</script>
<style lang="less" scoped>
  .list{
    padding: 15px;
    &-topTitle{
      color: #0089D7;
      font-size: 25px;
    }
    &-tags{
      list-style: none;
      height: 100px;
      overflow: auto;
      padding: 0;
      .list-tag-item{
        float: left;
        background-color: #0089D7;
        color: white;
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        &-active{
          background-color: #D8931B;
        }
      }
    }
    &-artTitle{
      color: #0089D7;
      font-size: 25px;
      cursor: pointer;
    }
    &-articles{
      list-style: none;
      padding: 0;
      margin-bottom: 0;
    }
    &-article-item{
      background-color: #EFEFEF;
      padding: 4px 0 4px 10px;
      margin-bottom: 5px;
      border-radius: 2px;
      overflow: hidden;
      &-active{
        border-left: 10px solid #0089D7;
      }
      &-title{
        font-size: 20px;
        margin: 0;
      }
      &-info{
        float: right;
        margin-right: 10px;
        text-align: right;
        span{
          font-size: 14px;
        }
        &-createTime{
          font-size: 14px;
        }
        &-publish{
          float: right;
          margin-top: -80px;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
</style>
