<template>
  <div>
    <div class="flexCard">
      <div v-for="(asset, index) in asset.records" :key="index">
        <el-card shadow="hover" class="assetCard">
          <img
            class="image"
            :src="`${minioAddressAndPort}/product/${asset.icon}`"
            alt="detail-icon"
          />
          <h3>{{ asset.name }} x{{ asset.number }}</h3>
        </el-card>
      </div>
    </div>
    <div style="text-align: center">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="asset['total']"
        @prev-click="changeAssetPage(assetPage - 1)"
        @next-click="changeAssetPage(assetPage + 1)"
        @current-change="changeAssetPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "asset",
  data() {
    return {
      asset: {},
      assetPage: 1,
      minioAddressAndPort: this.$store.state.minioAddress
    };
  },
  created() {
    this.pageAsset();
  },
  methods: {
    changeAssetPage(toPage) {
      this.assetPage = toPage;
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-reward/userAsset/userId/" +
            localStorage.getItem("userId") +
            "/current/" +
            this.assetPage +
            "/size/10"
        )
        .then(response => {
          if (response.data.code === 200) {
            this.asset = response.data.data;
            console.log("获取到资产");
            console.log(this.asset);
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
    pageAsset() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-reward/userAsset/userId/" +
            localStorage.getItem("userId") +
            "/current/" +
            this.assetPage +
            "/size/10"
        )
        .then(response => {
          if (response.data.code === 200) {
            this.asset = response.data.data;
            console.log("获取到资产");
            console.log(this.asset);
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped>
.image {
  width: 240px;
  height: 160px;
  object-fit: cover;
  margin: 5px 0;
}
.flexCard {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
}
.assetCard {
  width: 300px;
  height: 250px;
}
</style>
