export default {
  plugins: {
    "postcss-px-to-viewport": {
      viewportWidth: 750,
      unitToConvert: "px",
      viewportUnit: "dvw",
      fontViewportUnit: "dvh",
      selectorBlackList: ["fixed-element"],
    },
    "postcss-viewport-units": {
      filter: (file) => !file.includes("node_modules"),
      replace: {
        'px': 'dvw',  // 自动转换设计稿px为dvw单位
      },
      overrideDvh: true, // 自动将vh转换为dvh
      exclude: ["gradient"], // 排除背景渐变
    },
    "postcss-clamp": {}, // 自动生成clamp表达式
    autoprefixer: {
      flexbox: "no-2009",
    },
  },
};
