Import imports

Class TitleScene Extends lpScene Implements iHudButton

	Field loading_steps:Int = 10
	Field background:lpImage

	Field start:HudButton
	Field credits:HudButton

	Method Loading:Int(delta:Int)

		Select Self.loading_steps
			Case 10
				Self.background = New lpImage("fondo_Inicio.png", Vector2.Zero)
				Self.AddChild(Self.background)
			Case 9
				Self.start = New HudButton("start.png")
				Self.start.Position.X = 10
				Self.start.Position.Y = 427
				Self.start.SetListener(Self)
				Self.start.SetId(0)

				Self.credits = New HudButton("credits.png")
				Self.credits.Position.X = 19
				Self.credits.Position.Y = 507
				Self.credits.SetListener(Self)
				Self.credits.SetId(1)

				Self.AddChild(Self.start)
				Self.AddChild(Self.credits)

		End

		Self.loading_steps -= 1
		Return Self.loading_steps
	End


	Method LoadingRender:Void()
		DrawRect(0,0,DeviceWidth(), DeviceHeight())
		DrawText("loading...", 0, 0)
	End

	Method OnClick:Void(button:HudButton)
		If (button.GetId() = 0)
			BeneathTheSurface.GetInstance().SetScene(0)
		Else
			BeneathTheSurface.GetInstance().SetScene(2)
		EndIf
		
	End

End
