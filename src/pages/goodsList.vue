<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>商品列表</span>
    </nav-bread>
    <div class="filter-nav">
      <span>排序</span>
      <a href="javascript:void(0)">默认</a>
      <a href="javascript:void(0)" @click="sortGoods()">价格<span v-if="price_icon">&nbsp;↓</span><span v-if="!price_icon">&nbsp;↑</span></a>
      
    </div>
    <div class="pricearea">
      <dl>
        <dt>P r i c e</dt>
        <dd><span  v-bind:class="{'cur':priceCheck == 'All'}" @click="setPriceFilter('All')">&nbsp;&nbsp;All</span></dd>
        <dd v-for="(price,index) in priceArea">
          <span v-bind:class="{'cur':priceCheck == index}" @click="setPriceFilter(index)">&nbsp;&nbsp;{{price.priceStart}}-{{price.priceEnd}}</span>
        </dd>
      </dl>
    </div>
    <div class="goodslist">
      <ul>
        <li v-for="(item,index) in goodsList">
          <div>
            <a href="javascript:void(0)">
              <img v-lazy="'../../static/'+item.productImage" alt="prouductImg">
            </a>
          </div>
          <div class="main">
              <div class="goodsname" v-text="item.productName"></div>
              <div class="goodsprice" v-text="'￥'+item.salePrice"></div>
              <div class="addtoshop" @click="addCart(item.productId)"><a href="javascript:void(0)">加入购物车</a></div>
          </div>
        </li>
      </ul>
      <div class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
        <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
      </div>
      <div class="overlay" v-if="OrGoCart">
        <div class="alert">
          <p>加入购物车成功~</p>
          <button @click="OrGoCart=false">继续购物</button><button @click="goToCart">查看购物车</button>
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
export default {
    data(){
      return{
        price_icon:true,
        goodsList:[],
        sortFlag:true,
        page:1,
        pageSize:8,
        busy:true,
        loading:false,
        priceArea:[
          {
            priceStart:'0.00',
            priceEnd:'100.00'
          },
          {
            priceStart:'100.00',
            priceEnd:'500.00'
          },
          {
            priceStart:'500.00',
            priceEnd:'1000.00'
          },
          {
            priceStart:'1000.00',
            priceEnd:'5000.00'
          }
        ],
        priceCheck:'All',
        cartShowsec:false,  
        OrGoCart:false,
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted:function(){
      this.getGoodsList(false);
    },
    methods:{
      getGoodsList(flag){
        console.log("调用了getGoodsList方法");
        var param = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceCheck
        }
        this.loading = true;
        axios.get("/goods/list",{
          params:param
        }).then((result)=>{
          var res=result.data;
          this.loading = false;
          if(res.status=='0'){
            if(flag){
              this.goodsList = this.goodsList.concat(res.result.list);
              if(res.result.count==0){
                this.busy=true;
              }else{
                this.busy=false;
              }
            } else{
               this.goodsList = res.result.list;
               this.busy=false;
            }
          }else{
            this.goodsList=[];
          }
        })
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.price_icon = !this.price_icon;
        this.page = 1;
        this.getGoodsList();
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
                  this.page++;
                  this.getGoodsList(true);
                }, 500);
      },
      setPriceFilter(index){
        this.priceCheck = index;
        this.page = 1;
        this.getGoodsList();
      },
      addCart(productId){
        axios.post("/goods/addCart",{
          productId:productId
        }).then((response) => {
          let res = response.data;
          if(res.status=="0"){
            this.OrGoCart=true;
            this.$store.commit("updateCartCount",1);
          }else{
            alert('添加失败:'+res.msg);
          }
        })
      },
      goToCart(){
        this.$router.push({
          path:"/cart"
        });
      },
      
    }
   
}
</script>

<style>
  .filter-nav{
    text-align: right;
    margin-right: 370px;
    padding-top: 50px;
    padding-bottom: 10px;
    color: #666;
  }
  .filter-nav>a{
    padding-left: 8px;
    color: #666;
  }
  .filter-nav>a:hover{
    color:#000;
  }
  .pricearea{
    width: 20%;
    height: 500px;
    float: left;
    color: #666;
    background-color: #fcfcfc;
    margin-top: 10px;
    margin-left: 10px;
  }
  .pricearea>dl{
    margin-left: 50px;
    margin-top: 20px;
  }
  .pricearea>dl>dt{
    font-size: 18px;
  }
  .pricearea>dl>dd{
    margin-top: 10px;
    height: 35px;
    line-height: 35px;
  }
  .pricearea>dl>dd>span{
    display: block;
    height: 100%;
    width:150px;
    font-size: 14px;
    transition:margin-left 0.5s;
    cursor: pointer;
  }
  .pricearea>dl>dd>span:hover{
    margin-left: 20px;
    color: orange;
  }
  /* 价格区域被选中 */
  .pricearea>dl>dd>.cur{
    border-left:3px solid orange;
    color: orange;
  }
  .goodslist{
    width: 60%;
    margin: 0 auto;
    float: left;
  }
  .goodslist ul{
    padding-bottom: 50px;
  }
  .goodslist ul::after{
    clear: both;
    content: '';
    height:0px;
    display: block;
  }
  .goodslist li{
    width: 200px;
    height: 300px;
    float: left;
    border:1px solid #fff;
    margin-top: 10px;
    margin-left: 15px;
    text-align: center;
    background-color: #fff; 
    box-shadow: 5px 5px 5px #ccc;
  }
  .goodslist li:hover{
     border:1px solid orange;
  }
  .goodslist>ul>li>div>a>img{
    width: 150px;
    height: 150px;
  }
  .goodslist .main .goodsname{
    padding: 15px;
    color: rgba(255,0,0,.7);
    font-weight: bold;
    text-align: left;
  }
  .goodslist .main .goodsprice{
    text-align: left;
    padding-left: 15px;
    padding-top: 5px;
    color:#666;
  }
  .goodslist .main .addtoshop{
    padding: 5px;
    border: 1px solid #666;
    width:170px;
    margin: 0 auto;
    margin-top: 15px; 
    box-shadow: 2px 2px 2px #ccc;
    transition:margin-top 0.2s;
  }
  .goodslist .main .addtoshop:hover{
    cursor: pointer;
    margin-top: 12px; 
  }
  .goodslist .main .addtoshop a{
    color: red;
    font-size: 14px;
  }
  .view-more-normal{
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  /* 购物车弹窗 */
  .overlay{
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.6);
    position: fixed;
    top:0;left:0;
}
.overlay .alert{
    width: 500px;
    height: 250px;
    border:1px solid #666;
    background-color: #fff;
    position: absolute;
    left:0;right:0;top: 0;bottom: 0;
    margin: auto;
}
.overlay .alert p{
  text-align: center;
  margin-top: 50px;
  font-size: 20px;
  font-weight: lighter;
  color:#666;
}
.overlay .alert button{
  width: 170px;
  height: 30px;
  border:1px solid red;
  background-color: #fff;
  color: red;
  margin-left: 50px;
  margin-top: 50px;
  cursor: pointer;
  transition: font-size 0.5s;
}
.overlay .alert button:hover{
  font-size: 14px;
}
</style>


