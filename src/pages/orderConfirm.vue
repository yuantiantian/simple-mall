<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>订单确认</span>
        </nav-bread>
        <div class="confirm">
            <div class="confirm_header">
                <ul>
                    <li>Confirm Address</li>
                    <li>View Your Order</li>
                    <li>Make Payment</li>
                    <li>Order Confirmation</li>
                </ul>
            </div>
            <div class="confirm_content">
                <p>ORDER CONTENT</p>
                <div class="confirm_content_title">
                    <span>ORDER CONTENTS</span>
                    <span>PRICE</span>
                    <span>QUANTITY</span>
                    <span>SUBTOTAL</span>
                </div>
                <ul v-for="item in cartList" v-if="item.checked==1">
                    <li><img :src="'../../static/'+item.productImage" alt="">{{item.productName}}</li>
                    <li>${{item.salePrice}}</li>
                    <li>{{item.productNum}}</li>
                    <li>${{item.salePrice*item.productNum}}</li>
                </ul>
            </div>
            <div class="confirm_sum">
                <ul>
                    <li><p>总金额:</p><span>${{subTotal}}</span></li>
                    <li><p>配送费:</p><span>${{shipping}}</span></li>
                    <li><p>折扣:</p><span>${{discount}}</span></li>
                    <li><p>税费:</p><span>${{tax}}</span></li>
                    <li><p>需付款:</p><span>${{orderTotal}}</span></li>
                </ul>
            </div>
            <div class="confirm_footer">
                <router-link to="/address" class="confirm_previous">PREVIOUS</router-link>
                <span class="confirm_next" @click="payMent">NEXT</span>
            </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import axios from 'axios'
    export default{
        data(){
            return{
                cartList:[],
                shipping:100,
                discount:200,
                tax:400,
                orderTotal:0,
                subTotal:0,
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
        methods:{
            init(){
                axios.get("users/cartList").then((response)=>{
                    let res = response.data;
                    this.cartList = res.result;

                    this.cartList.forEach((item)=>{
                        if(item.checked=='1'){
                            this.subTotal += item.salePrice*item.productNum;
                        }
                    });

                    this.orderTotal = this.subTotal+this.shipping-this.discount+this.tax;
                })
            },
            payMent(){
                var addressId = this.$route.query.addressId;
                axios.post("/users/payMent",{
                  addressId:addressId,
                  orderTotal:this.orderTotal
                }).then((response)=>{
                    let res = response.data;
                    if(res.status=="0"){
                        this.$router.push({
                            path:'/orderSuccess?orderId='+res.result.orderId
                        })
                    }
                })
            }
        }
    }
</script>
<style>
    .confirm{
        width: 85%;
        margin: 0 auto;
    }
    .confirm .confirm_header{
        height: 150px;
        /* background-color: red;; */
    }
    .confirm .confirm_header ul{
        width: 100%;
    }
    .confirm .confirm_header ul li{
        width: 25%;
        float: left;
        line-height: 150px;
        text-align: center;
        height: 95px;
        color: #999;
        border-bottom: 2px solid #999;
        position: relative;
    }
    .confirm .confirm_header ul li::after{
        content: '';
        width:14px;
        height: 14px;
        border-radius: 14px;
        background-color:#999;
        display: block;
        position: absolute;
        top:88px;
        left:47%;
    }
    .confirm .confirm_header ul li:first-child,.confirm .confirm_header ul li:nth-child(2){
        color: #d1434a;
        border-bottom: 2px solid #d1434a;
    }
    .confirm .confirm_header ul li:first-child:after,.confirm .confirm_header ul li:nth-child(2):after{
        background-color:#d1434a;
    }
    .confirm .confirm_address{
    width: 100%;
    }
    .confirm .confirm_content>p{
        font-size: 16px;
        color:#666;
        font-weight: bolder;
        letter-spacing:5px;
        margin-left: 20px;  
    }
    .confirm_content_title{
        width: 100%;
        height: 50px;
        background-color: #444;
        margin-top: 20px;
        color: #fff;
        font-size: 20px;
        line-height: 50px;
    }
    .confirm_content_title>span:nth-child(1),.confirm .confirm_content>ul>li:first-child{
        width: 40%;
        text-align: center;
    }
    .confirm_content_title>span{
        display: block;
        width: 18%;
        height: 50px;
        float: left;
        text-align: right;
        margin-right: 20px;
    }
    .confirm .confirm_content>ul{
        width:100%;
        height: 150px;
        background-color: #fff;
        margin-top: 15px;
    }
    .confirm .confirm_content>ul>li>img{
        width: 120px;
        height: 120px;
        vertical-align: middle;
    }
    .confirm .confirm_content>ul>li{
        line-height: 150px;
        display: block;
        width: 18%;
        height: 150px;
        float: left;
        text-align: right;
        margin-right: 20px;
    }
    .confirm .confirm_content>ul>li:last-child{
        font-size: 18px;
        color: red;
        font-weight: bolder;
    }
    .confirm .confirm_sum{
        width: 100%;
        height: 300px;
    }
    .confirm .confirm_sum>ul{
        float: right;
        margin-top: 20px;
        margin-bottom: 20px;
        
    }
    .confirm .confirm_sum>ul>li>p{
        text-align: right;
        color: #666;
        font-size: 18px;
        margin-top: 15px;
        width: 200px;
        height: 30px;
        display: inline-block
    }
    .confirm .confirm_sum>ul>li>span{
        text-align: right;
        width: 150px;
        height: 30px;
        display: inline-block;
        margin-right: 20px;
    }
    .confirm .confirm_sum>ul>li:last-child>span{
        color: red;
        font-size: 20px;
        font-weight: bolder;
    }
    .confirm .confirm_footer .confirm_next{
        display: block;
        width: 200px;
        height: 50px;
        background-color: #d1434a;
        color: #fff;
        line-height: 50px;
        text-align: center;
        letter-spacing: 2px;
        float: right;
        margin-right: 20px;
        margin-bottom: 50px;
        cursor: pointer;
    }
    .confirm .confirm_footer .confirm_next:hover{
    background-color: #ff6666
  }
  .confirm .confirm_footer .confirm_previous{
        display: block;
        width: 200px;
        height: 50px;
        color: #ff6666;
        border: 1px solid #ff6666;
        line-height: 50px;
        text-align: center;
        letter-spacing: 2px;
        float: left;
        margin-left: 20px;
        margin-bottom: 50px;
        cursor: pointer;
    }
    .confirm .confirm_footer .confirm_previous:hover{
        color: red;
        background-color:rgba(255, 0, 0, .1);
    }
</style>