// delegatorBase.js
(function(Sqor){
    // Dependencies
    var $ = Sqor.$;
    var _ = Sqor._;

    var DelegatorBase = function(){
        var self = this;
        self._delegates = [];
    };

    _.extend(DelegatorBase, {

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
         * Calls all delegates listening for a given method
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

        // Workaround for annoying last comma rule.
        sdfsd3423452349249239493234: null

    });

})(Sqor);
