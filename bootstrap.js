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
            if (! _.isReal(subscriptionsForEvent)) {
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
            // TODO: implement
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
                ,   id: id
            };
        },

        /**
         * Get all the functions subscribed to this event and call them.
         *
         * @param {string} eventName, the name of the event to trigger
         * @return {Null}
         */
        trigger: function(eventName) {
            // TODO: IMPLEMENT
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

    /**
     * Returns a jQuery dom element for the template with options applied
     * to the corresponding fields in the template.
     *
     * @param {string} templateName, name of template to fetch
     * @param {object} options, fields to substitute inside template
     * @param {function} callback, handler for when DOM element is ready
     * @return {Null}
     */
    HTML.get = function(templateName,  options, callback){
        $.get("html/" +  templateName + ".html", function(htmlString) {
            var compiledTemplate = _.template(htmlString)(options);
            var domElement =  $(compiledTemplate);
            callback(domElement);
        });
    };

    /**
     * Returns a holder object with a spinner inside
     * @return {Object}, DOM holder
     */
    HTML.createSpinnerHolder = function(){
        var domElement = $("<span></span>");
        domElement.append(HTML.getSpinner());
        return domElement;
    };

    /**
     * A very simple spinner to indicate there is loading goign on.
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
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * This is a very simple widget that takes in an image, a title,
     * a subtitle, and a set of links associated with each element in the form
     * of callbacks.
     *
     * Usage:
     *      var c = new Sqor.Widgets.DisplayCard({name: "Simple Name"});
     *      $('body').append(c.getDomElement());
     *      c.reloadData({"name": "NewName"});
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
            }, 100); // TODO: REMOVE. This is for demo porpuposes.
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    // Export our widget
    Sqor.Widgets.DisplayCard = DisplayCard;
})(Sqor);

// SimpleTable.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * A simple table that renders cells in a list form.
     *
     * Usage:
     *
     * var someObject = {
     *  getNumberOfCells: function(){ return 2; },
     *
     *  getCellAtIndex: function(index) {
     *      var cells = [
     *           $("<div> Cell One </div>"),
     *           $("<div> Cell Two </div>"),
     *      ];
     *
     *      return cells[index];
     *  };
     *
     * };
     * var options = {
     *  dataDelegate: someObject
     * };
     *
     * var table = new SimpleTable(options);
     *
     * @consructor
     * @param {type} options,
     * @return {Null}
     */
    var SimpleTable = function(options){
        var self = this;
        var defaults = {
                parentElement: null
            ,   renderedCallback: $.noop
            , templateValues: {
                    "className": null
                }
            , dataDelegate: {
                "getNumberOfCells": function(){
                    return 0;
                },
                "getCellAtIndex": function(index){
                    return $("");
                }
            }
        };
        self._delegates = [];
        self._options = _.extend({}, defaults, options);
        self._dataDelegate = self._options.dataDelegate;
        self.create(self._options);
    };

    _.extend(SimpleTable.prototype, {
        create: function(options) {
            var self = this;
            // Setup our  holder element:
            self._el = HTML.createSpinnerHolder();
            self._el.empty();
            self._el.append(HTML.getSpinner());
            HTML.get("simpleTable", self._options.templateValues,
            function(domElement){
                self._el.empty();
                self._el.append(domElement);
                self._render();
                self._options.renderedCallback(self._el, domElement);
            });
        },

        _render: function(){
            var self = this;
            var cellsContainer = self._el.find(".SQOR_cellsContainer");
            var cellCount = self._dataDelegate.getNumberOfCells();
            // Render each cell by calling into our delegate
            for(var ii = 0; ii < cellCount; ii++){
                var currentCellDOM = self._dataDelegate.getCellAtIndex(ii);
                cellsContainer.append(currentCellDOM);
            };
        },

        setDataDelegate: function(delegate){
            var self = this;
            self._dataDelegate = delegate;
        },

        getDomElement: function(){
            var self = this;
            return self._el;
        },

        addDelegate: function(){
        },

        _callDelegateForMethod: function(methodName, _arguments) {
        },

        _getDelegateForMethod: function(methodName){
        },

        rerender: function(){
            var self = this;
            var cellsContainer = self._el.find("SQOR_cellsContainer");
            self._render();
        },

        getDelegateMethodsExpected: function(){
            return {
                    'getCellAt': ['index']
                ,   'getNumberOfCells': []
            };
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    // Export our widget
    Sqor.Widgets.SimpleTable = SimpleTable;
})(Sqor);

// AthleteList

// AthleteListViewController.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    var AthleteListViewController = function(options){
        var defaults = {};
        var self = this;
        self.create();
    };

    _.extend(AthleteListViewController.prototype, {

        create: function(){
            var self = this;
            self._model = new Sqor.Modules.AthleteListViewModel();
            var viewOptions = {
                dataDelegate: self
            };
            self._view = new Sqor.Widgets.SimpleTable(viewOptions);
        },

        getDomElement: function(){
            var self = this;
            return self._view.getDomElement();
        },

        getCellAtIndex: function(index) {
            return $("<div>" + index + "</div>");
        },

        getNumberOfCells: function(){
            var self = this;
            return self._model.size();
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Modules.AthleteListViewController = AthleteListViewController;
})(Sqor);



// AthleteListViewModel.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    var  AthleteListViewModel = function(){
    };

    _.extend(AthleteListViewModel.prototype, {

        size: function() {
            return 10;
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null

    });

    Sqor.Modules.AthleteListViewModel = AthleteListViewModel;
})(Sqor);
