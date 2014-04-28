Import imports

Class Credits Extends lpScene
	
	Field loading_steps:Int = 10
	Field font:AngelFont

	Method Loading:Int(delta:Int)

		Select Self.loading_steps
			Case 10
			font = New AngelFont()
			font.LoadFntFont("calibri_40")
			Case 9

		End

		Self.loading_steps -= 1
		Return Self.loading_steps
	End

	Method Update:void(delta:Int)
		If (KeyHit(KEY_SPACE) Or MouseHit())
			BeneathTheSurface.GetInstance().SetScene(1)
		EndIf
	End
	

	Method Render:Void()
		SetColor 0,0,0
		DrawRect(0,0,DeviceWidth(),DeviceHeight())
		SetColor 255,255,255

		Local px:Int = DeviceWidth() / 2
		Local py:Int = DeviceHeight() / 8

		font.DrawText("Created by :", px, py, AngelFont.ALIGN_CENTER)
		font.DrawText("Felipe Araya", px, py + 60, AngelFont.ALIGN_CENTER)
		font.DrawText("Luis Rodriguez", px, py + 110, AngelFont.ALIGN_CENTER)
		font.DrawText("Ricardo Silva", px, py + 160, AngelFont.ALIGN_CENTER)
		font.DrawText("Thanks for playing!", px, py + 300, AngelFont.ALIGN_CENTER)
		

	End

	Method LoadingRender:Void()
		DrawRect(0,0,DeviceWidth(), DeviceHeight())
		DrawText("loading...", 0, 0)
	End


End
