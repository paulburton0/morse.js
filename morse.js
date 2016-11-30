const commandLineArgs = require('command-line-args');
var tone = require('tonegenerator');
var header = require('waveheader');
var fs = require('fs');

const optionDefinitions = [
    { name: 'sidetone', alias: 't', type: Number, defaultValue: 800},
    { name: 'wpm', alias: 's', type: Number, defaultValue: 10},
    { name: 'output', alias: 'o', type: String, defaultValue: './morse.wav' },
    { name: 'input', alias: 'i', type: String},
    { name: 'help', alias: 'h', type: Boolean}
];

const options = commandLineArgs(optionDefinitions);

if(options.help || !options.input || !options){
    console.log('Usage: node index.js -s 10 -t 800 -i \'Testing 1 2 3\' -o ./morse.wav');
    console.log('\nOptions');
    console.log('--sidetone -t  Sets the tone frequency. Default is 800.');
    console.log('--wpm -s       Sets the speed in wpm. Default is 10.');
    console.log('--input -i     Sets the input text to convert to morse code.');
    console.log('--output -o    Sets the output file (must be a .wav file)');
    process.exit();
}

var samples = 44100; 
var toneFreq = options.sidetone;
var volume = 30;
var wpm = options.wpm;
var outputFile = options.output;
var text = options.input.split('');

var ditDuration = (1200/wpm)/1000;
var dahDuration = 3 * ditDuration;
var charSpaceDuration = 3 * ditDuration;
var wordSpaceDuration = 7 * ditDuration;
var dit = tone(toneFreq, ditDuration, volume, samples);
var dah = tone(toneFreq, dahDuration, volume, samples);
var elementSpace = new Array(Math.ceil(samples * ditDuration)).fill(0);
var charSpace = new Array(Math.ceil(samples * charSpaceDuration)).fill(0);
var wordSpace = new Array(Math.ceil(samples * wordSpaceDuration)).fill(0);

var characters = {
    'a' : dit.concat(elementSpace, dah),
    'b' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit),
    'c' : dah.concat(elementSpace, dit, elementSpace, dah, elementSpace, dit),
    'd' : dah.concat(elementSpace, dit, elementSpace, dit),
    'e' : dit,
    'f' : dit.concat(elementSpace, dit, elementSpace, dah, elementSpace, dit),
    'g' : dah.concat(elementSpace, dah, elementSpace, dit),
    'h' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit),
    'i' : dit.concat(elementSpace, dit),
    'j' : dit.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah),
    'k' : dah.concat(elementSpace, dit, elementSpace, dah),
    'l' : dit.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit),
    'm' : dah.concat(elementSpace, dah),
    'n' : dah.concat(elementSpace, dit),
    'o' : dah.concat(elementSpace, dah, elementSpace, dah),
    'p' : dit.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit),
    'q' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dah),
    'r' : dit.concat(elementSpace, dah, elementSpace, dit),
    's' : dit.concat(elementSpace, dit, elementSpace, dit),
    't' : dah,
    'u' : dit.concat(elementSpace, dit, elementSpace, dah),
    'v' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah),
    'w' : dit.concat(elementSpace, dah, elementSpace, dah),
    'x' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah),
    'y' : dah.concat(elementSpace, dit, elementSpace, dah, elementSpace, dah),
    'z' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit),
    '1' : dit.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah, elementSpace, dah),
    '2' : dit.concat(elementSpace, dit, elementSpace, dah, elementSpace, dah, elementSpace, dah),
    '3' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah, elementSpace, dah),
    '4' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dah),
    '5' : dit.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dit),
    '6' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dit),
    '7' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit, elementSpace, dit),
    '8' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit, elementSpace, dit),
    '9' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah, elementSpace, dit),
    '0' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dah, elementSpace, dah),
    '=' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dit, elementSpace, dah),
    '+' : dit.concat(elementSpace, dah, elementSpace, dit, elementSpace, dah, elementSpace, dit),
    '?' : dit.concat(elementSpace, dit, elementSpace, dah, elementSpace, dah, elementSpace, dit, elementSpace, dit),
    '.' : dit.concat(elementSpace, dah, elementSpace, dit, elementSpace, dah, elementSpace, dit, elementSpace, dah),
    '/' : dah.concat(elementSpace, dit, elementSpace, dit, elementSpace, dah, elementSpace, dit),
    ':' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit, elementSpace, dit, elementSpace, dit),
    ';' : dah.concat(elementSpace, dit, elementSpace, dah, elementSpace, dit, elementSpace, dah, elementSpace, dit),
    ',' : dah.concat(elementSpace, dah, elementSpace, dit, elementSpace, dit, elementSpace, dah, elementSpace, dah),
    '!' : dah.concat(elementSpace, dah, elementSpace, dah, elementSpace, dit)
}

var morseText = new Array;

text.map(function(element){
    if(element == ' '){
        morseText = morseText.concat(wordSpace);
    } else {
        morseText = morseText.concat(characters[element.toLowerCase()], charSpace);
    }
});


var file = fs.createWriteStream(outputFile);

file.write(header(morseText.length, {
    bitDepth: 8
}));

var data = Uint8Array.from(morseText, function(val) {
    return val + 128;
});

buffer = new Buffer(data)

file.write(buffer);
file.end();
