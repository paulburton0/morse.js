Morse.js

Morse.js is a Node JS app that converts text strings into WAV files containing
morse code.

Usage
    
node index.js -s 10 -t 800 -i \'Testing 1 2 3\' -o ./morse.wav');

Options

    --sidetone -t  Sets the tone frequency. Default is 800
    --wpm -s       Sets the speed in wpm. Default is 10
    --input -i     Sets the input text to convert to morse code
    --output -o    Sets the output file (must be a .wav file)
