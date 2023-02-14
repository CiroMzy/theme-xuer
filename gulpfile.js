var gulp = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var fs = require("fs");

function styles() {
  return gulp
    .src("less/style.less")
    .pipe(less())
    .pipe(gulp.dest("./dist/assets"));
}

function concatJs() {
  const jsFiles = [
    "message",
    "tools",
    "animate",
    "base",
    "collapse",
    "drawer",
    "price-range",
    "address-form",
    "address-list",
    "announcement-bar",
    "product-filters",
    "featured-product",
    "footer",
    "form-address-select",
    "form-checkbox",
    "form-input",
    "form-select",
    "header-menu",
    "localization-form",
    "mini-cart",
    "product-slide",
    "quantity-selector",
    "slideshow",
    "variant-picker",
    "drawer-search",
    "product-item",
    "video",
    "time-line",
    "quick-buy",
    "tab",
  ];

  const computedSrc = jsFiles.map((i) => `themeJs/${i}.js`);

  return gulp
    .src(computedSrc)
    .pipe(concat("theme.js"))
    .pipe(gulp.dest("assets"));
}

function watch() {
  gulp.watch("less/*.less", styles);
  gulp.watch("themeJs/*.js", concatJs);
  const cpWatch = gulp.watch([
    "snippets",
    "config",
    "assets",
    "sections",
    "locales",
    "templates",
    "theme.liquid",
  ]);
  cpWatch.on("change", function (path) {
    console.log(`File ${path} was changed`);
    const fileString = fs.readFileSync(path);
    fs.writeFileSync(`dist/${path}`, fileString);
  });
}

exports.watch = watch;
