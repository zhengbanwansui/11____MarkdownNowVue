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
        <el-button type="success" @click="securityLogin"
          >登录</el-button
        >
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
    securityLogin() {
      if (
        this.form.name === null ||
        this.form.name === "" ||
        this.form.password === null ||
        this.form.password === ""
      ) {
        this.$message({
          showClose: true,
          message: "用户名或密码不能为空",
          type: "error"
        });
        return;
      }
      // 用户名密码不为空时请求security的登录接口
      let data =
        "username=" + this.form.name + "&password=" + this.form.password;
      let rt = this.$router;
      this.$axios({
        url: this.$store.state.ip + "/auth/login",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        if (response.data.data === "登录失败") {
          this.$message({
            showClose: true,
            message: "登录失败",
            type: "error"
          });
        } else {
          let jwt = response.data.data;
          localStorage.setItem("token", jwt);
          let stringArr = jwt.split(".");
          let payload = stringArr[1];
          let Base64 = require("js-base64").Base64;
          let decodePayload = Base64.decode(payload);
          console.log("载荷：" + decodePayload);
          let result = JSON.parse(decodePayload);
          localStorage.setItem("userId", result["id"]);
          this.$message({
            showClose: true,
            message: "登陆成功",
            type: "success"
          });
          rt.go(0);
        }
      });
    },
    alert1() {
      alert(
        localStorage.getItem("userId") + " | " + localStorage.getItem("token")
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
