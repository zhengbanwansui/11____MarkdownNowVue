<template>
  <div class="slim">
    <el-card
      :body-style="{ padding: '10px 3px 3px 3px' }"
      class="cards"
      shadow="hover"
    >
      <div @click="addAlbumVisable = true">
        <img
          class="fitSquare"
          :src="minioAddressAndPort + '/picture/default-album.jpg'"
          width="200"
          height="200"
          alt=""
        />
        <h3 class="title">【添加相册】</h3>
      </div>
    </el-card>
    <el-dialog
      title="【添加相册】"
      :visible.sync="addAlbumVisable"
      width="300px"
      top="30px"
    >
      <div>
        <br />
        相册名称：
        <el-input v-model="newAlbum['name']" clearable></el-input>
        他人是否可见：
        <el-switch v-model="newAlbumOpen"></el-switch>
        <br />
        <el-button type="success" @click="insertAlbum()">添加</el-button>
      </div>
    </el-dialog>
    <div v-for="album in albums" :key="album.id">
      <el-card
        :body-style="{ padding: '10px 3px 3px 3px' }"
        class="cards"
        shadow="hover"
      >
        <div @click="dialogSchool = true">
          <img
            class="fitSquare"
            :src="minioAddressAndPort + '/picture/' + album['coverFileName']"
            alt=""
          />
          <h3 class="title">{{ album["name"] }}</h3>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "gallery",
  data() {
    return {
      newAlbumOpen: null,
      newAlbum: {
        name: null,
        open: false,
        createTime: null,
        userId: localStorage.getItem("userId")
      },
      minioAddressAndPort: this.$store.state.minioAddress,
      albums: null,
      addAlbumVisable: false
    };
  },
  created() {
    this.getAlbum();
  },
  methods: {
    insertAlbum() {
      this.newAlbum["createTime"] = this.dateFormat();
      if (this.newAlbumOpen === true) {
        this.newAlbum["open"] = 1;
      } else {
        this.newAlbum["open"] = 0;
      }
      this.$axios
        .post(
          this.$store.state.ip + "/markdownnow-blogroll/album",
          this.newAlbum
        )
        .then(response => {
          if (response.data.code === 200) {
            this.addAlbumVisable = false;
            this.getAlbum();
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
        })
        .catch(error => console.log(error));
    },
    getAlbum() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-blogroll/album/userId/" +
            localStorage.getItem("userId")
        )
        .then(response => {
          if (response.data.code === 200) {
            console.log(response.data);
            this.albums = response.data.data;
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
        })
        .catch(error => console.log(error));
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
.slim {
  text-align: left;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
}
.cards {
  text-align: center;
  width: 210px;
  height: 235px;
  background-color: #f6f6f6;
}
.title {
  margin: 0;
  font-size: 14px;
  color: rgb(66, 185, 131);
}
img.fitSquare {
  width: 200px;
  height: 200px;
  object-fit: cover;
}
</style>
