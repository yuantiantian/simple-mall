<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>我的购物车</span>
        </nav-bread>
        <div class="myCart">
            <p class="myCart_p">MY CART</p>
            <ul class="cart_title">
                <li>ITEM</li>
                <li>PRICE</li>
                <li>QUANTITY</li>
                <li>SUBTOTAL</li>
                <li>DELETE</li>
            </ul>
            <ul class="cart_content" v-for="item in cartList">
                <li><label><input type="checkbox" v-bind:checked="item.checked=='1'?true:false" @click="editCart('checked',item)"><img v-bind:src="'../../static/'+item.productImage" v-bind:alt="item.productName"><span>{{item.productName}}</span></label></li>
                <li v-text="item.salePrice"></li>
                <li>
                    <span @click="editCart('sub',item)" class="cart_sub">-</span>
                    <span>{{item.productNum}}</span>
                    <span @click="editCart('add',item)" class="cart_add">+</span>
                </li>
                <li>{{item.productNum*item.salePrice}}</li>
                <li><span @click="delCart(item.productId)">×</span></li>
            </ul>
            <div class="cart_footer">
                <div class="cart_footer_left">
                    <label><input type="checkbox" @click="checkedAll" v-bind:checked="isCheckedAll">全选</label>  <span>删除</span>
                </div>
                <div class="cart_footer_right">
                    <span>总价:<b>{{AllPrice}}</b></span>
                    <a @click="checkOut()" v-bind:class="checkedCount ==0 ?'noSubmit':''">结&nbsp;&nbsp;&nbsp;&nbsp;算</a>
                </div>
            </div>
        </div> 
        <nav-footer></nav-footer>
    </div>
   
</template>

<script>
import NavHeader from '../components/navHeader'
import NavFooter from '../components/navFooter'
import NavBread from '../components/navBread'
import axios from 'axios'
export default{
    data(){
        return{
            cartList:[],
            isCheckedAll:false
        }
    },
    components:{
        NavHeader,
        NavFooter,
        NavBread
    },
    mounted(){
        this.init();
       
    },
    computed:{
        checkedCount(){
            var i = 0;
            this.cartList.forEach((item)=>{
              if(item.checked=='1')i++;
            })
            return i;
        },
        AllPrice(){
            var money = 0;
            this.cartList.forEach((item)=>{
              if(item.checked=='1'){
                money += parseFloat(item.salePrice)*parseInt(item.productNum);
              }
            })
            return money;
        }
    },
    methods:{
        init(){
            axios.get("/users/cartList").then((response)=>{
                let res = response.data;
                this.cartList = res.result;
            });
        },
        delCart(id){
            axios.post("/users/cartDel",{
                productId:id
            }).then((response)=>{
                let res = response.data;
                var delCount = parseInt(res.result);
                this.$store.commit("updateCartCount",-delCount);
                if(res.status=='0'){
                    this.init();
                }
            })
        },
        editCart(flag,item){
            if(flag=="add"){
                item.productNum++;
                this.$store.commit("updateCartCount",1);
            }else if(flag=='sub'){
                if(item.productNum>1){
                    item.productNum--;
                    this.$store.commit("updateCartCount",-1);
                }
            }else{
                item.checked = item.checked=="1"?'0':'1';
            }
            axios.post("/users/cartEdit",{
                checked:item.checked,
                productId:item.productId,
                productNum:item.productNum
            }).then((response)=>{
                let res = response.data;
            })
        },
        checkedAll(){
            var flag = this.checkedCount == this.cartList.length ? '0' : '1';
            if(flag==1){
                this.isCheckedAll = true;
            }else{
                this.isCheckedAll = false;
            }
            axios.post("/users/editCheckedAll",{
                checkedAll:flag
            }).then((response)=>{
                let res = response.data;
                if(res.status=='0'){
                    this.init();
                }
            })
        },
        checkOut(){
            if(this.checkedCount>0){
                this.$router.push({
                    path:"/address"
                });
            }
        }
    }
}
</script>

<style>
body{
    background-color: #eee;
}
.myCart{
    width: 100%;
    height: 800px;
    margin-bottom: 50px;
}
.myCart .myCart_p{
    font-size: 25px;
    padding: 10px 0 20px 50px;
}
.cart_title{
    width: 95%;
    height: 50px;
    margin: 0 auto;
    background-color: #444; 
}
.cart_title li{
    float: left;
    font-size: 20px;
    line-height: 50px;
    color: #eee;
    width:20%;
    height: 50px;
    text-align: center;
}
.cart_content{
    width: 95%;
    height: 150px;
    margin: 0 auto;
    background-color: #fff;
    margin-top: 10px;
}
.cart_content li{
    float: left;
    vertical-align:middle;
    width:20%;
    height: 150px;
    text-align: center;
    line-height: 150px;
    white-space: nowrap; 
}
.cart_content li:nth-child(2),.cart_content li:nth-child(4){
    color: #ff3333;
}
.cart_content li:last-child span{
    font-size: 25px;
    padding: 10px;
    transition: font-size 0.5s;
}
.cart_content li:last-child span:hover{
    color:#ff3333;
    font-size: 20px;
    cursor: pointer;
}
.cart_content li input{
    margin-right: 30px;
    margin-left: 80px;
    width: 18px;
    height: 18px;
}
.cart_content li img{
    width: 100px;
    vertical-align: middle;
}
.cart_content li .cart_sub{
    padding: 2px 10px;
    cursor: pointer;
    margin-right: 3px;
    background-color: #eee;
    transition: background-color 0.5s;
}
.cart_content li .cart_add{
    padding: 2px 8px;
    cursor: pointer;
    margin-left: 3px;
    background-color: #eee;
}
.cart_content li .cart_sub:hover,.cart_content li .cart_add:hover{
    background-color: #ccc;
    color:#000;
}
.cart_footer{
    width: 95%;
    height: 50px;
    margin: 0 auto;
    background-color: #fff;
    margin-top: 20px;
}
.cart_footer_left,.cart_footer_right{
    width: 50%;
    height: 50px;
    float: left;
    color: #666;
    line-height: 50px;
    font-size: 16px;
}
.cart_footer_left input{
    margin-left: 50px;
    width: 18px;
    height: 18px;
    vertical-align:middle;
}
.cart_footer_left span{
    margin-left: 20px;
}
.cart_footer_right span{
   margin-left: 450px;
}
.cart_footer_right b{
    color: #ff3333;
    font-size: 24px;
    margin-left: 10px;
}
.cart_footer_right a{
    display: block;
    float: right;
    width: 150px;
    height: 50px;
    border:none;
    background-color: #ff3333;
    color: #eee;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
}
.cart_footer_right a:hover{
    background-color: #ff6666;
}
.cart_footer_right .noSubmit{
    background-color: #999;
    z-index:2;
}
.cart_footer_right .noSubmit:hover{
    background-color: #999;
}
</style>