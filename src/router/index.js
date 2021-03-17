import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Blog",
    component: () => import("../views/blog")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/register")
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: () => import("../views/detail")
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import("../views/user")
  },
  {
    path: "/album/:id",
    name: "Album",
    component: () => import("../views/album")
  },
  {
    path: "/personal",
    name: "Personal",
    component: () => import("../views/personal")
  },
  {
    path: "/edit/:articleId",
    name: "Edit",
    component: () => import("../views/edit")
  },
  {
    path: "/add",
    name: "Add",
    component: () => import("../views/add")
  },
  {
    path: "/search/:str",
    name: "Search",
    component: () => import("../views/search")
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/search")
  },
  {
    path: "/mall",
    name: "Mall",
    component: () => import("../views/mall")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
