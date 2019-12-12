       document.cookie = "name=DiscordUsername; discordUname=JohnDoe@example.com; expires=WED, 18 Dec 2023 12:00:00 UTC; path=/";
       document.cookie = "name=DiscordPassword; discordPword=example1234; expires=WED, 18 DEC 2023 12:00:00 UTC; path=/";

       //URL Parameters
      function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
                                                                                                                        
}
    var mytext = getUrlParam('text','Empty');
                                                                                                                        
      function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
    var number = getUrlVars()["x"];
var mytext = getUrlVars()["text"];
                                
                                
  
