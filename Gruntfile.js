var grunt = require('grunt');

grunt.config.init({
  ninja: {
    movements: ['hadooken', 'sor-yukeen', 'k.o']
  }
});


grunt.registerTask('world', 'world task description', function(){
  console.log('hello world');
});

grunt.registerTask('hello', 'say hello', function(name){
  if(!name || !name.length)
    grunt.warn('you need to provide a name.');

  console.log('Hello ' + name);
  console.log('Posible attacks:'+grunt.config.get('ninja').movements);
});

grunt.registerTask('default', ['world', 'hello:ninjas']);