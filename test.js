var morse = require('./morsecodify');

morse.codify(800, 20, 18, 'hello', null, function(err, x){
    if(err){
        console.error(err);
    } else {
        process.stdout.write(x);    
    }   
});
