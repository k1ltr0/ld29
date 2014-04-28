Import imports


Class GameScene Extends lpScene

	Field loading_steps:Int = 10

	Field planet:Planet
	Field cannon:Cannon

	Field background:lpImage

	Field shake:Float = 10
	Field shake_time:Float = 200
	Field shake_timer:Float = 0
	Field shake_flag:Bool = True

	Global _inst:GameScene

	Method Loading:Int(delta:Int)

		Select Self.loading_steps
			Case 10
				Self.background = New lpImage("background.png", Vector2.Zero)
				Self.AddChild(Self.background)
			Case 9
				Self.planet = New Planet()
				Self.cannon = New Cannon(Self.planet)

				Self.AddChild(Self.planet)
				Self.AddChild(Self.cannon)

				GameScene._inst = Self
		End

		Self.loading_steps -= 1
		Return Self.loading_steps
	End

	Method Shake(time, intensity)
		shake_flag = True
		shake_time = time
		shake = intensity
	End

	Method Update:Void(delta:Int)
		If (shake_flag)
			shake_timer += delta

			If (shake_time <= shake_timer)
				shake_timer = 0
			shake_timer += delta
				shake_flag = False
			EndIf
			
		EndIf

		Super.Update(delta)
	End

	Method Render:Void()
		If (shake_flag)
			Translate(Rnd(-shake,shake), Rnd(-shake,shake))
		EndIf
		Super.Render()
	End


	Method LoadingRender:Void()
		DrawRect(0,0,DeviceWidth(), DeviceHeight())
		DrawText("loading...", 0, 0)
	End

	Function GetInstance:GameScene()
		Return GameScene._inst
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
