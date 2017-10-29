<template>
  <div class="login">
    <div class="login-header">
        <h1 class="login-header-title">博客后台登录</h1>
    </div>
    <div class="login-item">
        <input type="text" placeholder="用户名" v-model="username" >
    </div>
    <div class="login-item">
        <input type="password" placeholder="密码" v-model="password" @keyup.enter="login">
    </div>
    <div class="login-item">
        <button @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import md5 from 'md5';
export default {
    name: "login",
    data(){
        return {
            username: "",
            password: ""
        }
    },
    methods:{
        login(){
            let info = {
                username: this.username,
                password: md5(this.password).toUpperCase()
            }
            this.$store.dispatch("CREATE_TOKEN", info).then((res) => {
                if(res.data.success){
                    //登录成功后跳转到首页
                    this.$router.push("/admin");
                }
            }).catch((err) => {
                this.$message.error(err.response.data.error);
            });
        }
    }
}
</script>

<style lang="less" scoped>
    .login{
        max-width: 640px;
        margin: 150px auto 0 auto;
        &-header{
            margin: 0 auto 50px auto;
            text-align: center;
        }
        &-item{
            margin-bottom: 10px;
            padding: 0 10px;
            input{
                display: block;
                margin: 0 auto;
                width: 300px;
                height: 40px;
                border: 1px solid #888;
                text-indent: 10px;
            }
            button{
                display: block;
                margin: 0 auto;
                width: 300px;
                height: 50px;
                margin: 20px auto;
                color: white;
                background-color: #0E639C;
                border-radius: 5px;
                border: 0;
                cursor: pointer;
            }
        }
    }
</style>
