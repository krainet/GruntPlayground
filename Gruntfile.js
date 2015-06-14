var grunt = require('grunt');

grunt.initConfig({
    mi_multitask:{
        task1:[1,2,3],
        task2:['hi','im','ninja']
    },
    default:{},
    ninja: {
        movements: ['hadooken', 'sor-yukeen', 'k.o']
    }
});




//Task world (printa hello world)
grunt.registerTask('hello', 'descripcion hello', function(){
    console.log('hello world');
});

//Task hello
grunt.registerTask('helloparam', 'descripcion helloparam', function(name){
    if(!name || !name.length)
        grunt.warn('you need to provide a name.');

    console.log('Hello ' + name);
    console.log('Posible attacks:'+grunt.config.get('ninja').movements);
});


//Ejemplo de multi-task
grunt.task.registerMultiTask('mi_multitask', 'descripcion multitask', function() {
    //Ejecutamos todas las tareas de multilog con grunt
    //Podemos ejecutar solo una task con grunt multilog:task1
    grunt.log.writeln(this.target + ': ' + this.data);
});

//Ejemplo task asíncrona
grunt.registerTask('task_async', 'Tarea "asincrona" task.', function() {
    // Forzamos tarea asyncrona al manejador done()
    var done = this.async();
    // Ejecutamos
    grunt.log.writeln('Processing task...');
    // Finaliza al ejecutar done();
    setTimeout(function() {
        grunt.log.writeln('All done!');
        done();
    }, 2000);
});





//Task por defecto (ejecuta task world y task hello con parametro ninjas
grunt.registerTask('default', ['hello', 'helloparam:ninjas']);
