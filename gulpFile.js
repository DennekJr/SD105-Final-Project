const {src, dest, series, watch} = require('gulp');



const pages = () => {
  return src('*.html').pipe(dest('dist'));
};
const scripts = () => {
  return src('src/scripts/*.js').pipe(dest('dist/scripts'));
};
const modules = () => {
  return src('src/scripts/modules/*.js').pipe(dest('dist/scripts/modules'));
};
const styles = () => {
  return src('src/styles/*.css').pipe(dest('dist/styles'));
};

const watchTask = () => {
  return watch(['src/**/**/**'], series(scripts, styles))
}


exports.default = series(scripts, styles, pages, modules);
exports.watch = watchTask;