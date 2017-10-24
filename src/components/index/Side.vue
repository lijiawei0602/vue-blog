<template>
  <div class="side">
      <div class="side-main" :class="{'side-main-show': sideBoxShow}">
          <img src="../../assets/head.jpg" alt="" class="side-main-pic" @click="goIndex">
          <p class="side-main-author">Power Train</p>
          <p class="side-main-motto">好好学习，天天向上</p>
          <ul class="side-main-icon">
              <li v-for="icon in iconList" class="side-main-icon-item" :key="icon.name">
                  <a :href="icon.href">
                      <i class="fa fa-2x" :class="'fa-'+icon.name"></i>
                  </a>
              </li>
          </ul>
          <ul class="side-main-tag" v-if="isInList">
              <li v-for="tag in tagList" class="side-main-tag-item" :class="{'side-main-tag-item-active': typeof selectTag.find(e => e.id == tag.id) !== 'undefined'}" :key="tag.name" @click="toggle_select_tags({id:tag.id, name: tag.name})">{{ tag.name }}</li>
          </ul>
          <div class="side-main-catalog" v-if="!isInList" :class="{'side-main-catalog-active': (scrollTop > 300)}">
            <p class="side-main-catalog-title">文章目录</p>
            <ul class="side-main-catalog-list">
                <li v-for="item in catalog" class="side-main-catalog-list-item"  :class="'side-main-catalog-list-item-'+item.tagName" :key="item.text">
                    <a href="javascript:void(0)" @click="goAnchor(item.href)">{{ item.text }}</a>
                </li>
            </ul>
          </div>
      </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import throttle from '../../lib/throttle.js';

export default {
  name: "side",
  data(){
      return {
          iconList: [
              { name: "github", href: "https://github.com/lijiawei0602"}
          ],
          scrollTop: 0,
      }
  },
  props: {
      isInList: {
          type: Boolean,
          required: true
      },
      catalog: {
          type: Array,
          required: false
      },
  },
  created(){
      if(this.isInList){
          this.GET_ALL_TAGS();
      }
      if(!this.isInList){
          //对scroll事件节流优化
          window.onscroll = throttle(this.beScrollTop, 300);
      }
  },
  computed: {
      ...mapGetters([
          'tagList',
          'selectTag',
          'sideBoxShow'
      ]),
  },
  methods: {
      goIndex(){
          this.$router.push("/");
      },
      ...mapActions([
          'GET_ALL_TAGS',
      ]),
      ...mapMutations({
          toggle_select_tags: 'toggle_select_tags',
      }),
      beScrollTop(){
          if(document.body.clientWidth < 850){
              return;
          }
          let scroll = document.body.scrollTop || document.documentElement.scrollTop;
          this.scrollTop = scroll;
      },
      //由于没使用history，所以导致锚点的默认行为不能使用，故采取手动实现默认锚点行为
      goAnchor(selector) {
        const anchor = '#' + selector;
        this.$emit("scroll", anchor);
      },

  },
  beforeDestroy(){
      window.onscroll = null;
  }
}
</script>
<style lang="less" scoped>
    .side{
        width: 250px;
        float: left;
        text-align: center;
        margin-top: 20px;
        &-main{
            &-pic{
                margin-top: 20px;
                width: 150px;
                border-radius: 50%;
                box-shadow: 0 0 2px #666;
                cursor: pointer;
            }
            &-author{
                font-size: 25px;
                color: #666;
                margin: 5px 0;
            }
            &-motto{
                color: #bfbfbf;
                margin: 5px 0;
                font-size: 14px;
            }
            &-icon{
                list-style-type: none;
                padding: 0;
                text-align: center;
                margin: 0;
                &-item{
                    margin: 5px;
                    display: inline-block;
                    width: 30px;
                    i{
                        color:#666;
                        &:hover{
                            color: #0288D9;
                        }
                    }
                }
            }
            &-tag{
                list-style-type: none;
                padding: 0;
                &-item{
                    display: inline-block;
                    padding: 5px 8px;
                    border: 1px solid #666;
                    border-radius: 3px;
                    margin: 5px;
                    text-align: center;
                    cursor: pointer;
                    color: #666;
                    font-size: 14px;
                    &:hover{
                        border: 1px solid #42B983;
                        background-color: #42B983;
                        color: white;
                        transform: scale(1.1);
                    }
                    &-active{
                        color: #0288D9 !important;
                        border-color: #0288D9;
                    }
                }
            }
            &-catalog{
                padding: 0 20px;
                &-title{
                    font-size: 18px;
                    color: #666;
                }
                &-list{
                    list-style-type: none;
                    padding: 0;
                    &-item{
                        text-align: left;
                        margin-bottom: 5px;
                        padding-left: 40px;
                        word-wrap: break-word;
                        a{
                            text-decoration: none;
                            color: #bfbfbf;
                        }
                        &-h1{
                            margin-left: 0; 
                        }
                        &-h2{
                            margin-left: 20px;
                        }
                        &-h3{
                            margin-left: 40px;
                        }
                        &-h4{
                            margin-left: 60px;
                        }
                        &-h5{
                            margin-left: 80px;
                        }
                        &-h6{
                            margin-left: 100px;
                        }
                    }
                }
            }
            &-catalog-active{
                position: fixed;
                top: 60px;
                bottom: 0;
                overflow-y: auto;
                width: 250px;
            }
        }
    }

    @media screen and (max-width: 850px){
        .side{
            position: absolute;
            top: 0;
            left: 0;
            &-main{
                position: fixed;
                left: 0;
                top: 61px;
                bottom: 0;
                width: 250px;
                -webkit-transform: translate(-250px);
                        transform: translate(-250px);
                -webkit-transition: trnasform 0.3s;
                        transition: transform 0.3s;
                background-color: white;
                overflow-x: hidden;
                overflow-y: auto;
                &-show{
                    -webkit-transfrom: translate(0px);
                            transform: translate(0px);
                    -webkit-transition: transform .3s;
                            transition: transform .3s;
                    z-index: 2;
                    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
                }
            }
        }
    }
</style>
