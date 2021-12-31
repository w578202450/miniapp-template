const { src, dest, series, watch } = require('gulp')
const scss = require('gulp-sass') // scss编译插件
const postcss = require('gulp-postcss') // 强大的css处理插件
const pxtorpx = require('postcss-px2rpx') // px转为rpx
const styleAliases = require('gulp-style-aliases') // scss设置alias
const rename = require('gulp-rename') // 更改文件名
const replace = require('gulp-replace') // 替换内容
const changed = require('gulp-changed') // 检测改动
const autoprefixer = require('autoprefixer') //  自动添加前缀
const env = process.env.NODE_ENV
console.log('构建环境：', env)

const paths = {
  styles: {
    src: ['miniprogram/**/*.scss'],
    dest: 'dist/',
  },
  wxml: {
    src: 'miniprogram/**/*.wxml',
    dest: 'dist/',
  },
  copy: {
    src: [
      'miniprogram/**/*',
      '!miniprogram/**/*.scss',
      '!miniprogram/node_modules',
      '!miniprogram/node_modules/**/*',
    ],
    dest: 'dist/',
  },
  env: {
    src: [`miniprogram/config/env.${env}.js`],
    dest: 'miniprogram/',
  },
}


/**
 * @Description: 将所有miniprogram中的文件按照paths规则打包到dist中
 * @param {*}
 * @Author: wangwangwang
 */
function copyToDist() {
  return src(paths.copy.src).pipe(dest(paths.copy.dest))
}

/**
 * 拷贝环境变量
 */
function copyEnv() {
  return src(paths.env.src)
    .pipe(
      rename(function (path) {
        path.basename = 'env'
      })
    )
    .pipe(dest(paths.env.dest))
}


/**
 * 编译sass文件为wxss文件
 * refrence: https://juejin.cn/post/6844903778496282632
 */
function compileStyle() {
  /**
   * 步骤如下：
   * 指定文件处理目录
   * gulp-replace通过正则匹配@import语句将其注释
   * 启用gulp-sass编译scss文件，
   * 通过postcss对低版本ios和安卓进行兼容样式处理
   * gulp-rename更改文件后缀为.wxss
   * gulp-replace通过正则匹配@import语句打开注释
   * 最后输入到dist目录
   */
  return src(paths.styles.src)
    .pipe(
      replace(/\\@(import\s[^@;]*)+(;import|\bimport|;|\b)?/g, ($1) => {
        // 与小程序自带的import不同，sass会把@improt的内容打包到当前文件，所以打出来的包会大一点
        // 而小程序限制单包大小不能超过2M，如果由于@import导致包过大，需要注释掉@import(使用自带的import)，等sass编译完后在重新打开
        // 考虑到小程序的样式文件单包应该不会超过2M，而且注释掉@import会导致sass中的变量申明、@mixin功能就不能用了，这里还是选择使用sass的@import功能
        return $1 // `\/*T${$1}T*\/`
      })
    )
    .pipe(
      styleAliases({
        '@miniprogram': 'miniprogram',
        '@page': 'miniprogram/page',
        '@styles': 'miniprogram/styles',
      })
    )
    .pipe(scss())
    .pipe(
      postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1']), pxtorpx()])
    )
    .pipe(
      rename(function (path) {
        path.extname = '.wxss'
      })
    )
    .pipe(changed(paths.styles.dest))
    .pipe(replace(/.scss/g, '.wxss'))
    .pipe(replace(/\/\*T(@import\s[^@;]*;)?(T\*\/)/g, '$1'))
    .pipe(dest(paths.styles.dest))
}

function watchTask() {
  watch(paths.styles.src, compileStyle)
  watch(paths.env.src, copyEnv)
  watch(paths.copy.src, copyToDist)
}

const buildTask = series(
  copyEnv,
  compileStyle,
  copyToDist,
)
exports.watch = series(buildTask, watchTask)

exports.default = buildTask
