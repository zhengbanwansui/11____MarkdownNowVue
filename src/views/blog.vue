<template>
  <div style="display: flex;flex-direction: row">
    <div class="flexFather">
      <div
        style="width: 250px;height: 350px; display: block"
        v-for="item in blog"
        :key="item.id"
      >
        <el-card :body-style="{ padding: '10px 10px 0 10px' }" shadow="hover">
          <div style="position: relative">
            <div class="authorName">作者：{{ item["authorName"] }}</div>
          </div>
          <img
            src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2386449788,2727519679&fm=26&gp=0.jpg"
            class="image"
            alt="图片"
          />
          <div style="padding: 8px;height: 80px;">
            <div>
              <el-button
                style="padding: 6px;color: rgb(66,185,131); font-weight: 800;"
                type="text"
                @click="toDetailPage(item.id)"
                >查看博客</el-button
              >
            </div>
            <span>{{ item.title }}</span>
          </div>
        </el-card>
      </div>
    </div>
    <div class="sideBar">
      <el-calendar class="calendar" v-model="calendar"> </el-calendar>
      <el-card class="box-card" style="width: 400px">
        <div slot="header">
          <span style="color: rgb(66,185,151);font-weight: bold;font-size: 20px"
            >{{ weather["city"] }}天气</span
          >
          <el-button
            style="float: right; padding: 3px 0; color: rgb(66,185,151);text-decoration: underline;"
            type="text"
            @click="getLocalWeather()"
          >
            更新天气
          </el-button>
        </div>
        {{ weather["wea"] }} {{ weather["tem"] }}℃<br /><br />
        今日气温：{{ weather["tem2"] }}℃ ~ {{ weather["tem1"] }}℃<br /><br />
        空气质量：{{ weather["air_level"] }}<br /><br />
        {{ weather["air_tips"] }}
      </el-card>
      <el-card class="box-card" style="width: 400px; margin-top: 10px">
        <div style="color: rgb(66,185,151);font-weight: bold;font-size: 20px">
          友情链接
        </div>
        <br />
        <div class="blogroll">
          <el-button
            style="padding: 6px;color: rgb(66,185,131); font-weight: 700;"
            type="text"
            v-for="item in blogroll"
            :key="item.id"
            @click="jumpToBlogroll(item.url)"
          >
            {{ item["websiteName"] }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogroll: null,
      calendar: new Date(),
      blog: [],
      weather: {
        wea: "",
        city: ""
      }
    };
  },
  created() {
    this.getAllAuthorName();
    this.getLocalWeather();
    this.getBlogroll();
  },
  methods: {
    jumpToBlogroll(url) {
      window.open(url);
    },
    getBlogroll() {
      this.$axios
        .get(this.$store.state.ip + "/api/blogroll")
        .then(response => {
          console.log(response);
          this.blogroll = response.data;
        })
        .catch(error => console.log(error));
    },
    getLocalWeather() {
      this.$axios
        .get(
          "http://www.tianqiapi.com/api?" +
            "version=v61&appid=63193281(暂时不使用)&appsecret=RB9LS7aK"
        )
        .then(response => {
          console.log(response);
          this.weather = response.data;
        })
        .catch(error => console.log(error));
    },
    toDetailPage(i) {
      console.log("跳转详细页面" + "/detail/" + i.toString());
      this.$router.push("/detail/" + i.toString());
    },
    async listAllBlog() {
      await this.$axios
        .get(this.$store.state.ip + "/api/blogs")
        .then(response => {
          console.log(response.data);
          this.blog = response.data;
        })
        .catch(error => console.log(error));
    },
    async getAllAuthorName() {
      await this.listAllBlog();
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
    }
  }
};
</script>

<style scoped>
.blogroll {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
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
/deep/.el-calendar__body {
  width: 400px;
}
/deep/.el-calendar-day {
  height: 30px;
}
@media screen and (min-width: 1201px) {
  .sideBar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
@media screen and (max-width: 1200px) {
  .sideBar {
    display: none;
  }
}
</style>
