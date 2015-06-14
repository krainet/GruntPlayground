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
    },
    concat: {
        //Ejemplo archivos
        options: {
            dest: 'tmp',
            templates: ['templates/header.html', 'templates/footer.html'],
            javascripts: ['javascripts/*.js'],
            stylesheets: ['stylesheets']
        }
    },
    //Ejemplo objeto task/multitask
    multiTaskName: {
        options: {
            gzip: false
        },
        target1: {
            src: 'stylesheets/*.css',
            dest: 'public',
            ext: '.min.css'
        },
        target2: {
            src: '*.js',
            dest: 'public',
            ext: '.min.js'
        }
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

    // Si tengo gasolina y llaves, arranco
    grunt.log.writeln('Rum rum! coche arrancado.');
});


//Error handling
grunt.registerTask('probarerror', 'Probar warning y fatal', function() {
    var mayberun=Math.random() < 0.5 ? true : false;
    var percent=Math.random()*100;

    grunt.log.writeln('Maybe run : ' + mayberun + ' percent: '+percent.toFixed(2)+'%');
    if(!mayberun){
        //Gestionamos fatal
        grunt.fatal('Error fatal no podemos ejecutar');
    }else{
        //Gestionamos un WARN
        if(percent<50){
            grunt.warn('Porcentaje inferior a 50%');
        }
        //Else.. nothing to do , task ended
    }
    return true;
});

//Grunt log printing
grunt.registerTask('probarlogcolors', 'Probar log colors', function() {
    grunt.log.error('Printing in RED');
    grunt.log.ok('Printing in Green');
});

//Ejemplo archivos
grunt.registerTask('concat', 'concatenates files', function(type){
    var recursiveConcat = function(source, result){
        grunt.file.expand(source).forEach(function(file){
            if(grunt.file.isDir(file)){
                grunt.file.recurse(file, function(f){
                    result = recursiveConcat(f, result);
                });
            } else {
                grunt.log.writeln('Concatenating ' + file + ' to other ' + result.length + ' characters.');
                result += grunt.file.read(file);
            }
        });
        return result;
    };

    grunt.config.requires('concat.options.' + type); // Parametro obligatorio.
    grunt.config.requires('concat.options.dest');

    var files = grunt.config.get('concat.options.' + type),
        dest = grunt.config.get('concat.options.dest'),
        concatenated = recursiveConcat(files, '');

    grunt.log.writeln('Writing ' + concatenated.length + ' chars to ' + 'tmp/' + type);
    grunt.file.write(dest + '/' + type, concatenated);
});

//Creamos task global para concatenar todas las carpetas
grunt.registerTask('concatAll', ['concat:templates', 'concat:javascripts', 'concat:stylesheets']);


//Task por defecto (ejecuta task world y task hello con parametro ninjas
grunt.registerTask('default', ['hello', 'helloparam:ninjas']);


/*
 Task Object functions

 -   this.async: designed for async tasks. Grunt will normally end the task without waiting for
 the callback to be executed. If you need Grunt to wait use done().

 -   this.requires: list of taskNames that should executed successfully first.
 E.g. this.requires(['concat', 'jshint']).

 -   this.name: this is the name of the task. E.g. grunt hello, then this.name === 'name'.

 -   this.args: returns an array with the parameters. E.g. grunt hello:crazy:world,
 then this.args will return ['crazy', 'world'].

 -   this.options([defaultsObj]): it gets options values from the config.init, optionally you
 can also pass an object containing the default values. Notice in the example bellow that
 even though console.log has a this.options({gzip: true}) it gets override by the options
 parameters. If not one it is specified in the config.init then it will use the default gzip: true.

 /*
 Multi Task Object

 -   this.target: name of the target current target. If you call it grunt multiTaskName, it will
 run like multiple tasks calling each target one at a time. this.target will be equal to target1 and then target2.

 -   this.files: return a (single) array that has all the properties for the current target.
 Take a look the the output above.

 -   this.filesSrc: it expands files and paths against src and return an array with them.

 -   this.data: contains the raw data of the target parameters.

 */

grunt.registerMultiTask('multiTaskName', 'example', function(){
    console.log('this.options', this.options({gzip: true}));
    console.log('this.data', this.data);
    console.log('this.files', this.files);
    console.log('this.filesSrc', this.filesSrc);
});


