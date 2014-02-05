// widgetBase.js
(function(Sqor) {
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /**
     * WidgetBase implements bare minimum for widgets core functionality.
     * ----------
     *
     * @constructor
     * @param {object} options, simple ways to configure our widget
     * @return {null}
     */
    var WidgetBase = function(options) {
        // The default values this widget can take:
        var defaults = {};
        self._templateName = "widgetBase";
        this.create(newOptions, defaults);
    };

    // Extending our widgets prototype to add basic functionality:
    _.extend(WidgetBase.prototype, {

        /**
         * Creates the basic DOM element representing our Widget
         * @param {Object} options,
         * @return {null}
         */
        create: function(options, defaults, doneRenderingCallback){
            var self = this;
            self._options = _.extend({}, defaults, options);
            // Create the DOM element
            self._el = HTML.createSpinnerHolder();
            HTML.get(self._templateName,
                self._options, function(domElement){
                    self._el.empty();
                    self._el.append(domElement);
                    if (_.isReal(doneRenderingCallback)){
                        doneRenderingCallback();
                    }
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
        reloadData: function(data, doneRenderingCallback){
            var self = this;
            self._data = data;
            // First we must indicate new data is being loaded:
            self._el.empty();
            self._el.append(HTML.getSpinner());
            // Actually load the new data:
            HTML.get(self._templateName, self._data, function(domElement){
                self._el.empty();
                self._el.append(domElement);
                if (_.isReal(doneRenderingCallback)){
                    doneRenderingCallback();
                }
            });
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    // Export our widget
    Sqor.Widgets.WidgetBase = WidgetBase;
})(Sqor);
