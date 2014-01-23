// bootstrap.js

/**
 * Simply initializes a few key holder objects.
 * @return {Object} a shell object for our library, Sqor
 */
var initialize = function(){
    var Sqor = {};

    // We define aa few primary holders
    Sqor.Core = {};
    Sqor.Models= {};
    Sqor.Streams= {};
    Sqor.Widgets = {};
    Sqor.Modules = {};
    Sqor.Services = {};
    Sqor.Settings = {};
    Sqor.TP = {};
    // TODO FIX THIS:
    Sqor.$ = $;
    Sqor._ = _;
    return Sqor;
};

// settings.js
var setupSettings = function(Sqor){
    //Sqor.Settings.Server = "http://sqor.com";
    Sqor.Settings.Server = "";
    //Sqor.Settings.RestAPI = "/rest/api";
    Sqor.Settings.RestAPI = "/fakeRestAPI";
    Sqor.Settings.FeedAPI = "/rest/feed/api";
};

var Sqor = initialize();
setupSettings(Sqor);

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

        /**
         * Removes a handler associated with a given eventName
         * @param {string} eventName, name to unbind from
         * @param {string} id, the unique id of the handler
         * @return {Null}
         */
        _removeSubscription: function(eventName, id) {
            var self = this;
            delete self._subscrptions[eventName][id];
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
         * @param {array} args, arguments to pass when triggering
         * @return {Null}
         */
        trigger: function(eventName, args) {
            var self = this;
            var functionsToInvoke = self._subscrptions[eventName];
            _.each(functionsToInvoke, function(functionPointer){
                functionPointer(args);
            });
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Core.Eventer = Eventer;
})(Sqor);

