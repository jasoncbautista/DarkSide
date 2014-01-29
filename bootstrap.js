// bootstrap.js

/**
 * Simply initializes a few key holder objects.
 * @return {Object} a shell object for our library, Sqor
 */
var initialize = function(window, document){
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
    // TODO(Jason): FIX THIS:
    Sqor.$ = $;
    Sqor._ = _;
    Sqor.Globals = {};
    Sqor.Globals.window = window;
    Sqor.Globals.document = document;
    return Sqor;
};

// settings.js
var setupSettings = function(Sqor){
    Sqor.CONSTANTS  = {};
    Sqor.Settings.Server = "http://sqor.com";
    Sqor.Settings.RestAPI = "/rest";
    Sqor.Settings.FeedAPI = "/rest/feed/api";
};

var Sqor = initialize(window, document);
setupSettings(Sqor);


/**
 * We should call this function when jquery says we have done loading .
 *
 * TODO(Jason): strictly speaking, we can do some of this stuff before
 * we are done loading..
 * TODO(Jason): consider doing this on router.onReady
 * ... then we can have router be the one to trigger on ready when it
 * has bound everything
 * @return {Null}
 */
Sqor.onReady = function(){

    // Need to add routes to router.... and handlers..
    Sqor.demoRoutes();

    //TODO(Jason): this should be done in its own class.. Scheduler?
    var Scheduler = function(urlPath){
        // For now we just delete everything on our page
        Sqor.$("body").empty();
    };
    Sqor.Router.subscribe("onUrlPathChanged", Scheduler);
};

// DemoRoutes.js
Sqor.demoRoutes = function(){
    // Subscribe to a few routes to see what we can do

    // TODO(Jason): each module should subscribe itself to these


    /**
     * Quickwa to call our experimental smart dynamic table
     * @return {null}
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
         * @return {null}
         */
        dataDelegate.prototype.cellAtIndex = function(index){
            return $("<div><h2>" + index + "</h2></div>");
        };
        Sqor.Widgets.SmartTable.test(50);
    };

    /**
     * Helper function to load our dynamic table module.
     * It basically auto loads more  models to do infinite scroll
     * @return {null}
     */
    var runSimpleDynamicTableModule =  function() {
        var c = new Sqor.Modules.FeedListController();
        $("body").append(c.getDomElement());
        //append to Model
        // c._model.appendItems(10);
        // c._model.prepend(10);
        window._c = c;
    };

    var runSimpleGrid = function(count) {

        var dataDelegate = {
            getNumberOfCells: function() {
                return count;
            },

            getCellAtIndex:  function(index){
                return $("<span class='SQOR_fakeCell'>" + index + "</span>");
            }
        };

        /**
         * A simple dummy delegate method used to test our table.
         * @param {type} index,
         * @return {null}
         */
        var options = {
            dataDelegate: dataDelegate
        };
        var grid = new Sqor.Widgets.SimpleGrid(options);
        $("body").append(grid.getDomElement());
    };

    var runDataGrid = function(showTeams){
        var playerModelOptions = {
                    path: "/sports/players"
                ,   fetchAll: true
                ,   urlParams: {
                        team_id: 32043
                    ,   limit: 30000
                }
        };
        if (showTeams) {
            playerModelOptions = {};
         }

        var c = new Sqor.Modules.ExampleGridController({modelOptions: playerModelOptions});
        $("body").append(c.getDomElement());
        //append to Model
        // c._model.appendItems(10);
        // c._model.prepend(10);
        window._c = c;

    };

    // Now we bind to our router...

};

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
     * @return {null}
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
         *
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

            // Finally, we add our subscription.
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
         * Removes a handler associated with a given eventName.
         *.
         * @param {string} eventName, name to unbind from
         * @param {string} id, the unique id of the handler
         * @return {null}
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
        //TODO(Jason): make this return a promise.
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
         * @return {null}
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

