import { createRouter, createWebHistory } from "vue-router";
import menu from "../../menu.json";
const getRoute = (menu, parentPath) => {
  return menu?.map((item) => {
    let path = parentPath + item.router;
    return {
      path,
      name: item.name,
      meta: {
        view: item.view,
      },
      component: [],
      children: getRoute(item.children, path),
    };
  });
};
const routes = getRoute(menu, "");
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PATH),
  routes,
});

export default router;
