var gulp = require('gulp');
var less = require('gulp-less');
 
var paths = {
  styles: {
    src: 'less/*.less',
    dest: './dist/assets'
  }
};
 
/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src('less/style.less')
    .pipe(less())
    // .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/assets'));
}
 
function watch() {
  gulp.watch(paths.styles.src, styles);
}
 
 
/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.styles = styles;
exports.watch = watch;