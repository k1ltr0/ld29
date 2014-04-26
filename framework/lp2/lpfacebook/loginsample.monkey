Import lp2.lpscenemngr
Import lp2.lpfacebook.lpfacebook


'' ////////////////////
'' ///////Sample///////
'' ////////////////////

Global APP_ID:String = "YOUR_APPID_HERE"

Class LoginSampleScene Extends lpScene Implements iHudButton

    '' buttons ids
    Const LOGIN_BUTTON:Int = 0
    Const COMMENT_BUTTON:Int = 1
    
    Field loginButton:HudButton
    Field commentButton:HudButton

    '' facebook usage
    Field facebook:lpFacebook

    Method Create:Void()

        ''' initialize login button
        Self.loginButton = New HudButton("sig_in.png")
        Self.loginButton.SetId(LOGIN_BUTTON)
        Self.loginButton.SetListener (Self)
        Self.loginButton.Position.X = DeviceWidth()/2 - Self.loginButton.Position.Width/2
        Self.loginButton.Position.Y = 100

        ''' initialize comment button
        Self.commentButton = New HudButton("comment.png")
        Self.commentButton.SetId(COMMENT_BUTTON)
        Self.commentButton.SetListener (Self)
        Self.commentButton.Position.X = DeviceWidth()/2 - Self.commentButton.Position.Width/2
        Self.commentButton.Position.Y = 200

        ''' added to children
        Self.AddChild(Self.loginButton)
        Self.AddChild(Self.commentButton)

        ''' init facebook
        Self.facebook = New lpFacebook(APP_ID)
    End

    Method Update:Void(delta:Int)
        Super.Update(delta)

        If ( KeyHit ( KEY_ESCAPE ) )
            Error ""
        End

    End
    

    ''' hudbutton events
    Method OnClick:Void(button:HudButton)
        ''' detect button id and execute 
        Select button.GetId()
            Case LOGIN_BUTTON
                ''' execute facebook login
                facebook.Login("publish_actions")
            Case COMMENT_BUTTON
                ''' post feed, this will be executed in background
                ''' facebook.PostFeed("este es un test")
        End Select
    End
    

End

''' LoginSample implements lpSceneMngr
Class LoginSample Extends lpSceneMngr

    Method Create:Void()
        ''' init the first scene
        LoginSample.GetInstance().SetScene(0)

        ''' hertz = cycles/seconds
        SetUpdateRate( 60 )
    End

    ''' must return the selected scene
    Method GetScene:lpScene(id:Int)
        ''' instantiate a LoginSampleScene
        Return New LoginSampleScene()
    End

End

Function Main:Int()
    New LoginSample()
    Return 0
End
