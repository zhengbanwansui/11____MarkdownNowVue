<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">博客大厅</router-link> |
      <router-link to="/login">登录</router-link> |
      <router-link to="/register">注册</router-link> |
      <router-link to="/personal">个人中心</router-link>
    </div>
    <div style="width: 100%; height: 80px;">
      &nbsp;
    </div>
    <router-view style="z-index: 999;" />
  </div>
</template>
<script></script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding-top: 30px;
  position: fixed;
  margin: 0 auto;
  height: 50px;
  width: 100%;
  background-color: white;
  /* "mavon-editor"的层级在1000-2000，所以为让顶栏在其上面就要设置大一点的z-index */
  z-index: 2000;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
0
