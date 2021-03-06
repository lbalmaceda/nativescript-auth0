var appSettings = require("application-settings");
var auth0 = require("nativescript-auth0");
var frameModule = require("ui/frame");

exports.onPageLoaded = function (args) {
    var page = args.object;

    //Check to see if the user is logged in
    if(!appSettings.hasKey("UserData")){
        doLogin();
    }else{
        //Deserialzise the saved user
        var userData = JSON.parse(appSettings.getString("UserData"));
        
        //Check if it's expired
        if(auth0.isTokenExpired(userData.token.idToken)){
            //Make them log in again
            doLogin();
        }else{
            //All good, navigate to your start page
            goToHome();
        }
    }
}

function doLogin(){
    auth0.show().then(function(args){
        //Serialize the user data
        appSettings.setString("UserData", JSON.stringify(args));
        goToHome();
    });
}

function goToHome(){
    frameModule.topmost().navigate(
    { 
        moduleName: "home",
        transition: {
            name: "fade",
            duration: 380,
            curve: "easeIn"
        },
        clearHistory: true //Dont want the user to nav back to login
    });
}