<template>
  <div>
    <div class="slim">
      <el-tree :data="topArchiveData" :props="defaultProps"></el-tree>
      <el-input v-model="archiveForm.year" placeholder="请输入年份"></el-input>
      <el-input v-model="archiveForm.month" placeholder="请输入月份"></el-input>
      <el-button type="success" @click="getOneArchive"
        >查找归档的博客</el-button
      >
    </div>
    <div class="flexFather">
      <div
        style="width: 250px;height: 350px; display: block"
        v-for="item in archiveOne"
        :key="item.id"
      >
        <el-card :body-style="{ padding: '10px 10px 0 10px' }" shadow="hover">
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
  </div>
</template>

<script>
export default {
  name: "archive",
  data() {
    return {
      minioAddressAndPort: this.$store.state.minioAddress,
      archiveOne: null,
      archiveForm: {
        year: null,
        name: null
      },
      topArchiveMap: null,
      topArchiveData: [],
      //   [
      //   {
      //     label: "一级 1",
      //     children: [
      //       {
      //         label: "二级 1-1",
      //         children: [
      //           {
      //             label: "三级 1-1-1"
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.getArchive();
  },
  methods: {
    toEditPage(articleId) {
      this.$router.push("/edit/" + articleId);
    },
    getOneArchive() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/api/blogs/archiveBlog/authorId/" +
            localStorage.getItem("userId") +
            "/year/" +
            this.archiveForm.year +
            "/month/" +
            this.archiveForm.month
        )
        .then(response => {
          this.archiveOne = response.data.data.archivedBlogs;
        })
        .catch(error => console.log(error));
    },
    getArchive() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/api/blogs/archiveBlog/authorId/" +
            localStorage.getItem("userId")
        )
        .then(response => {
          console.log("归档：");
          console.log(response.data.data.topArchiveMap);
          this.topArchiveMap = response.data.data.topArchiveMap;
          for (let year in this.topArchiveMap) {
            // 先添加一个年份作为顶级下拉栏
            console.log(year + " : " + this.topArchiveMap[year]);
            let yearObj = {
              label: year,
              children: []
            };
            // 月份栏对象
            for (let month in this.topArchiveMap[year]) {
              let monthText =
                this.topArchiveMap[year][month]["month"] +
                "  " +
                this.topArchiveMap[year][month]["count"];
              let monthObj = {
                label: monthText,
                children: []
              };
              yearObj.children.push(monthObj);
            }
            this.topArchiveData.push(yearObj);
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped>
.image {
  width: 230px;
  height: 230px;
}
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
.avatarFather {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  text-align: center;
}
.slim {
  text-align: left;
  width: 300px;
  margin: 0 auto;
}
</style>
