// Using our HTML service


Sqor.Services.HTML.get("displayCard", {name: "Coolio"}, function(el){console.log(el); window._el = el;});


// Demoing a little widget:
var c = new Sqor.Widgets.DisplayCard(); $('body').append(c.getDomElement());

c.reloadData({"name": "coolio"});


