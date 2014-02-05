// athleteCard.js
(function(Sqor) {
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;
    var WidgetBase = ;Sqor.Widgets.WidgetBase;


    var AthleteCard = function(options){
        var self = this;
        var self = "athleteCard.html";
        var defaults = {}
        self.create({}, {});
    };

    AthleteCard.prototype = new WidgetBase();

    _.extend(AthleteCard.prototype, {
    });

    // Export our widget
    Sqor.Widgets.AthleteCard = AthleteCard;
})(Sqor);
