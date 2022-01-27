// Generated on 2015-03-19 using generator-angular 0.11.1
"use strict";

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'
//var path = require('path');

module.exports = function(grunt) {
  var localConfig;
  try {
    localConfig = require("./server/config/local.env");
  } catch (e) {
    localConfig = {};
  }

  var ZAP_PORT = process.env.ZAP_PORT || 8090;
  //console.log('ZAP_PORT : ' + ZAP_PORT);
  var ZAP_HOST = process.env.ZAP_HOST || "localhost";
  //console.log('ZAP_HOST : ' + ZAP_HOST);
  var SERVER_HOST = process.env.SERVER_HOST || "localhost";
  //console.log('SERVER_HOST : ' + SERVER_HOST);
  var SERVER_PROD_PORT = process.env.JETTY_PORT || 9090;
  //var SERVER_PORT = 9014;
  var SERVER_PORT = SERVER_PROD_PORT;
  var SERVER_SECURE_PORT = 9443;
  //console.log('SERVER_PORT : ' + SERVER_PORT);
  var SERVER_PROD_URL = "http://" + SERVER_HOST + ":" + SERVER_PROD_PORT;
  var SERVER_URL =
    process.env.SERVER_URL || "http://" + SERVER_HOST + ":" + SERVER_PORT;
  var SERVER_SECURE_URL =
    process.env.SERVER_SECURE_URL ||
    "https://" + SERVER_HOST + ":" + SERVER_SECURE_PORT;
  var SERVER_CONTEXT = process.env.SERVER_CONTEXT || "/test/#/";

  // Time how long tasks take. Can help when optimizing build times
  require("time-grunt")(grunt);

  // Load grunt tasks automatically, when needed
  require("jit-grunt")(grunt, {
    bower: "grunt-bower-task",
    retire: "grunt-retire",
    //configureProxies: 'grunt-connect-proxy',
    zap_start: "grunt-zaproxy",
    zap_spider: "grunt-zaproxy",
    zap_scan: "grunt-zaproxy",
    zap_alert: "grunt-zaproxy",
    zap_report: "grunt-zaproxy",
    zap_stop: "grunt-zaproxy",
    zap_results: "grunt-zaproxy",
    //'validate-package': 'grunt-nsp-package',
    //protractor_coverage: "grunt-protractor-coverage",
    //instrument: "grunt-istanbul",
    //makeReport: "grunt-istanbul",
    //phantomcss: 'grunt-phantomcss',
    usebanner: "grunt-banner",
    replace: "grunt-text-replace",
    useminPrepare: "grunt-usemin",
    ngtemplates: "grunt-angular-templates",
    cdnify: "grunt-google-cdn",
    protractor: "grunt-protractor-runner",
    buildcontrol: "grunt-build-control",
  });

  //const imageminPng = require('imagemin-pngquant');
  //const imageminPng = require('imagemin-optipng');
  //const imageminJpeg = require('imagemin-jpegtran');

  //var async = require('async'),
  //    request = require('request');
  var serveStatic = require("serve-static");
  var serveIndex = require("serve-index");

  var parseVersionFromPomXml = function() {
    var fs = require("fs-extra");
    var parseString = require("xml2js").parseString;
    var version;
    var pomFile = "pom.xml";
    if (typeof process.env.MVN_RELEASE_VERSION !== "undefined") {
      pomFile = "pom.xml.tag";
    }
    //TODO use pom.xml.tag
    //pom.xml.next
    var pomXml;
    try {
      pomXml = fs.readFileSync(pomFile, "utf8");
    } catch (err) {
      // If the type is not what you want, then just throw the error again.
      if (err.code !== "ENOENT") {
        throw err;
      }
      // Handle a file-not-found error

      try {
        pomXml = fs.readFileSync("pom.xml", "utf8");
      } catch (err) {
        // If the type is not what you want, then just throw the error again.
        if (err.code !== "ENOENT") {
          throw err;
        }

        // Handle a file-not-found error
        console.log("Missing pom.xml");
      }
    }
    parseString(pomXml, { trim: true }, function(err, result) {
      version = result.project.parent[0].version;
      //console.dir(result.project.version);
      //version = result.project.version;
    });
    return version;
  };

  //console.log('Done.');

  var getVersion = function() {
    // TODO use https://www.npmjs.com/package/grunt-jenkins-build-info
    var POM_VERSION = parseVersionFromPomXml();
    //console.log('POM_VERSION : ' + POM_VERSION);
    var JENKINS_VERSION = process.env.BUILD_NUMBER || "0";
    // TODO use https://www.npmjs.com/package/grunt-jenkins-build-number for 0
    var RELEASE_VERSION = process.env.MVN_RELEASE_VERSION || POM_VERSION;
    if (typeof process.env.MVN_RELEASE_VERSION === "undefined") {
      RELEASE_VERSION = RELEASE_VERSION + "." + JENKINS_VERSION;
    }
    var pattern = /SNAPSHOT/i;
    RELEASE_VERSION = RELEASE_VERSION.replace(pattern, "build");
    //MVN_ISDRYRUN
    //MVN_DEV_VERSION
    //console.log('RELEASE_VERSION : ' + RELEASE_VERSION);
    return RELEASE_VERSION;
  };

  var VERSION = getVersion();
  //console.log('VERSION : ' + VERSION);

  // Configurable paths for the application
  var appConfig = {
    app: require("./bower.json").appPath || "app",
    dist: "dist",
    e2e: "coverage/e2e",
    //instrumentedServer: 'coverage/server/instrument',
    //instrumentedE2E: "coverage/e2e/instrumented",
  };

  var corsMiddleware = function(req, res, next) {
    console.log("cors");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    //res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1;mode=block");
    res.setHeader("Expires", "0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Cache-Control", "no-cache,no-store,must-revalidate");
    next();
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    config: appConfig,

    // Project meta
    pkg: grunt.file.readJSON("package.json"),
    banner:
      "/**\n" +
      " * <%= pkg.name %>\n" +
      " * @version v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
      " * @link <%= pkg.homepage %>\n" +
      " * @author <%= pkg.author.name %> <%= pkg.author.email %>\n" +
      " * @license <%= pkg.licenses.type %>, <%= pkg.licenses.url %>\n" +
      " */\n",

    // Install bower dependencies
    bower: {
      bower: require("./bower.json"),
      verbose: true,
    },

    nsp: {
      package: grunt.file.readJSON("package.json"),
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ["bower.json"],
        tasks: ["wiredep"],
      },
      js: {
        files: ["<%= config.app %>/scripts/{,*/}*.js"],
        tasks: ["newer:jshint:all"],
        options: {
          livereload: "<%= connect.options.livereload %>",
        },
      },
      jsTest: {
        files: ["test/spec/{,*/}*.js"],
        tasks: ["newer:jshint:test", "test:watch", "karma"],
      },
      compass: {
        files: ["<%= config.app %>/styles/{,*/}*.{scss,sass}"],
        tasks: ["compass:server", "postcss"],
      },
      gruntfile: {
        files: ["Gruntfile.js"],
        //},
        //styles: {
        //  files: ['<%= config.app %>/styles/{,*/}*.css'],
        //  tasks: ['newer:copy:styles', 'postcss']
      },
      livereload: {
        options: {
          livereload: "<%= connect.options.livereload %>",
        },
        files: [
          "<%= config.app %>/{,*/}*.html",
          ".tmp/styles/{,*/}*.css",
          "<%= config.dist %>/fonts/{,*/}*.{woff,woff2,ttf,svg}",
          "<%= config.app %>/images/{,*/}*.{ico,png,jpg,jpeg,gif,webp,svg}",
          "<%= config.app %>/resources/{,*/}*.json", //for angular-translate
          "<%= config.app %>/scripts/{,*/}*.js",
        ],
      },
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 8002,
        //protocol: 'https',
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: '*',
        hostname: "localhost",
        livereload: 35730,
        analytics: {
          account: "UA-56011797-1",
          domainName: "albandrieu.com",
        },
        discussions: {
          shortName: "nabla",
          url: "https://albandrieu.com",
          dev: false,
        },
      },
      livereload: {
        options: {
          open: true,
          debug: true,
          middleware: function(connect, options, middlewares) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            var directory =
              options.directory || options.base[options.base.length - 1];
            middlewares.push(serveIndex(directory));

            return [
              middlewares,
              serveStatic(".tmp"),
              connect().use(
                "/bower_components",
                serveStatic("./bower_components")
              ),
              serveStatic(appConfig.app),
              connect().use("/fonts", serveStatic(appConfig.dist + "/fonts")),
              connect().use(
                "/views/styles.html",
                serveStatic(appConfig.dist + "/views/styles.html")
              ), //nabla-styles
              connect().use("/images", serveStatic(appConfig.dist + "/images")), //nabla-styles styles.html images
            ];
          },
        },
      },
      test: {
        options: {
          port: SERVER_SECURE_PORT,
          protocol: "https",
          //open: true,
          singleRun: true,
          middleware: function(connect, options, middlewares) {
            return [
              serveStatic(".tmp"),
              serveStatic("test"),
              connect().use(
                "/bower_components",
                serveStatic("./bower_components")
              ),
              connect().use("/fonts", serveStatic(appConfig.dist + "/fonts")),
              serveStatic(appConfig.app),
            ];
          },
        },
      },
      coverageE2E: {
        options: {
          port: SERVER_PORT,
          protocol: "https",
          //open: true,
          //livereload: false,
          singleRun: true,
          //base: '<%= config.instrumentedE2E %>/app',
          middleware: function(connect) {
            return [
              serveStatic(".tmp"),
              //serveStatic('test'),
              connect().use(
                "/bower_components",
                serveStatic("./bower_components")
              ),
              connect().use("/fonts", serveStatic(appConfig.dist + "/fonts")),
              //serveStatic(appConfig.instrumentedE2E + "/app"),
              //serveStatic(config.app)
            ];
          },
        },
      },
      dist: {
        options: {
          //port: 9003,
          open: true,
          base: "<%= config.dist %>",
        },
      },
    },

    instrument: {
      //files: ['lib/**/*.js', '<%= config.app %>/scripts/**/*.js'],
      files: ["app/scripts/test/**/*.js"],
      options: {
        //cwd: 'app/',
        //lazy: true,
        basePath: "<%= config.instrumentedE2E %>",
        //basePath: './coverage/e2e/instrumented/'
      },
    },

    protractor_coverage: {
      options: {
        configFile: "protractor.conf.js", // Default config file
        keepAlive: true,
        noColor: false,
        //debug: true,
        verbose: true,
        //noInject: true,
        coverageDir: "<%= config.instrumentedE2E %>/",
        //args: {}
        args: {
          baseUrl: SERVER_SECURE_URL + SERVER_CONTEXT,
        },
      },
      chrome: {
        options: {
          args: {
            //baseUrl: 'http://localhost:' + ( process.env.SERVER_PORT || 9190 ) + '/',
            // Arguments passed to the command
            browser: "chrome",
          },
        },
      },
    },
    makeReport: {
      src: "<%= config.instrumentedE2E %>/*.json",
      options: {
        type: "lcov",
        //type: 'html',
        //dir: 'target/coverage/dir',
        dir: "target",
        print: "detail",
      },
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reporter: require("jshint-stylish"),
      },
      all: {
        src: [
          "Gruntfile.js",
          "<%= config.app %>/scripts/{,*/}*.js",
          "!<%= config.app %>/scripts/vendor/*",
        ],
      },
      test: {
        options: {
          jshintrc: "test/.jshintrc",
        },
        src: ["test/spec/{,*/}*.js"],
      },
    },

    jscs: {
      options: {
        config: ".jscs.json",
      },
      all: {
        src: [
          "Gruntfile.js",
          "<%= config.app %>/scripts/{,*/}*.js",
          "!<%= config.app %>/scripts/vendor/*",
          "test/spec/{,*/}*.js",
        ],
      },
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: [
            "http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html",
          ],
        },
      },
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              ".tmp",
              "<%= config.dist %>/{,*/}*",
              "!<%= config.dist %>/.git{,*/}*",
            ],
          },
        ],
      },
      server: ".tmp",
      //bower: ['.bower', 'bower_components'],
      tmp: ["tmp"],
      build: ["build"],
      docs: ["docs/groovydocs/", "docs/js/", "docs/partials/"],
      coverageE2E: {
        src: ["<%= config.e2e %>/"],
      },
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          //require('pixrem')(), // add fallbacks for rem units
          require("autoprefixer")({ browsers: "last 2 versions" }), // add vendor prefixes
        ],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: ".tmp/styles/",
            src: "{,*/}*.css",
            dest: ".tmp/styles/",
          },
        ],
      },
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ["<%= config.app %>/index.html"],
        exclude: [
          //'/angular-i18n/',  // localizations are loaded dynamically
          //'bower_components/bootstrap/dist/js/bootstrap.js',
          //'bower_components/bootstrap/dist/css/bootstrap.css', // notneeded if used by uncss
          "bower_components/github-fork-ribbon-css/gh-fork-ribbon.ie.css",
          "bower_components/social-likes/social-likes_classic.css",
          "bower_components/social-likes/social-likes_birman.css",
          "bower_components/nabla-styles/views/styles.html",
          //'bower_components/github-fork-ribbon-css/gh-fork-ribbon.css', // notneeded if used by uncss
          //'/swagger-ui/',
          ///bootstrap-sass-official/,
          ///bootstrap.js/, '/json3/', '/es5-shim/',
          ///bootstrap.css/,
          ///font-awesome.css/
        ],
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
        src: "<%= karma.unit.configFile %>",
        exclude: [/angular-i18n/, /swagger-ui/, /angular-scenario/],
        ignorePath: /\.\.\//, // remove ../../ from paths of injected javascripts
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi,
            },
            replace: {
              js: "'{{filePath}}',",
            },
          },
        },
      },
      sass: {
        src: ["<%= config.app %>/styles/{,*/}*.{scss,sass}"],
        ignorePath: /(\.\.\/){1,2}bower_components\//,
        //exclude: ['font-awesome', 'bootstrap-sass-official']
      },
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: "<%= config.app %>/styles",
        cssDir: ".tmp/styles",
        generatedImagesDir: ".tmp/images/generated",
        imagesDir: "<%= config.app %>/images",
        javascriptsDir: "<%= config.app %>/scripts",
        fontsDir: "<%= config.app %>/../bower_components/font-awesome/fonts",
        importPath: "<%= config.app %>/../bower_components",
        httpImagesPath: "/images",
        httpGeneratedImagesPath: "/images/generated",
        httpFontsPath: "/styles/fonts",
        relativeAssets: false,
        assetCacheBuster: false,
        raw: "Sass::Script::Number.precision = 10\n",
      },
      dist: {
        options: {
          generatedImagesDir: "<%= config.dist %>/images/generated",
        },
      },
      server: {
        options: {
          sourcemap: true,
        },
      },
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "<%= config.app %>/**/*.html",
            "<%= config.app %>/**/*.json",
            "<%= config.app %>/styles/**/*.css",
            "<%= config.app %>/scripts/**/*.js",
            "<%= config.dist %>/fonts/{,*/}*.{woff,woff2,ttf,svg}",
            "bower_components/**/*",
            "<%= config.app %>/images/**/*.{ico,png,jpg,jpeg,gif,webp,svg}",
            ".tmp/**/*.{css,js}",
          ],
        },
      },
      options: {
        watchTask: true,
        //online: false,
        //browser: ["google chrome", "firefox"],
        //server: '<%= config.app %>'
        proxy: "localhost:8002",
        //proxy: SERVER_HOST + ":" + SERVER_PORT
      },
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
          "<%= config.dist %>/scripts/{,*/}*.js",
          "<%= config.dist %>/styles/{,*/}*.css",
          "<%= config.dist %>/images/{,*/}*.{ico,png,jpg,jpeg,gif,webp,svg}",
          "!<%= config.dist %>/images/no-filerev/{,*/}*.{ico,png,jpg,jpeg,gif,webp,svg}",
          //'<%= config.dist %>/*.{ico,png}',
          "<%= config.dist %>/styles/fonts/*",
        ],
      },
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: "<%= config.app %>/**/*.html",
      options: {
        dest: "<%= config.dist %>",
        flow: {
          html: {
            steps: {
              js: ["concat"],
              //js: ['concat', 'uglifyjs'] //when using uncss
              // Disabled as we'll be using a manual
              // cssmin configuration later. This is
              // to ensure we work well with grunt-uncss
              css: ["cssmin"], //disable when using uncss
            },
            post: {},
          },
        },
      },
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ["<%= config.dist %>/{,*/}*.html"],
      css: ["<%= config.dist %>/styles/{,*/}*.css"],
      //js: ['<%= config.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: [
          "<%= config.dist %>",
          "<%= config.dist %>/images",
          "<%= config.dist %>/styles",
        ],
      },
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
      options: {
        rebase: false,
      },
      dist: {
        files: {
          "<%= config.dist %>/styles/main.css": [".tmp/styles/{,*/}*.css"],
        },
      },
    },
    uglify: {
      dist: {
        files: {
          "<%= config.dist %>/scripts/scripts.js": [
            "<%= config.dist %>/scripts/scripts.js",
          ],
          "<%= config.dist %>/scripts/vendor.js": [
            "<%= config.dist %>/scripts/vendor.js",
          ],
        },
      },
    },
    // concat: {
    //   dist: {}
    // },

    usebanner: {
      dist: {
        options: {
          position: "top",
          banner: "<%= banner %>",
        },
        files: {
          src: [
            "<%= config.dist %>/styles/*.css",
            "<%= config.dist %>/scripts/*.js",
          ],
        },
      },
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
            "../bower_components/github-fork-ribbon-css/gh-fork-ribbon.ie.css",
            "../.tmp/styles/main.css",
          ],
          // Ignore css selectors for async content with complete selector or regexp
          // Only needed if using Bootstrap
          ignore: [
            ".ng-move",
            ".ng-enter",
            ".ng-leave",
            "#added_at_runtime",
            ".created_by_jQuery",
            /nabla-header.*/,
            /github-fork-ribbon.*/,
            /app-loading.*/,
            /ec-.*/,
            /dropdown-menu/,
            /\.collapsing/,
            /\.collapse/,
          ],
        },
        files: {
          ".tmp/styles/main.css": [
            "<%= config.app %>/{,*/}*.html",
            //'./bower_components/nabla-notification/{,*/}*.html',
            //'./bower_components/nabla-header/{,*/}*.html'
          ],
        },
      },
    },

    critical: {
      test: {
        options: {
          //base: '<%= config.dist %>/',
          base: "./",
          css: [
            ".tmp/styles/main.css",
            ".tmp/styles/blog.css",
            ".tmp/styles/carousel.css",
            //'test/fixture/styles/bootstrap.css'
          ],
          width: 320,
          height: 70,
        },
        src: "<%= config.dist %>/index.html",
        //dest: 'styles/critical.css'
        //dest: 'index.html'
        dest: "<%= config.dist %>/index.html",
      },
    },

    penthouse: {
      server: {
        //outfile: '<%= config.dist %>/styles/critical.css',
        css: "<%= config.dist %>/styles/main.*.css",
        //url: SERVER_URL + SERVER_CONTEXT,
        url: "http://localhost:9090/test/#/",
        width: 1280,
        height: 800,
      },
    },

    compare_size: {
      files: ["app/styles/**", "dist/styles/**"],
    },

    // The following *-min tasks produce minified files in the dist folder
    //imagemin: {
    //  dynamic: {
    //    options: {
    //        optimizationLevel: 3,
    //        svgoPlugins: [{removeViewBox: false}],
    //        use: [imageminPng({quality: [0.5, 0.5]}), imageminJpeg({quality: 50})]
    //        //use: [imagemin.gifsicle(), imagemin.jpegtran(), imagemin.pngquant(), imagemin.svgo()]
    //    },
    //    files: [
    //      {
    //        expand: true,
    //        cwd: "<%= config.app %>/images",
    //        src: "{,*/}*.{ico,png,jpg,jpeg,gif}",
    //        dest: "<%= config.dist %>/images",
    //      },
    //    ],
    //  },
    //},

    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: "<%= config.app %>/images",
            src: "{,*/}*.svg",
            dest: "<%= config.dist %>/images",
          },
        ],
      },
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
          useShortDoctype: true,
        },
        files: [
          {
            expand: true,
            cwd: "<%= config.dist %>",
            src: ["*.html", "views/{,*/}*.html"],
            dest: "<%= config.dist %>",
          },
        ],
      },
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            cwd: "<%= config.dist %>/scripts",
            src: ["{,*/}*.js"],
            dest: "<%= config.dist %>/scripts",
          },
        ],
      },
    },

    ngconstant: {
      options: {
        name: require("./bower.json").moduleName,
        deps: false,
        wrap:
          "\"use strict\";\n// DO NOT EDIT THIS FILE, EDIT THE GRUNT TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE\n{%= __ngModule %}",
      },
      dev: {
        options: {
          dest: "<%= config.app %>/scripts/app.constants.js",
          //dest: '.tmp/concat/scripts/app.constants.js'
        },
        constants: {
          ENV: "dev",
          VERSION: parseVersionFromPomXml(),
        },
      },
      prod: {
        options: {
          dest: "<%= config.app %>/scripts/app.constants.js",
          //dest: '.tmp/concat/scripts/app.constants.js'
        },
        constants: {
          ENV: "prod",
          VERSION: parseVersionFromPomXml(),
        },
      },
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      dist: {
        cwd: "<%= config.app %>",
        src: ["scripts/**/*.html"],
        dest: ".tmp/templates/templates.js",
        options: {
          // This should be the name of your apps angular module
          module: require("./bower.json").moduleName,
          //module: require('./bower.json').name + 'App',
          usemin: "<%= config.app %>/scripts/app.js",
          htmlmin: {
            removeCommentsFromCDATA: true,
            // https://github.com/yeoman/grunt-usemin/issues/44
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            conservativeCollapse: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
          },
        },
      },
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: "<%= config.app %>",
            dest: "<%= config.dist %>",
            src: [
              "*.{ico,png,txt}",
              ".htaccess",
              "*.html",
              "views/{,*/}*.html",
              "images/{,*/}*.{webp}",
              "styles/fonts/{,*/}*.*",
              "fonts/{,*/}*.*",
              "resources/{,*/}*.*",
            ],
          },
          {
            expand: true,
            cwd: ".tmp/images",
            dest: "<%= config.dist %>/images",
            src: ["generated/*"],
          },
          {
            expand: true,
            cwd: "bower_components/nabla-styles/app",
            src: "images/*",
            dest: "<%= config.dist %>",
          },
          {
            expand: true,
            cwd: "bower_components/nabla-styles/app",
            src: "views/*",
            dest: "<%= config.dist %>",
            //}, {
            //  src: 'node_modules/apache-server-configs/dist/.htaccess',
            //  dest: '<%= config.dist %>/.htaccess'
          },
          {
            expand: true,
            cwd: ".",
            src:
              "bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*",
            dest: "<%= config.dist %>",
          },
          {
            expand: true,
            cwd: ".",
            src: "bower_components/font-awesome/fonts/*",
            dest: "<%= config.dist %>",
          },
          {
            expand: true,
            cwd: "bower_components/bootstrap-sass-official/assets/fonts/",
            src: "**/*",
            dest: "<%= config.dist %>/fonts",
          },
          {
            expand: true,
            cwd: "bower_components/font-awesome/fonts/",
            src: "**/*",
            dest: "<%= config.dist %>/fonts",
          },
          {
            //angular-translate
            expand: true,
            cwd: "bower_components/angular-i18n/",
            src: "*.js",
            dest: "<%= config.dist %>/bower_components/angular-i18n",
          },
        ],
      },
      coverageE2E: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: "<%= config.app %>",
            dest: "<%= config.instrumentedE2E %>/app",
            src: [
              "*.{ico,png,txt}",
              "images/{,*/}*.{webp}",
              "{,*/}*.html",
              "scripts/**/*.js",
              //'styles/fonts/{,*/}*.*'
              ".htaccess",
              //'../bower_components/**/*',
              "images/**/*",
              "fonts/**/*",
              "views/**/*",
              "styles/**/*",
            ],
          },
          {
            expand: true,
            cwd: ".",
            src:
              "bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*",
            dest: "<%= config.instrumentedE2E %>/app",
          },
          {
            expand: true,
            cwd: ".",
            src: "bower_components/font-awesome/fonts/*",
            dest: "<%= config.instrumentedE2E %>/app",
          },
          {
            expand: true,
            cwd: ".tmp/images",
            dest: "<%= config.instrumentedE2E %>/app/images",
            src: ["generated/*"],
          },
        ],
      },
      styles: {
        expand: true,
        cwd: "<%= config.app %>/styles",
        dest: ".tmp/styles/",
        src: "{,*/}*.css",
      },
    },

    buildcontrol: {
      options: {
        dir: "dist",
        commit: true,
        push: true,
        connectCommits: false,
        message:
          "Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%",
      },
      //pages: {
      //  options: {
      //    remote: 'git@github.com:example_user/example_webapp.git',
      //    branch: 'gh-pages'
      //  }
      //},
      heroku: {
        options: {
          remote: "heroku",
          branch: "master",
        },
      },
      openshift: {
        options: {
          remote: "openshift",
          branch: "master",
        },
        //},
        //local: {
        //  options: {
        //    remote: '../',
        //    branch: 'build'
        //  }
      },
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: ["copy:styles", "compass:server"],
      test: [
        //'copy:styles',
        "compass",
      ],
      dist: [
        "copy:styles",
        "compass:dist",
        //"imagemin",
        "svgmin"],
    },

    // Test settings
    karma: {
      unit: {
        configFile: "test/karma.conf.js",
        //browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        singleRun: true,
      },
    },

    replace: {
      //replace the font file path for critical
      dist: {
        //src: ['<%= config.dist %>/styles//*.css'],
        src: ["<%= config.dist %>/index.html"],
        overwrite: true, // overwrite matched source files
        replacements: [
          {
            from:
              ".tmp/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/",
            to:
              "../bower_components/bootstrap-sass-official/assets/fonts/bootstrap/",
          },
          {
            from: "/.tmp/bower_components/font-awesome/fonts/",
            to: "../bower_components/font-awesome/fonts/",
          },
          {
            from: ".tmp/fonts/bootstrap/",
            to: "fonts/bootstrap/",
          },
          {
            from: "@@undefined-version",
            to: VERSION,
          },
        ],
      },
      // Sets DEBUG_MODE to FALSE in dist
      debugMode: {
        src: ["<%= config.dist %>/scripts/scripts.js"],
        overwrite: true,
        replacements: [
          {
            from: /\/\*DEBUG_MODE\*\/.{1,}\/\*DEBUG_MODE\*\//gi,
            to: "/*DEBUG_MODE*/false/*DEBUG_MODE*/",
          },
        ],
      },
      // Sets VERSION_TAG for cache busting
      versionTag: {
        src: ["<%= config.dist %>/scripts/scripts.js"],
        overwrite: true,
        replacements: [
          {
            from: /\/\*VERSION_TAG_START\*\/.{1,}\/\*VERSION_TAG_END\*\//gi,
            to:
              "/*VERSION_TAG_START*/" +
              new Date().getTime() +
              "/*VERSION_TAG_END*/",
          },
        ],
      },
    },

    protractor: {
      options: {
        //keepAlive: true,
        configFile: "test/protractor.conf.js",
        //debug: true,
        args: {
          //directConnect: true,
          verbose: true,
          baseUrl: SERVER_URL + SERVER_CONTEXT,
        },
      },
      run: {},
    },

    env: {
      test: {
        NODE_ENV: "test",
      },
      prod: {
        NODE_ENV: "production",
      },
      all: localConfig,
    },

    yslow_test: {
      options: {
        args: " --web-security=false --ignore-ssl-errors=yes ",
        info: "grade",
        format: "tap",
        //format: 'junit',
        //ruleset: 'yblog',
        cdns: "nabla.mobi,albandrieu.com,albandri,localhost,127.0.0.1",
        /* jshint ignore:start */
        threshold:
          "\'{\"overall\": \"C\", \"ycdn\": \"F\", \"yexpires\": \"F\", \"ynumreq\": \"E\", \"yminify\": \"B\", \"ycompress\": \"C\", \"ydns\": \"D\", \"yno404\": \"F\", \"yexpressions\": \"B\", \"ymindom\": \"F\"}\'",
        /* jshint ignore:end */
        urls: [
          SERVER_PROD_URL + SERVER_CONTEXT,
          SERVER_PROD_URL + SERVER_CONTEXT + "#/about",
        ],
        //headers: '\'{"Cookie": "'JSESSIONID=0003EB22CC71A700D676B1E0B6558325;user=%7B%22loginName%22%3A%22nabla%22%2C%22userName"}\'',
        //reports: ['target/surefire-reports/yslow-main.xml',
        //          'target/surefire-reports/yslow-about.xml']
        reports: ["target/yslow-main.tap", "target/yslow-about.tap"],
      },
      your_target: {
        files: [],
      },
    },

    phantomas: {
      grunt: {
        options: {
          assertions: {
            assetsWithQueryString: 3, // receive warning, when there are more than 3 assets with a query string
            bodyHTMLSize: 10500, // receive warning, when the bodyHTMLsize is bigger than 10500
            jsErrors: 0, // receive warning, when more than 0 JS errors appear
            gzipRequests: {
              // receive warning, when less compressed assets are loaded then 10 ( might be useful for checking server configurations )
              type: "<",
              value: 10,
            },
          },
          indexPath: "./build/phantomas/",
          //See https://github.com/macbre/phantomas#parameters
          options: {
            "cookies-file": "./target/cookies.txt",
            timeout: 30,
            //'film-strip': false,
            "ignore-ssl-errors": true,
            "web-security": false,
            har: "./target/phantomas.har",
            //cookie: ''JSESSIONID=0003EB22CC71A700D676B1E0B6558325;user=%7B%22loginName%22%3A%22nabla%22%2C%22userName',
            verbose: true,
            debug: true,
          },
          url: SERVER_PROD_URL + SERVER_CONTEXT,
          buildUi: true,
        },
      },
    },

    //'phantomcss-gitdiff': {
    //  options: {},
    //    desktop: {
    //        options: {
    //            baseUrl: SERVER_PROD_URL + SERVER_CONTEXT,
    //            cleanupComparisonImages: false,
    //            //viewportSize: [1024, 768], //desktop
    //            viewportSize: [320, 400], //mobile
    //            gitDiff: true
    //        },
    //        files: [{
    //          cwd: 'dist/',
    //          src: '*.html'
    //        }]
    //    }
    //},

    qunit: {
      options: {
        urls: [SERVER_PROD_URL + SERVER_CONTEXT],
        screenshotOnFail: true,
        viewportSize: {
          width: 1100,
          height: 768,
        },
        screenshotPath: ".tmp/screenshots",
        originalScreenshotPath: ".tmp/original_screenshots",
        diffScreenshotPath: ".tmp/diff_screenshots",
        errorDiffPath: ".tmp/screenshots/error",
        resemble: {
          errorType: "movement",
        },
      },
    },

    //phantomcss: {
    //  options: {
    //    mismatchTolerance: 0.05,
    //    screenshots: "screenshots",
    //    results: "./build/phantomcss/",
    //    viewportSize: [1280, 800],
    //  },
    //  src: ["phantomcss.js"],
    //},

    sitespeedio: {
      default: {
        options: {
          //url: 'http://albandrieu.com:9090/',
          url: SERVER_PROD_URL + SERVER_CONTEXT,
          deepth: 1,
          resultBaseDir: "./build/sitespeedio/",
        },
      },
    },

    pagespeed: {
      options: {
        nokey: true,
        //url: 'http://albandrieu.com/alban/'
        //url: 'alban-andrieu.com'
        //url: 'alban-andrieu.eu'
        //url: 'alban-andrieu.fr'
        //url: 'bababou.fr'
        //url: 'bababou.eu'
        //url: 'http://localhost:9090/'
        //url: SERVER_PROD_URL + SERVER_CONTEXT
        url: "http://albandrieu.com/sample/",
      },
      //prod: {
      //  options: {
      //    url: "https://albandrieu.com/sample/#/about",
      //    locale: "en_GB",
      //    strategy: "desktop",
      //    threshold: 80
      //  }
      //},
      paths: {
        options: {
          paths: ["sample/#/about", "sample/#/", "nabla/#/"],
          locale: "en_GB",
          strategy: "desktop",
          threshold: 58,
        },
      },
    },

    pagespeed_junit: {
      options: {
        //urls: ['http://albandrieu.com:9090/'],
        urls: ["http://albandrieu.com/nabla/"],
        //key: '<API_KEY>',
        reports: ["target/surefire-reports/TEST-pagespeed.xml"],
        threshold: 60,
        ruleThreshold: 12,
      },
    },

    wpt: {
      options: {
        locations: ["Paris_wpt"],
        key: process.env.WPT_API_KEY,
      },
      sideroad: {
        options: {
          url: [
            //'http://albandrieu.com:9090/'
            //SERVER_PROD_URL + SERVER_CONTEXT
            "https://albandrieu.com/sample/",
          ],
        },
        dest: "./build/sideroad/",
      },
    },

    perfbudget: {
      default: {
        options: {
          //url: 'http://albandrieu.com:9090/',
          //url: SERVER_PROD_URL + SERVER_CONTEXT,
          url: "https://albandrieu.com/sample/",
          timeout: 500,
          key: process.env.WPT_API_KEY,
          budget: {
            render: "2000",
            SpeedIndex: "6000",
          },
        },
      },
    },

    "gh-pages": {
      options: {
        base: "dist",
        dotfiles: true,
      },
      src: ["**/*"],
    },

    zap_start: {
      options: {
        host: ZAP_HOST,
        port: ZAP_PORT,
        daemon: true,
      },
    },
    zap_spider: {
      options: {
        url: SERVER_SECURE_URL,
        host: ZAP_HOST,
        port: ZAP_PORT,
      },
    },
    zap_scan: {
      options: {
        url: SERVER_SECURE_URL,
        host: ZAP_HOST,
        port: ZAP_PORT,
      },
    },
    zap_alert: {
      options: {
        host: ZAP_HOST,
        port: ZAP_PORT,
        ignore: [
          "Content-Type header missing",
          "Private IP disclosure",
          "X-Content-Type-Options header missing",
          "X-Frame-Options header not set",
        ],
      },
    },
    zap_report: {
      options: {
        dir: "build/reports/zaproxy",
        host: ZAP_HOST,
        port: ZAP_PORT,
        html: true,
      },
    },
    zap_stop: {
      options: {
        host: ZAP_HOST,
        port: ZAP_PORT,
      },
    },
    zap_results: {
      options: {
        risks: ["High"],
        //risks: ['High', 'Medium', 'Low', 'Informational']
      },
    },

    retire: {
      js: ["app/src/*.js"] /** Which js-files to scan. **/,
      node: [
        "node",
      ] /** Which node directories to scan (containing package.json). **/,
      options: {
        proxy: "http://albandrieu.com",
        verbose: true,
        packageOnly: true,
        jsRepository:
          "https://raw.github.com/RetireJS/retire.js/master/repository/jsrepository.json",
        nodeRepository:
          "https://raw.github.com/RetireJS/retire.js/master/repository/npmrepository.json",
        outputFile: "./target/retire-output.json",
        ignore: "documents,java",
        /** list of files to ignore **/
        ignorefile: ".retireignore.json", //or '.retireignore'
      },
    },

    checkDependencies: {
      this: {},
    },

    release: {
      options: {
        additionalFiles: ["bower.json"],
        npm: false, //default: true
        github: {
          //apiRoot: 'https://git.example.com/v3', // Default: https://github.com
          repo: "<%= pkg.repository.url %>", //put your user/repo here
          accessTokenVar: "GITHUB_ACCESS_TOKEN", //ENVIRONMENT VARIABLE that contains GitHub Access Token
          // Or you can use username and password env variables, we discourage you to do so
          usernameVar: "GITHUB_USERNAME", //ENVIRONMENT VARIABLE that contains GitHub username
          passwordVar: "GITHUB_PASSWORD", //ENVIRONMENT VARIABLE that contains GitHub password
        },
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  //grunt.loadNpmTasks("grunt-contrib-imagemin");
  //grunt.loadNpmTasks("grunt-reload");

  // Used for delaying livereload until after server has restarted
  grunt.registerTask("wait", function() {
    grunt.log.ok("Waiting for server reload...");

    var done = this.async();

    setTimeout(function() {
      grunt.log.writeln("Done waiting!");
      done();
    }, 1500);
  });

  grunt.registerTask(
    "serve",
    "start the server and preview your app, --allow-remote for remote access",
    function(target) {
      if (grunt.option("allow-remote")) {
        grunt.config.set("connect.options.hostname", "0.0.0.0");
      }
      if (target === "dist") {
        return grunt.task.run(["build", "connect:dist:keepalive"]);
      }

      if (target === "test") {
        return grunt.task.run(["build", "connect:test:keepalive"]);
      }

      if (target === "coverageE2E") {
        return grunt.task.run(["build", "connect:coverageE2E:keepalive"]);
      }

      grunt.task.run([
        "clean:server",
        //'wiredep:server', if we do not use uncss below
        "wiredep",
        //'ngconstant:dev',
        "concurrent:server",
        //'uncss',
        "postcss",
        "connect:livereload",
        "browserSync",
        "watch",
      ]);
    }
  );

  grunt.registerTask(
    "server",
    "DEPRECATED TASK. Use the \"serve\" task instead",
    function(target) {
      grunt.log.warn(
        "The `server` task has been deprecated. Use `grunt serve` to start a server."
      );
      grunt.task.run([target ? "serve:" + target : "serve"]);
    }
  );

  /**
   * Run acceptance tests to teach ZAProxy how to use the app.
   **/
  grunt.registerTask("acceptance-test", function() {
    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    //var done = this.async();
    //
    //// make sure requests are proxied through ZAP
    //var r = request.defaults({
    //      //'proxy': 'https://' + SERVER_HOST + ':' + ZAP_PORT,
    //      'baseUrl': SERVER_SECURE_URL
    //  });
    //
    //async.series([
    //  function(callback) {
    //    //r.get('index.html', callback);
    //    r.get({'url': 'index.html',
    //      followAllRedirects: true
    //      //agentOptions: {
    //      //  secureProtocol: 'SSLv3_method'
    //      //}
    //      }, callback);
    //  }
    //  // Add more requests to navigate through parts of the application
    //], function(err) {
    //  if (err) {
    //    grunt.fail.warn('Acceptance test failed: ' + JSON.stringify(err, null, 2) + ' ' + err);
    //    grunt.fail.warn('Is zaproxy still running?');
    //    grunt.task.run(['zap_stop']);
    //    return;
    //  }
    //  grunt.log.ok();
    //  done();
    //});

    grunt.task.run(["protractor:run"]);
  });

  /**
   * ZAProxy alias task.
   **/
  grunt.registerTask("zap", [
    //'zap_start',
    //'connect:test',
    //'connect:coverageE2E',
    "acceptance-test",
    //'protractor_coverage:chrome',
    //'makeReport',
    //'zap_spider',
    //'zap_scan',
    //'zap_alert',
    //'zap_report',
    //'penthouse',
    //'yslow_test', #buggy
    //'pagespeed',
    //'pagespeed_junit'
    //'sitespeedio',
    //'phantomas'
    //'wpt',
    //'perfbudget',
    //'qunit'
    //'zap_stop'
    //'zap_results'
  ]);

  grunt.registerTask("qunit", ["qunit"]);

  grunt.registerTask("prepare", [
    //'clean:bower',
    "bower",
  ]);

  grunt.registerTask("integration-test", ["zap"]);

  grunt.registerTask("test", ["unit-test"]);

  grunt.registerTask("unit-test", function(target) {
    if (target !== "watch") {
      grunt.task.run([
        //'check',
        "clean:server",
        "wiredep:test",
        //'ngconstant:dev',
        "concurrent:test",
        "postcss",
      ]);
    }

    grunt.task.run([
      //'connect:test',
      //'mocha',
      "karma",
    ]);
  });

  grunt.registerTask("check", function() {
    grunt.task.run([
      "newer:jshint",
      //"newer:jscs", // joined ESLint
      "checkDependencies"
    ]);
  });

  grunt.registerTask("package", ["build"]);

  grunt.registerTask("site", ["gh-pages"]);

  grunt.registerTask("build", [
    "clean:dist",
    "clean:coverageE2E",
    "wiredep", //remove boostrap after the test
    //'ngconstant:prod',
    "useminPrepare",
    "concurrent:dist",
    "postcss",
    //'uncss',
    "ngtemplates",
    "concat",
    "copy:dist",
    "cssmin",
    "replace:debugMode",
    "replace:versionTag",
    "ngAnnotate",
    "uglify",
    "filerev",
    "usemin",
    //'critical',
    "htmlmin",
    "replace:dist",
    "usebanner",
    //"copy:coverageE2E",
    //"instrument",
  ]);

  grunt.registerTask("docs", ["clean:docs"]);

  grunt.registerTask("test-docs", ["docs", "connect"]);

  grunt.registerTask("default", [
    "bower",
    "unit-test",
    "package",
    "compare_size",
    "docs",
  ]);
};
