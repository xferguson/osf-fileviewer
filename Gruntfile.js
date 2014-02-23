module.exports = function(grunt) {

  var latest = '<%= pkg.name %>';
  var name = '<%= pkg.name %>-v<%= pkg.version%>';

  // Latest releases including version number in filename
  var devRelease = 'dist/' + name + '.js';
  var minRelease = 'dist/' + name + '.min.js';

  // Latest releases without version number in filename for easier imports
  // These go in the project root
  var latestDevRelease = 'dist/' + latest + '.js';
  var latestMinRelease = 'dist/' + latest + '.min.js';

  // Latest AMD releases
  var latestAMDRelease = 'dist/' + latest + '-amd.js';
  var latestAMDMinRelease = 'dist/' + latest + '-amd.min.js';

  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON('package.json'),

    // Banner definitions
    meta: {
      banner: '/*\n' +
        ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
        ' *  <%= pkg.description %>\n' +
        ' */\n'
    },

    // Concat definitions
    concat: {
      target: {
        src: ['src/**/*.js'],
        dest: devRelease
      },
      amd: {
        src: ['amd-header.js', 'src/**/*.js', 'amd-footer.js'],
        dest: latestAMDRelease
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    // Lint definitions
    jshint: {
      files: ['src/hgrid.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Minify definitions
    uglify: {
      target: {
        src: ['src/**/*js'],
        dest: minRelease
      },
      nodepTarget: {
        src: 'src/hgrid.js',
        dest: 'dist/hgrid-nodeps.min.js'
      },
      amd: {
        src: latestAMDRelease,
        dest: latestAMDMinRelease
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    // CSS minification
    cssmin: {
      add_banner: {
        options: {
          banner: '/* hgrid-<%= pkg.version %> */'
        },
        files: {
          'dist/hgrid.min.css': ['src/**/*.css']
        }
      }
    },

    // Copy latest releases without version numbers in filename
    copy: {
      main: {
        files: [{
          src: devRelease,
          dest: latestDevRelease
        }, {
          src: minRelease,
          dest: latestMinRelease
        }, {
          src: 'src/hgrid.js',
          dest: 'dist/hgrid-nodeps.js'
        }, {
          src: 'src/hgrid.css',
          dest: 'dist/hgrid.css'
        }, {
          src: 'src/images/*',
          dest: 'dist/images/',
          flatten: true,
          expand: true
        }]
      }
    },

    // Unit testing
    qunit: {
      all: {
        options: {
          urls: ['tests/index.html']
        }
      }
    },

    // If a source js file changes, concatenated and copy the files to dist/
    watch: {
      files: ['src/**/*.js'],
      tasks: ['concat', 'copy']
    }

    // yuidoc: {
    //   compile: {
    //     name: '<%= pkg.name %>',
    //     description: '<%= pkg.description %>',
    //     version: '<%= pkg.version %>',
    //     options: {
    //       paths: 'src/',
    //       outdir: 'docs',
    //       exclude: 'vendor'
    //     }
    //   }
    // }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-yuidoc');

  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy', 'qunit', 'jshint']);
  grunt.registerTask('travis', ['concat', 'copy', 'qunit', 'jshint']);

};
