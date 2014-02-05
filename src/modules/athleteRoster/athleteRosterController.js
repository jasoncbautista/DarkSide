// ExampleGridController.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;
    var ExampleGridController = Sqor.Modules.ExampleGridController;
    var Carrousel = Sqor.Widgets.Carrousel  ;
    var AthleteRosterControler = function(options){
        var self = this;
        self.create(options);
        self._addSortingWidget();
    };

    AthleteRosterControler.prototype = new ExampleGridController({
        _subclass: true
    });

    _.extend(AthleteRosterControler.prototype, {

/**
         * A simple rendering function that attaches our grid to our main
         * holding element
         * @return {Null}
         */
        _prerender: function(){
            var self = this;
            // TODO(Jason): fix this, use actual template:
            self._el = $("<div><div class='sortingHolder'></div>" +
                         "<div class='roster'></div> </div");
            self._el.find(".roster").append(self._gridView.getDomElement());
        },
        _addSortingWidget: function(){
            var self = this;
            var sortingWidget = new Carrousel({
                carts: [
                        {"key": "abc", "value": "ABC"}
                    ,   {"key": "zxy", "value": "ZXY"}
                ]
            });
            self._sortingWidgets = sortingWidget;
            self._el.find(".sortingHolder").append(
                self._sortingWidgets.getDomElement());
        },

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Modules.AthleteRosterControler= AthleteRosterControler;
})(Sqor);

