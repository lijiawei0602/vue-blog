<template>
  <div class="side">
      <div class="side-main">
          <img src="../../assets/head.jpg" alt="" class="side-main-pic" @click="goIndex">
          <p class="side-main-author">Power Train</p>
          <p class="side-main-motto">好好学习，天天向上</p>
          <ul class="side-main-icon">
              <li v-for="icon in iconList" class="side-main-icon-item" :key="icon">
                  <a :href="icon.href">
                      <i class="fa fa-2x" :class="'fa-'+icon.name"></i>
                  </a>
              </li>
          </ul>
          <ul class="side-main-tag" v-if="isInList">
              <li v-for="tag in tagList" class="side-main-tag-item" :key="tag.name">{{ tag.name }}</li>
          </ul>
          <div class="side-main-catalog" v-if="!isInList">
            <p class="side-main-catalog-title">文章目录</p>
            <ul class="side-main-catalog-list">
                <li v-for="item in catalogBox" class="side-main-catalog-list-item" :key="item.text">
                    <a :href="item.href">{{ item.text }}</a>
                </li>
            </ul>
          </div>
      </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: "side",
  data(){
      return {
          iconList: [
              { name: "github", href: "https://github.com/lijiawei0602"}
          ],
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
      }
  },
  created(){
      this.GET_ALL_TAGS();
  },
  computed: {
      ...mapGetters([
          'tagList',
      ]),
  },
  mounted: {
  },
  methods: {
      goIndex(){
          this.$router.push("/");
      },
      ...mapActions([
          'GET_ALL_TAGS',
      ]),
  }
}
</script>
<style lang="less" scoped>
    .side{
        width: 250px;
        float: left;
        text-align: center;
        &-main{
            &-pic{
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
        }
    }
</style>
