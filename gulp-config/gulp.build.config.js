module.exports = {
  /**
   * The directory where the project will be built during development
   */
  build_dir: 'build',
  /**
   * The directory where the project will be compiled for production
   */
  compile_dir: 'public',

  /**
   * Font sub-directory for the build and compile locations (to keep css font paths happy)
   */
  font_sub_dir: 'fonts',

  /**
   * App specific code and files (located in `src` directory).
   */
  app: {
    /**
     * App specific JavaScript files (excluding unit tests)
     */
    scripts: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],

    /**
     * App specific unit tests
     */
    unit_tests: ['src/**/*.spec.js'],

    /**
     * App component styles and overrides
     */
    styles: ['src/**/*.less'],

    /**
     * App specific reusable HTML partial views and templates and associated `build/` output file
     */
    templates: ['src/app/**/*.tpl.html'],
    templates_build: 'templates-app.js',

    /**
     * Reusable (non-app specific) HTML partial views and templates and associated `build/` output file
     */
    common_templates: ['src/common/**/*.tpl.html'],
    common_templates_build: 'templates-common.js',

    /**
     * Primary app entry point (index) and stylesheet
     */
    index_file: ['src/index.html'],
    less_file: 'src/less/main.less'
  },

  /**
   * Vendor specific dependencies for the app
   * Directory structure is maintained during builds and testing, however all scripts and styles will be concatenated
   * for distribution
   */
  vendor: {
    /**
     * JavaScript dependencies
     */
    scripts: [
      'vendor/angular/angular.js',
      'vendor/angular-ui-router/release/angular-ui-router.js'
    ],
    /**
     * Vendor stylesheets
     */
    styles: [
      'vendor/semantic-ui/build/packaged/css/semantic.min.css'
    ],
    /**
     * Vendor specific fonts to be copied to the output directories.
     * Note: matching files are flattened and placed directly under the `<build_dir/compile_dir>/fonts/`
     */
    fonts: [
      'vendor/semantic-ui/build/packaged/fonts/*'
    ],
    /**
     * Vendor assets
     */
    assets: []
  },

  /**
   * Collection of specific files included during tests only
   */
  test: {
    scripts: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  }
};
