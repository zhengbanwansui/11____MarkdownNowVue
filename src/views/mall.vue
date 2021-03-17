<template>
  <div>
    <div class="flexFather">
      <div
        v-for="(product, index) in products.records"
        :key="index"
        class="productBorder"
      >
        <div class="product">
          <img
            class="image"
            :src="minioAddressAndPort + '/product/' + product.icon"
            alt="pic"
          />
          <div>{{ product.name }}</div>
          <div class="price">{{ product.price }}积分</div>
          <div>
            <el-button @click="addToCart(product.id)">加入购物车</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="products.size"
      :total="products.total"
      @prev-click="changePage(productsPage - 1)"
      @next-click="changePage(productsPage + 1)"
      @current-change="changePage"
    >
    </el-pagination>
    <!-- 购物车按钮 -->
    <div class="cart">
      <img
        class="cartImg"
        @click="showCart"
        :src="minioAddressAndPort + '/picture/cart.png'"
        alt="cart"
      />
    </div>
    <!-- 窗口 -->
    <el-dialog title="购物车" :visible.sync="cartDialogVisible" width="70%">
      <div class="cartListOutside">
        <div class="cartList" v-for="(value, key) in this.cartObj" :key="key">
          <!-- 产品名 -->
          {{ productIdNameMap.get(key - 0) }}
          <!-- 计数器 -->
          <el-input-number
            v-model="cartObj[key]"
            @change="changeProductNum"
            size="small"
            :min="0"
            :max="999"
            label="计数器"
          >
          </el-input-number>
        </div>
        <el-divider><i class="el-icon-caret-bottom"></i></el-divider>
        <el-button @click="createOrder" type="success">下单</el-button>
      </div>
    </el-dialog>
    <!-- 创建订单按钮 -->
    <el-button class="orderButton" @click="showOrder" type="success"
      >查看我的订单</el-button
    >
    <!-- 订单窗口 -->
    <el-dialog title="我的订单" :visible.sync="orderVisible" width="50%">
      <div v-for="(order, index) in order.records" :key="index">
        <div v-for="(detail, index) in order.detailWithProductVOS" :key="index">
          <div class="detailRow">
            <img
              class="detailImage"
              :src="minioAddressAndPort + '/product/' + detail.icon"
              alt="detail-icon"
            />
            <h3>{{ detail.name }}</h3>
            <div style="width: 30px;display: block;"></div>
            <h3>{{ detail.price }}积分</h3>
            <h4>x{{ detail.num }}</h4>
          </div>
        </div>
        <div class="detailRow">
          <div class="orderInfo">
            <div>商品总价：{{ order.money }}积分</div>
            <div>订单时间：{{ order.time }}</div>
            <div>订单状态：{{ orderStatus(order.purchased) }}</div>
          </div>
          <div v-show="orderPurchase(order.purchased)">
            <el-button type="warning" @click="expendPoint(order.id)">支付</el-button>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="order['total']"
        @prev-click="changeOrderPage(orderPage - 1)"
        @next-click="changeOrderPage(orderPage + 1)"
        @current-change="changeOrderPage"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "mall",
  data() {
    return {
      order: {},
      orderPage: 1,
      orderVisible: false,
      cartDialogVisible: false,
      cartMap: new Map(),
      cartObj: {},
      minioAddressAndPort: this.$store.state.minioAddress,
      products: {},
      productsPage: 1,
      productIdNameMap: new Map()
    };
  },
  created() {
    this.pageProducts();
  },
  methods: {
    expendPoint(orderId) {
      this.$axios
        .put(this.$store.state.ip + "/markdownnow-reward/buy/expendPoint", {
          orderId: orderId,
          userId: localStorage.getItem("userId")
        })
        .then(response => {
          if (response.data.code === 200) {
            this.$message({
              showClose: true,
              message: "支付成功",
              type: "success"
            });
            this.orderVisible = false;
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
    orderPurchase(i) {
      if (i === 1) {
        return false;
      } else {
        return true;
      }
    },
    orderStatus(i) {
      if (i === 1) {
        return "已完成";
      } else {
        return "待支付";
      }
    },
    changeOrderPage(toPage) {
      this.orderPage = toPage;
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-reward/order/user/" +
            localStorage.getItem("userId") +
            "/size/10/current/" +
            toPage
        )
        .then(response => {
          if (response.data.code === 200) {
            this.order = response.data.data;
            console.log("获取到订单");
            console.log(this.order);
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
          this.cartDialogVisible = false;
        })
        .catch(error => console.log(error));
    },
    showOrder() {
      this.orderVisible = true;
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-reward/order/user/" +
            localStorage.getItem("userId") +
            "/size/10/current/" +
            this.orderPage
        )
        .then(response => {
          if (response.data.code === 200) {
            this.order = response.data.data;
            console.log("获取到订单");
            console.log(this.order);
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
          this.cartDialogVisible = false;
        })
        .catch(error => console.log(error));
    },
    changeProductNum() {
      // 修改Map
      this.cartMap = new Map();
      for (let product in this.cartObj) {
        if (this.cartObj[product] !== 0) {
          this.cartMap.set(product, this.cartObj[product]);
        }
      }
      this.cartObj = this.convertMapToObj(this.cartMap);
      console.log(this.cartMap);
    },
    updateProductIdNameMap() {
      console.log("更新Map");
      for (let i in this.products["records"]) {
        this.productIdNameMap.set(
          this.products["records"][i].id,
          this.products["records"][i].name
        );
      }
      console.log(this.productIdNameMap);
    },
    showCart() {
      this.cartDialogVisible = true;
      this.cartObj = this.convertMapToObj(this.cartMap);
      console.log(this.cartObj);
    },
    convertMapToObj(map) {
      let obj = Object.create(null);
      for (let [k, v] of map) {
        obj[k] = v;
      }
      return obj;
    },
    createOrder() {
      let obj = Object.create(null);
      for (let [k, v] of this.cartMap) {
        obj[k] = v;
      }
      let form = {
        productMap: obj,
        userId: localStorage.getItem("userId")
      };
      this.$axios
        .put(
          this.$store.state.ip + "/markdownnow-reward/buy/buySomeProduct",
          form
        )
        .then(response => {
          if (response.data.code === 200) {
            this.$message({
              showClose: true,
              message: "已创建订单",
              type: "success"
            });
            this.changeOrderPage(this.orderPage);
            this.orderVisible = true;
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: "error"
            });
          }
          this.cartDialogVisible = false;
        })
        .catch(error => console.log(error));
    },
    addToCart(productId) {
      if (this.cartMap.has(productId)) {
        let old = this.cartMap.get(productId);
        this.cartMap.set(productId, old + 1);
      } else {
        this.cartMap.set(productId, 1);
      }
      this.$message({
        showClose: true,
        message: "已加入",
        type: "success"
      });
    },
    changePage(page) {
      this.productsPage = page;
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-reward/product/current/" +
            this.productsPage +
            "/size/12"
        )
        .then(response => {
          if (response.data.code === 200) {
            this.products = response.data.data;
            this.updateProductIdNameMap();
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
    pageProducts() {
      this.$axios
        .get(
          this.$store.state.ip +
            "/markdownnow-reward/product/current/" +
            this.productsPage +
            "/size/12"
        )
        .then(response => {
          if (response.data.code === 200) {
            this.products = response.data.data;
            this.updateProductIdNameMap();
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
.flexFather {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  align-content: space-around;
  width: 100%;
  height: 580px;
}
.productBorder {
  background-color: antiquewhite;
  width: 240px;
  height: 280px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.product {
  width: 220px;
  height: 260px;
  background-color: white;
}
.image {
  margin: 0 0;
  width: 220px;
  height: 170px;
  object-fit: cover;
}
.detailImage {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin: 5px 0;
}
.price {
  text-align: center;
  color: #ff6700;
}
.cart {
  right: 10px;
  bottom: 0;
  position: fixed;
}
.cartImg {
  width: 60px;
  height: 60px;
  object-fit: cover;
}
.cartList {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 300px;
}
.cartListOutside {
  padding: 0 350px;
}
.orderButton {
  right: 80px;
  bottom: 15px;
  position: fixed;
}
.detailRow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.orderInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
</style>
