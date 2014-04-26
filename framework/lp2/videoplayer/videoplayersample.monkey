Import lp2.lpscenemngr
Import lp2.lpscene
Import lp2.videoplayer.nativeplayer


Class SampleScene Extends lpScene

	Field loading_step:Int = 0
	Field video_player:NativePlayer

	Method Loading:Int(delta:Int)

		If (loading_step = 0)
			Self.video_player = New NativePlayer()
			Self.video_player.SetVirtualResolution(640, 960)
			Self.video_player.SetPosition(100,400,500,500)
			'' Self.video_player.SetUrl("rtsp://192.168.0.3:554/user=admin&password=1&channel=1&stream=0.sdp?real_stream--rtp-caching=100")
			Self.video_player.SetUrl("rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov")
			Self.video_player.Play()
		EndIf

		loading_step -= 1

		Return loading_step
	End

	Method Update:Void(delta:Int)
	End
End


'''' implementing framework
Class Manager Extends lpSceneMngr
	
	Method Create:Void()
		Self.SetScene(0)
		SetUpdateRate(60)
	End

	Method GetScene:lpScene(id:Int)
		Return New SampleScene()
	End

End


''' first called function on monkey
Function Main:Int()
	New Manager()
	Return 0
End


