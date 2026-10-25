import React from "react";
import { Navigate } from "react-router-dom";
import { lazyLoader } from "@/router/lazyLoader";
import { cloneDeep } from "lodash";
import LayoutContent from "@/layout/layout";
import PlatformLogin from "@/views/PlatformLogin";

// 获取 views 目录下的全部 .jsx .tsx 文件
const viewsModules = import.meta.glob<{ default: React.ComponentType }>("../views/**/*.{jsx,tsx}");

// 根据 path 匹配文件，返回 import 函数
const dynamicImport = (path: string) => {
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter(key => {
    const k = key.replace(/..\/views|../, "");
    return k.startsWith(`${path}`) || k.startsWith(`/${path}`);
  });
  if (matchKeys.length === 1) {
    return viewsModules[matchKeys[0]];
  } else {
    return null;
  }
};

// 将后端路由数据转为 React Router 格式
const transformRoutes = (routes: PageRouteItem[]) => {
  return cloneDeep(routes)
    .filter(item => item.meta.isRouter)
    .map(item => {
      const { path, element } = item;
      const importFunc = dynamicImport(element as string);
      return {
        path: path as string,
        element: importFunc ? lazyLoader(React.lazy(importFunc)) : <Navigate to="/404"></Navigate>,
      };
    });
};

// 获取系统路由
export default function getSystemRoutes(pageRoutes: PageRouteItem[]) {
  return [
    {
      path: "/",
      element: <Navigate to="/platformLogin" />,
    },
    {
      path: "/platformLogin",
      element: <PlatformLogin />,
    },
    {
      element: <LayoutContent />,
      children: [
        ...transformRoutes(pageRoutes),
        { path: "/403", element: lazyLoader(React.lazy(() => import("@/views/Error/403"))) },
        { path: "/404", element: lazyLoader(React.lazy(() => import("@/views/Error/404"))) },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" />,
    },
  ];
}
