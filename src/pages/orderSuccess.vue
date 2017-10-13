<template>
    <div>
        <nav-header></nav-header>
        <div class="suc">
            <div class="suc_header">
                <ul>
                    <li>Confirm Address</li>
                    <li>View Your Order</li>
                    <li>Make Payment</li>
                    <li>Order Confirmation</li>
                </ul>
            </div>
            <div class="suc_content">
                <img src="../../static/ok-2.png" alt="suc">
                <p class="gxi">恭喜!</p> 
                <p>你的订单创建成功!</p>  
                <p class="suc_orderid">订单号：{{orderId}}<span>总金额：{{orderTotal}}</span></p>
                <router-link to="/cart" class="suc_btn">查看购物车</router-link><router-link class="suc_btn" to="/">返回首页</router-link>   
            </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import axios from 'axios'
    export default{
        data(){
            return{
                orderId:'',
                orderTotal:0
            }
        },
        components:{
            NavHeader,
            NavFooter
        },
        mounted(){
            var orderId = this.$route.query.orderId;
            console.log("orderId:"+orderId);
            if(!orderId){
              return;
            }
            axios.get("/users/orderDetail",{
                params:{
                  orderId:orderId
                }
            }).then((response)=>{
                let res = response.data;
                if(res.status=='0'){
                    this.orderId = orderId;
                    this.orderTotal = res.result.orderTotal;
                }
            });
        },
    }
</script>

<style>
    .suc{
        width: 85%;
        margin: 0 auto;
    }
    .suc .suc_header{
        height: 150px;
    }
    .suc .suc_header ul{
        width: 100%;
    }
    .suc .suc_header ul li{
        width: 25%;
        float: left;
        line-height: 150px;
        text-align: center;
        height: 95px;
        color: #d1434a;
        border-bottom: 2px solid #d1434a;
        position: relative;
    }
    .suc .suc_header ul li::after{
        content: '';
        width:14px;
        height: 14px;
        border-radius: 14px;
        background-color:#d1434a;
        display: block;
        position: absolute;
        top:88px;
        left:47%;
    }
    .suc .suc_content{
        width: 600px;
        height: 500px;
        margin: 40px auto;

    }
    .suc .suc_content img{
        width: 180px;
        margin-left: 210px;
    }
    .suc .suc_content p{
        text-align: center;
        font-size: 22px;
        font-weight: lighter;
    }
    .suc .suc_content .gxi{
        margin-top: 50px;
    }
    .suc .suc_content .suc_orderid{
        font-size: 18px;
        margin-top: 20px;
        color: #666; 
    }
    .suc .suc_content .suc_orderid>span{
        margin-left: 20px;
    }
    .suc .suc_content .suc_btn{
        display: block;
        width: 200px;
        height: 40px;
        color: #ff6666;
        border: 1px solid #ff6666;
        line-height: 40px;
        text-align: center;
        letter-spacing: 2px;
        float: left;
        margin-left: 60px;
        margin-top: 20px;
        cursor: pointer;
    }
    .suc .suc_content .suc_btn:hover{
        color: red;
        background-color:rgba(255, 0, 0, .1);
    }
</style>