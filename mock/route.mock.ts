import { defineMock } from "vite-plugin-mock-dev-server";
import { resultSuccess, resultError } from "./utils";
import frontEndRoutes from "@/router/frontEnd";
import cloneDeep from "lodash/cloneDeep.js";
const frontRouteKeys = ["/home", "/basictable"];

const filterFn = () => {
  const arr = cloneDeep(frontEndRoutes);
  const keySet = new Set(frontRouteKeys);
  const byId = new Map(arr.map(item => [item.id, item]));
  const keepIds = new Set<string | number>();

  arr.forEach(item => {
    const matched =
      keySet.has(String(item.id)) || (item.path != null && keySet.has(item.path));
    if (!matched) return;

    keepIds.add(item.id);
    let parent = item.parent;
    while (parent != null) {
      keepIds.add(parent);
      parent = byId.get(parent)?.parent ?? null;
    }
  });

  return arr.filter(item => keepIds.has(item.id));
};
export default defineMock([
  {
    url: "/mock/backendRoute",
    delay: [200, 500],
    method: ["GET"],
    body: ({ headers }) => {
      const { authorization } = headers;
      if (authorization === "Bearer 123456abc") {
        const newArr = filterFn();
        console.log('newArr',newArr);
        // return resultSuccess(newArr, "success");
        return resultSuccess(frontEndRoutes, "success");
      } else {
        return resultError([], "no permission");
      }
    },
  },
]);
