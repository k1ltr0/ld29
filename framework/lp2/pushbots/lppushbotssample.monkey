Import lp2.lpscenemngr
Import lp2.pushbots.lppushbots

#ANDROID_APP_PACKAGE="com.loadingplay.pushbotssample"

''''' Use example ''''
Class PushBotsSampleScene Extends lpScene

	Method Create:Void()
	
		''' sender id and 
		lpPushBots.Init("638320435550", "5249a6c94deeaed00600366f")
	End

End

Class PushBotsSample Extends lpSceneMngr

	Method Create:Void()

		PushBotsSample.GetInstance().SetScene(0)

		SetUpdateRate(60)
	End

	Method GetScene:lpScene(id:Int)
		Return New PushBotsSampleScene()
	End

End

Function Main:Int()
	New PushBotsSample()
	Return 0
End