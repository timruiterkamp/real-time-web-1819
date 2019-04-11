const gulp = require("gulp");
const uglify = require("gulp-uglify");
const clean = require("gulp-clean");
const concat = require("gulp-concat");

gulp.task("clean", function() {
  return gulp.src("dist/*", { read: false }).pipe(clean());
});

gulp.task("minifyJS", function() {
  return (
    gulp
      .src("./src/static/*.js") // path to your files
      .pipe(concat("index.js"))
      // .pipe(uglify())
      .pipe(gulp.dest("dist/scripts/"))
  );
});

// if (process.env.NODE_ENV !== 'production') {
//   gulp.watch(['scripts/**/*.js'], gulp.series('minifyJS'))
// }
