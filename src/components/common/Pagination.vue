<template>
  <ul class="pagination">
    <li class="pagination-button" @click="prevPage"><</li>
    <li class="pagination-item" v-for="page in pageArr" @click="switchPage(page)" :class="{ 'pagination-item-active': curPage == page }">{{ page }}</li>
    <li class="pagination-button" @click="nextPage">></li>
  </ul>
</template>
<script>

export default {
    name: "pagination",
    data(){
      return{}
    },
    props:{
      curPage:{
        type: Number,
        required: true
      },
      allPage:{
        type: Number,
        required: true
      }
    },
    computed:{
      pageArr(){
        let arr = [];
        if(this.allPage <= 7){  //1 2 3 4 5 6 7
          for(let i=1; i<=this.allPage; i++){
            arr.push(i);
          }
        }else{                  //总页数大于7
          if(this.curPage < 4){ //当前页数小于4
            for(let i=1; i<=this.curPage + 1; i++){ //1 2 3 4 ... allPage
              arr.push(i);
            }
            arr.push("...");
            arr.push(this.allPage);
          }else if(this.allPage - this.curPage < 3){  //1 ... cur-1 curPage ** allPage
            arr.push(1);
            arr.push("...");
            for(let i=this.curPage - 1; i<=this.allPage; i++){
              arr.push(i);
            }
          }else{  //1 ... cur-1 cur cur+1 ... allPage
            arr.push(1);
            arr.push("...");
            arr.push(this.curPage - 1);
            arr.push(this.curPage);
            arr.push(this.curPage + 1);
            arr.push("...");
            arr.push(this.allPage);
          }
        }
        return arr;
      }
    },
    methods:{
      prevPage(){
        if(this.curPage <= 1){
          return;
        }
        this.$emit("changePage", this.curPage - 1);
      },
      nextPage(){
        if(this.curPage >= this.allPage){
          return;
        }
        this.$emit("changePage", this.curPage + 1);
      },
      switchPage(page){
        if(page == "..."){
          return;
        }
        this.$emit("changePage", page);
      }
    }
}
</script>
<style lang="less" scoped>
  .pagination{
    list-style-type: none;
    padding: 0;
    text-align: center;
    margin-top: 20px;
    &-button{
      display: inline-block;
      color: #0288D1;
      padding: 2px 5px;
      text-align: center;
      cursor: pointer;
    }
    &-item{
      display: inline-block;
      padding: 2px 10px;
      text-align: center;
      cursor: pointer;
      margin: 0 10px;
      &:hover{
        background-color: #efefef;
      }
      &-active{
        background-color: #efefef;
      }
    }
  }
</style>
