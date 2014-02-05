// ExampleGridController.js
(function(Sqor){
    // Dependencies
    var HTML = Sqor.Services.HTML;
    var $ = Sqor.$;
    var _ = Sqor._;
    ExampleGridController = Sqor.Modules.ExampleGridController;

    var AthleteRosterControler = function(options){
        var self = this;
        self.create(options);
    };

    AthleteRosterControler.prototype = new ExampleGridController({
        _subclass: true
    });

    _.extend(AthleteRosterControler.prototype, {
    });

    Sqor.Modules.AthleteRosterControler= AthleteRosterControler;
})(Sqor);

