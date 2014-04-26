#Rem
first implementation of facebook connect, 
doesn't work properly, but it is a first aproach
it uses graph api
#End

Import lp2.lpscenemngr
Import lp2.lpscene
Import libs.lpapp
Import lp2.lphudbutton

''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''
'''''''''''' facebook ''''''''''''
''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''

Import "native/lpfacebook.${TARGET}.${LANG}"
Import "native/proxy.php"

Extern 
    Function lpFacebookLaunchBrowser:Void(url:String, lpfacebook:lpFacebook)="lpFacebookLaunchBrowser"

    Class lpHttpRequestBase

        '' open a url to be treated iin background
        '' html5 TARGET doesn't support the cross-domain request, so you can use a little proxy
        '' @param   query_method:String  support 'GET' and 'POST'
        '' @param   url:String           server url that respose to request 
        '' @param   requestComplete:lpIOnHttpRequestComplete listener, 
        '' will be executed when the server response
        '' @Sample Open( "GET", "http://sample.com", requesListener )
        Method Open:Void( query_method:String, url:String, requestComplete:lpIOnHttpRequestComplete )

        '' Send an httprequest with config at @see Open
        '' @param  params:String if parameters are needed it must take them, with the sintax
        '' @sample param1=value&param2=value2&param3=value3
        Method Send:Void( params:String="" )
    End

Public

''''''''''''''''''''''''''''''''''
''''''''''' Interfaces '''''''''''
''''''''''''''''''''''''''''''''''

Interface ilpFacebook
    Method OnFacebookResponse:Void(response:String)
End

Interface lpIOnHttpRequestComplete
    Method OnHttpRequestComplete:Void ( resp:String )
End


''''''''''''''''''''''''''''''''''
'''''''''''' Classes '''''''''''''
''''''''''''''''''''''''''''''''''

 Class lpHttpRequest Extends lpHttpRequestBase

    Method New()
    End

    Method New(query_method:String, url:String, requestComplete:lpIOnHttpRequestComplete)
        Open( query_method, url, requestComplete )
    End

End


Class lpFacebook Implements lpIOnHttpRequestComplete

Private

    Field appid:String
    Field accessToken:String
    Field logged:Bool = False
    Field listener:ilpFacebook

Public
    
    Method New( appid:String )
        Self.appid = appid

        ''' must be called at least once, to tell compiler must copy this method
        If ( False )
            Self.OnLoginResponse( "", true )
            Self.OnHttpRequestComplete( "" )
        End
    End

    Method Login:Void( permissions:String = "email" )
        lpFacebookLaunchBrowser ( "https://www.facebook.com/dialog/oauth?client_id="+Self.appid+"&redirect_uri=http://www.loadingnutrition.com/facebooktest.html&state=state&scope="+permissions+"&response_type=token&display=popup", Self )
    End

    Method OnLoginResponse:Void( token:String, nogo:Bool = False )
        '' if nogo is enabled must do nothing
        If ( nogo ) 
            Return
        End

        If ( token<>"undefined" )
            Self.logged = True
            Self.accessToken = token
        End

    End

    '' request logged user data
    '' @param   listener:ilpFacebook the listener will be executed once facebook respond
    Method Me:Void( listener:ilpFacebook )
        Local r:lpHttpRequest = New lpHttpRequest( "GET","http://www.loadingnutrition.com/data/proxy.php?u=https://graph.facebook.com/me?access_token=" + Self.accessToken, Self )
        r.Send("")

        Self.listener = listener
    End

    Method WallPost:Void( post:String )
        Local r:lpHttpRequest = New lpHttpRequest( "POST","http://www.loadingnutrition.com/data/proxy.php?u=https://graph.facebook.com/me/feed?access_token=" + Self.accessToken, Self )
        r.Send("message=" + post)
    End
    

    '' http listener
    Method OnHttpRequestComplete:Void( req:String )
        If ( Self.listener )
            Self.listener.OnFacebookResponse( req )
        End
    End

End

''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''
'''''''''' Basic Sample ''''''''''
''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''

Class LoginSampleScene Extends lpScene Implements ilpFacebook, iHudButton
    
    '' facebook instance
    Field facebook:lpFacebook

    '' test buttons
    Field loginButton:HudButton
    Field postButton:HudButton

    '' buttons ids
    Const LOGIN_BUTTON:Int = 0
    Const COMMENT_BUTTON:Int = 1

    Method Create:Void()
        facebook = New lpFacebook("155360927970352")

        '' init buttons
        loginButton = New HudButton("sig_in.png")
        postButton = New HudButton("comment.png")

        loginButton.Position.X = DeviceWidth()/2 - loginButton.Position.Width/2
        loginButton.Position.Y = 100

        postButton.Position.X = DeviceWidth()/2 - postButton.Position.Width/2
        postButton.Position.Y = 200

        '' asign ids
        loginButton.id = LOGIN_BUTTON
        postButton.id = COMMENT_BUTTON

        loginButton.SetListener(Self)
        postButton.SetListener(Self)

    End

    Method Update:Void(delta:Int)
        loginButton.Update(delta)
        postButton.Update(delta)
    End

    Method Render:Void()
        loginButton.Render()
        postButton.Render()
    End

    ''' facebook responses here
    Method OnFacebookResponse:Void(response:String)
        Print "aaaaa" + response
    End

    ''' hudbutton events
    Method OnClick:Void(id:Int)
        Select id
            Case LOGIN_BUTTON
                Self.facebook.Login("email,publish_actions")
            Case COMMENT_BUTTON
                Self.facebook.WallPost("test")
        End
    End

End

Class LoginSample Extends lpSceneMngr

    Method Create:Void()
        LoginSample.GetInstance().SetScene(0)
        SetUpdateRate( 60 )
    End

    Method GetScene:lpScene(id:Int)
        Return New LoginSampleScene()
    End

End

Function Main:Int()
    New LoginSample()
    Return 0
End
