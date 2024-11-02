import { createWebHashHistory, createRouter } from "vue-router";
import Layout from "@/views/layout/index.vue";

const originalPush = createRouter.prototype.push;
createRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "/pool",
        name: "pool",
        component: () => import("@/views/pool/index.vue"),
        meta: {
          title: "碎片合成",
        },
      },
      {
        path: "/detail",
        name: "detail",
        component: () => import("@/views/detail/index.vue"),
        meta: {
          title: "数据查询",
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "err",
    component: () => import("@/views/err/404.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
