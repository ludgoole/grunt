/*
@怎么开发一个可以自动把写的代码发送到远程网站，让他们检查一下错误并且压缩好，再反回来生成一个文件?
开发一个工具，可以调用这个工具对我的某个项目目录里面的项目文件做一些操作，比如压缩、查错、合并等。

@如果要做成一个工具，可能不太好，或许别人还需要更多功能，但是我没法开发这么多功能啊?
做个框架，然后每个功能做成一个插件，比如压缩插件、合并插件。
如果有人需要在他的项目里压缩某个文件，他安装一下我这个工具然后再安装压缩插件就好了。
这样有更多需求的人，可以自己编写功能插件，然后配合我的工具使用。

@安装完了工具和插件之后，要怎么来调用这个插件来处理项目文件？
在项目文件夹中编写一个JS来设置任务,工具会读取这个JS，解析之后获得他要执行的任务，然后调用插件完成任务。

@插件这么多，放在项目里肯定很大，而且又是不相关代码?
发布的时候自动删除这些插件文件

@如果发给别人，别人要继续开发，还得重新安装依次安装这些插件，然后执行任务。那怎么办？
再用个文件记录一下当前项目中安装或者需要的插件,这样只需要把这个文件和JS任务文件放在项目目录里面，
有需要的人，直接输入一条命令安装一下，然后立刻就可以执行了。


//////////////////////////////////////////////////////////////////////////////////////////
需求： 编译 合并 查错 压缩 服务器 监听 
工具：grunt
插件：grunt-contrib-sass(less)
      grunt-contrib-concat
      grunt-contrib-jshint
      grunt-contrib-uglify
      grunt-contrib-watch
      grunt-contrib-connect
任务：Gruntfile.js
记录：pkg         >>package.json
*/



/**
 * step1 >>npm install -g grunt-cli     //环境
 * step2 >>npm init                     //记录
 * step3 >>npm install grunt --save-dev //工具
 * step4 >>npm install --save-dev       //插件
                                * grunt-contrib-less 
                                * grunt-contrib-concat 
                                * grunt-contrib-jshint 
                                * grunt-contrib-uglify 
                                * grunt-contrib-connect
                                * grunt-contrib-watch 
 *step5 >>Gruntfile.js                             
 */

module.exports = function(grunt) {
  
    /**
        @sass(less) 编译后输出方式
        嵌套输出方式 nested
        展开输出方式 expanded  
        紧凑输出方式 compact 
        压缩输出方式 compressed
     */

    var lessStyle = 'expanded';


    //1.任务配置
    grunt.initConfig({
      //记录文件
      pkg: grunt.file.readJSON('package.json'),
      //需求任务
      less: {
          //输出
          output: {
              //数据定义
              options:{
                style: lessStyle,
              },
              //文件处理(处理后文件：当前文件)
              files: {
                './style.css': './less/style.less'
              },
          },
      },
      jshint: {
          //数据定义
          options:{
            globals: {
              jQuery: true,
              console: true,
              module: true
            }
          },
          //文件处理(当前文件)
          files: ['./src/plugin.js','./src/plugin2.js'],
          //all:'./global.js',
      },
      concat: {
          //数据定义
          options:{
            separator: ';',   //防止两个文件之间相互干扰设置的，结果无法被 jshint 验证通过  >>1.删除options  2.jshint前置
          },
          //文件处理(处理后文件：当前文件)
          dist: {
            dest:'./global.js',
            src: ['./src/plugin.js','./src/plugin2.js'],
          },
      },
      uglify: {
          //压缩
          compressjs: {
            //数据定义
            options:{
              
            },
            //文件处理(处理后文件：当前文件)
            files: {
              './global.min.js': './global.js'
            }
          }
      },
      connect: {
        //数据定义        
        options: {
          // Change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost',
          port: 9000,
          livereload: 35729,
          open: true,          
        },
        server: {
            options:{
              port: 9000,
              base: './'
            }
        },
      },
      watch: {
          //js文件
          scripts: {
            //任务
            tasks: ['jshint','concat','uglify'],
            //文件
            files: ['./src/plugin.js','./src/plugin2.js'],
          },
          //less文件
          less: {
            //任务
            tasks: ['less'],
            //文件
            files: ['./less/style.less'],
          },
          //自动刷新
          livereload: {
            //数据定义
            options:{
                //<%=%>  >>获取后台的变量值
                livereload: '% = connect.options.livereload %'
            },
            //文件处理(处理后文件：当前文件)
            files: ['index.html','style.css','js/globe.min.js']
          },
      },
    });


    //2.插件加载
    //对应插件
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    
    //3.任务注册
    //监听器 数据来源
    grunt.registerTask('outputcss',['less']);
    grunt.registerTask('concatjs',['concat']);
    grunt.registerTask('compressjs',['concat','jshint','uglify']);
    grunt.registerTask('watchit',['less','concat','jshint','uglify','connect','watch']);
    grunt.registerTask('default');
    
};
