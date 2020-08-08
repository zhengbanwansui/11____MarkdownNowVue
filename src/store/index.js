import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: -1,
    token: "",
    ip: "http://192.168.1.65"
  },
  mutations: {},
  actions: {},
  modules: {}
});
