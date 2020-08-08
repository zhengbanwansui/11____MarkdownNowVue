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
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594879490170&di=165c2d3172e24ad6982f977e25274e2e&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F00%2F26%2F48%2F8056d0dd3d72814.jpg"
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
                src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3342498410,4092660790&fm=26&gp=0.jpg"
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
      <el-tab-pane label="个人信息" name="second">
        <div style="text-align: center; width: 300px;margin: 0 auto">
          用户名：<el-input v-model="userData.name" disabled></el-input>
          积分：<el-input v-model="userData.point" disabled></el-input>
          是否为管理员：<el-input v-model="isAdminComputed" disabled></el-input>
          电子邮箱：<el-input v-model="userData.email" clearable></el-input>
          个性签名：<el-input v-model="userData.sign" clearable></el-input>
          个人简介：<el-input v-model="userData.info" clearable></el-input>
          <el-button type="success" @click="changePersonalData">修改</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
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
  methods: {
    showPage() {
      return localStorage.getItem('userId') != null;
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
        .put(this.$store.state.ip + "/api/user/", this.userData)
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
    isAdminComputed: function() {
      if (this.userData.isAdmin === 1) {
        return "是";
      }
      if (this.userData.isAdmin === 0) {
        return "否";
      }
      return "";
    }
  },
  created() {
    this.getUserData();
    this.getMyBlogs();
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
</style>
