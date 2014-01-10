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


// Eventer.js
(function(Sqor) {
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * Eventer is a simple publish / subscribe class to help
     * us create classes that can support siple notifications.
     *
     * Usage:
     *  var eventer = new Eventer();
     *
     *  // Client
     *  eventer.subscribe("all", function() {
     *      console.log('something changed...');
     *  });
     *
     *  // Server
     *  eventer.trigger("all");
     *
     *
     * @constructor
     * @return {Null}
     */
    var Eventer = function(){
        var self = this;
        self._subscrptions = {};
    };

    _.extend(Eventer.prototype, {

        /**********************************************************************
         *   Priavate Methods
         *********************************************************************/

        /**
         *  A simple helper to add the event to our event map and return
         *  a functio to make it easy to unbind.
         * @param {string} eventName, name of the event to subscribe to
         * @param {string} id, unieque id associated with handler
         * @param {function} handler, callback function to trigger on event
         * @return {function}, unsubscribe function
         */
        _addEvent: function(eventName, id, handler) {
            var self = this;
            // First we get our subscriptions by eventName
            var subscriptionsForEvent = self._subscrptions[eventName];
            // We create a new entry if we don't have any subscriptions
            if (! _.isReal(subscriptionsForEvent) {
                self._subscrptions[eventName] = {};
                subscriptionsForEvent = self._subscrptions[eventName];
            }

            // Finally, we add our subscription
            //
            // WARNING: a very rare problem would be to add two subscriptions
            // with the same id, potential solution is to loop on
            // self.subscribe untill a unique is found.

            subscriptionsForEvent[id] = handler;
            return function(){
                self._removeSubscription(eventName, id);
            };
        },

        _removeSubscription: function(eventName, id) {
        },

        /**********************************************************************
         *   Public Methods
         *********************************************************************/

        /**
         * The main interface for clents to be able to bind themselves to
         * events supported by the eventer.
         *
         * @param {string} keyName, the name of the event we want to bind to.
         * @param {function} handler, a callback function to handle the
         *  triggering
         *  of the event.
         * @return {object}, callback to unsubscribe and id for handler
         */
        subscribe:  function(eventName, handler) {
            var self = this;
            var id = ("" + Math.random()).replace(".", "_");
            // Delegate the addition of the actual subscription to a helper
            var unsubscribeCallback = _addEvent(eventName, id, handler);
            return {
                unsubscribe: unsubscribeCallback
                id: id
            };
        },

        /**
         * Get all the functions subscribed to this event and call them.
         *
         * @param {string} eventName, the name of the event to trigger
         * @return {Null}
         */
        trigger: function(eventName) {
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Core.Eventer
})(Sqor);
// Data.js
(function(Sqor) {
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    var Data = {};

    Data.getAllPlayers = function() {
    };

    Data.getFeedForCurrentUser = function() {
    };

})(Sqor);

// HTML.js
(function(Sqor) {
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    // Creating our HTML Service to process tempaltes
    /**
     * A static object that holds a few key functions to fetch our templates.
     * Internally using underscore templating engine. This service takes
     * care of fetching everything from the server and provides a simple
     * interface.
     *
     *  Usage:
     *   var onRender = function(domElement) {
     *      // NOTE: domElement is actually a jquery object
     *      domElement.find(".someClass");
     *   }
     *   HTML.get('exampleTempalte', {'fieldOne': 'fieldValue'}, onRender);
     *
     */
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
        var domElement = $("<span></span>");
        domElement.append(HTML.getSpinner());
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
(function(Sqor) {
    // Need to get our dependencies
    var HTML = Sqor.Services.HTML,
        $ = Sqor.$;

    /**
     * This is a very simple widget that takes in an image, a title,
     * a subtitle, and a set of links associated with each element in the form
     * of callbacks.
     *
     * @constructor
     * @param {object} options, simple ways to configure our DisplayCard
     * @return {object}, the display card itself
     */
    var DisplayCard = function(options) {
        // The default values this widget can take:
        var defaults = {
                data: {
                        tltle: "Sample name"
                    ,   titleLabel: "Title: "
                    ,   subtitle: "Subtitle Example"
                    ,   subtitleLabel: "Subtitle Label: "
                    ,   imageURI: null
                },
                styleClas: "none"
        };
        var newOptions = _.extend({}, defaults, options);
        this.create(newOptions);
        // TODO: we need to return a promise... somehow too..
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
         * @param {object} data, data pertaining to how to render
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
            }, 100); // TODO: REMOVE, this is for demo porpuposes.
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });
    Sqor.Widgets.DisplayCard = DisplayCard;
})(Sqor);


