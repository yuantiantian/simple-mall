import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '../pages/goodsList'
import Cart from '../pages/cart'
import Address from '../pages/address'
import OrderConfirm from '../pages/orderConfirm'
import OrderSuccess from '../pages/orderSuccess'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'goodsList',
      component:GoodsList
    },
    {
      path:'/cart',
      name:'cart',
      component:Cart
    },
    {
      path: '/address',
      name: 'address',
      component:Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component:OrderConfirm
    },
    {
      path:'/orderSuccess',
      name:'orderSuccess',
      component:OrderSuccess
    },
  ]
})
