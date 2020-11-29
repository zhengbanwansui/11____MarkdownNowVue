<template>
  <div>
    <a href="javascript:;" class="file">
      上传封面图
      <input
        @change="getAvatarFile"
        type="file"
        ref="refInputFile"
        accept="image/png,image/jpeg,image/gif,image/jpg"
      />
    </a>
    <el-input
      style="font-size: 26px;"
      placeholder="请输入标题"
      v-model="blog.title"
    >
      <template slot="prepend">标题</template>
    </el-input>
    <mavon-editor :toolbars="toolbars" v-model="blog.text"></mavon-editor>
    <div class="fixSave">
      <el-button
        style="position:relative;top: 5px;"
        type="primary"
        @click="saveBlog"
      >
        保存
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileParam: null,
      blog: {
        id: -1,
        authorId: localStorage.userId,
        title: "文章标题",
        text: "# 正文\n## 正文\n### 正文\n#### 正文\n##### 正文\n###### 正文",
        createTime: "",
        changeTime: "",
        coverPicture: null
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
    getAvatarFile(event) {
      let file = event.target.files[0];
      this.fileParam = new FormData();
      this.fileParam.append("file", file);
      console.log("获取到文件：");
      console.log(this.fileParam.get("file"));
    },
    saveBlog() {
      let formObject = new FormData();
      if (this.fileParam != null) {
        formObject = this.fileParam;
      }
      formObject.append("authorId", localStorage.userId);
      formObject.append("title", this.blog.title);
      formObject.append("text", this.blog.text);
      formObject.append("createTime", this.dateFormat());
      formObject.append("changeTime", this.dateFormat());
      console.log("保存文章为");
      console.log(this.blog);
      this.$axios
        .post(this.$store.state.ip + "/api/blogs", formObject)
        .then(response => {
          console.log(response.data);
          this.$message({
            showClose: true,
            message: "已添加文章",
            type: "success"
          });
          this.$router.replace("/personal");
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
.file {
  position: relative;
  display: inline-block;
  background: #67c23a;
  border: 1px solid #67c23a;
  border-radius: 4px;
  padding: 12px 20px;
  overflow: hidden;
  font-size: 14px;
  color: #ffffff;
  text-decoration: none;
  text-indent: 0;
  line-height: 14px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #85ce61;
  border-color: #85ce61;
  color: #ffffff;
  text-decoration: none;
}
</style>
