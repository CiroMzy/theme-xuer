var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var fs = require('fs');

function styles() {
  return gulp.src('less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/assets'))

}

function concatJs() {
  return gulp.src('themeJs/*.js')
  .pipe(concat('theme.js'))
  .pipe(gulp.dest('assets'))
}

 
function watch() {
  gulp.watch('less/*.less', styles);
  gulp.watch('themeJs/*.js', concatJs);
  const cpWatch = gulp.watch([
    'snippets',
    'config',
    'assets',
    'sections',
    'templates',
    'theme.liquid'
  ]);
  cpWatch.on('change', function(path) {
    console.log(`File ${path} was changed`);
    const fileString = fs.readFileSync(path)
    fs.writeFileSync(`dist/${path}`, fileString)
  });
}
 
 
exports.watch = watch;