#!/usr/bin/env node

var debug           = require('debug')('svgim:cli');
var Q               = require('q');
var meow            = require('meow');
var path            = require('path');
var fs              = require('fs');
var zlib            = require('zlib');

var svgImageMerge   = require('../lib/index.js');

var cli = meow({
    help: [
        'Usage',
        '  svg-image-merge <background-file> <top-file> <output-file>',
        '',
        'Example',
        '  svg-image-merge background.jpg wording.png result.svg',
        '',
        'Options:',
        '  none for the moment',
        ''
    ].join('\n'),
    pkg: '../package.json'
});

// Check parameters
if (cli.input.length < 3) {
    cli.showHelp();
}

var backgroundImagePath = path.resolve(process.cwd(), cli.input[0]);
var backgroundImage;
var topImagePath = path.resolve(process.cwd(), cli.input[1]);
var topImage;
var outputPath = cli.input[2];


function loadImage(imagePath) {
    return Q.nfcall(fs.readFile, imagePath)

    .then(function(buffer) {
        return buffer;
    });
}

function saveImage(imageBuffer, imagePath) {
    return Q.nfcall(fs.writeFile, imagePath, imageBuffer);
}

function outputGzippedSize(buffer) {
    var deferred = Q.defer();

    zlib.gzip(buffer, function(err, gzippedBuffer) {
        if (err) {
            deferred.reject(err);
        } else {
            console.log('Gzipped size is ' + gzippedBuffer.length + ' Bytes');
            deferred.resolve(buffer);
        }
    });

    return deferred.promise;
}


// Now let's start the job!
Q.all([

    // Load both images
    loadImage(backgroundImagePath),
    loadImage(topImagePath)

])

.then(function(images) {
    debug('Input images loaded');
    
    // Store images in these variables, in case we need it later
    backgroundImage = images[0];
    topImage = images[1];

    // Convert the thing
    return svgImageMerge.merge(backgroundImage, topImage);
})

// Write the new size in the console
.then(outputGzippedSize)

// Then write the SVG on the disk
.then(function(outputBuffer) {
    return saveImage(outputBuffer, outputPath);
})

.then(function() {
    console.log('The file ' + outputPath + ' is correctly created.');
})

.fail(function(err) {
    console.log(err);
});
