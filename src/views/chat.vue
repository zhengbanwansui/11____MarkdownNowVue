<template>
  <div style="width: 300px; margin-left: auto;margin-right: auto">
    <div>(测试版本 尚未完善 敬请期待)</div>
    <div class="flexDiv">
      <el-input
        v-model="targetUserName"
        placeholder="请输入对方的用户名"
      ></el-input>
    </div>
    <div class="flexDiv">
      <el-input
        v-model="sendMessage"
        placeholder="请输入发送的消息内容"
      ></el-input>
    </div>
    <div class="flexDiv">
      <el-button type="success" @click="onSend">发送消息</el-button>
    </div>
    <div class="flexDiv">
      <el-button type="success" @click="onRecv">接收消息</el-button>
    </div>
    <el-input
      autosize
      type="textarea"
      placeholder="聊天记录框"
      v-model="area"
      disabled
    >
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      targetUserName: "",
      targetUserId: -1,
      sendMessage: "",
      area: ""
    };
  },
  methods: {
    onSend() {
      if (this.targetUserName === null || this.sendMessage === null) {
        return;
      }
      let This = this;
      let axios = this.$axios;
      this.$axios
        .get(This.$store.state.ip + "/api/user/id/" + this.targetUserName)
        .then(function(response) {
          console.log("success get target Id:" + response.data);
          This.targetUserId = response.data;
          axios
            .post(This.$store.state.ip + "/api/chat", {
              userId: localStorage.getItem("userId"),
              receiveUserId: This.targetUserId,
              text: This.sendMessage
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
              console.log("发送消息完毕");
            });
        })
        .catch(function(error) {
          console.log("error");
          console.log(error);
        })
        .then(function() {
          console.log("收信人id完毕");
        });
    },
    onRecv() {
      let This = this;
      this.$axios
        .get(
          This.$store.state.ip + "/api/chat/" + localStorage.getItem("userId")
        )
        .then(response => {
          console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.area += response.data[i];
            this.area += "\n";
          }
        });
    }
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
