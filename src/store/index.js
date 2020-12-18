import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: -1,
    token: "",
    ip: "http://localhost:8090",
    minioAddress: "http://localhost:9000"
  },
  mutations: {},
  actions: {},
  modules: {}
});
