#If TARGET<>"ios" And TARGET<>"android" And TARGET<>"html5"
#Error "target not supported at lp2.lplogin"
#End


'' ////////////////////
'' //////Facebook//////
'' ////////////////////

Import "native/lpfacebook.${TARGET}.${LANG}"

#If TARGET="ios"

#LIBS+="Accounts.framework"
#LIBS+="AdSupport.framework"
#LIBS+="Security.framework"
#LIBS+="Social.framework"

#Elseif TARGET="android"

#LIBS+="${CD}/native/android-support-v4.jar"

#ANDROID_MANIFEST_APPLICATION+="<activity android:name=~qcom.facebook.LoginActivity~q android:theme=~q@android:style/Theme.Translucent~q></activity>"

#End

Extern


''' facebook user equivalent, can get data from user such as username
Class lpFacebookUser
    
    ''' return the request data
    ''' @param var:String some valid variable from facebook user like "username"
    Method Get:String(var:String)
    Method GetFriends:lpFacebookUser[]()
    Method GetFriendById:lpFacebookUser(id:String)
End

''' facebook base class
Class lpFacebookBase

    ''' login 
    Method Init:Void(appid:String)
    Method Login:Void(permissions:String)
    Method Logout:Void()
    Method IsOpened:Bool()

    ''' posting 
    Method PostFeed:Void(name:String, caption:String, description:String, link:String, picture:String, message:String = "")

    ''' user methods
    Method Me:lpFacebookUser()
    
End
