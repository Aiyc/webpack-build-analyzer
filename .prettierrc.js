module.exports = {
  printWidth: 100, // 每行最大字符数
  tabWidth: 2, // 缩进空格数
  useTabs: false, // 禁用制表符（用空格）
  semi: true, // 句尾分号
  singleQuote: true, // 使用单引号
  quoteProps: 'consistent', // 对象属性引号一致性（自动）
  trailingComma: 'all', // 多行尾随逗号（全部添加）
  bracketSpacing: true, // 对象括号空格 { foo: bar }
  arrowParens: 'always', // 箭头函数参数括号（始终添加）
  endOfLine: 'lf', // 换行符类型（Unix 风格）
  overrides: [
    {
      files: ['*.nvue'],
      options: {
        parser: 'vue',
      },
    },
  ],
};
