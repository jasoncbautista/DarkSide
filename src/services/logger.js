(function(Sqor){
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;
    var Messenger =  Sqor.Services.Messenger;

    var Logger = function(options){
        var self = this;
        var defaults = {
            loggingEndpoint:  "/rest/log/"
        };

        self._options = _.extend({}, defaults, options);
    };

    _.extend(Logger.prototype, {
        // Workaround for annoying last comma rule.
        log: function(eventName, options){
            var self  = this;
            // TODO(Jason): stringify options??
            Messenger.request("POST"
                , self._options.loggingEndpoint
                , options);
        },
        sdfsd3423452349249239493234: null
    });

    Sqor.Services.Logger = new Logger();
})(Sqor);
