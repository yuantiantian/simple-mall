<template>
  <div class="navbread">
   <nav>
       <a href="/">主页</a>>
       <slot></slot>
   </nav>
  </div>
</template>

<script>
export default {

}
</script>
<style>
.navbread{
    margin-top: 10px;
    height: 60px;
    background-color: #eee;
    padding-left: 10px;
    margin-left: 50px;
}
.navbread>nav,.navbread>nav>a{
    color: #666;
    line-height: 60px;
    cursor: pointer;
}
.navbread>nav>a:hover{
    color: #ff3333;
}
</style>