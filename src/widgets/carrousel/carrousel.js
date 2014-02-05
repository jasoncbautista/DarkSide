// carrousel.js
(function(Sqor) {
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;

    /*
     * TODO: change name to carrousel widget
     *
     * +-----------+------------+-----------+
     * |           |            |           |
     * |    abc    |    zxy     |    loc    |
     * +-----------+------------+-----------+
     *
     * Usage:
     * ---------------------
     *  var options = {
     *      "cart": [
         *          {"key": "abc", value: "ABC"}
     *          ,   {"key": "zxy", value: "ZXY"}
     *      ]
     *
     *  };
     *  var carrousel = new Sqor.Widgets.Carrousel(options);
     *
     * ---------------------
     *
     * @constructor
     * @param {type} options,
     * @return {Null}
     */
    var Carrousel= function(options){
        var self = this;
        self.create(options);
    };

    // Extending our widgets prototype to add basic functionality:
    _.extend(DisplayCard.prototype, {

        /**
         * Creates the basic DOM element representing our Widget.
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
                self._render();
            });
        },

        self.

        /**
         * Returns the dom element associated with this widget
         * @return {Object}, DOM representation of widget.
         */
        getDomElement: function(){
            var self = this;
            return self._el;
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    // Export our widget
    Sqor.Widgets.Carrousel = Carrousel;
})(Sqor);


