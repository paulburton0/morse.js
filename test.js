var morse = require('./morsecodify');

morse.codify(800, 20, 18, 'hello', null, function(err, x){
    if(err){
        console.error(err);
    } else {
        var y = new Buffer(x)
        process.stdout.write(y);    
    }   
});
