Import lp2.lpscenemngr
Import lp2.lphudbutton
Import lp2.revmob.lprevmob

''''' Use example ''''
Class RevmobSampleScene Extends lpScene Implements iHudButton

	Field revmob:lpRevmob

	Const BUTTON_MORE:Int = 0
	Const BUTTON_FULL:Int = 1

	Field button_more:HudButton
	Field button_full:HudButton

	Method Create:Void()
		revmob = New lpRevmob()
		revmob.Init("52337b20edbb7b7d750000f5")
		revmob.SetTestingMode(True, lpRevmob.WITH_ADS)
		
		revmob.CreateAdLink()
		revmob.CreateFullScreen()

		button_more = New HudButton("comment.png")
		button_more.Position.X = DeviceWidth()/2-button_more.Position.Width/2
		button_more.Position.Y = DeviceHeight()/2-button_more.Position.Height/2

		button_more.SetId(BUTTON_MORE)
		button_more.SetListener(Self)
		
		button_full = New HudButton("comment.png")
		button_full.Position.X = DeviceWidth()/2 - button_full.Position.Width/2
		button_full.Position.Y = DeviceHeight()/2 - button_full.Position.Height/2 + button_more.Position.Height
		button_full.SetId(BUTTON_FULL)
		button_full.SetListener(Self)
		
		
		Self.AddChild(button_more)
		Self.AddChild(button_full)

	End

	Method OnClick:Void(button:HudButton)
		If (button.GetId() = BUTTON_MORE)
			revmob.LinkOpen()
		Else
			revmob.ShowFullScreen()
		End
		
	End
	

End

Class RevmobSample Extends lpSceneMngr

	Method Create:Void()

		RevmobSample.GetInstance().SetScene(0)

		SetUpdateRate(60)
	End

	Method GetScene:lpScene(id:Int)
		Return New RevmobSampleScene()
	End

End

Function Main:Int()
	New RevmobSample()
	Return 0
End