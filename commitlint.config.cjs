module.exports = {
  extends: ["@commitlint/config-conventional"],
  // 校验规则（违反就报错）
  rules: {
    "type-enum": [
      2, // 错误级别，违反直接报错
      "always", // 每次提交都必须校验
      [
        // 允许的提交类型（只能用这些）
        "feat", // 新功能
        "fix", // 修复bug
        "docs", // 文档
        "style", // 代码格式（空格、换行、分号）
        "refactor", // 重构（不改功能、不改bug）
        "perf", // 性能优化
        "test", // 测试
        "build", // 构建脚本
        "ci", // 自动化配置
        "chore", // 杂项修改
        "revert", // 回滚代码
      ],
    ],
    "type-case": [0], // 不限制大小写
    "type-empty": [2, "never"], // 提交类型不能为空
    "subject-empty": [2, "never"], // 描述不能为空
    "subject-full-stop": [0, "never"], // 结尾不要句号
    "scope-empty": [0, "always"], // 范围可以不填
    "body-empty": [0, "always"], // 详细描述可以不填
    "footer-empty": [0, "always"], // issue可以不填
    "subject-case": [0], // 不限制描述格式
  },
};
