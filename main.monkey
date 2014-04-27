Import imports


''' alguna wea
Class Planet Implements iDrawable

	Field rotation:Float = 0

	Method New()
	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)
		Local delta_secs:Float = Float(delta) / 1000.0
		
		If (KeyDown(KEY_LEFT))
			rotation -= 360 * delta_secs
		ElseIf(KeyDown(KEY_RIGHT))
			rotation += 360 * delta_secs
		EndIf
	End

	Method Render:Void()
		PushMatrix()
			Translate( DeviceWidth() * 0.7, DeviceHeight()*0.3) 
			Rotate( rotation )
			DrawCircle(0,0, 100)
			DrawRect(0,0,100,100)
		PopMatrix()
	End
End


Class GameScene Extends lpScene

	Field loading_steps:Int = 10

	Field planet:Planet
	Field cannon:Cannon

	Method Loading:Int(delta:Int)

		Select Self.loading_steps
			Case 10
				Self.planet = New Planet()
				Self.cannon = New Cannon()

				Self.AddChild(Self.planet)
				Self.AddChild(Self.cannon)
		End

		Self.loading_steps -= 1
		Return Self.loading_steps
	End



	Method LoadingRender:Void()
		DrawRect(0,0,DeviceWidth(), DeviceHeight())
		DrawText("loading...", 0, 0)
	End
End



Class BeneathTheSurface Extends lpSceneMngr

	Method Create:Void()
		SetUpdateRate(60)

		Self.SetScene(0)
	End

	Method GetScene:lpScene(id:Int)
		If (id = 0)
			Return New GameScene()
		EndIf
		
		Return Null
	End

End


Function Main:Int()
	Local bts:= New BeneathTheSurface()
	Return 0
End
