// Generated on 2015-03-19 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }

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
  var ZAP_HOST = process.env.ZAP_HOST || 'localhost';
  //console.log('ZAP_HOST : ' + ZAP_HOST);
  var SERVER_HOST = process.env.SERVER_HOST || 'localhost';
  //console.log('SERVER_HOST : ' + SERVER_HOST);
  var SERVER_PORT = process.env.JETTY_PORT || 9090;
  //console.log('SERVER_PORT : ' + SERVER_PORT);
  var SERVER_URL = 'http://' + SERVER_HOST + ':' + SERVER_PORT;
  var SERVER_CONTEXT = '/';

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  //require('load-grunt-tasks')(grunt);
  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
	bower: 'grunt-bower-task',
	versioncheck: 'grunt-version-check',
	configureProxies: 'grunt-connect-proxy',
	'zap_start': 'grunt-zaproxy',
	'zap_spider': 'grunt-zaproxy',
	'zap_scan': 'grunt-zaproxy',
	'zap_alert': 'grunt-zaproxy',
	'zap_report': 'grunt-zaproxy',
	'zap_stop': 'grunt-zaproxy',
	'zap_results': 'grunt-zaproxy',
	'validate-package': 'grunt-nsp-package',
	resemble: 'grunt-resemble-cli',
    instrument: 'grunt-protractor-coverage',
	usebanner: 'grunt-banner',
	replace: 'grunt-text-replace',
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner',
    buildcontrol: 'grunt-build-control'
  });

  var async = require('async'),
      request = require('request');

  //grunt.loadNpmTasks('grunt-ngdocs');
  //grunt.loadNpmTasks('grunt-contrib-connect');
  //grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-ng-annotate');
  //grunt.loadNpmTasks('grunt-ng-constant');
  //grunt.loadNpmTasks('grunt-angular-templates');
  //grunt.loadNpmTasks('grunt-zaproxy');
  //grunt.loadNpmTasks('grunt-perfbudget');
  ////grunt.loadNpmTasks('grunt-yslow');
  //grunt.loadNpmTasks('grunt-yslow-test');
  //grunt.loadNpmTasks('grunt-pagespeed');
  //grunt.loadNpmTasks('grunt-pagespeed-junit');
  //grunt.loadNpmTasks('grunt-wpt');
  //grunt.loadNpmTasks('grunt-gh-pages');
  //grunt.loadNpmTasks('grunt-phantomas');
  //grunt.loadNpmTasks('grunt-sitespeedio');
  //grunt.loadNpmTasks('grunt-uncss');
  ////TODO http://grunt-tasks.com/grunt-purifycss/
  //grunt.loadNpmTasks('grunt-postcss');
  ////grunt.loadNpmTasks('grunt-penthouse'); //Use grunt-critical instead
  //grunt.loadNpmTasks('grunt-critical');
  //grunt.loadNpmTasks('grunt-compare-size');
  ////grunt.loadNpmTasks('grunt-phantomcss-gitdiff'); //Use grunt-resemble-cli instead
  //grunt.loadNpmTasks('grunt-resemble-cli');
  //grunt.loadNpmTasks('grunt-banner');
  //grunt.loadNpmTasks('grunt-release');
  //grunt.loadNpmTasks('grunt-version-check');
  //grunt.loadNpmTasks('grunt-installed-check');
  //grunt.loadNpmTasks('grunt-check-dependencies');
  //grunt.loadNpmTasks('grunt-nsp-package');

  var parseVersionFromPomXml = function() {
      var fs = require('fs');
      var parseString = require('xml2js').parseString;
      var version;
      var pomFile = 'pom.xml';
      if (typeof process.env.MVN_RELEASE_VERSION !== 'undefined') {
        pomFile = 'pom.xml.tag';
      }
      //TODO use pom.xml.tag
      //pom.xml.next
      var pomXml;
      try {
        pomXml = fs.readFileSync(pomFile, 'utf8');
      } catch (err) {

        // If the type is not what you want, then just throw the error again.
        if (err.code !== 'ENOENT') { throw err; }
        // Handle a file-not-found error

        try {
          pomXml = fs.readFileSync('pom.xml', 'utf8');
        } catch (err) {
          // If the type is not what you want, then just throw the error again.
          if (err.code !== 'ENOENT') { throw err; }

          // Handle a file-not-found error
          console.log('Missing pom.xml');
        }

      }
      parseString(pomXml, function(err, result) {
          version = result.project.parent[0].version;
          //console.dir(result.project.parent[0]);
          //version = result.project.version[0];
      });
      return version;
  };

  //console.log('Done.');

  var getVersion = function() {
    // TODO use https://www.npmjs.com/package/grunt-jenkins-build-info
    var POM_VERSION = parseVersionFromPomXml();
    var JENKINS_VERSION = process.env.BUILD_NUMBER || '0';
    // TODO use https://www.npmjs.com/package/grunt-jenkins-build-number for 0
    var RELEASE_VERSION = process.env.MVN_RELEASE_VERSION || POM_VERSION;
    if (typeof process.env.MVN_RELEASE_VERSION === 'undefined') {
      RELEASE_VERSION = RELEASE_VERSION + '.' + JENKINS_VERSION;
    }
    var pattern = /SNAPSHOT/i;
    RELEASE_VERSION = RELEASE_VERSION.replace(pattern, 'build');
    //MVN_ISDRYRUN
    //MVN_DEV_VERSION
    //console.log('RELEASE_VERSION : ' + RELEASE_VERSION);
    return RELEASE_VERSION;
  };

  var VERSION = getVersion();
  console.log('VERSION : ' + VERSION);

  // Configurable paths for the application
  var appConfig = {
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
    config: appConfig,

    bower: {
      bower: require('./bower.json'),
      verbose: true
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
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'test:watch', 'karma']
      },
      compass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      //},
      //styles: {
      //  files: ['<%= config.app %>/styles/{,*/}*.css'],
      //  tasks: ['newer:copy:styles', 'postcss']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= config.app %>/resources/{,*/}*.json'
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
        livereload: 35730,
        analytics: {
          account: 'UA-56011797-1',
          domainName: 'nabla.mobi'
        },
        discussions: {
          shortName: 'nabla',
          url: 'http://home.nabla.mobi',
          dev: false
        },
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
            connect.static(options.base[0]),
            connect.directory(options.base[0]),
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
          //port: 9003,
          open: true,
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
    postcss: {
      options: {
        processors: [
          //require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer-core')({browsers: 'last 2 versions'}) // add vendor prefixes
        ]
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
                   //'/angular-i18n/',  // localizations are loaded dynamically
                   //'bower_components/bootstrap/dist/js/bootstrap.js',
                   //'bower_components/bootstrap/dist/css/bootstrap.css', // notneeded if used by uncss
                   'bower_components/github-fork-ribbon-css/gh-fork-ribbon.ie.css',
                   'bower_components/social-likes/social-likes_classic.css',
                   'bower_components/social-likes/social-likes_birman.css'
                   //'bower_components/github-fork-ribbon-css/gh-fork-ribbon.css', // notneeded if used by uncss
                   //'/swagger-ui/',
                   ///bootstrap-sass-official/,
                   ///bootstrap.js/, '/json3/', '/es5-shim/',
                   ///bootstrap.css/,
                   ///font-awesome.css/
        ]
      //},
      //server: {
      //  ignorePath: /^\/|\.\.\//,
      //  src: ['<%= config.app %>/index.html'],
      //  exclude: [
      //             '/angular-i18n/',  // localizations are loaded dynamically
      //             'bower_components/bootstrap/dist/js/bootstrap.js',
      //             //'bower_components/bootstrap/dist/css/bootstrap.css', // needed as we do not do uncss
      //             '/swagger-ui/'
      //  ]
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        exclude: [/angular-i18n/, /swagger-ui/, /angular-scenario/],
        ignorePath: /\.\.\//, // remove ../../ from paths of injected javascripts
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
      },
      sass: {
        src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= config.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= config.app %>/images',
        javascriptsDir: '<%= config.app %>/scripts',
        fontsDir: '<%= config.app %>/styles/fonts',
        importPath: '<%= config.app %>/../bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= config.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= config.app %>/**/*.html',
            '<%= config.app %>/**/*.json',
            '<%= config.app %>/styles/**/*.css',
            '<%= config.app %>/scripts/**/*.js',
            '<%= config.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '.tmp/**/*.{css,js}'
          ]
        }
      },
      options: {
        watchTask: true,
        online: false,
        //browser: ["google chrome", "firefox"],
        //server: '<%= config.app %>'
        proxy: 'localhost:8001'
        //proxy: SERVER_HOST + ":" + SERVER_PORT
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
          '!<%= config.dist %>/images/no-filerev/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
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
      //html: '<%= config.app %>/index.html',
      options: {
        dest: '<%= config.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              //js: ['concat', 'uglifyjs'] //when using uncss
              // Disabled as we'll be using a manual
              // cssmin configuration later. This is
              // to ensure we work well with grunt-uncss
              css: ['cssmin'] //disable when using uncss
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

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    uglify: {
      dist: {
        files: {
          '<%= config.dist %>/scripts/scripts.js': [
            '<%= config.dist %>/scripts/scripts.js'
          ],
          '<%= config.dist %>/scripts/vendor.js': [
            '<%= config.dist %>/scripts/vendor.js'
          ]
        }
      }
    },
    // concat: {
    //   dist: {}
    // },

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

    uncss: {
      dist: {
        options: {
          compress: !true,
          // Take our Autoprefixed stylesheet main.css &
          // any other stylesheet dependencies we have..
          stylesheets: [
            //'../bower_components/nabla-notification/styles/css/nabla-notification.css',
            //'../bower_components/nabla-header/styles/css/nabla-header.css',
            //'../bower_components/bootstrap/dist/css/bootstrap.css',
            '../bower_components/github-fork-ribbon-css/gh-fork-ribbon.ie.css',
            '../.tmp/styles/main.css'
          ],
          // Ignore css selectors for async content with complete selector or regexp
          // Only needed if using Bootstrap
          ignore: ['.ng-move', '.ng-enter', '.ng-leave',
                   '#added_at_runtime', '.created_by_jQuery',
                   /nabla-header.*/,
                   /github-fork-ribbon.*/,
                   /app-loading.*/,
                   /ec-.*/,
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

    critical: {
      test: {
        options: {
            //base: '<%= config.dist %>/',
            base: './',
            css: [
                '.tmp/styles/main.css'
                //'test/fixture/styles/bootstrap.css'
            ],
            width: 320,
            height: 70
        },
        src: '<%= config.dist %>/index.html',
        //dest: 'styles/critical.css'
        //dest: 'index.html'
        dest: '<%= config.dist %>/index.html'
      }
    },

    penthouse: {
      server: {
        //outfile: '<%= config.dist %>/styles/critical.css',
        css: '<%= config.dist %>/styles/main.*.css',
        //url: SERVER_URL + SERVER_CONTEXT,
        url: 'http://localhost:9090/#/',
        width: 1280,
        height: 800
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
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true,
          removeEmptyAttributes: true,
          removeAttributeQuotes: true,
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

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>/scripts',
          src: ['{,*/}*.js'],
          dest: '<%= config.dist %>/scripts'
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
            //'.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*',
            'fonts/{,*/}*.*',
            'resources/{,*/}*.*'
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
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= config.dist %>'
        //}, {
        //  expand: true,
        //  cwd: 'bower_components/nabla-header',
        //  src: 'images/*',
        //  dest: '<%= config.dist %>'
        //}, {
        //  expand: true,
        //  cwd: 'bower_components/nabla-notification',
        //  src: 'images/*',
        //  dest: '<%= config.dist %>'
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/font-awesome/fonts/*',
          dest: '<%= config.dist %>'
        //}, {
        //  expand: true,
        //  cwd: 'bower_components/font-awesome/fonts/',
        //  src: '**/*',
        //  dest: '<%= config.dist %>/fonts'
        }, {
          expand: true,
          cwd: 'bower_components/angular-i18n/',
          src: '*.js',
          dest: '<%= config.dist %>/bower_components/angular-i18n'
        //}, {
        //  expand: true,
        //  cwd: 'bower_components/bootstrap/dist',
        //  src: 'fonts/*',
        //  dest: '<%= config.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      //pages: {
      //  options: {
      //    remote: 'git@github.com:example_user/example_webapp.git',
      //    branch: 'gh-pages'
      //  }
      //},
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      //},
      //local: {
      //  options: {
      //    remote: '../',
      //    branch: 'build'
      //  }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        //'copy:styles'
        'compass:server'
      ],
      test: [
        //'copy:styles'
        'compass'
      ],
      dist: [
        //'copy:styles',
        'compass:dist',
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

    replace: {
      // Sets DEBUG_MODE to FALSE in dist
      debugMode: {
        src: ['<%= config.dist %>/scripts/scripts.js'],
        overwrite: true,
        replacements: [
          {
            from: /\/\*DEBUG_MODE\*\/.{1,}\/\*DEBUG_MODE\*\//gi,
            to: '/*DEBUG_MODE*/false/*DEBUG_MODE*/'
          }
        ]
      },
      // Sets VERSION_TAG for cache busting
      versionTag: {
        src: ['<%= config.dist %>/scripts/scripts.js'],
        overwrite: true,
        replacements: [
          {
            from: /\/\*VERSION_TAG_START\*\/.{1,}\/\*VERSION_TAG_END\*\//gi,
            to: '/*VERSION_TAG_START*/' + new Date().getTime() + '/*VERSION_TAG_END*/'
          }
        ]
      }
    },

    protractor: {
      options: {
        //keepAlive: true,
        configFile: 'test/protractor.conf.js',
        args: {
          //seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.39.0.jar',
          //chromeDriver: 'node_modules/protractor/selenium/chromedriver.exe'
        }
      },
      run: {}
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    'yslow_test': {
      options: {
        info: 'grade',
        format: 'tap',
        //format: 'junit',
        //ruleset: 'yblog',
        cdns: 'nabla.mobi,home.nabla.mobi,albandri,localhost,127.0.0.1',
        threshold: '\'{"overall": "B", "ycdn": "F", "yexpires": "F", "ynumreq": "E", "yminify": "B", "ycompress": "B", "ydns": "D", "yno404": "F", "yexpressions": "B", "ymindom": "F"}\'',
        urls: [SERVER_URL + SERVER_CONTEXT,
               SERVER_URL + '#/about'],
        //headers: '\'{"Cookie": "'JSESSIONID=0003EB22CC71A700D676B1E0B6558325;user=%7B%22loginName%22%3A%22nabla%22%2C%22userName"}\'',
        //reports: ['target/surefire-reports/yslow-main.xml',
        //          'target/surefire-reports/yslow-about.xml']
        reports: ['target/yslow-main.tap',
                  'target/yslow-about.tap']
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
            //cookie: ''JSESSIONID=0003EB22CC71A700D676B1E0B6558325;user=%7B%22loginName%22%3A%22nabla%22%2C%22userName',
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
        screenshotRoot: 'screenshots/',
        tolerance: 10,
        //url: 'http://0.0.0.0:8000/dist',
        url: SERVER_URL + SERVER_CONTEXT,
        //debug: true,
        gm: false

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
        reports: ['target/surefire-reports/TEST-pagespeed.xml'],
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
        host: ZAP_HOST,
        port: ZAP_PORT,
        daemon: true
      }
    },
    'zap_spider': {
      options: {
        url: SERVER_URL,
        host: ZAP_HOST,
        port: ZAP_PORT
      }
    },
    'zap_scan': {
      options: {
        url: SERVER_URL,
        host: ZAP_HOST,
        port: ZAP_PORT
      }
    },
    'zap_alert': {
      options: {
        host: ZAP_HOST,
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
        host: ZAP_HOST,
        port: ZAP_PORT,
        html: true
      }
    },
    'zap_stop': {
      options: {
        host: ZAP_HOST,
        port: ZAP_PORT
      }
    },
    'zap_results': {
      options: {
        risks: ['High']
        //risks: ['High', 'Medium', 'Low', 'Informational']
      }
    },

    versioncheck: {
      options: {
        skip: ['semver', 'npm', 'lodash'],
        hideUpToDate: false
      }
    },

    checkDependencies: {
        this: {}
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
      //'wiredep:server', if we do not use uncss below
      'wiredep',
      //'ngconstant:dev',
      'concurrent:server',
      //'uncss',
      'postcss',
      'configureProxies:server',
      'connect:livereload',
      'browserSync',
      'watch'
    ]);

  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
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
    //'penthouse',
    'yslow_test',
    'pagespeed',
    'pagespeed_junit',
    'sitespeedio',
    'phantomas',
    //'wpt',
    'perfbudget',
    'resemble',
    //'zap_stop'
    'zap_results'
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
        'wiredep:test',
        //'ngconstant:dev',
        'concurrent:test',
        'postcss'
      ]);
    }

    grunt.task.run([
      'connect:test',
      //'mocha',
      'karma'
    ]);
  });

  grunt.registerTask('check', function(target) {
    grunt.task.run([
    'newer:jshint',
    'newer:jscs',
    'checkDependencies',
    'versioncheck',
    'validate-package'
    ]);

    if (target === 'release') {
      grunt.task.run([
        //'validate-package',
        'installed_check'
      ]);
    }
  });

  grunt.registerTask('package', [
    'build'
  ]);

  grunt.registerTask('site', [
    'gh-pages'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    //'wiredep:app', //remove boostrap after the test
    'wiredep',
    //'ngconstant:prod',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    //'uncss',
    'ngtemplates',
    'concat',
    'copy:dist',
    'cdnify',
    'cssmin',
    'replace:debugMode',
    'replace:versionTag',
    'ngAnnotate',
    'uglify',
    'filerev',
    'usemin',
    'critical',
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