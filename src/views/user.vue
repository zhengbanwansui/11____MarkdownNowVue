<template>
  <div>
    <h4>用户详细信息</h4>
    <div style="text-align: center; width: 300px;margin: 0 auto">
      <el-avatar
        :size="100"
        fit="cover"
        :src="getAvatarUrl"
      ></el-avatar>
      <br />
      用户名：<el-input v-model="userData.name" disabled></el-input>
      积分：<el-input v-model="userData.point" disabled></el-input>
      是否为管理员：<el-input v-model="isAdminComputed" disabled></el-input>
      电子邮箱：<el-input v-model="userData.email" clearable></el-input>
      个性签名：<el-input v-model="userData.sign" clearable></el-input>
      个人简介：<el-input v-model="userData.info" clearable></el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      userData: {
        name: "",
        isAdmin: null,
        point: null,
        email: null,
        sign: null,
        info: null
      },
      avatarUrl:
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3531761125,3665413676&fm=26&gp=0.jpg"
    };
  },
  created() {
    this.getUserDetails();
    this.getCurrentAvatar();
  },
  methods: {
    getUserDetails() {
      this.$axios
        .get(this.$store.state.ip + "/api/user/" + this.$route.params.id)
        .then(response => {
          console.log("用户信息详情");
          console.log(response.data);
          this.userData = response.data;
        })
        .catch(error => console.log(error));
    },
    getCurrentAvatar() {
      let ip = this.$store.state.minioAddress;
      this.$axios
        .get(
          this.$store.state.ip + "/api/avatars/current/" + this.$route.params.id
        )
        .then(response => {
          console.log(response.data);
          this.avatarUrl = ip + "/avatar/" + response.data["fileName"];
          console.log(this.avatarUrl);
        })
        .catch(error => console.log(error));
    }
  },
  computed: {
    getAvatarUrl() {
      return this.avatarUrl;
    },
    isAdminComputed: function() {
      if (this.userData.isAdmin === 1) {
        return "是";
      }
      if (this.userData.isAdmin === 0) {
        return "否";
      }
      return "";
    }
  }
};
</script>

<style scoped></style>
