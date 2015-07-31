var debug       = require('debug')('svgim:index');
var Q           = require('q');
var fs          = require('fs');
var path        = require('path');
var mustache    = require('mustache');
var sizeOf      = require('image-size');

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
            debug('Template loaded');
            return mustache.render(template, templateVars);
        });
    };

    function loadTemplate() {
        return Q.nfcall(fs.readFile, path.resolve(__dirname, '../templates/output.svg'), 'utf8');
    }

};

module.exports = new SvgImageMerge();