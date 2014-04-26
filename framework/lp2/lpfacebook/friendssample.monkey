Import lp2.lpscenemngr
Import lp2.lpfacebook.lpfacebook


'' ////////////////////
'' ///////Sample///////
'' ////////////////////

Global APP_ID:String = "155360927970352"

Class FriendsSampleScene Extends lpScene Implements iHudButton

    '' buttons ids
    Const LOGIN_BUTTON:Int = 0
    Const FRIENDS_BUTTON:Int = 1
    
    Field loginButton:HudButton
    Field friendsButton:HudButton

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
        Self.friendsButton = New HudButton("comment.png")
        Self.friendsButton.SetId(FRIENDS_BUTTON)
        Self.friendsButton.SetListener (Self)
        Self.friendsButton.Position.X = DeviceWidth()/2 - Self.friendsButton.Position.Width/2
        Self.friendsButton.Position.Y = 200

        ''' added to children
        Self.AddChild(Self.loginButton)
        Self.AddChild(Self.friendsButton)

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
            Case FRIENDS_BUTTON

            	Local friend_list:lpFacebookUser[] = facebook.Me().GetFriends()

            	If (friend_list)
            		For Local user:=Eachin facebook.Me().GetFriends()
	            		Print user.Get("first_name")
	            	Next
            	EndIf
            	
        End Select
    End
    

End

''' FriendsSample implements lpSceneMngr
Class FriendsSample Extends lpSceneMngr

    Method Create:Void()
        ''' init the first scene
        FriendsSample.GetInstance().SetScene(0)

        ''' hertz = cycles/seconds
        SetUpdateRate( 60 )
    End

    ''' must return the selected scene
    Method GetScene:lpScene(id:Int)
        ''' instantiate a LoginSampleScene
        Return New FriendsSampleScene()
    End

End

Function Main:Int()
    New FriendsSample()
    Return 0
End
