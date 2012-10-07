// PROJECT: Phonegap Facebook Application
// AUTHOR: Drew Dahlman ( www.drewdahlman.com )
// AUTHOR UPDATE : Lecamus Jocelyn (www.ocelyn.com)
// DATE: 07.10.2012

/*
NOTES:
The current solution for working with Facebook within Phonegap is confusing and very limiting.
This solution uses the Childbrowser to create your access_token, save that, and then allow you to
do what ever you want within the graph API.

This example will allow you to post to a users wall
*/

// GLOBAL VARS
var facebook_client_id = "286791308089096", // YOUR APP ID
    facebook_redirect_uri = "https://www.facebook.com/connect/login_success.html"; // LEAVE THIS
	
var facebook_token = "fbToken"; // OUR TOKEN KEEPER

var client_browser;

// FACEBOOK
var Facebook = {
	init:function( success ){
		
		// Begin Authorization
		var authorize_url = "https://www.facebook.com/dialog/oauth?";
		 authorize_url += "client_id=" + facebook_client_id;
		 authorize_url += "&redirect_uri=" + facebook_redirect_uri;
		 authorize_url += "&response_type=token"

        window.plugins.childBrowser.onLocationChange = function(loc){
			 Facebook.facebookLocChanged(loc,success);
		 };
		 if (window.plugins.childBrowser != null) {
			window.plugins.childBrowser.showWebPage(authorize_url);
		 }
	},

	facebookLocChanged:function(loc, success){

        if (loc.indexOf("https://www.facebook.com/connect/login_success.html") > -1 || loc.indexOf("https://www.facebook.com/connect/login_success.html") >= 0) {

            var accessToken = /access_token=[^&$]+/.exec(loc)[0];
            if ( accessToken.length > 0 ) {
                window.plugins.childBrowser.close()
                localStorage.setItem(facebook_token, accessToken);
                setTimeout(function(){success.call(this, true);},300);
            }
		}
	},

	share:function(url){
		
		// Create our request and open the connection
		var req = new XMLHttpRequest(); 
		req.open("POST", url, true);
		req.send(null); 
		return req;
	},

	post:function(_fbType,params, success){
			
		// Our Base URL which is composed of our request type and our localStorage facebook_token
		var url = 'https://graph.facebook.com/me/'+_fbType+'?'+localStorage.getItem(facebook_token);
		
		// Build our URL
		for(var key in params){
			if(key == "message"){
				
				// We will want to escape any special characters here vs encodeURI
				url = url+"&"+key+"="+escape(params[key]);
			}
			else {
				url = url+"&"+key+"="+encodeURIComponent(params[key]);
			}
		}
		
		var req = Facebook.share(url);
		
		// Our success callback
		//req.onload = success.call(this);
		req.onload = function(){
            navigator.notification.alert(
                'MESSAGE POSTED',  // message
                function(){},         // callback
                'FACEBOOK REALLY',            // title
                'OK'                  // buttonName
            );
        };

        req.success = function(){
            navigator.notification.alert(
                'MESSAGE POSTED',  // message
                function(){},         // callback
                'FACEBOOK REALLY2',            // title
                'OK'                  // buttonName
            );
        };
	}
};