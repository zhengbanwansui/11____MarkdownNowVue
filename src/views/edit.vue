<template>
  <div>
    <el-input
      style="font-size: 26px;"
      placeholder="请输入标题"
      v-model="blog.title"
    >
      <template slot="prepend">标题</template>
    </el-input>
    <h3>
      发布日期：{{ this.blog["createTime"] }}
      <br />
      最近修改：{{ this.blog["changeTime"] }}
    </h3>
    <mavon-editor
      :toolbars="toolbars"
      v-model="blog.text"
    ></mavon-editor>
    <div class="fixSave">
      <el-button
        style="position:relative;top: 5px;"
        type="primary"
        @click="updateBlog"
      >
        保存文章
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
      <el-button
        style="position:relative;top: 5px;"
        type="danger"
        @click="deleteBlog"
      >
        删除文章
        <i class="el-icon-document-delete el-icon--right"></i>
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      blog: {
        title: "",
        text: ""
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: false, // code
        table: true, // 表格
        readmodel: true, // 沉浸式阅读
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      }
    };
  },
  created() {
    this.getBlog();
  },
  methods: {
    dateFormat() {
      let date = new Date();
      let year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
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
      // 拼接
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
    },
    deleteBlog() {
      this.$axios
        .delete(this.$store.state.ip + "/api/blogs/" + this.blog.id)
        .then(response => {
          console.log(response.data);
          this.$message({
            showClose: true,
            message: "已删除文章",
            type: "success"
          });
          this.$router.replace("/personal");
        })
        .catch(error => console.log(error));
    },
    updateBlog() {
      console.log("更新文章");
      console.log(this.blog);
      this.blog.changeTime = this.dateFormat();
      this.$axios
        .put(this.$store.state.ip + "/api/blogs/", this.blog)
        .then(response => {
          console.log(response.data);
          this.$message({
            showClose: true,
            message: "已更新文章",
            type: "success"
          });
        })
        .catch(error => console.log(error));
    },
    getBlog() {
      this.$axios
        .get(
          this.$store.state.ip + "/api/blogs/" + this.$route.params.articleId
        )
        .then(response => {
          this.blog = response.data;
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
<style scoped>
.fixSave {
  width: 100%;
  display: block;
  height: 50px;
  background-color: rgba(230, 230, 230, 1);
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 2000;
}
</style>
