var grunt = require('grunt');

grunt.initConfig({
    mi_multitask:{
        task1:[1,2,3],
        task2:['hi','im','ninja']
    },
    default:{},
    ninja: {
        movements: ['hadooken', 'sor-yukeen', 'k.o']
    },
    coche: {
        llaves: 'llaveCoche'
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

//Tarea fallando sincronamente
grunt.registerTask('task_fail_sync', 'Mi fallo sincrono', function() {
    // Fallo sincrono.
    return false;
});

//Tarea fallando "A"sincronamente
grunt.registerTask('task_fail_async', 'Mi fallo "A"sincrono', function() {
    var done = this.async();
    setTimeout(function() {
        // Fail asynchronously.
        done(false);
    }, 2000);
});


//Tarea dependiente de otra
//Si ejecutamos arrancar coche sin ponergasolina , no funcionará la task
//Si no hay gasolina en la gasolinera, tampoco arrancará
//Si no existieran las llaves , no podriamos arrancar
grunt.registerTask('ponergasolina', 'Poner gasolina en coche', function() {
    var result=Math.random() < 0.5 ? true : false;
    grunt.log.writeln('Result has : ' + result);
    if(!result){
        grunt.log.writeln('No habia gasolina en repsol!');
    }else{
        grunt.log.writeln('Deposito lleno!');
    }
    return result;
});

grunt.registerTask('arrancarcoche', 'Arrancar coche', function() {
    // Si no tengo gasolina, no arranca el coche!
    grunt.task.requires('ponergasolina');

    // Si no tengo llave (grunt.config) tampoco podré arrancar
    grunt.log.writeln('Tengo llaves? '+grunt.config.get('coche').llaves);

    //Test run
    grunt.config.requires('coche.llaves');
    
    //Test fail
    //grunt.config.requires('coche.llaves');

    // Si tengo gasolina, arranco
    grunt.log.writeln('Rum rum! coche arrancado.');
});




//Task por defecto (ejecuta task world y task hello con parametro ninjas
grunt.registerTask('default', ['hello', 'helloparam:ninjas']);
