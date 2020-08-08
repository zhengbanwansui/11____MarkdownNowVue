<template>
  <div style="width: 300px; margin-left: auto;margin-right: auto">
    <el-form class="form">
      <el-form-item label="用户名">
        <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          v-model="form.passwordAgain"
          placeholder="请再次输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
        passwordAgain: ""
      },
      test: {
        name: "用户名",
        password: "密码"
      }
    };
  },
  methods: {
    onSubmit() {
      if (this.form.password !== this.form.passwordAgain) {
        alert("两次输入密码不一致");
        return;
      }
      console.log("submit!" + this.form.name + this.form.password);
      let This = this;
      this.$axios
        .post(This.$store.state.ip + "/api/registers", {
          name: this.form.name,
          password: this.form.password
        })
        .then(function(response) {
          console.log("success");
          console.log(response);
        })
        .catch(function(error) {
          console.log("error");
          console.log(error);
        })
        .then(function() {
          console.log("请求完毕");
        });
    }
  }
};
</script>

<style scoped></style>
