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
          <el-popover>
            <el-input type="text" v-model="myCommentChild"></el-input>
            <el-button
              @click="addTargetComment(item.id)"
              type="text"
              style="margin-left: 20px"
            >发送</el-button
            >
            <el-button type="text" style="margin-left: 20px" slot="reference"
            >评论</el-button
            >
          </el-popover>
          <el-button
            @click="deleteMyComment(item.id)"
            v-if="showDeleteButton(item.commentUserId)"
            type="text"
            style="margin-left: 20px"
            >删除</el-button
          >
        </p>
        <div
          class="childComment"
          v-for="child in item['childComment']"
          :key="child.id"
        >
          <p class="commentContent">
            <span class="commentName">{{ child["commentUserName"] }}</span>
            :
            <span class="commentNameAt">@{{ child["targetUserName"] }}</span>
            {{ child["content"] }}

            <el-popover>
              <el-input type="text" v-model="myCommentChild"></el-input>
              <el-button
                @click="addInsideTargetComment(item.id, child['commentUserId'])"
                type="text"
                style="margin-left: 20px"
                >发送</el-button
              >
              <el-button type="text" style="margin-left: 20px" slot="reference"
                >评论</el-button
              >
            </el-popover>
            <el-button
              @click="deleteMyComment(child.id)"
              v-if="showDeleteButton(child.commentUserId)"
              type="text"
              style="margin-left: 20px"
              >删除</el-button
            >
          </p>
        </div>
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
      myComment: "",
      myCommentChild: ""
    };
  },
  async created() {
    await this.getBlogDetail();
    await this.getCommentList();
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
        .post(this.$store.state.ip + "/api/blogComment/father", {
          blogId: this.$route.params.id,
          commentUserId: localStorage.getItem("userId"),
          content: this.myComment,
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
    addTargetComment(commentId) {
      this.$axios
        .post(this.$store.state.ip + "/api/blogComment/child", {
          blogId: this.$route.params.id,
          commentUserId: localStorage.getItem("userId"),
          content: this.myCommentChild,
          targetCommentId: commentId,
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
    addInsideTargetComment(commentId, targetUserId) {
      this.$axios
        .post(this.$store.state.ip + "/api/blogComment/child", {
          blogId: this.$route.params.id,
          commentUserId: localStorage.getItem("userId"),
          content: this.myCommentChild,
          targetCommentId: commentId,
          time: this.dateFormat(),
          targetUserId: targetUserId
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
    async getCommentList() {
      await this.$axios
        .get(this.$store.state.ip + "/api/blogComment/" + this.$route.params.id)
        .then(response => {
          this.commentList = response.data;
          console.log("在？看看评论 博客号 " + this.$route.params.id);
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
.commentNameAt {
  font-size: medium;
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
.childComment {
  width: 100%;
  padding-left: 80px;
}
</style>
