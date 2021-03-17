<template>
  <div class="slim" v-show="showPage()">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的博客" name="first">
        <div class="flexFather">
          <div style="width: 250px;height: 350px; display: block">
            <el-card
              :body-style="{ padding: '10px 10px 0 10px' }"
              shadow="hover"
            >
              <!--                https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594879490170&di=165c2d3172e24ad6982f977e25274e2e&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F00%2F26%2F48%2F8056d0dd3d72814.jpg-->
              <img
                :src="minioAddressAndPort + '/picture/add-blog.jpg'"
                class="image"
                alt="图片"
              />
              <div style="padding: 8px;height: 80px;">
                <div>
                  <el-button
                    style="padding: 6px;color: rgb(66,185,131); font-weight: 800;"
                    type="text"
                    @click="addNewBlog"
                    >添加博客</el-button
                  >
                </div>
                <span>写一篇新的博客</span>
              </div>
            </el-card>
          </div>
          <div
            style="width: 250px;height: 350px; display: block"
            v-for="item in blog"
            :key="item.id"
          >
            <el-card
              :body-style="{ padding: '10px 10px 0 10px' }"
              shadow="hover"
            >
              <img
                :src="minioAddressAndPort + '/cover/' + item['coverPicture']"
                class="image"
                alt="图片"
              />
              <div style="padding: 8px;height: 80px;">
                <div>
                  <el-button
                    style="padding: 6px;color: rgb(66,185,131); font-weight: 800;"
                    type="text"
                    @click="toEditPage(item.id)"
                    >编辑博客</el-button
                  >
                </div>
                <span>{{ item.title }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="归档" name="second">
        <archive></archive>
      </el-tab-pane>
      <el-tab-pane label="个人信息" name="third">
        <div style="text-align: center; width: 300px;margin: 0 auto">
          <el-avatar
            :size="100"
            fit="cover"
            v-loading="avatarLoading"
            :src="getAvatarUrl"
          ></el-avatar>
          <br />
          <el-button type="success" @click="dialogVisible = true"
            >修改头像</el-button
          >
          <el-dialog
            title="修改头像"
            :visible.sync="dialogVisible"
            width="100%"
          >
            重新上传
            <br />
            <br />
            <a href="javascript:;" class="file">
              选择新头像文件
              <input
                @change="getAvatarFile"
                type="file"
                ref="refInputFile"
                accept="image/png,image/jpeg,image/gif,image/jpg"
              />
            </a>
            <br />
            <el-button style="" type="success" @click="uploadAvatarFile"
              >上传新头像</el-button
            >
            <el-divider></el-divider>
            使用历史头像
            <br />
            <br />
            <div class="avatarFather">
              <div
                v-for="item in avatarHistory"
                :key="item['id']"
                style="width: 100px;height: 100px;"
              >
                <el-popover placement="bottom" width="300">
                  <p>设置为当前头像或者删除它：</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deleteAvatar(item.id)"
                      >删除此头像</el-button
                    >
                    <el-button
                      type="success"
                      size="mini"
                      @click="changeToHistoryAvatar(item.id)"
                      >设置为当前头像</el-button
                    >
                  </div>
                  <el-avatar
                    slot="reference"
                    :src="minioAddressAndPort + '/avatar/' + item.fileName"
                    :size="100"
                    fit="cover"
                  ></el-avatar>
                </el-popover>
              </div>
            </div>
            <span slot="footer" class="dialog-footer"></span>
          </el-dialog>
          <br />
          用户名：<el-input v-model="userData.name" disabled></el-input>
          积分：<el-input v-model="userData.point" disabled></el-input>
          是否为管理员：<el-input v-model="isAdminComputed" disabled></el-input>
          电子邮箱：<el-input v-model="userData.email" clearable></el-input>
          个性签名：<el-input v-model="userData.sign" clearable></el-input>
          个人简介：<el-input v-model="userData.info" clearable></el-input>
          <el-button type="success" slot="reference" @click="changePersonalData"
            >修改</el-button
          >
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的相册" name="fourth">
        <gallery></gallery>
      </el-tab-pane>
      <el-tab-pane label="我的资产" name="fifth">
        <asset></asset>
      </el-tab-pane>
      <el-tab-pane label="从天而降的神奇工具箱" name="sixth">
        <utils></utils>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import utils from "@/components/utils.vue";
import archive from "@/components/archive.vue";
import gallery from "@/components/gallery.vue";
import asset from "@/components/asset.vue";
export default {
  components: {
    utils,
    archive,
    gallery,
    asset
  },
  data() {
    return {
      minioAddressAndPort: this.$store.state.minioAddress,
      dialogVisible: false,
      avatarLoading: false,
      avatarHistory: null,
      avatarUrl:
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3531761125,3665413676&fm=26&gp=0.jpg",
      fileParam: null,
      activeName: "third",
      userData: {
        name: "",
        isAdmin: null,
        point: null,
        email: "",
        sign: "",
        info: ""
      },
      blog: []
    };
  },
  created() {
    this.getUserData();
    this.getMyBlogs();
    this.getCurrentAvatar();
    this.getHistoryAvatar();
    console.log("URL参数" + this.$route.query.activeName);
    if (typeof this.$route.query.activeName !== "undefined") {
      this.activeName = this.$route.query.activeName;
    }
  },
  methods: {
    deleteAvatar(avatarId) {
      this.$axios
        .delete(this.$store.state.ip + "/api/avatars/" + avatarId)
        .then(response => {
          console.log(response);
          this.$router.go(0);
        })
        .catch(error => console.log(error));
    },
    changeToHistoryAvatar(avatarId) {
      this.$axios
        .put(this.$store.state.ip + "/api/avatars/" + avatarId)
        .then(response => {
          console.log(response);
          this.$router.go(0);
        })
        .catch(error => console.log(error));
    },
    getHistoryAvatar() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/api/avatars/history/" +
            localStorage.getItem("userId")
        )
        .then(response => {
          console.log(response.data);
          this.avatarHistory = response.data;
        })
        .catch(error => console.log(error));
    },
    getCurrentAvatar() {
      let ip = this.$store.state.minioAddress;
      this.$axios
        .get(
          this.$store.state.ip +
            "/api/avatars/current/" +
            localStorage.getItem("userId")
        )
        .then(response => {
          console.log(response.data);
          this.avatarUrl = ip + "/avatar/" + response.data["fileName"];
          console.log(this.avatarUrl);
        })
        .catch(error => console.log(error));
    },
    getAvatarFile(event) {
      let file = event.target.files[0];
      this.fileParam = new FormData();
      this.fileParam.append("file", file);
      this.fileParam.append("userId", localStorage.getItem("userId"));
      console.log("获取到文件：");
      console.log(this.fileParam.get("file"));
    },
    uploadAvatarFile() {
      // 上传开始
      this.avatarLoading = true;
      this.$axios
        .post(this.$store.state.ip + "/api/avatars", this.fileParam)
        .then(response => {
          console.log(response.data);
          this.getCurrentAvatar();
          // 上传成功
          this.avatarLoading = false;
          this.$message({
            showClose: true,
            message: "头像上传成功",
            type: "success"
          });
          this.$router.go(0);
        })
        .catch(error => {
          console.log(error);
          // 上传失败
          this.avatarLoading = false;
          this.$message({
            showClose: true,
            message: "头像上传失败",
            type: "error"
          });
        });
    },
    showPage() {
      return localStorage.getItem("userId") != null;
    },
    addNewBlog() {
      this.$router.push("/add");
    },
    toEditPage(articleId) {
      this.$router.push("/edit/" + articleId);
    },
    changePersonalData() {
      console.log(this.userData);
      this.$axios
        .put(this.$store.state.ip + "/api/user", this.userData, {
          headers: {
            "access-control-allow-origin": "*"
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            alert("修改成功");
          }
        })
        .catch(error => {
          console.log(error);
          alert("修改失败");
        });
    },
    getMyBlogs() {
      this.$axios
        .get(
          this.$store.state.ip + "/api/blogs/author-id/" + localStorage.userId
        )
        .then(response => {
          this.blog = response.data;
          console.log(response.data);
        })
        .catch(error => console.log(error));
    },
    getUserData() {
      this.$axios
        .get(this.$store.state.ip + "/api/user/" + localStorage.userId)
        .then(response => {
          console.log(response);
          this.userData = response.data;
        });
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
<style scoped>
.slim {
  text-align: left;
  /*width: 300px;*/
  margin: 0 auto;
}
.flexFather {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  text-align: center;
}
.image {
  width: 230px;
  height: 230px;
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
.avatarFather {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  text-align: center;
}
</style>
