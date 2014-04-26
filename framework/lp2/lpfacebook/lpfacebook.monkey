Import lpfacebookbase

#Rem
''''''''''''''''''''''''''''''''''''''''
''''''' ios development constrains '''''
''''''''''''''''''''''''''''''''''''''''

for facebook developement you must add manually the following lybraries, can't be added with monkey:

FacebookSDK.framework, 
FacebookSDK.framework/FacebookSDKResources.bundle
and libsqlite3.dylib

as indicates:
https://developers.facebook.com/docs/getting-started/facebook-sdk-for-ios/


if yout get the error 

FBSDKLog: Cannot use the Facebook app or Safari to authorize, fb**** is not registered as a URL Scheme

please follow the instruction on this website

http://stackoverflow.com/questions/17132003/fbsdklog-cannot-use-the-facebook-app-or-safari-to-authorize-fb-is-not-regi

fast implementation:

add the following lines to the file *.plist, must be added before the "</dict>" markup

<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>fbAPP_ID</string>
        </array>
    </dict>
</array>


''''''''''''''''''''''''''''''''''''''''''''
''''''' android development constrains '''''
''''''''''''''''''''''''''''''''''''''''''''

for facebook implementation on android you must follow the video:
https://developers.facebook.com/docs/getting-started/facebook-sdk-for-android/3.0/

you must add manually the reference to facebook proyect:

1.- import android proyect and template into eclipse
2.- add the facebookSDK proyect as lib into the main project
3.- copy the generated line inside project.properties from the main project to template project

'''''''''''''''''''''''''''''''''''''
''''''' lpfacebookUser class ''''''''
'''''''''''''''''''''''''''''''''''''

''' facebook user equivalent, can get data from user such as username
Class lpFacebookUser
    
    ''' return the request data
    ''' @param var:String some valid variable from facebook user like "username"
    Method Get:String(var:String)
End

#End

''' facebook extends from lpFacebookBase
Class lpFacebook Extends lpFacebookBase

Private
    
    Field sessionState:Int = STATE_CLOSED

Public

    ''' facebook login status
    Const STATE_OPENED:Int = 0 
    Const STATE_CLOSED:Int = 1

	''' constructor with appid
	''' @param appid:String init the facebook instance with this appid, 
	''' appid is provided by facebook @see:http://developers.facebook.com/apps
    Method New(appid:String)
    	Self.Init( appid )
    End

    ''' initialize the current facebook instance with the id:
    ''' @param appid:String appid is provided by facebook @see:http://developers.facebook.com/apps
    Method Init:Void(appid:String)
        Super.Init(appid)
    End

    ''' perform a login in facebook
    ''' @param permissions:String you can ask for permissions such as "publish_action"
    ''' for more than one permission separate by comma "publish_action,read_friendlists"
    Method Login:Void(permissions:String)
        Super.Login(permissions)
    End

    ''' destroy the current facebook session
    Method Logout:Void()
        Super.Logout()
    End

    ''' share something on the facebook wall, you must ask form "publish_action" permission
    Method PostFeed:Void(name:String, caption:String, description:String, link:String, picture:String, message:String = "")
        Super.PostFeed(name, caption, description, link, picture, message)
    End

    ''' return the current logged user
    Method Me:lpFacebookUser()
        Return Super.Me()
    End

    ''' eval if the current facebook sessions is opened
    Method IsOpened:Bool()
        Return Super.IsOpened()
    End
    
End
