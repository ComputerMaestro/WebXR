const githubPages = require('gh-pages');

module.exports = function(grunt){
  grunt.registerTask('deploy', 'Deploy website to gh-pages repo', function(){
    githubPages.publish('./', {
      'src': ['entry.html', './js/index.js']
    }, function(err) {
      if(err) {
        console.error(err);
      } else {
        console.log("gh pages setup complete");
      }
    });
  });
}
