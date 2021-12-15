const {src, dest, series, watch} = require('gulp');

const scripts = () => {
  return src('src/scripts/*.js').pipe(dest('dist/scripts'));
};
const styles = () => {
  return src('src/styles/*.css').pipe(dest('dist/styles'));
};

const watchTask = () => {
  return watch(['src/**/**/**'], series(scripts, styles))
}


exports.default = series(scripts, styles);
exports.watch = watchTask;