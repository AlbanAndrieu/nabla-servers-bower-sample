// Generated on 2015-03-19 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  var zone;
  var xdomainUrl;

  try {
    xdomainUrl = require('./urlConfig.js').getUrl();
    zone = require('./urlConfig.js').getProxy();
  } catch (e) {
    if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
      console.log('No urlConfig module found, going with defaults');
      xdomainUrl = 'slave="http://home.nabla.mobi:8080/login"';
      zone = 'home.nabla.mobi';
    }
  }

  var ZAP_PORT = 8090;
  var SERVER_HOST = 'localhost';
  var SERVER_PORT = '9090';
  var SERVER_URL = 'http://' + SERVER_HOST + ':' + SERVER_PORT;
  var SERVER_CONTEXT = 'login';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  var async = require('async'),
      request = require('request');

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-zaproxy');
  grunt.loadNpmTasks('grunt-yslow');
  grunt.loadNpmTasks('grunt-pagespeed');
  grunt.loadNpmTasks('grunt-wpt');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    bower: {
      install: {
        options: {
          targetDir: 'bower_components',
          install: true,
          verbose: true,
//          cleanTargetDir: true,
          cleanBowerDir: false,
          bowerOptions: {},
          copy: true
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 8001,
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: '*',
        hostname: 'localhost',
        livereload: 35729,
        analytics: {
          account: 'UA-56011797-1',
          domainName: 'nabla.mobi'
        },
        discussions: {
          shortName: 'nabla',
          url: 'http://home.nabla.mobi',
          dev: false
        },
        //open: true,
        middleware: function(connect, options) {
          var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
          return [

            function(req, res, next) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
              res.setHeader('X-Content-Type-Options', 'nosniff');
              res.setHeader('X-Frame-Options', 'DENY');
              res.setHeader('X-XSS-Protection', '1;mode=block');
              res.setHeader('Expires', '0');
              res.setHeader('Pragma', 'no-cache');
              res.setHeader('Cache-Control', 'no-cache,no-store,must-revalidate');
              return next();
            },
            connect.static(options.base),
            connect.directory(options.base),
            proxy
          ];
        }
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect, options) {

            if (!Array.isArray(options.base)) {
                options.base = [options.base];
            }

            // Setup the proxy
            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

            // Serve static files.
            options.base.forEach(function(base) {
                middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            return [
              middlewares,
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9002,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          port: 9003,
          open: true,
          base: '<%= yeoman.dist %>'
        }
      },
      proxies: [{
        context: '/login/',
        host: zone,
        port: 8080,
        changeOrigin: true
      }, {
        context: '/apidocs/',
        host: zone,
        port: 8080,
        changeOrigin: true
      }]
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    jscs: {
      options: {
        config: '.jscs.json'
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp',
      //bower: ['.bower', 'bower_components'],
      tmp: ['tmp'],
      build: ['build'],
      docs: ['docs']
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
        {
          expand: true,
          cwd: 'bower_components/nabla-notifications/',
          src: ['**/views/*'],
          dest: '<%= yeoman.app %>'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/nabla-header',
          src: 'img/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/nabla-notifications',
          src: 'img/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    ngdocs: {
      options: {
        scripts: ['angular.js', '../src.js'],
        html5Mode: false
      },
      all: ['src/**/*.js']
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        //browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        singleRun: true
      }
//      sampleComponent: {
//        configFile: 'karma-sample-component.conf.js'
//      }
//      nablaAuth: {
//        configFile: 'karma-nabla-auth.conf.js'
//      },
//      nablaNotifications: {
//        configFile: 'karma-nabla-notifications.conf.js',
//        //browsers: ['PhantomJS', 'Chrome'],
//        //singleRun: false,
//        //logLevel: 'DEBUG',
//        autoWatch: true
//      },
//      nablaHeader: {
//        configFile: 'karma-nabla-header.conf.js',
//        //browsers: ['PhantomJS', 'Chrome'],
//        //singleRun: false,
//        //logLevel: 'DEBUG',
//        autoWatch: true
//      }
    },

    protractor: {
      options: {
		keepAlive: true,
        configFile: 'test/protractor.conf.js',
        args: {
          //seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.39.0.jar',
          //chromeDriver: 'node_modules/protractor/selenium/chromedriver.exe'
        }
      },
      run: {}
    },

    yslow: {
      options: {
        thresholds: {
          weight: 180,
          speed: 1000,
          score: 80,
          requests: 15
        }
      },
      pages: {
        files: [
          {
            src: SERVER_URL,
            thresholds: {
              weight: 100
            }
          }
        ]
      }
    },

    pagespeed: {
      options: {
        nokey: true,
        //url: 'http://home.nabla.mobi/'
        url: 'http://home.nabla.mobi:9090/'
      },
      //prod: {
      //  options: {
      //    url: "https://developers.google.com/speed/docs/insights/v1/getting_started",
      //    locale: "en_GB",
      //    strategy: "desktop",
      //    threshold: 80
      //  }
      //},
      paths: {
        options: {
          paths: ['/#/about', '/todo'],
          locale: 'en_GB',
          strategy: 'desktop',
          threshold: 80
        }
      }
    },

    wpt: {
      options: {
        locations: ['Tokyo', 'SanJose_IE9'],
        key: process.env.WPT_API_KEY
      },
      sideroad: {
        options: {
          url: [
            'http://home.nabla.mobi',
            'http://home.nabla.mobi:8380/jenkins/'
          ]
        },
        dest: 'tmp/sideroad/'
      }
    },

    'zap_start': {
      options: {
        port: ZAP_PORT,
        daemon: false
      }
    },
    'zap_spider': {
      options: {
        url: SERVER_URL,
        port: ZAP_PORT
      }
    },
    'zap_scan': {
      options: {
        url: SERVER_URL,
        port: ZAP_PORT
      }
    },
    'zap_alert': {
      options: {
        port: ZAP_PORT
      }
    },
    'zap_report': {
      options: {
        dir: 'build/reports/zaproxy',
        port: ZAP_PORT,
        html: true
      }
    },
    'zap_stop': {
      options: {
        port: ZAP_PORT
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'configureProxies:server',
      'connect:livereload',
      'watch'
    ]);

  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });


  /**
   * Run acceptance tests to teach ZAProxy how to use the app.
   **/
  grunt.registerTask('acceptance-test', function() {
    var done = this.async();

    // make sure requests are proxied through ZAP
    var r = request.defaults({'proxy': SERVER_URL});

    async.series([
      function(callback) {
        r.get(SERVER_URL + '/' + SERVER_CONTEXT + '/index.html', callback);
      }
      // Add more requests to navigate through parts of the application
    ], function(err) {
      if (err) {
        grunt.fail.warn('Acceptance test failed: ' + JSON.stringify(err, null, 2));
        grunt.fail.warn('Is zaproxy started?');
        return;
      }
      grunt.log.ok();
      done();
    });

    grunt.task.run(['protractor:run']);
  });

  /**
   * ZAProxy alias task.
   **/
  grunt.registerTask('zap', [
  //'zap_start',
    'acceptance-test',
    'zap_spider',
    'zap_scan',
    'zap_alert',
    'zap_report'
  //'zap_stop'
  ]);

  grunt.registerTask('prepare', [
    //'clean:bower',
    'bower'
  ]);

  grunt.registerTask('integration-test', [
    'zap',
    'pagespeed',
    'wp'
  ]);

  grunt.registerTask('unit-test', [
    'check',
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
    //'protractor:run'
  ]);

  grunt.registerTask('check', [
    'newer:jshint',
    'jscs'
  ]);

  grunt.registerTask('package', [
    'build'
  ]);

  grunt.registerTask('site', [
    'docs'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('docs', [
    'clean:docs',
    'ngdocs'
  ]);

  grunt.registerTask('test-docs', [
    'docs',
    'connect'
  ]);

  grunt.registerTask('default', [
    'bower',
    'unit-test',
    'package',
    'site'
  ]);
};
