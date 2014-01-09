// bootstrap.js
// This is a very simple

/**
 * Simply initializes a few key holder objects.
 * @return {Object} a shell object for our library, Sqor
 */
var initialize = function(){
    var Sqor = {};
    // We define aa few primary holders
    Sqor.Core = {};
    Sqor.Widgets = {};
    Sqor.Modules = {};
    Sqor.Services = {};
    Sqor.TP = {};

    // TODO FIX THIS:
    Sqor.$ = $;
    Sqor._ = _;
    return Sqor;
};

var Sqor = initialize();

// Now we can have services such as:
/*
    Sqor.Service.HTML
*/

// Example initialize an empty namespace
(function(Sqor, undefined) {
})(Sqor);

// HTML.js
(function(Sqor, undefined) {
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    var HTML = {};
    // getCompiledTemplate
    HTML.get = function(templateName,  options, callback){
        $.get("html/" +  templateName + ".html", function(htmlString) {
            var compiledTemplate = _.template(htmlString)(options);
            var domElement =  $(compiledTemplate);
            callback(domElement);
        });
    };

    // HTML.getTempalte=
    Sqor.Services.HTML = HTML;
})(Sqor);

// Now we have an example widget:
// DisplayCard.js
(function(Sqor, undefined) {
    // Need to get our dependencies
    var HTML = Sqor.Services.HTML,
        $ = Sqor.$;

    /**
     * This is a very simple widget that takes in an image, a title,
     * a subtitle, and a set of links associated with each element in the form
     * of callbacks.
     *
     * @constructor
     * @param {type} options,
     * @return {Null}
     */
    var DisplayCard = function(options) {
        // The default values this widget can take:
        var defaults = {
                tltle: "Sample name"
            ,   subtitle: null
            ,   image: null
        };
        var newOptions = _.extend({}, defaults, options);
        this.create(newOptions);
        return this;
    };

    _.extend(DisplayCard.prototype, {
        create: function(options){
            var self = this;
            // Create the DOM element
            self._el = $("<div></div>");
        },

        _generate = function(){
        },

        update: function(){
        },

        sdfsd3423452349249239493234: null
    });
    // defaults
    // create
    Sqor.Widgets.DisplayCard = DisplayCard;
})(Sqor);
