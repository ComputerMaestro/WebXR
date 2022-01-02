var githubPages = require('gh-pages');

module.exports = function(grunt) {
  grunt.initConfig({
    'gh-pages': {
      options: {
        base: 'dist',
        repo: 'https://github.com/ComputerMaestro/WebXR.git'
      },
      src: ['*.html', '**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('deploy', ['gh-pages']);
}

// module.exports = function(grunt){
//   grunt.registerTask('deploy', 'Deploy website to gh-pages repo', function(){
//     console.log('starting gh pages setup');
//     console.log(githubPages);
//     githubPages.publish('dist', {
//       'src': ['entry.html', './js']
//     }, function(err) {
//       if(err) {
//         console.error(err);
//       } else {
//         console.log("gh pages setup complete");
//       }
//     });
//     console.log('exiting gh pages setup');
//   });
// }
