module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    execute: {
      target : {
        src: ['src/main.js']
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer-core')({browsers: 'last 1 version'}),
        ]
      },
      dist: {
        src: 'css/*.css'
      }
    },

    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },

      element: {
        files: 'src/**/*.js',
        tasks: ['execute', 'postcss']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('default', ['watch']);
}
