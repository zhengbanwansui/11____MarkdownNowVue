<template>
  <div style="width: 300px; margin-left: auto;margin-right: auto">
    <br />
    <div v-show="!isLogin">
      <div class="flexDiv">
        <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
      </div>
      <div class="flexDiv">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </div>
      <div class="flexDiv">
        <el-button type="success" @click="onSubmit">登录</el-button>
      </div>
    </div>
    <div v-show="isLogin">
      <el-button type="success" @click="onQuit">注销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
        isLogin: false
      }
    };
  },
  methods: {
    async onSubmit() {
      let rt = this.$router;
      this.$axios.all([this.getToken(), this.getUserId()]).then(
        this.$axios.spread(function(token, userId) {
          if (token.data.length === 32) {
            localStorage.setItem("token", token.data);
            localStorage.setItem("userId", userId.data);
            console.log("登陆成功，刷新页面");
            rt.go(0);
          } else {
            console.log("Token为空，登录失败");
          }
        })
      );
    },
    async getToken() {
      let This = this;
      return this.$axios.get(
        This.$store.state.ip +
          "/api/tokens?" +
          "name=" +
          this.form.name +
          "&password=" +
          this.form.password
      );
    },
    async getUserId() {
      let This = this;
      return this.$axios.get(
        This.$store.state.ip + "/api/user/id/" + this.form.name
      );
    },
    onQuit() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      this.isLogin = false;
      this.$router.go(0);
    }
  },
  created() {
    this.isLogin =
      localStorage.getItem("token") != null &&
      localStorage.getItem("userId") != null;
  }
};
</script>
<style scoped>
.flexDiv {
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
