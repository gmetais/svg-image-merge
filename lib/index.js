var debug       = require('debug')('svgim:index');
var Q           = require('q');
var fs          = require('fs');
var path        = require('path');
var mustache    = require('mustache');
var sizeOf      = require('image-size');
var SVGO        = require('svgo');

var SvgImageMerge = function() {

    this.merge = function(backgroundImageBuffer, topImageBuffer, options) {

        // Detect files size
        var backgroundSize = sizeOf(backgroundImageBuffer);
        debug('Background size: %dx%d', backgroundSize.width, backgroundSize.height);
        var topSize = sizeOf(topImageBuffer);
        debug('Top size: %dx%d', topSize.width, topSize.height);

        var templateVars = {
            base64Background: backgroundImageBuffer.toString('base64'),
            base64Top: topImageBuffer.toString('base64'),
            width: Math.max(backgroundSize.width, topSize.width),
            height: Math.max(backgroundSize.height, topSize.height)
        };

        return loadTemplate()

        .then(function(template) {
            return createSVG(template, templateVars);
        })

        .then(function(svg) {
            return optimizeSVG(svg);
        });
    };
    

    function loadTemplate() {
        debug('Loading template');
        return Q.nfcall(fs.readFile, path.resolve(__dirname, '../templates/output.svg'), 'utf8');
    }

    function createSVG(template, vars) {
        var deferred = Q.defer();

        debug('Creating the SVG');
        deferred.resolve(mustache.render(template, vars));

        return deferred.promise;
    }

    function optimizeSVG(svgBuffer) {
        var deferred = Q.defer();

        debug('Optimizing a little bit more the file with the terrific SVGO');
        var svgo = new SVGO();
        
        svgo.optimize(svgBuffer, function(result) {
            if (result.error) {
                deferred.reject(result.error);
            } else {
                deferred.resolve(result.data);
            }
        });

        return deferred.promise;
    }

};

module.exports = new SvgImageMerge();