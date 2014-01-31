
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