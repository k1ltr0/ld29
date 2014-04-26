

// facebook variables
var lpfb_lasturl = document.location.href;
var lpfb_changelistener = null;
var lpfb_instance = null;

// url change listener for javascript
lpfb_UrlChangeListener=function()
{   
    if (lpfb_lasturl != document.location.href) {
        clearTimeout(lpfb_changelistener);
        
        // code when changed        
        var token = document.location.href.split("#?token=")[1];
        console.log("access_token : " + token);
        lpfb_instance.p_OnLoginResponse( token )
    };

    lpfb_lasturl = document.location.href;
}

// facebook dialog opener
lpFacebookLaunchBrowser=function(address, lpfacebook)
{
    window.open(address, "_blank", "width=100,height=100");

    lpfb_lasturl = document.location.href;
    lpfb_changelistener =setInterval(function(){lpfb_UrlChangeListener()},100);

    lpfb_instance = lpfacebook
}
var lprc;
// implementing the lpHttpRequest class
lpHttpRequestBase=function()
{

    var lpxmlhttp;

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        lpxmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        lpxmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    lpxmlhttp.onreadystatechange=function()
        {
            if (lpxmlhttp.readyState==4 && lpxmlhttp.status==200)
            {
                lprc.p_OnHttpRequestComplete(lpxmlhttp.responseText);
            }
        };

    this.lpxmlhttp = lpxmlhttp;

};

lpHttpRequestBase.prototype.Open=function( query_method, url, requestComplete )
{
    // debug: alert(query_method + " " + url);
    this.lpxmlhttp.open(query_method,url,true);
    this.method = query_method

    lprc = requestComplete
};

lpHttpRequestBase.prototype.Send=function( params )
{
    // debug: alert( this.method );
    
    // if method is post must set some headers.
    if (this.method == "POST") 
    {
        this.lpxmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.lpxmlhttp.setRequestHeader("Content-length", params.length);
        this.lpxmlhttp.setRequestHeader("Connection", "close");
    };

    this.lpxmlhttp.send(params);
};

