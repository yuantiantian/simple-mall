<template>
  <div> 
    <nav-header></nav-header>
    <nav-bread>
        <span>我的地址</span>
    </nav-bread>
    <div class="ad">
      <div class="ad_header">
        <ul>
          <li>Confirm Address</li>
          <li>View Your Order</li>
          <li>Make Payment</li>
          <li>Order Confirmation</li>
        </ul>
      </div>
      <div class="ad_address">
        <p>SHIPPING ADDRESS</p>
        <ul v-for="(item,index) in addressListFilter" v-bind:class="{'check':checkIndex==index}" @click="checkIndex=index,selectedAddressId=item.addressId" >
          <li>{{item.userName}}</li>
          <li>{{item.streetName}}</li>
          <li>{{item.tel}}</li>
          <li v-if="item.isDefault">默认地址<span></span></li>
          <li v-if="!item.isDefault" class="setDef" @click="setDefault(item.addressId)">设为默认</li>
          <li @click="deleteAddress(item.addressId)"><span>×</span></li>
        </ul>
        <ul class="ad_add">
            <li>+</li><p>Add new address</p>
          </ul>
      </div>
      <div class="ad_more" @click="expend">more</div>
      <div class="ad_method">
          <p>SHIPPING METHOD</p>
          <ul>
            <li>Standard shipping</li>
            <li>Free</li>
            <li>Once shipped，Order should arrive in the destination in 1-7 business days</li>
          </ul>
      </div>
      <div class="ad_footer">
        <router-link :to="{path:'orderConfirm',query:{'addressId':selectedAddressId}}" class="next">NEXT</router-link>
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
          limit:3,
          addressList:[],
          checkIndex:0,
          selectedAddressId:''
        }
    },
    components:{
        NavHeader,
        NavFooter,
        NavBread
    },
    mounted(){
      this.init()
    },
    computed:{
      addressListFilter(){
        return this.addressList.slice(0,this.limit);
      }
    },
    methods:{
      init(){
        axios.get("/users/addressList").then((response)=>{
            let res = response.data;
            this.addressList = res.result;
        });
      },
      expend(){
        if(this.limit==3){
          this.limit = this.addressList.length;
        }else{
          this.limit = 3;
        }
      },
      setDefault(addressId){
        axios.post("/users/setDefault",{
          addressId:addressId
        }).then((response)=>{
          let res = response.data;
          if(res.status =  '0'){
            console.log("set Default");
            this.init();
          }
        })
      },
      deleteAddress(addressId){
        axios.post("users/delAddress",{
          addressId:addressId
        }).then((response)=>{
          let res = response.data;
          if(res.status == '0'){
            alert("删除成功");
            this.init();
          }
        })
      },
    }
  }
</script>

<style>
  .ad{
    width: 85%;
    margin: 0 auto;
  }
  .ad .ad_header{
    height: 150px;
    /* background-color: red;; */
  }
  .ad .ad_header ul{
    width: 100%;
  }
  .ad .ad_header ul li{
    width: 25%;
    float: left;
    line-height: 150px;
    text-align: center;
    height: 95px;
    color: #999;
    border-bottom: 2px solid #999;
    position: relative;
  }
  .ad .ad_header ul li::after{
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
  .ad .ad_header ul li:first-child{
    color: #d1434a;
    border-bottom: 2px solid #d1434a;
  }
  .ad .ad_header ul li:first-child:after{
    background-color:#d1434a;
  }
  .ad .ad_address{
    width: 100%;
  }
  .ad .ad_address>p,.ad .ad_method p{
    font-size: 16px;
    color:#666;
    font-weight: bolder;
    letter-spacing:5px;
    margin-left: 20px;
    
  }
  .ad .ad_address ul,.ad .ad_method ul{
    width: 21%;
    height: 200px;
    background-color: #fff;
    border: 2px solid #ddd;
    margin: 10px 1%;
    float: left;
    cursor: pointer;
  }.ad .ad_address ul:hover{
    border:2px solid orange;

  }
  .ad .ad_address ul li:first-child{
    padding: 20px;
  }
  .ad .ad_address ul li:nth-child(2){
    padding: 10px;
  }
  .ad .ad_address ul li:nth-child(3){
    padding: 20px 10px 20px 10px;
  }
  .ad .ad_address ul li:nth-child(4){
    padding: 10px;
    color:orange;
    display: inline;
  }
  .ad .ad_address ul li:last-child{
    float: right;
    margin-right: 20px;
  }
  .ad .ad_address ul li:last-child span{
      font-size: 20px;
      padding: 10px;
  }
  .ad .ad_address ul li:last-child span:hover{
      color:#ff3333;
      cursor: pointer;
  }
  .ad_add li:first-child{
    text-align: center;
    font-size: 80px;
    font-weight: 100;
    color: #999;
  }
  .ad_add p{
    text-align: center;
    color: #999;
  }
  .ad_more{
    width: 20%;
    height: 40px;
    margin:0 auto;
    clear: both;
    text-align: center;
    line-height: 40px;
    border-bottom: 1px solid orange;
    color: orange;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .ad_more:hover{
    color: red
  }
  .ad .ad_method{
    height: 250px;
  }
  .ad .ad_method ul{
    border:2px solid orange;
  }
  .ad .ad_method ul li:first-child{
    padding: 20px;
  }
  .ad .ad_method ul li:nth-child(2){
    font-weight: bolder;
    margin-left: 20px;
    font-size: 18px
  }
  .ad .ad_method ul li:last-child{
    padding: 20px;
    font-weight: lighter;
  }
  .ad .ad_footer .next{
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
  .ad .ad_footer .next:hover{
    background-color: #ff6666
  }
  .ad .ad_address .check{
    border:2px solid orange;
  }
  .ad>.ad_address>ul>.setDef{
    color: #ddd !important;
  }
  .ad>.ad_address>ul>.setDef:hover{
    color: orange !important;
  }
</style>