(function(Sqor){
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * Messenger class is a simple wrapper around simple networking calls.
     *
     * Usage:
     *  var data = {"id": "383"};
     *  var p = Sqor.Services.Messenger.request("get", "feeds",  data);
     *
     * @param {type} options,
     * @return {Null}
     */
    var Messenger = function(options){
        var self = this;
        var defaults = {
                server: Sqor.Settings.Server
            ,   restAPI: Sqor.Settings.RestAPI // "/rest/api"
            ,   feedAPI: Sqor.Settings.FeedAPI
        };

        self._options = _.extend({}, defaults, options);
    };

    _.extend(Messenger.prototype, {
        /**
         * Converts a data object into a string of the following form:
         *
         *      key=Value&key2=Value2
         *
         * @param {object} data,
         * @return {string}
         */
        _serializeGetParams: function(data){
            var string = "";
            // Make into simple string
            _.each(data, function(value, key){
                string+= key + "=" + value + "&";
            });
            // Remove extra &, just to be clean
            string = string.substr(0, string.length-1);
            return encodeURI(string);
        },

        /**
         * Send request to REST API.
         * @param {type} type,
         * @param {type} path,
         * @param {type} data,
         * @return {Null}
         */
        requestRestAPI: function(type, path, data){
            var self = this;
            path = Sqor.Settings.RestAPI + path;
            self.request(type, path, data);
        },

        /**
         * A wrapper around get / post /put /delete ajaxy calls.
         *
         * @param {string} type,
         * @param {string} path, api path
         * @param {object} data, map of params
         * @return {object}, jquery promise
         */
        request: function(type, path, data){
            var self = this;
           var url = self._options.server + path;
           var handle = {};
           if (type === "GET") {
                var getParams = self._serializeGetParams(data);
                handle = $.get(url + getParams);
           } else {
               handle = $.ajax({
                   type: type
                ,    url: url
                ,   data: data
               });
           }
           return handle;
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });
    Sqor.Services.Messenger = new Messenger();
})(Sqor);

(function(Sqor){
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    var Logger = function(options){
        var defaults = {
            loggingEndpoint:  "/rest/log/"
        };
    };

    _.extend(Logger.prototype, {
        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Services.Logger = new Logger();
})(Sqor);

// Model.js
(function(Sqor) {
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;
    var Messenger = Sqor.Services.Messenger;

    /**
     * @constructor
     * @param {type} options,
     * @return {Null}
     */
    var Model = function(options){
    };

    Model.prototype = new Sqor.Core.Eventer();

    _.extend(Model.prototype, {

    });

})(Sqor);

// Collection.js
(function(Sqor) {
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    /*
     * create -> POST
     * read -> GET
     * update -> PUT
     * delete -> DELETE
     */

    /**
     *
     * @constructor
     * @param {type} options,
     * @return {Null}
     */
    var Collection = function(options){
        var self = this;
        var defaults = {
                model: null
            ,   mode: "probe"
            ,   appendHandler: $.noop
            ,   prependHandler: $.noop
            ,   insertHandler: $.noop
            ,   allChanges: $.noop
            ,   firstLoad: $.noop
            ,   iterSize: 25
        };
        newOptions = _.extend({}, defaults, options);
        self._options = newOptions;
        self.create();
    };

    Collection.prototype = new Sqor.Core.Eventer();
    _.extend(Collection.prototype, {
        create: function(){
            self._models = [];
            self._rawList = [];
            self._originalCount= false;
            self._tailFetches= 0;
            self._noneTailFetches= 0;
            self._headFetches= 0;
            self._iterPosition = 0;
        },

        // TODO: implement iterator
        next: function(){
            var self = this;
            if ( self._models.length > self._originalCount ) {
            }

            return [];
            return false;
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

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
     *      var c = new Sqor.Widgets.DisplayCard({title: "Simple Name"});
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
                    tltle: ""
                ,   titleLabel: ""
                ,   subtitle: ""
                ,   subtitleLabel: ""
                ,   imageURI: ""
                ,   styleClas: "none"
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
            // Create the DOM element
            self._el = HTML.createSpinnerHolder();
            HTML.get("displayCard", self._options, function(domElement){
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
        /**
         * Creates a simple table by loading the HTML template
         * @param {object} options, used to configure the widget
         * @return {Null}
         */
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

        /**
         * Renders the table by loading each cell from the dataDelegate.
         * @return {Null}
         */
        _render: function(){
            var self = this;
            var cellsContainer = self._el.find(".SQOR_cellsContainer");
            var cellCount = self._dataDelegate.getNumberOfCells();
            // Render each cell by calling into our delegate
            for(var ii = 0; ii < cellCount; ii++){
                var currentCellDOM = self._dataDelegate.getCellAtIndex(ii);
                cellsContainer.append(currentCellDOM);
            }
        },

        /**
         * Set's the current dataDelegate to specifcy cells, and count.
         * @param {object} delegate, dataDelegate containing key methods
         * @return {Null}
         */
        setDataDelegate: function(delegate){
            var self = this;
            self._dataDelegate = delegate;
        },

        /**
         * Returns the jQuery dom element representing the SimpleTable
         * @return {object}, jQuery object
         */
        getDomElement: function(){
            var self = this;
            return self._el;
        },

       /**
        * A delegate method we expose as a way to be notified when we should
        * rerender.
        *
        * @return {Null}
        */
       dataChanged: function(){
            var self = this;
            self.rerender();
        },

        /**
         * Helper function to rerender (after everything has already been
         * rendered).
         * @return {Null}
         */
        rerender: function(){
            var self = this;
            var cellsContainer = self._el.find(".SQOR_cellsContainer");
            cellsContainer.empty();

            self._render();
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    // Export our widget
    Sqor.Widgets.SimpleTable = SimpleTable;
})(Sqor);

// DynamicTable.js
(function(Sqor) {
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     *  Our dynamic table subclasses our SimpleTable. It works
     *  in a pretty similar manner with the difference that it supports
     *  appending and prepending of new items without refreshing everything
     *
     *
     *  Usage:
     *
     ** var someObject = {
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
     * var table = new DynamicTable(options);
     *
     *  // TODO demonstrate example of appending
     *
     *
     * @constructor
     * @param {type} options,
     * @return {Null}
     */
    var DynamicTable = function(options){
        // Subclass off super
        Sqor.Widgets.SimpleTable.call(this, options);
    };

    DynamicTable.prototype = new  Sqor.Widgets.SimpleTable();

    _.extend(DynamicTable.prototype, {
        /**
         * We are overwriting the original dataChanged method to
         * handle diffs in data changes.
         *
         * @param {string} type,
         * @param {number} count,
         * @return {Null}
         */
        dataChanged: function(type, count){
            var self = this;
            // if we don't have a real type
            if(! _.isReal(type)) {
                Sqor.Widgets.SimpleTable.prototype.dataChanged.apply(this);
            } else if( type === "prepend"){
                // We need to add a few rorrws
                self.renderMoreTopRows(count);
            } else if (type === "append"){
                // TODO: if count > 0
                self.renderMoreBottomRows(count);
            }
        },

        /**
         * Does old school infinite scroll rendering
         * @param {type} count,
         * @return {Null}
         */
        renderMoreTopRows: function(count){
            var self = this;
            var cellsContainer = self._el.find(".SQOR_cellsContainer");
            // Render each new cell by calling into our delegate
            for(var ii =  count - 1  ; ii  >=  0 ; ii--){
                var currentCellDOM = self._dataDelegate.getCellAtIndex(ii);
                cellsContainer.prepend(currentCellDOM);
            }
        },

        /**
         * Takes our dom structure and adds rows to the bottom
         * @param {type} count, number of rows to add
         * @return {Null}
         */
        renderMoreBottomRows: function(count){
            var self = this;
            var cellsContainer = self._el.find(".SQOR_cellsContainer");
            var cellCount = self._dataDelegate.getNumberOfCells();
            // Render each new cell by calling into our delegate
            for(var ii =  cellCount - count; ii < cellCount; ii++){
                var currentCellDOM = self._dataDelegate.getCellAtIndex(ii);
                cellsContainer.append(currentCellDOM);
            }
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Widgets.DynamicTable = DynamicTable;
})(Sqor);

(function(Sqor) {
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * This widget will reflect the state of the feed list. Similar to how
     * Facebook and a few big sites do it.
     *
     * @param {type} options,
     * @return {Null}
     */
    var FeedFooter = function(options){
        var self = this;
        var defaults = {
                templateValues: {}
            ,   renderedCallback: $.noop
        };
        self._delegates = [];
        self._options = _.extend({}, defaults, options);
        self.create(self._options);
    };

    _.extend(FeedFooter.prototype, {
        // TODO: MAKE ALL WIDGETS inherit from BASEWIDGET .. .and remove this
        // code????
        create: function(){
            var self = this;
            // Setup our  holder element:
            self._el = HTML.createSpinnerHolder();
            self._el.empty();
            self._el.append(HTML.getSpinner());
            HTML.get("feedFooter", self._options.templateValues,
            function(domElement){
                self._el.empty();
                self._el.append(domElement);
                self._render();
                self._options.renderedCallback(self._el, domElement);
            });
        },

        /**
         * Renders our widget for the first time.
         * @return {Null}
         */
        _render: function(){
        },

        /**
         * Returns the jQuery dom element representing our widget
         * @return {object}, jQuery object
         */
        getDomElement: function(){
            var self = this;
            return self._el;
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Widgets.FeedFooter = FeedFooter;
})(Sqor);
// AthleteList
// AthleteListViewController.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * A simple module to render a list of cells.
     *
     * Usage:
     *
     *  var c = new Sqor.Modules.AthleteListViewController();
     *  $("body").append(c.getDomElement());
     *
     * @param {object} options,
     * @return {Null}
     */
    var AthleteListViewController = function(options){
        var defaults = {};
        var self = this;
        self.create();
    };

    _.extend(AthleteListViewController.prototype, {

        /**
         * Siple create function to setup model and view along with delegates.
         * @return {Null}
         */
        create: function(){
            var self = this;
            self._model = new Sqor.Modules.AthleteListViewModel();
            var tableViewOptions = {
                dataDelegate: self
            };
            self._tableView = new Sqor.Widgets.DynamicTable(tableViewOptions);
            self._footerView = new Sqor.Widgets.FeedFooter();
            self._model.addDelegate(self._tableView);

            // TODO: fix this, use actual template:
            self._el = $("<div></div");
            self._el.append(self._tableView.getDomElement());
            self._el.append(self._footerView.getDomElement());
            self._bindScroll();
        },

        /**
         * Helper function to return if a certain element is in the "viewport"
         * of the browser at this time
         * @param {type} elem,
         * @return {Null}
         */
        _isScrolledIntoView: function(elem){
            var offscreenTop =  $(document.body).scrollTop()
            var displayAreaSize = window.innerHeight;

            var elemTop = $(elem).offset().top;

            var totalScrolled = offscreenTop + displayAreaSize;
            var isVisible =  elemTop <= totalScrolled;
            // return isVisible; /
            return isVisible;
        },

        /**
         * We create a binding to scroll event so that we can load more
         * items when we reach a certain point
         *
         * @return {Null}
         */
        _bindScroll: function(){
            var self = this;
            self._modelCount = self._model.size();
            self._lastLoadedReturned = true ;
            $(document).scroll(function(){
                var documentHeight = $(document).height();
                var scrollTop = $(document).scrollTop();
                // TODO:  this is kidna buggy... some disconnect...
                // need a way to find maxScroll Max
                // if we are over half way through.. load more items
                var scrollLimit =  documentHeight * 1/3;
                if (self._isScrolledIntoView(self._footerView.getDomElement())){
                    if (self._modelCount <= self._model.size()  &&
                        self._lastLoadedReturned) {
                        self._lastLoadedReturned = false;
                        self._tryToLoadMore();
                        self._modelCount = self._model.size();
                    }
                }
            });
        },

        /**
         * We go to the server / model  and try to load more  items
         * worry about that.
         *
         * @return {Null}
         */
        _tryToLoadMore: function(){
            var self = this;
            // TODO:  remove this timeout:
            // set on timer to emulate delay in ajax...
            self._model.loadBottomItems(function(){
                console.log("loading more...");
                self._lastLoadedReturned = true;
            });
        },

        /**
         * A simple way to return the DOM element representing this controller
         * @return {object} jquery DOM element
         */
        getDomElement: function(){
            var self = this;
            return self._el;
        },

        /**********************************************************************
         *  Delegate API Methods Implemented
         *********************************************************************/

        /**
         * Simple function to return a DOM element for a given cell position.
         * @param {number} index,
         * @return {Object} jquery Object
         */
        getCellAtIndex: function(index) {
            var self = this;
            var imageURI = "";
            try{
            imageURI = self._model._items[index].doc.media_ig[0].url;
            } catch(e){
            }
            var options = {
                        title:  "" + index + ")."
                    ,   subtitle:  self._model._items[index].doc.content
                    ,   imageURI: imageURI//"images/person_placeholder.jpg"
                };
            var displayCard  = new Sqor.Widgets.DisplayCard(options);
            return displayCard.getDomElement();
        },

        /**
         * Returns number of cells by calling on model:
         * @return {number} size of table
         */
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

    /**
     * Initializes a simple model to represetn the state of the list module.
     * @return {Null}
     */
    var  AthleteListViewModel = function(){
        var self = this;
        self._delegates = [];
        self._offset= 0;
        self._sep = 25;
        self._items = [];
        var promise =  $.get("http://feedtools-dev.sqor.com/content?offset=0&limit=25&q=type:instagram");
        promise.done(function(data){
            self._loadItems(data);
        });
    };

    _.extend(AthleteListViewModel.prototype, {

        /**
         * Adds a delegate to our list of delegates
         * @param {object} delegate,
         * @return {Null}
         */
        addDelegate: function(delegate){
            var self = this;
            self._delegates.push(delegate);
        },

        /**
         * Calls all delegates listening for dataChanges
         * @return {Null}
         */
        _callDelegates: function(type, count){
            var self = this;
            var args = arguments;
            _.each(self._delegates, function(delegate) {
                if (_.isReal(delegate.dataChanged)) {
                    delegate.dataChanged.apply(delegate, args);
                }
            });
        },

        _loadItems: function(data){
            var self = this;
            var results = data.results;
            _.each(results, function(result){
                self._items.push(result);
            });

            self.appendItems(results.length);
            self._offset += self._sep;
        },

        loadBottomItems: function(successHandler){
            var self = this;
            var promise =  $.get("http://feedtools-dev.sqor.com/content?offset=" + self._offset + "&limit=25");
            promise.done(function(data){
                self._loadItems(data);
                successHandler();
            });
        },

        /**
         * New rows / items were added to the beginning
         * @param {type} count,
         * @return {Null}
         */
        prependItems: function(count) {
            var self = this;
            self._callDelegates("prepend", count);
        },

        /**
         * Old rows /items were loaded into memory:
         * @param {type} count,
         * @return {Null}
         */
        appendItems: function(count) {
            var self = this;
            self._callDelegates("append", count);
        },


        /**
         * Returns the size of the list / table
         * @return {number} size of list
         */
        size: function() {
            var self = this;
            return self._items.length;
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Modules.AthleteListViewModel = AthleteListViewModel;
})(Sqor);


// UserFeeder.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    var UserFeeder = function(){
    };
    UserFeeder.prototype = new  Sqor.Core.Eventer();
    _.extend(UserFeeder.prototype, {
    });

    Sqor.Streams.UserFeeder = UserFeeder;
})(Sqor);
// UserFeedViewController.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    var UserFeedViewController = function(){
    };
})(Sqor);

// experiMENTAL
//           experiMENTAL
//                  experiMENTAL
(function(Sqor){
    var SmartTable = function(){
    };

    SmartTable.test = function(count, dataDelegate) {
        var addListener = function(elements) {
            var elementsUp = 0;
            var rearrangeElements= function(elementsArray, elementsUp) {
                    var displayAreaHeight = window.innerHeight;
                    var middleElement = elementsArray[Math.floor(elementsArray.length *  1/3)];
                    middleElementTop = middleElement.offset().top -
                        $(window).scrollTop();
                    var middleElementRealTop = (middleElementTop + middleElement.height() );
                    console.log('middleElementRealTop', middleElementRealTop);
                    console.log('displayAreaHeight/2', displayAreaHeight/2);
                    // TODO: This needs to be based on diff of scroll
                    // from last scroll ... and not on position of elements..
                    //  so if you scroll up a little.. you move some elements
                    //  if you scroll up a ton.. you rredraw
                    if ( middleElementRealTop  <= displayAreaHeight * 1/8) {
                        // Now we move one of our elements from the head to the
                        // tail
                        var head = elementsArray[0];
                        elementsArray = elementsArray.splice(1, elementsArray.length-1);
                        elementsArray.push(head);
                        elementsUp++;
                        console.log('shift..');
                    }
                    if (middleElementRealTop >= displayAreaHeight  * 7/8) {
                        var tail = elementsArray[elementsArray.length -1];
                        elementsArray = elementsArray.splice(0, elementsArray.length-1);
                        elementsArray.unshift(tail);
                        elementsUp--;
                        console.log('shift down..');
                    }
                return [elementsArray, elementsUp];
            };

            var domElements = elements;
            var lastScroll = $(document).scrollTop();
            $(document).scroll(function() {
                var ii = 0;
                _.each(domElements, function(domElement){
                    var top = domElement.offset().top;
                    var scrollFromTop = $(document).scrollTop();
                    var diffScrolled = lastScroll - scrollFromTop;
                    var elementHeight = domElement.height();
                    var newTop = (ii+elementsUp)*elementHeight - scrollFromTop;
                    domElement.css("top", newTop + "px");
                    lastScroll = scrollFromTop;
                    ii++;
                });

                var results = rearrangeElements(domElements, elementsUp);
                console.log('results', results[0]);
                console.log('eleementsUp', results[1]);
                domElements = results[0];
                elementsUp = results[1];
            });
        };
        var self = this;
        var parentEl = $("body");
        // First we add a fake super large element:
        var hugeEl = $("<div></div>");
        parentEl.append(hugeEl);
        hugeEl.css("height", 100 * 600 + "px");
        // Create a bunch of DOM
        var domElements = [];
        for(var ii = 0; ii < count; ii++) {
            var newEl = $("<div class='fixed'>" +
                          ii + "<span class='container'></span></div>");
            parentEl.append(newEl);
            domElements.push(newEl);
            var height = newEl.height();
            // TODO: start this at - 1/3 hidden away
            newEl.css("top", height * ii + "px");
        }
        addListener(domElements);
    };

    _.extend(SmartTable.prototype, {
        test: function(count){
        }
    });

    Sqor.Widgets.SmartTable = SmartTable;
})(Sqor);

$(document).ready(function(){

    /**
     * Quickwa to call our experimental smart dynamic table
     * @return {Null}
     */
    var runComplexTable  = function() {
        var dataDelegate = function(count) {
            var self = this;
            this._count = count;
        };

        dataDelegate.prototype.cellCount = function() {
            var self = this;
            return self._count;
        };

        /**
         * A simple dummy delegate method used to test our table.
         * @param {type} index,
         * @return {Null}
         */
        dataDelegate.prototype.cellAtIndex = function(index){
            return $("<div><h2>" + index + "</h2></div>");
        };
        Sqor.Widgets.SmartTable.test(50);
    };

    /**
     * Helper function to load our dynamic table module.
     * It basically auto loads more  models to do infinite scroll
     * @return {Null}
     */
    var runSimpleDynamicTableModule =  function() {
        var c = new Sqor.Modules.AthleteListViewController();
        $("body").append(c.getDomElement());
        //append to Model
        // c._model.appendItems(10);
        // c._model.prepend(10);
        window._c = c;
    };

    runSimpleDynamicTableModule();
    // runComplexTable();
});

