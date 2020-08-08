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
    path: "/personal",
    name: "Personal",
    component: () => import("../views/personal")
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../views/chat")
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
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
