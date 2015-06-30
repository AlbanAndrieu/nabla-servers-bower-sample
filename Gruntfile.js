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

  var ZAP_PORT = process.env.ZAP_PORT || 8090;
  //console.log('ZAP_PORT : ' + ZAP_PORT);
  var SERVER_HOST = process.env.SERVER_HOST || 'localhost';
  //console.log('SERVER_HOST : ' + SERVER_HOST);
  var SERVER_PORT = process.env.JETTY_PORT || 9090;
  //console.log('SERVER_PORT : ' + SERVER_PORT);
  var SERVER_URL = 'http://' + SERVER_HOST + ':' + SERVER_PORT;
  var SERVER_CONTEXT = '';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  var async = require('async'),
      request = require('request');

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-zaproxy');
  grunt.loadNpmTasks('grunt-perfbudget');
  grunt.loadNpmTasks('grunt-yslow');
  grunt.loadNpmTasks('grunt-yslow-test');
  grunt.loadNpmTasks('grunt-pagespeed');
  grunt.loadNpmTasks('grunt-pagespeed-junit');
  grunt.loadNpmTasks('grunt-wpt');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-phantomas');
  grunt.loadNpmTasks('grunt-sitespeedio');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-compare-size');
  grunt.loadNpmTasks('grunt-phantomcss-gitdiff');
  grunt.loadNpmTasks('grunt-resemble-cli');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-release');

  var fs = require('fs');

  var parseString = require('xml2js').parseString;
  // Returns the second occurence of the version number
  var parseVersionFromPomXml = function() {
      var version;
      var pomXml = fs.readFileSync('pom.xml', 'utf8');
      parseString(pomXml, function(err, result) {
          version = result.project.parent[0].version;
          //console.dir(result.project.parent[0]);
          //version = result.project.version[0];
      });
      return version;
  };

  //console.log('Done.');

  var VERSION = parseVersionFromPomXml();
  console.log('VERSION : ' + VERSION);

  // Configurable paths
  var config = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project meta
    pkg: require('./package.json'),
    banner: '/**\n' +
            ' * <%= pkg.name %>\n' +
            ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * @link <%= pkg.homepage %>\n' +
            ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
            ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
            ' */\n',

    // Project settings
    config: config,

    bower: {
      bower: require('./bower.json'),
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
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'test:watch', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          //open: false,
          port: 9002,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          port: 9003,
          open: true,
          //livereload: false,
          base: '<%= config.dist %>'
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
          '<%= config.app %>/scripts/{,*/}*.js',
          '!<%= config.app %>/scripts/vendor/*'
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
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
        ]
      }
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/{,*/}*',
            '!<%= config.dist %>/.git{,*/}*'
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
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
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

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html'],
        exclude: [
                   '/angular-i18n/',  // localizations are loaded dynamically
                   '/swagger-ui/',
                   'bower_components/bootstrap/dist/js/bootstrap.js'
        ]
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        exclude: [/angular-i18n/, /swagger-ui/, /angular-scenario/],
        ignorePath:  /\.\.\//, // remove ../../ from paths of injected javascripts
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
      //options: {
      //  encoding: 'utf8',
      //  algorithm: 'md5',
      //  length: 20
      //},
      dist: {
        src: [
          '<%= config.dist %>/scripts/{,*/}*.js',
          '<%= config.dist %>/styles/{,*/}*.css',
          '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          //'<%= config.dist %>/*.{ico,png}',
          '<%= config.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= config.app %>/**/*.html',
      options: {
        dest: '<%= config.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs']
              // Disabled as we'll be using a manual
              // cssmin configuration later. This is
              // to ensure we work well with grunt-uncss
              //css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css'],
      //js: ['<%= config.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ]
      }
    },

    uncss: {
      dist: {
        options: {
          compress: !true,
          // Take our Autoprefixed stylesheet main.css &
          // any other stylesheet dependencies we have..
          stylesheets: [
            '../.tmp/styles/main.css',
            //'../bower_components/nabla-notification/styles/css/nabla-notification.css',
            //'../bower_components/nabla-header/styles/css/nabla-header.css',
            '../bower_components/bootstrap/dist/css/bootstrap.css'
          ],
          // Ignore css selectors for async content with complete selector or regexp
          // Only needed if using Bootstrap
          ignore: ['.ng-move', '.ng-enter', '.ng-leave', '.created_by_jQuery',
                   /nabla-header.*/,
                   /dropdown-menu/,/\.collapsing/,/\.collapse/]
        },
        files: {
          '.tmp/styles/main.css': ['<%= config.app %>/{,*/}*.html'
          //'./bower_components/nabla-notification/{,*/}*.html',
          //'./bower_components/nabla-header/{,*/}*.html'
          ]
        }
      }
    },

    'compare_size': {
      files: [
        'app/styles/**',
        'dist/styles/**'
      ]
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    cssmin: {
       dist: {
         files: {
           '<%= config.dist %>/styles/main.css': [
           //'<%= config.app %>/styles/{,*/}*.css',
           '.tmp/styles/{,*/}*.css'
           ]
         }
       }
    },
    //uglify: {
    //  dist: {
    //    files: {
    //      '<%= config.dist %>/scripts/': [
    //        '<%= config.dist %>/scripts/*.js'
    //      ]
    //    }
    //  }
    //},
    //concat: {
    //  dist: {}
    //},

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: ['<%= config.dist %>/styles/*.css', '<%= config.dist %>/scripts/*.js']
        }
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

    ngconstant: {
         options: {
             name: require('./bower.json').moduleName,
             deps: false,
             wrap: '"use strict";\n// DO NOT EDIT THIS FILE, EDIT THE GRUNT TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE\n{%= __ngModule %}'
         },
         dev: {
             options: {
                 dest: '<%= config.app %>/scripts/app.constants.js'
                 //dest: '.tmp/concat/scripts/app.constants.js'
             },
             constants: {
                 ENV: 'dev',
                 VERSION: parseVersionFromPomXml()
             }
         },
         prod: {
             options: {
                 dest: '<%= config.app %>/scripts/app.constants.js'
                 //dest: '.tmp/concat/scripts/app.constants.js'
             },
             constants: {
                 ENV: 'prod',
                 VERSION: parseVersionFromPomXml()
             }
         }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      dist: {
        cwd: '<%= config.app %>',
        src: ['scripts/**/*.html'],
        dest: '.tmp/templates/templates.js',
        options: {
            // This should be the name of your apps angular module
            module: require('./bower.json').moduleName,
            //module: require('./bower.json').name + 'App',
            usemin: 'scripts/app.js',
            htmlmin:  {
                removeCommentsFromCDATA: true,
                // https://github.com/yeoman/grunt-usemin/issues/44
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                conservativeCollapse: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true
            }
        }
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= config.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
        {
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp}',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= config.dist %>/images',
          src: ['generated/*']
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%= config.dist %>/.htaccess'
        }, {
          expand: true,
          cwd: 'bower_components/nabla-header',
          src: 'img/*',
          dest: '<%= config.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/nabla-notification',
          src: 'img/*',
          dest: '<%= config.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= config.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= config.app %>/styles',
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
      all: ['app/**/*.js']
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

    'yslow_test': {
      options: {
        info: 'grade',
        format: 'tap',
        //format: 'junit',
        //ruleset: 'yblog',
        cdns: 'nabla.mobi,home.nabla.mobi,albandri,localhost,127.0.0.1',
        threshold: '\'{"overall": "A", "ycdn": "F", "yexpires": "F"}\'',
        urls: [SERVER_URL + SERVER_CONTEXT,
               SERVER_URL + '#/about'],
        //headers: '\'{"Cookie": "user=%7B%22loginName%22%3A%22nabla%22%2C%22userName"}\'',
        //reports: ['target/surefire-reports/yslow.xml']
        reports: ['target/yslow.tap']
      },
      'your_target': {
        files: []
      }
    },

    phantomas: {
      grunt: {
        options: {
          assertions: {
            assetsWithQueryString: 3,     // receive warning, when there are more than 3 assets with a query string
            bodyHTMLSize: 10500, // receive warning, when the bodyHTMLsize is bigger than 10500
            jsErrors: 0,     // receive warning, when more than 0 JS errors appear
            gzipRequests: {      // receive warning, when less compressed assets are loaded then 10 ( might be useful for checking server configurations )
              type: '<',
              value: 10
            }
          },
          indexPath: './build/phantomas/',
          options: {
            timeout: 30,
            //cookie: 'user=%7B%22loginName%22%3A%22nabla%22%2C%22userName',
            verbose: true,
            debug: true
          },
          url: SERVER_URL + SERVER_CONTEXT,
          buildUi: true
        }
      }
    },

    'phantomcss-gitdiff': {
      options: {},
        desktop: {
            options: {
                baseUrl: SERVER_URL + SERVER_CONTEXT,
                cleanupComparisonImages: false,
                //viewportSize: [1024, 768], //desktop
                viewportSize: [320, 400], //mobile
                gitDiff: true
            },
            files: [{
              cwd: 'dist/',
              src: '*.html'
            }]
        }
    },

    resemble: {
      options: {
        screenshotRoot: 'build/screenshots/',
        //url: 'http://0.0.0.0:8000/dist',
        url: SERVER_URL + SERVER_CONTEXT,
        //debug: true,
        gm: true

      },
      desktop: {
        options: {
          width: 1100
        },
        files: [
         {
           cwd: 'dist/',
           //expand: true,
           //src: ['**/*.html'],
           src: ['*.html'],
           dest: 'desktop'
         }
        ]
      },
      //desktop: {
      //  options: {
      //    width: 1100,
      //  },
      //  src: ['dist/about', 'dist/contact', 'dist/customers', 'dist/customers/customer-stories'],
      //  dest: 'desktop',
      //},
      //tablet: {
      //  options: {
      //    width: 800,
      //  },
      //  src: ['dist/**/*.html'],
      //  dest: 'tablet',
      //},
      mobile: {
        options: {
          width: 450
        },
        files: [
         {
           cwd: 'dist/',
           //expand: true,
           //src: ['**/*.html'],
           src: ['*.html'],
           dest: 'mobile'
         }
        ]
      }
    },

    sitespeedio: {
      default: {
        options: {
          url: 'http://home.nabla.mobi:9090/',
          deepth: 1,
          resultBaseDir: './build/sitespeedio/'
        }
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
          paths: ['/#/about', '/#/'],
          locale: 'en_GB',
          strategy: 'desktop',
          threshold: 80
        }
      }
    },

    'pagespeed_junit': {
      options: {
        urls: ['http://home.nabla.mobi:9090/'],
        //key: '<API_KEY>',
        reports: ['results.xml'],
        threshold: 10,
        ruleThreshold: 2
      }
    },

    wpt: {
      options: {
        locations: ['Tokyo'],
        key: process.env.WPT_API_KEY
      },
      sideroad: {
        options: {
          url: [
            'http://home.nabla.mobi:9090/'
            //'http://home.nabla.mobi:8380/jenkins/'
          ]
        },
        dest: './build/sideroad/'
      }
    },

    perfbudget: {
      default: {
        options: {
          url: 'http://home.nabla.mobi:9090/',
          timeout: 300,
          key: process.env.WPT_API_KEY,
          budget: {
            render: '2000',
            SpeedIndex: '3000'
          }
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'dist',
        dotfiles: true
      },
      src: ['**/*']
    },

    'zap_start': {
      options: {
        host: SERVER_HOST,
        port: ZAP_PORT,
        daemon: true
      }
    },
    'zap_spider': {
      options: {
        url: SERVER_URL,
        host: SERVER_HOST,
        port: ZAP_PORT
      }
    },
    'zap_scan': {
      options: {
        url: SERVER_URL,
        host: SERVER_HOST,
        port: ZAP_PORT
      }
    },
    'zap_alert': {
      options: {
        host: SERVER_HOST,
        port: ZAP_PORT,
        ignore: ['Content-Type header missing',
                 'Private IP disclosure',
                 'X-Content-Type-Options header missing',
                 'X-Frame-Options header not set']
      }
    },
    'zap_report': {
      options: {
        dir: 'build/reports/zaproxy',
        host: SERVER_HOST,
        port: ZAP_PORT,
        html: true
      }
    },
    'zap_stop': {
      options: {
        host: SERVER_HOST,
        port: ZAP_PORT
      }
    },

    release: {
      options: {
        additionalFiles: ['bower.json'],
        npm: false, //default: true
        github: {
          //apiRoot: 'https://git.example.com/v3', // Default: https://github.com
          repo: '<%= pkg.repository.url %>', //put your user/repo here
          accessTokenVar: 'GITHUB_ACCESS_TOKEN', //ENVIRONMENT VARIABLE that contains GitHub Access Token
          // Or you can use username and password env variables, we discourage you to do so
          usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains GitHub username
          passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains GitHub password
        }
      }
    }
  });

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function(target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      //'ngconstant:dev',
      'concurrent:server',
      'autoprefixer',
      'configureProxies:server',
      'connect:livereload',
      'watch'
    ]);

  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
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
        grunt.fail.warn('Is zaproxy still running?');
        grunt.task.run(['zap_stop']);
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
    'zap_report',
    'yslow_test',
    'pagespeed',
    'pagespeed_junit',
    'sitespeedio',
    'phantomas',
    //'wpt',
    'perfbudget',
    'resemble'
    //'zap_stop'
  ]);

  grunt.registerTask('prepare', [
    //'clean:bower',
    'bower'
  ]);

  grunt.registerTask('integration-test', [
    'zap'
  ]);

  grunt.registerTask('test', [
    'unit-test'
  ]);

  grunt.registerTask('unit-test', function(target) {
    if (target !== 'watch') {
      grunt.task.run([
        'check',
        'clean:server',
        'wiredep',
        //'ngconstant:dev',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'connect:test',
      //'mocha',
      'karma'
    ]);
  });

  grunt.registerTask('check', [
    'newer:jshint',
    'jscs'
  ]);

  grunt.registerTask('package', [
    'build'
  ]);

  grunt.registerTask('site', [
    'gh-pages'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    //'ngconstant:prod',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'uncss',
    //'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'usebanner'
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
    'compare_size',
    'docs'
  ]);
};
