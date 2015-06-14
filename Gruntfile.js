var grunt = require('grunt');

grunt.initConfig({
    multilog:{
        task1:[1,2,3],
        task2:['hi','im','ninja']
    },
    default:{},
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

grunt.task.registerMultiTask('multilog', 'Log stuff.', function() {
    //Ejecutamos todas las tareas de multilog con grunt
    //Podemos ejecutar solo una task con grunt multilog:task1
    grunt.log.writeln(this.target + ': ' + this.data);
});