//Router.js
(function(Sqor){
    var $ = Sqor.$;
    var _ = Sqor._;
    var Eventer = Sqor.Core.Eventer;
    var window = Sqor.Globals.window;
    var document = Sqor.Globals.document;

    var Router = function(){
        var self = this;
        self._routes = []; // TODO(Jason): {}
        self._bindToHashChange();
    };

     /**
      * Router is a static class that will be available as one instance
      * (singleton) that takes care of notifying anyone that cares about events
      * that just happened.
      *
      * @constructor
      * @return {null}
      */
     Router.prototype.eventer = new Eventer();
    _.extend(Router.prototype, {

        /**
         * The router binds itself to events on changes of the url path.
         * A first time load is considered a "change".
         * @return {Null}
         */
        _bindToHashChange: function(){
            var self = this;
            // We must bind to our
            $(document).ready(function(){
                var urlPath =
                    self._cleanUpUrlPath(window.location.hash);
                self._triggerRouteForPath(urlPath);

                $(window).on("hashchange", function(){
                    // TODO: on first load?
                    var urlPath =
                        self._cleanUpUrlPath(window.location.hash);
                    self._triggerRouteForPath(urlPath);
                });
            });
        },

        /**
         * Helper method to clean up our url path, particularly removing
         * the # character.
         * @param {string} urlPath, dirty version of the path
         * @return {string}, cleaned version of the path
         */
        _cleanUpUrlPath: function(urlPath){
            var self = this;
            // WARNING: this assumes no # are allowed anywhere else on the
            // url path
            return urlPath.replace("#", "");
        },

        /**
         * Quick and easy way to add a few routes all at once.
         * These routes will create an easy way to make subscriptions.
         *
         * Usage:
         *
         *  var routes = [
         *          { key: "someKey", pattern: "/path/one"}
         *      ,   { key: "someKeyX", pattern: "/path/X"}
         *      ,   { key: "someKeyY", pattern: "/path/Y"}
         *  ];
         *
         * Router.addRoutes(routes);
         * -------------------------
         * @param {array} routes, array of
         * @return {null}
         */
        addRoutes: function(routes){
            var self = this;
            _.each(routes, function(route){
                self.addRoute(route.key, route.pattern);
            });
        },

        /**
         * Add a single route pattern to our set of routes.
         *
         * Usage:
         *
         * router.addRoute("someKey", "somePattern");
         * -------------------------
         * @param {type} key,
         * @param {type} routePathPattern,
         * @return {Null}
         */
        addRoute: function(key, routePathPattern){
            var self = this;
            // Lowercase all:
            self._routes.push({
                    "key": key
                ,   "pathPattern": routePathPattern
            });
        },

        /**
         * Given a url path, we try to match against our set of routes and
         * triger an even when this happens.
         *
         * Ussage:
         *
         *  router._triggerRouteForPath("path/one");
         * -------------------------
         * @param {type} urlPath,
         * @return {null}
         */
        _triggerRouteForPath: function(urlPath) {
            var self = this;
            _.each(self._routes, function(route){
                // TODO(Jason): make this
                if( route.pathPattern === urlPath){
                    var matchInfo= {
                            requestedURLPath: urlPath
                        ,   matchedPattern: route.pathPattern
                    };
                    self.trigger(route.key, params)
                    self.trigger("onUrlPathChanged");
                }
            });
        },

        // TODO(Jason): onReady... notify all who depend on us
        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Core.Router = new Router();

})(Sqor);

//Messenger.js
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
     * @return {null}
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
         * @return {null}
         */
        requestRestAPI: function(type, path, data){
            var self = this;
            path = Sqor.Settings.RestAPI + path;
            return self.request(type, path, data);
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
                var urlWithGetParams = url + "?" +  getParams;
                handle = $.get(urlWithGetParams);
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
    var Eventer = Sqor.Core.Eventer;
    // TODO(Jason): switch away from static model
    /**
     * @constructor
     * @param {type} options,
     * @return {null}
     */
    var Model = function(options){
        var self = this;
        var defaults = {
                path: "/"
            , connectionType: "REST"
            , isLocalOnly: true
            , atuosave: true
            , data: {}
        };

        self._options = _.extend({}, defaults, options);
        self.create();
    };

    // We subclass off our eventer class
    Model.prototype = new Eventer();

    _.extend(Model.prototype, {
        // TODO(Jason):
        // get("key", "defaultValue");
        // var title = model.get("title", "");

        create: function() {
            var self = this;
            // Load our data
            self._loadData(self._options.data);
        },

        save: function(newProperties){
            // TODO(Jason): implement
        },

        // TODO(Jason): overwrite subscribe to accept things like:
        //  set:PropertyName   delete:PropertyName


        /**
         * Whenever there is a set on a given property, we notify even
         * if they are the same value. We also save by default.
         * @param {type} propertyName,
         * @param {type} value,
         * @return {null}
         */
        set: function(propertyName, value /*, notifyOnlyIfDifferent*/) {
            var self = this;
            self._rawData[propertyName] =  value;
            if (!self._options.isLocalOnly) {
                self.save();
            }
            self.trigger(propertyName, {data: self._rawData, newValue: value});
        },

        /**
         * Simple function to help load our data into local varible
         * @param {type} data,
         * @param {type} shouldNotify,
         * @return {null}
         */
        _loadData: function(data, shouldNotify){
            var self = this;
            self._rawData = data;
            if (shouldNotify) {
            }
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    _.extend(Model, {
    });
    Sqor.Core.Model = Model;
})(Sqor);

// SimpleCollection.js
(function(Sqor) {
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;
    var Messenger = Sqor.Services.Messenger;
    var Eventer = Sqor.Core.Eventer;
    var Model = Sqor.Core.Model;

    var SimpleCollection = function(options){
        var self = this;
        var defaults = {
                model: Sqor.Core.Model
            ,   path: "/"
            ,   urlParams: {}
            ,   successHandler: $.noop
            ,   delegates: []
            ,   fetchAll: false
            ,  sortOnKey: "id"
        };

        self._options = _.extend({}, defaults, options);
        self._delegates = self._options.delegates;
        self._rawData = [];
        self._sortedData = [];
        self.create();
    };

    SimpleCollection.prototype = new Eventer();

    _.extend(SimpleCollection.prototype, {
        create: function(){
            var self = this;
            self._itemsInCollection = 0;

            if (self._options.fetchAll) {
                self.fetchAll(self._options.successHandler);
            }
        },

        fetchAll: function(successHandler){
            var self = this;
            var params = self._options.urlParams;
            // TODO(Jason): fix and make recurisve
            var request = Messenger.requestRestAPI("GET", self._options.path, params);
            request.done(function(response){
                self._handleFetch(response, successHandler, params);
            });
        },

        _handleFetch: function(response, successHandler, params){
            var self = this;
            var rows = response.rows;
            self._rawData = self._rawData.concat(rows);
            self._sortedData = self._rawData.concat([]);
            successHandler(self._rawData);
            self._notifyDelegates("dataChanged");
        },

        /**
         * Calls all delegates listening for dataChanges
         * @return {null}
         */
        _notifyDelegates: function(methodName, _arguments){
            var self = this;
            var args = _arguments;
            _.each(self._delegates, function(delegate) {
                if (_.isReal(delegate[methodName])) {
                    delegate[methodName].apply(delegate, args);
                }
            });
        },

        getItem: function(index){
            var self = this;
            return self._sortedData[index];
        },

        length: function(){
            var self = this;
            return self._rawData.length;
        },

        /**
         * Adds a delegate to our list of delegates
         * @param {object} delegate,
         * @return {null}
         */
        addDelegate: function(delegate){
            var self = this;
            self._delegates.push(delegate);
        },

        _resort: function(keyToSortOn){
            var self = this;
            self._sortedData = _.sortBy(self._rawData, function(item){
                return item[keyToSortOn];
            });
        },

        getSorted: function(keyToSortOn, dontTriggerDataChange){
            var self = this;
            self._resort(keyToSortOn);
            if (!dontTriggerDataChange){
                self._notifyDelegates("dataChanged");
            }
            return self._sortedData;
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Core.SimpleCollection = SimpleCollection;
})(Sqor);


// StaticCollection.js
//  Supports sorting, etc.
//  Filtering

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
     * @return {null}
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

        // TODO(Jason): implement iterator
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
     * @return {null}
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
        // TODO(Jason): we need to return a promise... somehow too..
        return this;
    };

    // Extending our widgets prototype to add basic functionality:
    _.extend(DisplayCard.prototype, {

        /**
         * Creates the basic DOM element representing our Display Card.
         * @param {Object} options,
         * @return {null}
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
         * @return {null}
         */
        reloadData: function(data){
            var self = this;
            self._data = data;
            // First we must indicate new data is being loaded:
            self._el.empty();
            self._el.append(HTML.getSpinner());
            // Actually load the new data:
            HTML.get("displayCard", self._data, function(domElement){
                self._el.empty();
                self._el.append(domElement);
            });
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
     * @return {null}
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
         * @return {null}
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
         * @return {null}
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
         * @return {null}
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
        * @return {null}
        */
       dataChanged: function(){
            var self = this;
            self.rerender();
        },

        /**
         * Helper function to rerender (after everything has already been
         * rendered).
         * @return {null}
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


// ExampleGridController.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;
    var SimpleCollection = Sqor.Core.SimpleCollection;

    var ExampleGridController = function(options){
        var self = this;
        self.create(options);
    };

    _.extend(ExampleGridController.prototype, {

        /**
         * Siple create function to setup model and view along with delegates.
         * @return {null}
         */
        create: function(options){
            var self = this;
            var defaultModelOptions= {
                    path: "/sports/teams"
                ,   fetchAll: true
                ,   urlParams: {
                        sport: "nba"
                    ,   limit: 100
                    ,   offset: 0
                }
            };

            var modelOptions = _.extend({}
                , defaultModelOptions
                , options.modelOptions);

            self._models = new Sqor.Core.SimpleCollection(modelOptions);
            var gridViewOptions = {
                    dataDelegate: self
                // , displayDelegate: self
            };

            self._gridView = new Sqor.Widgets.SimpleGrid(gridViewOptions);
            self._models.addDelegate(self._gridView);

            // TODO(Jason): fix this, use actual template:
            self._el = $("<div></div");
            self._el.append(self._gridView.getDomElement());
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
            var model = self._models.getItem(index);
            // var displayCard = self._getWidgeForType(model);
            // return displayCard.getDomElement();
            var options = {
                title: model.name
                , subtitle: model.first_name + " " + model.last_name
                , author: ""
                , imageURI: ""
                , externalURI: ""
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
            return self._models.length();
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });
    Sqor.Modules.ExampleGridController = ExampleGridController;
})(Sqor);

// ExampleGridModel.js


// SimpleGrid.js
(function(Sqor) {
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    // Constants for this specific class
    Sqor.CONSTANTS.SimpleGrid = {
            ROWS_FIRST: "rows_first"
        ,   COLUMNS_FIRST: "columns_first"
    };

    // TODO(Jason): displayDelegate
    var CONSTANTS = Sqor.CONSTANTS.SimpleGrid;

    // TODO(Jason):  document usage
    /**
     * A simple grid that can be used to graph anything from a simple one
     * column table to a multi-dimensional.
     * @param {object} options,
     * @return {null}
     */
    // TODO(Jason): test edge cases for maxColumn: 0, 1,
    // TODO(Jason): what are valid default values?
    //          --- some type of error handling library would be super cool
    var SimpleGrid = function(options){
        var self = this;
        var defaults = {
                parentElement: null
            ,   renderedCallback: $.noop
            , displayDelegate: {
                     maxColumns: function(){ return 1;}
                ,   graphingMode: function(){ return CONSTANTS.ROWS_FIRST;}

            }
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

        // TODO(Jason): add 'displayDelegate' ... and a fake one..
        // so we can do reload and display in this mode with these many
        // rows...
        self._delegates = [];
        self._options = _.extend({}, defaults, options);
        self._dataDelegate = self._options.dataDelegate;
        self.create(self._options);
    };

    _.extend(SimpleGrid.prototype, {

        /**
         * Creates a simple grid widget, which will allow us to create
         * simple tables side by side of same or similar sizes
         * @param {type} options,
         * @return {null}
         */
        create: function(options){
            var self = this;
            // Setup our  holder element:
            self._el = HTML.createSpinnerHolder();
            self._el.empty();
            self._el.append(HTML.getSpinner());
            HTML.get("simpleGrid", self._options.templateValues,
            function(domElement){
                self._el.empty();
                self._el.append(domElement);
                self._render();
                self._options.renderedCallback(self._el, domElement);
            });
        },

        _getNumberOfRows: function(){
            var self = this;
            var cellCount = self._dataDelegate.getNumberOfCells();
            var maxColumns = self._options.displayDelegate.maxColumns();
            var result =  Math.ceil(cellCount/maxColumns);
            return result;
        },

        _getMaxCellsPerRow: function(){
            var self = this;
            return self._getNumberOfColumns();
        },

        _getNumberOfColumns: function(){
            var self = this;
            return self._options.displayDelegate.maxColumns();
        },

        /**
         * Renders the table by loading each cell from the dataDelegate.
         * @return {null}
         */
        _render: function(){
            var self = this;
            var cellsContainer = self._el.find(".SQOR_cellsContainer");
            var cellCount = self._dataDelegate.getNumberOfCells();
            // Render each cell by calling into our delegate
            // TODO(Jason): do this with a Tempalte.. real one..
            var currentIndex = 0;
            var rowCount = self._getNumberOfRows();
            var columnCount = self._getNumberOfColumns();

            // TODO(Jason): if ROWS_FIRST CONSTANT
            // We loop over our rows, and create
            //  make into function
            for(var rr  = 0; rr < rowCount ; rr++){
                // Create our holder row
                // [ ----- row ----------]
                var rowDOM = $("<div></div>");
                // Now we loop over and insert each cell for a given column
                // at that row level:
                // [ ------- last row full ---]
                // [ [cell0 | cell1 ........  ]
                for(var cc = 0; cc < columnCount; cc++) {
                    // Make sure we haven't gone over
                    if (currentIndex < cellCount) {
                        var currentCellDOM =
                            self._dataDelegate.getCellAtIndex(currentIndex);
                        currentIndex++;
                        rowDOM.append(currentCellDOM);
                    } else {
                    }
                }
                cellsContainer.append(rowDOM);
            }
        },

        /**
         * Set's the current dataDelegate to specifcy cells, and count.
         * @param {object} delegate, dataDelegate containing key methods
         * @return {null}
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
        * @return {null}
        */
       dataChanged: function(){
            var self = this;
            self.rerender();
        },

        /**
         * Helper function to rerender (after everything has already been
         * rendered).
         * @return {null}
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

    Sqor.Widgets.SimpleGrid = SimpleGrid;
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
     *  // TODO(Jason):  demonstrate example of appending
     *
     *
     * @constructor
     * @param {type} options,
     * @return {null}
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
         * @return {null}
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
                // TODO(Jason): if count > 0
                self.renderMoreBottomRows(count);
            }
        },

        /**
         * Does old school infinite scroll rendering
         * @param {type} count,
         * @return {null}
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
         * @return {null}
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
     * @return {null}
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
        // TODO(Jason): MAKE ALL WIDGETS inherit from BASEWIDGET .. .and remove this
        // code????
        create: function(){
            var self = this;
            // Setup our  holder element:
            self._el = HTML.createSpinnerHolder();
            self._el.empty();
            self._el.append(HTML.getSpinner());
            HTML.get("feedFooterxx", self._options.templateValues,
            function(domElement){
                self._el.empty();
                self._el.append(domElement);
                self._render();
                self._options.renderedCallback(self._el, domElement);
            });
        },

        /**
         * Renders our widget for the first time.
         * @return {null}
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
// FeedListController.js
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
     *  var c = new Sqor.Modules.FeedListController();
     *  $("body").append(c.getDomElement());
     *
     * @param {object} options,
     * @return {null}
     */
    var FeedListController = function(options){
        var defaults = {};
        var self = this;
        self.create();
    };

    _.extend(FeedListController.prototype, {

        /**
         * Siple create function to setup model and view along with delegates.
         * @return {null}
         */
        create: function(){
            var self = this;
            self._model = new Sqor.Modules.FeedListModel();
            var tableViewOptions = {
                dataDelegate: self
            };

            self._modelCount = 0;
            self._model.addDelegate(self);
            self._tableView = new Sqor.Widgets.DynamicTable(tableViewOptions);
            self._footerView = new Sqor.Widgets.FeedFooter();
            self._model.addDelegate(self._tableView);

            // TODO(Jason): fix this, use actual template:
            self._el = $("<div></div");
            self._el.append(self._tableView.getDomElement());
            self._el.append(self._footerView.getDomElement());
            self._bindScroll();
            self._lastLoadedReturned = true;
            self._loadMoreDataIfNeeded();
        },

        /**
         * Helper function to return if a certain element is in the "viewport"
         * of the browser at this time
         * @param {type} elem,
         * @return {null}
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
         * A delegate method to be called by the model when the feed changes.
         * @param {object} data,
         * @return {null}
         */
        dataChanged: function(data){
            var self = this;
            // Make sure we are up to date in terms of data:
            self._lastLoadedReturned = true;
            // We might just be finishing up loading our stuff...
            setTimeout(function(){
                self._loadMoreDataIfNeeded();
            }, 100); // TODO(Jason): fix this... this is done so we don't double
            // hit the loading spinner..
            //
            // NOTE: this is a function of the loader being
            // stuck while we load more since we don't append items fast
            // enough... race donition type of thing. Don't wanna dobule
            // load
        },

        /**
         * A hacky way to do infinite scroll by loading more data
         * @return {null}
         */
        _loadMoreDataIfNeeded: function(){
            // TODO(Jason): set our view to reflect state of data!
            // ---> or set it's little model... DATA DRIVEN
            var self = this;
            var documentHeight = $(document).height();
            var scrollTop = $(document).scrollTop();
            if (self._isScrolledIntoView(self._footerView.getDomElement())){
                if (self._modelCount <=  self._model.size()  &&
                    self._lastLoadedReturned) {
                        self._lastLoadedReturned = false;
                        self._tryToLoadMore();
                        self._modelCount = self._model.size();
                }
            }
        },

        /**
         * We create a binding to scroll event so that we can load more
         * items when we reach a certain point
         *
         * @return {null}
         */
        _bindScroll: function(){
            var self = this;
            self._modelCount = self._model.size();
            self._lastLoadedReturned = true ;
            $(document).scroll(function(){
                self._loadMoreDataIfNeeded();
            });
        },

        /**
         * We go to the server / model  and try to load more  items
         * worry about that.
         *
         * @return {null}
         */
        _tryToLoadMore: function(){
            var self = this;
            // TODO(Jason):  remove this timeout:
            // set on timer to emulate delay in ajax...
            self._model.loadBottomItems();
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
            var model = self._model._items[index].doc;
            var displayCard = self._getWidgeForType(model);
            return displayCard.getDomElement();
        },

        /**
         * Returns the correct type of widget for the given model
         * @param {object} model,
         * @return {object}, widget for model
         */
        _getWidgeForType: function(model){
            // TODO(Jason): replace this with a widget per type:
            var self = this;
            var options = {
                title:""
                , subtitle: ""
                , author: ""
                , imageURI: ""
                , externalURI: ""
            };
            options.externalURI = model.link;
            var imageURI = "";
            try{
                imageURI = model.media_ig[0].url;
            } catch(e){
            }
            options.imageURI = imageURI;

            // TODO(Jason): awful, remove
            if (model.type === "twitter"){
                options.title = model.author;
                options.subtitle = model.summary;
            } else if (model.type === "instagram") {
                options.subtitle = model.content;
            } else if (model.type === "rss") {
                options.title = model.title;
                options.summary= model.summary;
            } else if (model.type === "getty_images") {
                options.title = model.title;
            } else if (model.type === "espn_api") {
                options.title = model.title;
                options.summary= model.summary;
            } else if (model.type === "sqor") {
                options.title = model.author;
                options.summary= model.content;
            } else {
                console.log(model.type);
                // TODO(Jason): implement generic widget
            }
            var displayCard  = new Sqor.Widgets.DisplayCard(options);
            return displayCard;
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

    Sqor.Modules.FeedListController = FeedListController;
})(Sqor);

// FeedListModel.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * Initializes a simple model to represetn the state of the list module.
     * @return {null}
     */
    var  FeedListModel = function(){
        var self = this;
        self._delegates = [];
        self._offset= 0;
        self._step = 10;
        self._items = [];
    };

    _.extend(FeedListModel.prototype, {

        /**
         * Adds a delegate to our list of delegates
         * @param {object} delegate,
         * @return {null}
         */
        addDelegate: function(delegate){
            var self = this;
            self._delegates.push(delegate);
        },

        /**
         * Calls all delegates listening for dataChanges
         * @return {null}
         */
        _notifyDelegates: function(type, count, methodName){
            var self = this;
            var args = arguments;
            _.each(self._delegates, function(delegate) {
                if (_.isReal(delegate[methodName])) {
                    delegate[methodName].apply(delegate, args);
                }
            });
        },

        /**
         * Pushes items into our local array of entries
         *
         * @param {object} data,
         * @return {null}
         */
        _loadItems: function(data){
            var self = this;
            var results = data.results;
            _.each(results, function(result){
                self._items.push(result);
            });

            self._offset += self._step;
            self.appendItems(results.length);
        },

        /**
         * Make request to load data from network/server.
         * @return {null}
         */
        loadBottomItems: function(){
            var self = this;
            var requestURL= "http://feedtools-dev.sqor.com/content?q=type:instagram&offset=" +
                self._offset + "&limit=" + self._step;
            // q=*
            // q=type:instragram
            var promise =  $.get(requestURL);
            promise.done(function(data){
                self._loadItems(data);
            });
        },

        /**
         * New rows / items were added to the beginning
         * @param {type} count,
         * @return {null}
         */
        prependItems: function(count) {
            var self = this;
            self._notifyDelegates("prepend", count, "dataChanged");
        },

        /**
         * Old rows /items were loaded into memory:
         * @param {type} count,
         * @return {null}
         */
        appendItems: function(count) {
            var self = this;
            self._notifyDelegates("append", count, "dataChanged");
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

    Sqor.Modules.FeedListModel = FeedListModel;
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
                    // TODO(Jason): This needs to be based on diff of scroll
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
            // TODO(Jason): start this at - 1/3 hidden away
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

    //runSimpleGrid(13);
    //runSimpleDynamicTableModule();
    // runComplexTable();
    //runDataGrid();
});

