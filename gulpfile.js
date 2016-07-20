// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    react = require('gulp-react'),             //react Js
    merge = require('gulp-merge'),             //merge 
    fileinclude = require('gulp-file-include'),// include 文件用
    autoprefixer = require('gulp-autoprefixer'),//根据浏览器版本自动处理浏览器兼容前缀
    notify = require('gulp-notify'),           //消息通知
    clean = require('gulp-clean'),             //清空文件夹
    livereload = require('gulp-livereload');   //livereload
//原文件路径
var pathSrc = {
    //[注]按顺序加载时需要把文件依次写全
    libFile: [
        './src/config/online.url.js',//线上环境
        // './src/config/develop.url.js',//开发环境
        './src/lib/react/react.js',
        './src/lib/react/react-dom.js',
        './src/lib/jquery-2.1.3.min.js',
        // './src/lib/zepto.min.js',
        // './src/lib/webuploader/webuploader.html5only.min.js',
        './src/lib/swiper/swiper-3.2.7.jquery.min.js',
        './src/lib/ratchet/js/ratchet.js',
        './src/lib/moment.js',
        './src/lib/iscroll.v4.2.js',
        './src/lib/i-alert.js',
        './src/lib/app-tool.js',
        './src/lib/public.js'
    ],
    cssFile: [
        './src/lib/ratchet/css/ratchet.min.css',
        './src/lib/ratchet/css/ratchet-theme-ios.min.css',
        './src/lib/swiper/swiper-3.2.7.min.css'
        // './src/lib/webuploader/webuploader.css'
    ],
    webuploader: [
        './src/lib/webuploader/*'
    ],
    fonts: [
        './src/lib/ratchet/fonts/*'
    ],
    jsx: [
        './src/components/**/*.jsx'
    ],
    scss: [
        './src/components/**/*.scss'
    ],
    pages: [
        './src/pages/**/*.html'
    ],
    images: [
        './src/assets/images/*'
    ],
    tempData:[
        './src/tempdata/*'
    ]
};
//生成文件路径
var pathDes= {
    assets: './release/assets',
    css: './release/css',
    fonts: './release/fonts',
    webuploader: './release/webuploader',
    js: './release/js',
    pages: './release/pages',
    tempData: './release/tempdata'
};

// tempData 处理
gulp.task('tempData', function () {
    return gulp.src(pathSrc.tempData)
        .pipe(gulp.dest(pathDes.tempData))
        .pipe(notify({message: 'temp Data completed!'}));
});
// pages 处理
gulp.task('pages', function () {
    gulp.src(pathSrc.pages)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                version: new Date().getTime()
            }
        }))
        .pipe(gulp.dest(pathDes.pages))
        .pipe(livereload())
        .pipe(notify({message: 'pages completed!'}));
});

// cssFile 样式处理
gulp.task('cssFile', function () {

    return merge(cssLib(),cssSass())
        .pipe(concat('app.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(pathDes.css))
        .pipe(livereload())
        .pipe(notify({message: 'coreCss completed!'}));
});
function cssSass(){
    return sass(pathSrc.scss, {style:'expanded', "sourcemap": true, "noCache": true})
        .pipe(iAutoprefixer())
        .pipe(concat('scsslib.css'));
}
function cssLib(){
    return gulp.src(pathSrc.cssFile)
        .pipe(iAutoprefixer())
        .pipe(concat('public.css'));
}

// 图片处理
gulp.task('images', function(){

    return gulp.src(pathSrc.images)
        .pipe(imagemin())
        .pipe(gulp.dest(pathDes.assets))
        .pipe(livereload())
        .pipe(notify({message: 'images completed!'}));
})

//libFile 处理
gulp.task('libFile', function(){
    return merge(appLib(),appJsx())
            .pipe(jshint())
            // .pipe(jshint.reporter('default'))
            .pipe(concat('app.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(pathDes.js))
            .pipe(livereload())
            .pipe(notify({message: 'libFile completed!'}));
});
function appJsx(){
    return gulp.src(pathSrc.jsx)
            .pipe(concat('app.jsx'))
            .pipe(react());
}
function appLib(){
    return gulp.src(pathSrc.libFile)
            .pipe(concat('lib.js'));
}

// fonts 处理
gulp.task('fonts', function () {
    return gulp.src(pathSrc.fonts)
        .pipe(gulp.dest(pathDes.fonts))
        .pipe(notify({message: 'fonts completed!'}));
});

// webuploader 处理
gulp.task('webuploader', function () {
    return gulp.src(pathSrc.webuploader)
        .pipe(gulp.dest(pathDes.webuploader))
        .pipe(notify({message: 'webuploader completed!'}));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    return gulp.src(releaseDir(), {read: false})
        .pipe(clean())
        .pipe(notify({message: 'clean completed!'}));
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('tempData', 'libFile','fonts', 'cssFile', 'pages', 'images', 'webuploader');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){
        
        // 监听html
        gulp.watch(pathSrc.pages, function(event){
            gulp.run('pages');
        })
        // 监听scss
        gulp.watch(pathSrc.scss, function(){
            gulp.run('cssFile');
        });
        // 监听css
        gulp.watch(pathSrc.cssFile, function(){
            gulp.run('cssFile');
        });
        // 监听images
        gulp.watch(pathSrc.images, function(){
            gulp.run('images');
        });
        // 监听jsx
        gulp.watch(pathSrc.jsx, function(){
            gulp.run('libFile');
        });
        //监听 js lib
        gulp.watch(pathSrc.libFile, function(){
            gulp.run('libFile');
        });

        //监听 tempData lib
        gulp.watch(pathSrc.tempData, function(){
            gulp.run('tempData');
        });
        
        //监听 fonts lib
        gulp.watch(pathSrc.fonts, function(){
            gulp.run('fonts');
        });
        //监听 webuploader lib
        gulp.watch(pathSrc.webuploader, function(){
            gulp.run('webuploader');
        });
        // 建立即时重整伺服器
        livereload.listen();
});

//共用pipe
function iAutoprefixer(){
    return autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4');
}
//release相关目录文件集合
function releaseDir(){
    return ['./release/*'];
}
