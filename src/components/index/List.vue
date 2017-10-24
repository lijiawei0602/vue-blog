<template>
<div class="list">
  <Side :isInList="true"></Side>
  <Loading v-if="isLoading" :loadingMsg="loadingMsg"></Loading>
  <ul class="list-article">
      <li class="list-article-filter" v-if="selTag.length !== 0">
          筛选&nbsp;
        <span>{{ filterMsg }}</span>
       &nbsp;标签
      </li>
      <template v-if="pubArtList.length !== 0 && isLoading == false">
        <li v-for="item in pubArtList" class="list-article-item" :key="item.id">
            <h1 class="list-article-item-title">
                <router-link :to="'/article/' + item.id">{{ item.title | subTitle(item.title) }}</router-link>
            </h1>
            <div class="list-article-item-info">
                <p class="list-article-item-info-time">{{ item.createTime | subTime }}</p>
                <div class="list-article-item-info-abstract markdown-body" v-html="compileMD(item.abstract)" v-hljs></div>
                <p class="continue-reading">
                    <router-link :to="'/article/'+item.id">继续阅读...</router-link>
                </p>
            </div>
        </li>
        <Pagination :curPage="curPage" :allPage="allPage" @changePage="changePage"></Pagination>
      </template>
      <div class="msg-box" v-if="pubArtList.length == 0 && isLoading == false">
          <p>没有符合搜索条件的内容</p>
      </div>
  </ul>

</div>
</template>
<script>
import Loading from '../common/Loading.vue';
import Side from './Side.vue';
import Pagination from '../common/Pagination';

import marked from '../../lib/marked.js';
import css from '../../assets/css/highlight.css';

import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'list',
  components:{
      Side,
      Loading,
      Pagination
  },
  data(){
      return {
          isLoading: false,
          loadingMsg: "加载中...",
      }
  },
  methods: {
      ...mapActions([
          'GET_ALL_PUBLISH_ARTICLES',
      ]),
      compileMD(val){
          return marked(val);
      },
      changePage(cur){
          this.isLoading = true;
          this.$router.push('/page/'+cur);
           this.GET_ALL_PUBLISH_ARTICLES({
            page: cur,
            tag: this.selectTagArr
        }).then((res) => {
            this.isLoading = false;
        });
      }
  },
  beforeMount(){
      this.isLoading = true;
      this.GET_ALL_PUBLISH_ARTICLES({ page: this.$route.params.page }).then(res => {
          this.isLoading = false;
      });
  },
  computed: {
      ...mapGetters([
         'allPage',
         'curPage',
         'selectTag',
         'pubArtList',
      ]),
      filterMsg(){
          let msg = '';
          this.$store.state.selectTag.map(item => {
              msg += item.name + '、';
          });
          return msg.replace(/、$/,'');
      },
      selTag(){
          return this.$store.state.selectTag;
      },
  },
  watch: {
    selectTag(){
        this.Loading = true;
        let arr = [];
        this.selectTag.map((item) => {
            arr.push(item.id);
        });
        this.GET_ALL_PUBLISH_ARTICLES({
            tag: arr
        }).then(() => {
            this.Loading = false;
        });
    }
  },
  filters: {
      subTime(time){
        var year = time.split("-")[0],
            month = time.split("-")[1],
            day = time.split("-")[2].split("T")[0];
        var other = time.split("-")[2].split("T")[1];
        var clock = other.split(".")[0];

        var newTime = `${year}年${month}月${day} ${clock}`;
        return newTime;
      },
      subTitle(title){
        if(title.length > 20){
            return title.substring(0,20) + "...";
        }else{
            return title;
        }
      }
  }
}
</script>
<style lang="less" scoped>
    .list{
        padding: 10px;
        margin: 0 auto;
        margin-top: 60px;
        max-width: 1000px;
        &-article{
            list-style-type: none;
            padding: 0;
            margin-left: 260px;
            &-filter{
                text-align: center;
                span{
                    font-size: 22px;
                    color: #0288D9;
                }
            }
            &-item{
                // margin: 0 auto;
                padding: 0 10px 10px 10px;
                &-title{
                    font-size: 24px;
                    cursor: pointer;
                    a{
                        text-decoration: none;
                        color: #0288D9;
                        &:hover{
                            border-bottom: 3px solid #0288D9;
                        }
                    }
                }
                &-info{
                    &-time{
                        color: #7f8c8d;
                        font-size: 14px;
                    }
                    &-abstract{
                    
                    }
                    .continue-reading{
                        a{
                            text-decoration: none;
                            color: #0288D9;
                            font-size: 14px;
                        }
                    }
                }
            }
            .msg-box{
                position: fixed;
                top: 50%;
                left: 50%;
                width: 200px;
                height: 200px;
                margin-left: -100px;
                margin-top: -100px;
                text-align: center;
                color: #bfbfbf;
            }
        }
    }

    @media screen and (max-width: 850px){
        .list{
            margin-top: 60px;
            &-article{
                margin-left: 0;
                &-filter{
                    span{
                        font-size: 18px;
                    }
                }
            }
        }
    }
</style>
