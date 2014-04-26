Import lp2.lpscenemngr
Import lp2.lpscene
Import lp2.adcolony.adcolony
Import lp2.form.fbutton

#ANDROID_APP_PACKAGE="com.loadingplay.omcad"

Global APP_ID:String = "app34149ea47b2e4e6aa9"
Global V4VC_ZONE_ID:String = "vz81e775002d8a473bb2"
Global VIDEO_ZONE_ID:String = "vzaca9df5730d74e5aa3"

Class GameScene Extends lpScene Implements ifButton

	Field loading_steps:Int = 0

	Field button_test_v4vc:fButton
	Field button_test_video:fButton

	Const BUTTON_V4VC:Int = 0
	Const BUTTON_VIDEO:Int = 1

	Method Loading:Int(delta:Int)
		Select loading_steps
			Case 0

				Local camera:lpCamera = lpSceneMngr.GetInstance().GetCurrentCamera()
				camera.ViewPort.Width = 320
				camera.ViewPort.Height= 480

				''' init button for v4vc
				Self.button_test_v4vc = New fButton(320/2-300/2,100,300,100)
				Self.button_test_v4vc.SetText("loading...")
				Self.button_test_v4vc.GetOverStateBackground().SetRGB(255,255,255)
				Self.button_test_v4vc.GetNormalStateBackground().SetRGB(255,255,255)
				Self.button_test_v4vc.GetPressedStateBackground().SetRGB(122,122,122)
				Self.button_test_v4vc.AddListener(Self)
				Self.button_test_v4vc.SetButtonId(BUTTON_V4VC)

				Self.AddChild(Self.button_test_v4vc)

				''' init button for video
				Self.button_test_video = New fButton(320/2-300/2,230,300,100)
				Self.button_test_video.SetText("loading...")
				Self.button_test_video.GetOverStateBackground().SetRGB(255,255,255)
				Self.button_test_video.GetNormalStateBackground().SetRGB(255,255,255)
				Self.button_test_video.GetPressedStateBackground().SetRGB(122,122,122)
				Self.button_test_video.AddListener(Self)
				Self.button_test_video.SetButtonId(BUTTON_VIDEO)

				Self.AddChild(Self.button_test_video)

				''' init adcolony
				lpAdColony.Init(APP_ID, [V4VC_ZONE_ID, VIDEO_ZONE_ID])
		End

		loading_steps -= 1

		Return loading_steps
	End

	Method LoadingRender:Void()
		DrawText("loading", 0, 0)
	End


	Method Update:Void(delta:Int)
		Super.Update(delta)

		If (lpAdColony.IsAvailable(V4VC_ZONE_ID))
			Self.button_test_v4vc.SetText("v4vc")
		EndIf

		If (lpAdColony.IsAvailable(VIDEO_ZONE_ID))
			Self.button_test_video.SetText("video")
		EndIf
		
	End

	Method OnStateChange:Void(button:fButton, state:Int)
		''' TODO: insert code here
	End

	Method OnClick:Void(button:fButton)
		Select button.GetButtonId()
			Case BUTTON_V4VC
				lpAdColony.ShowV4VC(V4VC_ZONE_ID)
			Case BUTTON_VIDEO
				lpAdColony.ShowVideo(VIDEO_ZONE_ID)
		End
	End

End


Class Game Extends lpSceneMngr
	Method Create:Void()
		SetUpdateRate(60)
		Self.SetScene(0)
	End

	Method GetScene:lpScene(id:Int)
		Return New GameScene()
	End
End



Function Main:Int()
	New Game
	Return 0
End
