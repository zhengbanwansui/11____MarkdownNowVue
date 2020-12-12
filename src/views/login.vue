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
    <el-button @click="alert1"></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: null,
        password: null,
        isLogin: false
      }
    };
  },
  methods: {
    alert1() {
      alert(localStorage.getItem("userId") + " | " + localStorage.getItem("token"));
    },
    async onSubmit() {
      let rt = this.$router;
      let This = this;
      this.$axios.all([this.getToken(), this.getUserId()]).then(
        this.$axios.spread(function(tokenResponse, userIdResponse) {
          if (tokenResponse.data.code === 200) {
            localStorage.setItem("token", tokenResponse.data.data);
            localStorage.setItem("userId", userIdResponse.data);
            This.$message({
              showClose: true,
              message: "登陆成功",
              type: "success"
            });
            rt.go(0);
          } else {
            This.$message({
              showClose: true,
              message: tokenResponse.data.msg,
              type: "error"
            });
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
