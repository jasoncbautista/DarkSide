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

    /**
     * Returns a holder object with a spinner inside.
     * @return {Object}, DOM holder
     */
    HTML.createSpinnerHolder = function(){
        var self = this;
        var domElement = $("<span></span>");
        domElement.append(self.getSpinner());
        return domElement;
    };

    /**
     * A very simple spinner to indicate there is loading goign on .
     * @return {Object} DOM element
     */
    HTML.getSpinner = function() {
        var domElement  = $("<span> <img src='images/spinner.gif'/></span>");
        return domElement;
    },

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
                data: {
                        tltle: "Sample name"
                    ,   subtitle: null
                    ,   image: null
                },
                styleClas: "none"
        };
        var newOptions = _.extend({}, defaults, options);
        this.create(newOptions);
        return this;
    };

    // Extending our widgets prototype to add basic functionality:
    _.extend(DisplayCard.prototype, {
        /**
         * Creates the basic DOM element representing our Display Card.
         * @param {Object} options,
         * @return {Null}
         */
        create: function(options){
            var self = this;
            self._options = options;
            self._data = options.data;
            // Create the DOM element
            self._el = HTML.createSpinnerHolder();
            HTML.get("displayCard", self._data, function(domElement){
                self._el.empty();
                self._el.append(domElement);
            });
        },

        /**
         * Returns the dom element associated with this widget
         * @return {Object}, DOM representation of widget.
         */
        getDomElement: function(){
            var self = this;
            return self._el;
        },

        /**
         *  A quick and dirty way to reload data.
         * @param {type} options,
         * @return {Null}
         */
        reloadData: function(data){
            var self = this;
            self._data = data;
            // First we must indicate new data is being loaded:
            self._el.empty();
            self._el.append(HTML.getSpinner());
            // Actually load the new data:
            setTimeout(function(){
                HTML.get("displayCard", self._data, function(domElement){
                    self._el.empty();
                    self._el.append(domElement);
                });
            }, 500); // TODO: remove, this is for demo porpuposes
        },

        sdfsd3423452349249239493234: null
    });
    Sqor.Widgets.DisplayCard = DisplayCard;
})(Sqor);

