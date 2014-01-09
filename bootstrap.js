// bootstrap.js

/**
 * Simply initializes a few key holder objects.
 * @return {Object} a shell object for our library, Sqor
 */
var initialize = function(){
    var Sqor = {};
    // We define aa few primary holders
    Sqor.Core = {};
    Sqor.Widgets = {};
    Sqor.Modules = {};
    Sqor.Services = {};
    Sqor.TP = {};

    // TODO FIX THIS:
    Sqor.$ = $;
    Sqor._ = _;
    return Sqor;
};

var Sqor = initialize();

// Now we can have services such as:
/*
    Sqor.Service.HTML
*/

// Example initialize an empty namespace
(function(Sqor, undefined){
})(Sqor);


// HTML.js
(function(Sqor, undefined){
    // Dependencies:
    var $ = Sqor.$;
    var _ = Sqor._;

    var HTML = {};
    // getCompiledTemplate
    HTML.get = function(templateName,  options, callback){
        $.get("html/" +  templateName + ".html", function(htmlString) {
            var compiledTemplate = _.template(htmlString)(options);
            var domElement =  $(compiledTemplate);

            callback(domElement);
        });
    };

    // HTML.getTempalte=
    Sqor.Services.HTML = HTML;
})(Sqor);




// .js
(function(Sqor, undefined){
    debugger;

    // defaults
    // create
    //

})(Sqor);








