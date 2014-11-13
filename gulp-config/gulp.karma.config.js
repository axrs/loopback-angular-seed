module.exports = function (config) {
  config.set({
    basePath: '../',
    files: [
      /* @echo SCRIPTS */,
      'src/**/*.js'
    ],
    plugins: ['karma-jasmine', 'karma-chrome-launcher'],
    browsers: ['Chrome'],
    frameworks: ['jasmine']
  });
};
