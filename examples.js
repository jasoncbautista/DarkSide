// Using our HTML service


Sqor.Services.HTML.get("displayCard", {name: "Coolio"}, function(el){console.log(el); window._el = el;});
