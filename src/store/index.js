import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: -1,
    token: "",
    ip: "http://127.0.0.1:8090",
    minioAddress: "http://127.0.0.1:9000"
  },
  mutations: {},
  actions: {},
  modules: {}
});
