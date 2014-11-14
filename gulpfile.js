/**
 * Load required Gulp packages and tasks.
 */
var gulp = require('gulp'),
  runSequence = require('gulp-run-sequence'),
  clean = require('gulp-clean'),
  inject = require('gulp-inject'),
  jshint = require('gulp-jshint'),
  karma = require('karma').server,
  preprocess = require('gulp-preprocess'),
  ngHtml2js = require('gulp-ng-html2js'),
  concat = require('gulp-concat'),
  order = require('gulp-order'),
  debug = require('gulp-debug'),
  util = require('gulp-util'),
  less = require('gulp-less');


/**
 * Gulp build configuration
 */
var config = require('./gulp-config/gulp.build.config');
var buildPrefix = config.build_dir + "/";

/**
 * Gulp helper method to copy files and folders preserving any hierarchy
 * @param {glob} src Source file or folder filter to copy
 * @param {string} dest Destination path
 * @param {object|null} [opts] Options to pass into node-glob
 * @param {string} [opts.base] Base directory to clone, default: everything before a glob starts
 * @return {Stream} Vinyl stream
 */
gulp.copy = function (src, dest, opts) {
  opts = opts ? opts : {base: "./"};
  return gulp.src(src, opts)
    .pipe(gulp.dest(dest));
};

/**
 * Gulp helper method to copy files into a flat folder (removing structure)
 * @param {glob} src Source file or folder filter to copy
 * @param {string} dest Destination path
 * @return {Stream} Vinyl stream
 */
gulp.copyFlat = function (src, dest) {
  return gulp.src(src)
    .pipe(gulp.dest(dest));
};

/**
 * Gulp helper method to inject source files directly into placeholders
 * @param {string} target Target file for injection
 * @param {glob} src Files to inject
 * @param {string} dest Destination Output
 * @return {Stream} Vinyl stream
 */
gulp.inject = function (target, src, dest) {
  return gulp.src(target)
    .pipe(inject(src, {addRootSlash: false}))
    .pipe(gulp.dest(dest));
};

/**
 * Gulp helper method to concatenate HTML into an AngularJS template cache
 * @param {glob} src Files to merge
 * @param {string} target Target file name
 * @param {string} dest Destination directory
 * @param {string} name AngularJS module name
 * @return {Stream} Vinyl stream
 */
gulp.htmlToNg = function (src, target, dest, name) {
  return gulp.src(src)
    .pipe(ngHtml2js({
      moduleName: name
    }))
    .pipe(concat(target))
    .pipe(gulp.dest(dest));
};

/**
 * Cleans the build destination directory.
 *
 * Note: Destructive, removes all files in the `config.build_dir`
 */
gulp.task('build-clean', function () {
  return gulp.src(config.build_dir).pipe(clean());
});

/**
 * Copies vendor files and app assets/scripts to the build directory
 */
gulp.task('build-copy', function () {
  var files = [].concat(
    config.vendor.scripts,
    config.vendor.styles,
    config.vendor.assets,
    config.app.scripts
  );
  return gulp.copy(files, config.build_dir);
});

/**
 * Copies any app assets into the build directory
 */
gulp.task('build-copy-app-assets', function () {
  return gulp.copy('src/assets/**/*.*', config.build_dir + "/assets", {base: './src/assets'});
});

/**
 * Copies any vendor font dependencies directly into the `config.build_dir`/fonts directory
 */
gulp.task('build-copy-vendor-fonts', function () {
  return gulp.copy(config.vendor.fonts, config.build_dir /* + "/" + config.font_sub_dir*/);
});

/**
 * Concatenates app specific HTML templates into a single AngularJS module
 */
gulp.task('build-app-templates', function () {
  return gulp.htmlToNg(config.app.templates, config.app.templates_build, config.build_dir, "templates-app");
});

/**
 * Concatenates common HTML templates into a single AngularJS module
 */
gulp.task('build-common-templates', function () {
  //ToDo: Find a better way.
  //If no templates exist within the common structure, gulp will not create the required module.
  //This has been overcome by having a placeholder copied into the build directory first
  gulp.copyFlat('gulp-config/templates-common.js', config.build_dir);
  return gulp.htmlToNg(config.app.common_templates, config.app.common_templates_build, config.build_dir, "templates-common");
});

/**
 * Builds the LESS file `config.app.less_file` for testing
 */
gulp.task('build-less', function () {
  gulp.src([config.app.less_file].concat(config.app.styles))
    .pipe(less())
    .pipe(gulp.dest(config.build_dir));
});

/**
 * Injects the app script and style dependencies into a built index `config.app.index_file`
 */
gulp.task('build-inject-index', function () {

  var vendorFiles = [].concat(
    config.vendor.styles,
    config.vendor.scripts
  );

  var scripts = [].concat(config.app.scripts);
  var templates = [config.app.templates_build, config.app.common_templates_build];
  var styles = ['main.css', '**/*.css', '!vendor/**/*.css'];

  return gulp.src(config.app.index_file)
    .pipe(inject(gulp.src(vendorFiles, {read: false}), {name: 'vendor', addRootSlash: false}))
    .pipe(inject(gulp.src(scripts, {read: false}), {name: 'app', addRootSlash: false}))
    .pipe(inject(gulp.src(templates, {read: false, cwd: config.build_dir}), {name: 'templates', addRootSlash: false}))
    .pipe(inject(gulp.src(styles, {read: false, cwd: config.build_dir}), {name: 'app', addRootSlash: false}))
    .pipe(gulp.dest(config.build_dir));
});

/**
 * Runs JSHint over JavaScript files to assist detecting potential errors and problems.
 * Note: JSHint can be configured via the `.jshintrc` file
 */
gulp.task('jshint', function () {
  return gulp.src(config.app.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

/**
 * Copies the Karma configuration to the build directory in preparation for testing
 */
gulp.task('karma-setup', function () {
  var target = gulp.src('./gulp-config/gulp.karma.config.js');
  var files = [].concat(
    config.vendor.scripts,
    config.test.scripts
  );
  var templates = [buildPrefix + config.app.templates_build, buildPrefix + config.app.common_templates_build];

  var sources = "'" + files.concat(templates).join("', '") + "'";

  return target.pipe(preprocess({context: {SCRIPTS: sources}}))
    .pipe(gulp.dest(config.build_dir));
});

/**
 * Runs the Karma unit testing
 */
gulp.task('karma-run', function () {
  return karma.start({
    configFile: __dirname + "/" + config.build_dir + "/gulp.karma.config.js",
    singleRun: true
  });
});

/**
 * The default task is to build the client and run the unit tests
 */
gulp.task('default', function (cb) {
    runSequence('build-clean', 'jshint',
      [
        'build-copy', 'build-copy-app-assets', 'build-copy-vendor-fonts',
        'build-app-templates', 'build-common-templates', 'build-less'
      ],
      'build-inject-index', 'karma-setup', 'karma-run'
    );
  }
);

//ToDo: compile less, concat css, watch, karma continuous, compile, ng-annotate, uglify
