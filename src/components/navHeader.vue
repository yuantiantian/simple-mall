<template>
    <header>
        <div class="navheader">
            <img src="../assets/images/logo.jpg" alt="logo" class="logo">
            <ul>
                <li @click="loginModalFlag=true" v-if="!nickName">登录</li>
                <li v-if="nickName" v-text="nickName"></li>
                <li @click="logout" v-if="nickName">退出</li>
                <li><router-link to="/cart"><img src="../assets/images/shop.png" alt="shop" class="shop"></router-link><span>{{cartCount}}</span></li>
            </ul>
        </div>
        <div class="overlay" v-if="loginModalFlag">
            <div class="login_content">
                <div class="login_title">LOGIN</div>
                <div class="login_input">
                    <span class="no_login" @click="loginModalFlag=false">×</span>
                    <ul>
                        <li><input type="text" placeholder="admin" v-model="userName"></li>
                        <li><input type="password" placeholder="password" v-model="userPwd" @keyup.enter="login"><p class="err_login" v-if="errTip">用户名或密码输入错误！</p></li>
                        <li><input type="button" value="登   录" class="btn_login" @click="login"></li>
                    </ul>
                </div>
            </div>
        </div>
    </header> 
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            userName:'admin',
            userPwd:'',
            errTip:false,
            loginModalFlag:false
        }
    },
    computed:{
        nickName(){
            return this.$store.state.nickName;
        },
        cartCount(){
            return this.$store.state.cartCount;
        }
    },
    mounted(){
        this.checkLogin();
        this.getCartCount();
    },
    methods:{
        checkLogin(){
            axios.get("/users/checkLogin").then((response)=>{
                let res = response.data;
                var path = this.$route.pathname;
                if(res.status=="0"){
                    this.$store.commit("updateUserInfo",res.result);
                    this.loginModalFlag = false;
                }else{
                    if(this.$route.path!="/"){
                        this.$router.push("/");
                    }
                }
            })
        },
        login(){
            if(!this.userName || !this.userPwd){
              this.errTip = true;
              return;
            }
            axios.post("/users/login",{
              userName:this.userName,
              userPwd:this.userPwd
            }).then((response)=>{
                let res = response.data;
                console.log(res.status)
                if(res.status=="0"){
                  this.errTip = false;
                  this.loginModalFlag = false;
                  this.$store.commit("updateUserInfo",res.result.userName);
                  this.getCartCount();
                }else{
                  this.errTip = true;
                }
            });
        },
        logout(){
            axios.post("/users/logout").then((response)=>{
                let res = response.data;
                if(res.status=="0"){
                    this.$store.commit("updateUserInfo",'');
                }
            })
        },
        getCartCount(){
            axios.get("/users/getCartCount").then((response)=>{
                let res = response.data;
                this.$store.commit("initCartCount",res.result);
            })
        }
    }
}
</script>

<style>
    .navheader{
        width: 100%;
    }
    .logo{
        width: 120px;
        cursor: pointer;
        margin-top: 10px;
        margin-left: 50px;  
    }
    .navheader ul{
        float: right;
        margin-right:50px;
    }
    .navheader ul li{
        float: left;
        width: 80px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
        color:#666;
        
    }
    .navheader ul li:hover{
        color: #000;
        font-size: 18px;
        background-color: #ddd;
    }
    .navheader ul li:last-child{
        position: relative;
    }
    .navheader ul li:last-child span{
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        background-color: #ff6666;
        top: 10px;
        right: 10px;
        text-align: center;
        line-height: 20px;
        color: #fff;
    }
    .shop{
        width: 40px;
        margin-top: 10px;
    }
    .shop:hover{
        width: 45px;
    }
    .overlay{
        width:100%;
        height:100%;
        background-color: rgba(0,0,0,0.6);
        position: fixed;
        top:0;left:0;
        z-index: 10;
    }
    .overlay .login_content{
        width: 500px;
        height: 300px;
        border:1px solid #666;
        background-color: #fff;
        position: absolute;
        left:0;right:0;top: 0;bottom: 0;
        margin: auto;
    }
    .no_login{
        display: block;
        width: 30px;
        height: 30px;
        border: 1px solid #666;
        font-size: 30px;
        text-align: center;
        line-height: 30px;
        color: #666;
        font-weight: lighter;
        position: absolute;
        top: 0;
        right: 0;
        border-top: none;
        border-right: none;
        cursor: pointer;
    }
    .login_title{
        font-size: 40px;
        color: orange;
        text-align: center;
        font-weight: lighter;
    }
    .login_input{
        width: 400px;
        height: 150px;
        margin: 0 auto;
    }
    .login_input li input{
        width:300px;
        height: 35px;
        border-radius: 2px;
        box-shadow: none;
        border: 1px solid #666;
        margin-top: 25px;
        margin-left:50px;
        text-indent: 10px;
    }
    .err_login{
        font-size: 12px;
        color: red;
        margin-left:50px;
    }
    .btn_login{
        color: #333;
        -webkit-transition: color  0.5s,background-color 0.5s;
        -moz-transition: color  0.5,sbackground-color 0.5s;
        transition: color  0.5s,background-color 0.5s;
    }
    .btn_login:hover{
        background-color: #D2691E;
        cursor: pointer;
        color: #eee;
    }
</style>