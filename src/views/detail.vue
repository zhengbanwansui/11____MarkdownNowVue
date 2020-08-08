<template>
  <div>
    <h1 style="font-size: 40px; padding: 20px 0">{{ this.blog.title }}</h1>
    <div class="mdShow">
      <div class="h3Father">
        <h3>
          作者：{{ this.blog["authorName"] }}
          <br />
          发布日期：{{ this.blog["createTime"] }}
          <br />
          最近修改：{{ this.blog["changeTime"] }}
        </h3>
      </div>
      <mavon-editor
        :value="blog.text"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :scrollStyle="true"
      />
    </div>
    <el-divider></el-divider>
    <div class="commentArea">
      <div style="display: flex;">
        <el-input type="text" v-model="myComment"></el-input>
        <el-button type="success" @click="addComment">发送评论</el-button>
      </div>
      <div style="margin: 30px" v-for="item in commentList" :key="item.id">
        <p class="commentContent">
          <span class="commentName">{{ item["commentUserName"] }}</span>
          :
          {{ item["content"] }}
          <el-button
            @click="deleteMyComment(item.id)"
            v-if="showDeleteButton(item.commentUserId)"
            type="text"
            style="margin-left: 20px"
          >删除</el-button
          >
        </p>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      blog: {
        title: "null",
        text: "null"
      },
      commentList: null,
      myComment: ""
    };
  },
  async created() {
    await this.getBlogDetail();
    await this.getCommentList();
    await this.getCommentAuthorName();
  },
  methods: {
    deleteMyComment(commentId) {
      this.$axios
        .delete(this.$store.state.ip + "/api/blogComment/" + commentId)
        .then(response => {
          console.log(response);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.$router.go(0);
        })
        .catch(error => console.log(error));
    },
    showDeleteButton(commentUserId) {
      return commentUserId.toString() === localStorage.getItem("userId");
    },
    addComment() {
      this.$axios
        .post(this.$store.state.ip + "/api/blogComment", {
          blogId: this.$route.params.id,
          commentUserId: localStorage.getItem("userId"),
          content: this.myComment,
          id: null,
          targetCommentId: null,
          time: this.dateFormat()
        })
        .then(response => {
          console.log(response);
          this.$message({
            showClose: true,
            message: "评论成功",
            type: "success"
          });
          this.$router.go(0);
        })
        .catch(error => console.log(error));
    },
    async getCommentAuthorName() {
      console.log("@@");
      for (let i = 0; i < this.commentList.length; i++) {
        console.log(this.commentList[i]["commentUserId"]);
        await this.$axios
          .get(
            this.$store.state.ip +
              "/api/user/" +
              this.commentList[i]["commentUserId"]
          )
          .then(response => {
            console.log("找到名字" + response.data.name);
            this.$set(
              this.commentList[i],
              "commentUserName",
              response.data.name
            );
          });
      }

      console.log("@@");
    },
    async getCommentList() {
      await this.$axios
        .get(this.$store.state.ip + "/api/blogComment/" + this.$route.params.id)
        .then(response => {
          this.commentList = response.data;
          console.log("在？看看评论 ");
          console.log(this.commentList);
        })
        .catch(error => console.log(error));
    },
    async getBlogDetail() {
      await this.$axios
        .get(this.$store.state.ip + "/api/blogs/" + this.$route.params.id)
        .then(response => (this.blog = response.data))
        .catch(error => console.log(error));
      this.$axios
        .get(this.$store.state.ip + "/api/user/" + this.blog["authorId"])
        .then(response =>
          this.$set(this.blog, "authorName", response.data.name)
        )
        .catch(error => console.log(error));
    },
    dateFormat() {
      let date = new Date();
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    }
  },
  computed: {}
};
</script>
<style scoped>
.commentName {
  font-size: large;
  color: #42b983;
  font-weight: bold;
}
.commentContent {
  font-size: medium;
}
@media screen and (min-width: 1201px) {
  .mdShow {
    width: 70%;
    margin: 0 auto;
  }
  .commentArea {
    width: 70%;
    margin: 0 auto;
    text-align: left;
  }
}
@media screen and (max-width: 1200px) {
  .mdShow {
    width: 100%;
  }
  .commentArea {
    width: 100%;
    text-align: left;
  }
}
</style>
