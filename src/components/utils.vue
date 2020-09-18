<template>
  <div class="slim">
    <el-card
      :body-style="{ padding: '10px 3px 3px 3px' }"
      class="cards"
      shadow="hover"
    >
      <div @click="dialogSchool = true">
        <img
          width="200px"
          src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2657147354,1521427986&fm=26&gp=0.jpg"
          alt=""
        />
        <h3 style="margin: 3px 0; color: white">【大折磨开学 - 物品打包】</h3>
      </div>
    </el-card>
    <el-dialog
      title="【大折磨开学 - 物品打包】"
      :visible.sync="dialogSchool"
      width="300px"
      top="30px"
    >
      <div>
        <br />
        请点击打包好的物品
        <div
          style="display: flex; flex-direction: row; justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;"
        >
          <div v-for="(item, index) in things" :key="index">
            <el-button
              @click="$refs.MyItems[index].$el.style.display = 'none'"
              ref="MyItems"
              >{{ item }}</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "utils",
  data() {
    return {
      dialogSchool: false,
      things: [
        "床上用品",
        "床单",
        "被子",
        "枕巾",
        "枕套",
        "睡衣",
        "洗漱洗澡用品",
        "毛巾",
        "牙刷",
        "牙膏",
        "洗发水",
        "洗面奶",
        "香皂",
        "衣服",
        "裤子",
        "鞋子",
        "袜子",
        "帽子围巾手套",
        "雨伞",
        "手纸",
        "口罩",
        "水杯",
        "学习用品",
        "笔",
        "纸",
        "书",
        "关键道具",
        "钥匙",
        "身份证",
        "钱包",
        "校园卡",
        "身份识别卡",
        "电子产品",
        "手机电脑充电器"
      ]
    };
  },
  methods: {}
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
  width: 230px;
  background-color: #42b983;
}
</style>
