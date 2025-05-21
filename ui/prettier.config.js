module.exports = {
  trailingComma: 'none',
  arrowParens: 'avoid',
  bracketSpacing: true,
  printWidth: 120,
  tabWidth: 2,
  overrides: [
    {
      files: '*.html',
      options: {
        printWidth: 90,
        bracketSameLine: false,
        parser: 'angular',
        htmlWhitespaceSensitivity: 'ignore',
        singleAttributePerLine: false
      }
    }
  ],
};