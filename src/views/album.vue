<template>
  <div>
    <a href="javascript:;" class="file">
      上传图片
      <input
        @change="getFileAndUpload"
        type="file"
        ref="refInputFile"
        accept="image/png,image/jpeg,image/gif,image/jpg"
      />
    </a>
    <div class="flexFather">
      <div v-for="picture in pictures['records']" :key="picture['id']">
        <el-card>
          <img class="fitWidth" :src="minioAddressAndPort + '/picture/' + picture['fileName']" alt="">
          <h3>{{ picture["name"] }}</h3>
        </el-card>
      </div>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pictures.size"
      :total="pictures.total"
      @prev-click="changePage(-1)" @next-click="changePage(1)" @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "album",
  data() {
    return {
      minioAddressAndPort: this.$store.state.minioAddress,
      pictures: null,
      current: 1,
      fileParam: null
    };
  },
  created() {
    this.pagePictures();
  },
  methods: {
    getFileAndUpload(event) {
      let file = event.target.files[0];
      this.fileParam = new FormData();
      this.fileParam.append("multipartFile", file);
      this.fileParam.append("createTime", this.dateFormat());
      this.fileParam.append("albumId", this.$route.params.id);
      console.log("获取到文件：");
      console.log(this.fileParam.get("file"));
      this.$axios
        .post(
          this.$store.state.ip +
          "/markdownnow-blogroll/picture/", this.fileParam
        )
        .then(response => {
          if (response.data.code === 200) {
            this.$router.go(0);
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
        }).catch(error => {console.log(error)});
    },
    currentChange(toPage) {
      this.current = toPage;
      this.$axios
        .get(
          this.$store.state.ip +
          "/markdownnow-blogroll/picture/" + this.$route.params.id + "/current/" +
          this.current +
          "/size/10"
        )
        .then(response => {
          if (response.data.code === 200) {
            this.pictures = response.data.data;
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
          // 上传失败
          this.$message({
            showClose: true,
            message: "上传失败",
            type: "error"
          });
        });
    },
    changePage(change) {
      this.current = this.current + change;
      this.$axios
        .get(
          this.$store.state.ip +
          "/markdownnow-blogroll/picture/" + this.$route.params.id + "/current/" +
          this.current +
          "/size/10"
        )
        .then(response => {
          if (response.data.code === 200) {
            this.pictures = response.data.data;
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
    pagePictures() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-blogroll/picture/" + this.$route.params.id + "/current/" +
            1 +
            "/size/10"
        )
        .then(response => {
          if (response.data.code === 200) {
            this.pictures = response.data.data;
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
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
    }
  }
};
</script>

<style scoped>
img.fitWidth {
  height: 200px;
  object-fit: cover;
}
.flexFather {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
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
