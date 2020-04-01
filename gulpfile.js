const { series, parallel, src, dest, watch } = require('gulp');
const clean = require('gulp-clean');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const rename = require("gulp-rename")
const prettyHtml = require('gulp-pretty-html');
const Crypto = require('crypto-js');

const manageEnvironment = function(environment) {
  // Get brand color according to brand name.
  environment.addFilter(
    'getBrandColor',
    function (name) {
        const info = {
            "medium": '#00ab6c',
            "twitter": '#1da1f2',
            "weibo": '#DA291C',
            "reddit": '#ff4500',
            "website": '#737373',
            "telegram": '#0088cc',
            "github": '#24292e',
            "mobile": '#a4c639',
            "desktop": '#0078d7'
        }
        return (info[name.toLowerCase()] || 'black')
    })

  environment.addFilter(
    'getJobStatusName',
    // Get jobStatus from key
    function (key) {
      const info = {
          "vechain_team": "VeChain Staff",
          "community_member": "Community Member",
          "third_party": "Third Party"
      }
      return (info[key.toLowerCase()] || null)
    }
  )

  environment.addFilter(
    'getHashID',
    function (key) {
      return Crypto.SHA256(key).toString().slice(0,7)
    }
  )

  environment.addGlobal(
    'makeString',
    function (key) {
      return String(key)
    }
  )

  environment.addGlobal(
    'compareByJob',
    function (itemA, itemB) {
      // if has official mark
      if (itemA["run_by_vechain"] || itemB["run_by_vechain"]) {
          // both official.
          if (itemA["run_by_vechain"] && itemB["run_by_vechain"]) {
              return 0
          }
          // Only A is official
          if (itemA["run_by_vechain"]) {
              return -1
          }
          // Only B is official
          if (itemB["run_by_vechain"]) {
              return 1
          }
      }
  
      // if has staff mark
      if (itemA["job_status"] == "vechain_team" || itemB["job_status"] == "vechain_team") {
          // both staff
          if (itemA["job_status"] == "vechain_team" && itemB["job_status"] == "vechain_team") {
              return 0
          }
          // only A is staff
          if (itemA["job_status"] == "vechain_team") {
              return -1
          }
          // only B is staff
          if (itemB["job_status"] == "vechain_team") {
              return 1
          }
      }
  
      // cannot compare, leave it equal.
      return 0
  }
  )
}

function copyEnv() {
  if (process.env.NODE_ENV == "development") {
    return src('src/env/env.local.js').pipe(rename('env.js')).pipe(dest('dist/js/'))
  } else {
    return src('src/env/env.production.js').pipe(rename('env.js')).pipe(dest('dist/js/'))
  }
}

function javascript() {
  return src(['src/js/*.js', 'src/vendor-js/*.js']).pipe(dest('dist/js/'))
}

function css() {
  return src(['src/css/*.css', 'src/vendor-css/*.css']).pipe(dest('dist/css/'))
}

// Render with nunjucks
function html() {
  return src('src/templates/*.+(html|njk)')
          .pipe(data(function(){ return require('./src/data/data.json')}))
          .pipe(nunjucksRender({
            path: ['src/templates'],
            manageEnv: manageEnvironment
          }))
          .pipe(prettyHtml({
            indent_size: 2,
            indent_char: " ",
            indent_with_tabs: false,
            preserve_newlines: false,
            indent_inner_html: true
          }))
          .pipe(dest('dist/'))
}

function cleanUp() {
  return src(['dist/js/*.js','dist/css/*.css','dist/*.html'], {read: false}).pipe(clean())
}

const allTasks = series(cleanUp, parallel(javascript, copyEnv, css, html))

exports.dev = function () {
  watch(['src/css/*.css','src/js/*.js','src/templates/**/*.+(html|njk)', 'src/data/*.json'], { ignoreInitial: false }, allTasks)
}

exports.publish = allTasks
