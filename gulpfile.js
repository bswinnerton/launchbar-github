var gulp  = require('gulp');
var shell = require('gulp-shell');

var path = 'Contents/Scripts/!(bundle.min.js)*.js';

gulp.task('build', function () {
  return gulp.src(path).pipe(shell(['script/build']));
});

gulp.task('watch', function() {
  gulp.watch(path, gulp.series('build'));
});
