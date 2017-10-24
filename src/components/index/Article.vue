<template>
  <div class="article">
    <Loading v-if="isLoading" :loadingMsg="loadingMsg"></Loading>
    <Side :isInList="false" :catalog="catalog" @scroll="scrollTop"></Side>
    <div class="article-main" v-if="!isLoading">
      <h1 class="article-main-title">{{ currentArticle.title }}</h1>
      <p class="article-main-time">{{ currentArticle.createTime | subTime }}</p>
      <div class="article-main-content" v-html="compileMD(currentArticle.content)" v-hljs ref="article"></div>
    </div>
  </div>
</template>
<script>
import Side from './Side.vue';
import Loading from '../common/Loading.vue';
import marked from '../../lib/marked.js';
import css from '../../assets/css/highlight.css';
import css2 from '../../assets/css/syntax.styl';

import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'article',
  components: {
      Side,
      Loading
  },
  data(){
      return {
          isLoading: false,
          loadingMsg: "加载中...",
          catalog: [],
      }
  },
  created(){
      this.$store.dispatch("GET_PUBLISH_ARTICLE", this.$route.params.id).then((res) => {
      });
  },
  beforeMount(){
      //当前文章数据之前已经获取到了，不必在组件重新渲染时再次获取
      if(this.currentArticle.id == this.$route.params.id){
          this.$nextTick(() => {
              Array.prototype.slice.call(this.$refs.article.querySelectorAll("h1,h2,h3,h4,h5,h6")).forEach((item, index) => {
                  item.id = item.localName + '-' + index;
                  this.catalog.push({
                      tagName: item.localName,
                      text: item.innerText,
                      href: item.id
                  });
              });
          });
          return;
      }
      //没有数据则获取
      this.isLoading = true;
      this.GET_PUBLISH_ARTICLE(this.$route.params.id).then(() => {
          this.isLoading = false;
          this.$nextTick(() => {
              Array.prototype.slice.call(this.$refs.article.querySelectorAll("h1,h2,h3,h4,h5,h6")).forEach((item, index) => {
                  item.id = item.localName + '-' + index;
                  this.catalog.push({
                      tagName: item.localName,
                      text: item.innerText,
                      href: item.id
                  });
              });
          });
      });
  },
  methods: {
      ...mapActions([
          'GET_PUBLISH_ARTICLE',
      ]),
      compileMD(content){
          return marked(content);
      },
      scrollTop(anchor){
          if(anchor){
              var node = this.$el.querySelector(anchor);
              var height = node.offsetTop;
              document.body.scrollTop = height;
              document.documentElement.scrollTop = height;
          }
      }
  },
  computed: {
      ...mapGetters([
          'currentArticle',
      ]),
  },
  filters: {
      subTime(time){
        if(time){
            var year = time.split("-")[0],
                month = time.split("-")[1],
                day = time.split("-")[2].split("T")[0];
            var other = time.split("-")[2].split("T")[1];
            var clock = other.split(".")[0];

            var newTime = `${year}年${month}月${day} ${clock}`;
            return newTime;
        }
      },
  }
}
</script>
<style lang="less" scoped>
    .article{
        padding: 10px;
        margin: 0 auto;
        margin-top: 60px;
        margin-bottom: 20px;
        max-width: 1000px;
        &-main{
            margin-left: 260px;
            padding: 10px;
            &-title{
                color: #0288D9;
                margin-bottom: 0;
            }
            &-time{
                color: #666;
                font-size: 14px;
            }
            &-content{
                overflow-y: auto;
            }
        }
    }

    @media screen and (max-width: 850px){
        .article{
            &-main{
                margin-left: 0;
            }
        }
    }
</style>
