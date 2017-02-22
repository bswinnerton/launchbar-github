var gulp  = require('gulp');
var shell = require('gulp-shell');

var path = 'Contents/Scripts/!(bundle.js)*.js';

gulp.task('build', function () {
  return gulp.src(path).pipe(shell(['script/build']));
});

gulp.task('watch', function() {
  gulp.watch(path, ['build']);
});
