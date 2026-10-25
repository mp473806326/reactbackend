import Mock from "mockjs";
import { defineMock } from "vite-plugin-mock-dev-server";
import { resultSuccess } from "./utils";

export default defineMock([
  {
    url: "/node/data",
    delay: [150, 300],
    method: ["GET"],
    body: () => {
      const mockData = Mock.mock({
        "data|10-20": [
          {
            "id|+1": 1,
            key: "@guid",
            name: "@cname",
            "age|18-60": 1,
            address: "@county(true)",
            "tags|1-3": ["@ctitle(2, 4)"],
          },
        ],
      });
      return resultSuccess(mockData.data, "数据获取成功");
    },
  },
]);

