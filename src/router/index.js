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
          title: "Home",
        },
      },
      {
        path: "/pool",
        name: "pool",
        component: () => import("@/views/pool/index.vue"),
        meta: {
          title: "Fragment",
        },
      },
      {
        path: "/detail",
        name: "detail",
        component: () => import("@/views/detail/index.vue"),
        meta: {
          title: "Query",
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
