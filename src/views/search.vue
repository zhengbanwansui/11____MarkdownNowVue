<template>
  <div>
    <div class="flexFatherSearchBar">
      <div>
        <el-input
          v-model="searchString"
          placeholder="请输入搜索的博客和用户名"
        ></el-input>
      </div>
      <div>
        <el-button
          type="success"
          @click="getAllAuthorName"
          icon="el-icon-search"
          >搜索</el-button
        >
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="搜索到的博客" name="blog">
        <div class="flexFather">
          <div
            style="width: 250px;height: 350px; display: block"
            v-for="item in blog"
            :key="item.id"
          >
            <el-card
              :body-style="{ padding: '10px 10px 0 10px' }"
              shadow="hover"
            >
              <div style="position: relative">
                <div class="authorName">作者：{{ item["authorName"] }}</div>
              </div>
              <img
                :src="minioAddressAndPort + '/cover/' + item['coverPicture']"
                class="image"
                alt="封面图出差了"
              />
              <div style="padding: 8px;height: 80px;">
                <div>
                  <el-button
                    style="padding: 6px;color: rgb(66,185,131); font-weight: 800;"
                    type="text"
                    @click="toBlogPage(item.id)"
                    >查看博客</el-button
                  >
                </div>
                <span>{{ item.title }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="搜索到的用户" name="user">
        <div v-for="user in this.user" :key="user.id">
          <el-card :body-style="{ padding: '10px 10px 0 10px' }" shadow="hover">
            {{ user.name }}
            <el-button
              style="padding: 6px;color: rgb(66,185,131); font-weight: 800;"
              type="text"
              @click="toUserPage(user['id'])"
              >查看用户</el-button
            >
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      minioAddressAndPort: this.$store.state.minioAddress,
      activeName: "blog",
      searchString: null,
      blog: [],
      user: []
    };
  },
  methods: {
    toUserPage(userId) {
      console.log("跳转用户页面" + userId.toString());
      // this.$router.push("/user/" + userId.toString());
      let routeData = this.$router.resolve({
        path: "/user/" + userId.toString()
      });
      window.open(routeData.href, "_blank");
    },
    toBlogPage(i) {
      console.log("跳转详细页面" + "/detail/" + i.toString());
      // this.$router.push("/detail/" + i.toString());
      let routeData = this.$router.resolve({
        path: "/detail/" + i.toString()
      });
      window.open(routeData.href, "_blank");
    },
    async getAllAuthorName() {
      await this.searchBlog();
      console.log("【开始寻找作者名称】");
      for (let i = 0; i < this.blog.length; i++) {
        console.log("为" + this.blog[i].title + "寻找作者");
        await this.$axios
          .get(this.$store.state.ip + "/api/user/" + this.blog[i]["authorId"])
          .then(response => {
            console.log("找到名字" + response.data.name);
            this.$set(this.blog[i], "authorName", response.data.name);
          });
      }
      console.log(this.blog);
      this.searchUser();
    },
    async searchBlog() {
      await this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-search/searchBlog?str=" +
            this.searchString
        )
        .then(response => {
          this.blog = response.data.data;
          console.log("搜索到用户");
          console.log(response.data.data);
        })
        .catch(error => console.log(error));
    },
    searchUser() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-search/searchUser?str=" +
            this.searchString
        )
        .then(response => {
          this.user = response.data.data;
          console.log(response.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.flexFatherSearchBar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  text-align: center;
}
.flexFather {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
}
.image {
  width: 230px;
  height: 230px;
}
.authorName {
  width: 230px;
  position: absolute;
  background-color: rgba(60, 60, 60, 0.7);
  height: 20px;
  top: 210px;
  color: white;
}
</style>
