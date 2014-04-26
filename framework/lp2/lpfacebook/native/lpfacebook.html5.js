
// facebook initialization

//window.fbAsyncInit = function() {
//  };


/*
  FB.login(function(response) {
    if (response.authResponse) {
        // The person logged into your app
    } else {
        // The person cancelled the login dialog
    }
  });
*/

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

lpFacebookUser = function()
{
  this.sessionUser = new Array();
  this.init = function(s){
    this.sessionUser = s;
  }
  this.Get = function(varname)
  {
    return this.sessionUser[varname];
  }
  this.GetFriends = function()
  {
    alert("function lpFacebookUser.GetFriends not implemented yet!");

    return [];
  }
  this.GetFriendById = function(id)
  {
    alert("function lpFacebookUser.GetFriendById not implemented yet!");

    return null;
  }
};

lpFacebookBase = function()
{
};

var lpfbuser = new lpFacebookUser();
var lpfbsessionUser = new Array();
var loggedIn = false;

lpFacebookBase.prototype.Login = function(permissions)
{
  FB.login(function(response) {
    if (response.authResponse) {
        if (response.status === 'connected') {
          loggedIn = true;
        }
        // The person logged into your app
        // alert ( response.authResponse.accessToken );
    } else {
        // The person cancelled the login dialog
    }
  }, {scope: permissions});
}

lpFacebookBase.prototype.Logout = function()
{
  FB.logout(function(response) {
    lpfbsessionUser = new Array();
    loggedIn = false;
  });
};

lpFacebookBase.prototype.Init = function(appid)
{
  // init the FB JS SDK
    FB.init({
      appId      : appid,                          // App ID from the app dashboard
      channelUrl : '//www.loadingnutrition.com/channel.html', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here

    function userData() {
      FB.api('/me', function(response) 
        {
          lpfbsessionUser["username"] = response.name;
          lpfbuser.init(lpfbsessionUser);
        });
    }

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        userData();
      }
    });
};

lpFacebookBase.prototype.PostFeed = function (name, caption, description, link, picture, message)
{
  FB.api(
    '/me/feed',
    'post',
    { name: name,
      caption: caption,
      description: description,
      link : link,
      picture: picture,
      message: message },
    function(){
      console.log("comentario posteado");
    }
    // Log.info.bind('/me/feed POST callback') // just in debug
  );
};


lpFacebookBase.prototype.Me = function()
{
  return lpfbuser;
};

lpFacebookBase.prototype.IsOpened = function()
{
  return loggedIn;
};


