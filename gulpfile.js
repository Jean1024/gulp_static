const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const del = require('del');
const uglify = require('gulp-uglify');
const pump = require('pump');

const paths = {
  allSrcJs: './src/js/*.js',
  libDir: './dist/js',
  allSrcCss: './src/css/*.css',
  cssDir: './dist/css'
};
// Environment setup.
var env = {
  production: false
};

// Environment task.
gulp.task('set-production', function() {
  env.production = true;
});

gulp.task('cleanjs', () => {
  return del(paths.libDir);
});
gulp.task('cleancss', () => {
  return del(paths.cssDir);
});

gulp.task('buildjs', ['cleanjs'], cb => {
  if (env.production) {
    pump([
      gulp.src(paths.allSrcJs),
      babel({
        presets: ['es2015']
      }),
      uglify(),
      gulp.dest(paths.libDir)
    ], cb)
  } else {
    pump([
      gulp.src(paths.allSrcJs),
      babel({
        presets: ['es2015']
      }),
      gulp.dest(paths.libDir)
    ], cb)
  }
});

// Css process.
gulp.task('postcss', ['cleancss'], cb => {
  var plugins = [
    autoprefixer({
      browsers: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 10'],
    })
  ];

  if (env.production) {
    plugins.push(cssnano());
    pump([
      gulp.src(paths.allSrcCss),
      postcss(plugins),
      gulp.dest(paths.cssDir)
    ], cb)
  } else {
    pump([
      gulp.src(paths.allSrcCss),
      sourcemaps.init(),
      postcss(plugins),
      sourcemaps.write('.'),
      gulp.dest(paths.cssDir)
    ], cb)
  }
});

gulp.task('watch', function() {
  gulp.watch(paths.allSrcCss, ['postcss']);
  gulp.watch(paths.allSrcJs, ['buildjs']);
});

gulp.task('default', ['postcss', 'buildjs', 'watch']);
gulp.task('build', ['set-production', 'postcss', 'buildjs']);