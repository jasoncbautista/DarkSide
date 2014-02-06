// ExampleGridController.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;
    var ExampleGridController = Sqor.Modules.ExampleGridController;
    var Carrousel = Sqor.Widgets.Carrousel  ;
    var AthleteCard = Sqor.Widgets.AthleteCard;

    /**
     * This widget displays a team roster in teable format:
     *
     * Example:
     *  TODO(Jason): draw example
     *
     * @constructor
     * @param {type} options,
     * @return {Null}
     */
    var AthleteRosterControler = function(options){
        var self = this;
        self.create(options);
        self._addSortingWidget();
    };

    /** Subclass off example grid **/
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

        /**
         * Adds our roster sorting widget view.
         * @return {Null}
         */
        _addSortingWidget: function(){
            var self = this;
            var sortingWidget = new Carrousel({
                carts: [
                        {"key": "abc", "value": "ABC"}
                    ,   {"key": "zxy", "value": "ZXY"}
                    ,   {"key": "position", "value": "POS"}
                ]
            });
            self._sortingWidgets = sortingWidget;
            self._sortingWidgets.addDelegate(self);
            self._el.find(".sortingHolder").append(
                self._sortingWidgets.getDomElement());

        },

        /**********************************************************************
         *  Delegate API Methods Implemented
         *********************************************************************/

        /**
         * Simple function to return a DOM element for a given cell position.
         * @param {number} index, number in model
         * @return {Object} jquery Object
         */
        getCellAtIndex: function(index) {
            var self = this;
            var model = self._models.getItem(index);
            // var displayCard = self._getWidgeForType(model);
            // return displayCard.getDomElement();
            var options = {
                  "athleteNumber": model.number
                , "athleteFirstName": model.first_name
                , "athleteLastName": model.last_name
                , "athletePosition": model.position
                // TODO(Jason): make this an actual url
                //  Shold probably be an external call from a library
                , externalURI: ""
            };

            var athleteCard = new AthleteCard(options);
            // TODO(Jason): add to array to save for destroy calls..
            return athleteCard.getDomElement();
        },


        mouseOver: function(sortObject, ee){
            // console.log(ee);
            console.log(sortObject);
        },
        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null
    });

    Sqor.Modules.AthleteRosterControler= AthleteRosterControler;
})(Sqor);

