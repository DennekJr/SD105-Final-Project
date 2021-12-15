const {src, dest, series} = require('gulp');

const defaultTask = () => {
  return src('src/*.html').pipe(dest('dist'));
};
const scripts = () => {
  return src('src/scripts/*.js').pipe(dest('dist/scripts'));
};
const styles = () => {
  return src('src/styles/*.css').pipe(dest('dist/styles'));
};

exports.default = series(scripts, styles);