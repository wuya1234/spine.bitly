/*
Usage:
$('#short').bitlyDFD({utility:'shorten', longUrl:'http://google.com', callback:createView});
$('#short').bitlyDFD({utility:'clicks', shortUrl:'http://bit.ly/eUGBef'});
http://jsfiddle.net/addyosmani/7HrbD/4/
*/

$.fn.bitlyDFD = function( options ) {
    
  var defaults = {
    version:    '3.0',
    login:      'legacye',
    apiKey:     'R_32f60d09cccde1f266bcba8c242bfb5a',
    history:    '0',
    longUrl:  	'',
    utility: 	'shorten',
    callback: 	function(){}
  };   
    
 var args 		= arguments, 
     opts 		= $.extend( defaults , options ), 
     collection = this, 
     result 	= "",
     queryUrl 	= "",
     params   	= "version="+opts.version
                    +"&longUrl="+opts.longUrl
                    +"&login="+opts.login
                    +"&apiKey="+opts.apiKey
                    +"&history="+opts.history
                    +"&shortUrl="+opts.shortUrl
                    +"&hash=" + opts.hash
                    +"&format=json&callback=?";
    
    (opts.utility=='shorten')? 
        (queryUrl = "http://api.bit.ly/shorten?" + params) : 
        (queryUrl = "http://api.bitly.com/v3/clicks?" + params);
       
    $.getJSON(queryUrl, function( data ){
            result = data;
    })
    .then(
    function(){
        switch( opts.utility ){
            case 'shorten':
                //collection.html(result.results[defaults.longUrl].shortUrl);
                return collection.each(function() {
                    opts.callback(result.results[defaults.longUrl].shortUrl, opts.longUrl);
                });
               break;
                   
            case 'clicks':
                return collection.each(function() {
                     $(this).append("<div class='bitly-summary'>" +
 					   "<span><strong>User Clicks (all URLs): </strong>" + result.data["clicks"][1].user_clicks + "</span>" +
					   "<span><strong>Global Clicks (Aggregated): </strong>" + result.data["clicks"][1].global_clicks + "</span>" +
                    "</div>");
                    });
               break;     
        } 
    },
    function(){
         return collection.each(function() {
            ///('There was an error connecting to the Bit.ly API')
        });
    }
	);
};

