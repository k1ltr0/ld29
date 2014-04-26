Import lp2.lprectangle

#If TARGET="android"
Import "native/player.android.java"

Extern

Class NativePlayer

	''' sets the virtual resolution, to recalculate the position on the camera
	Method SetVirtualResolution:Void(w:Int, h:Int)

	''' sets the position on the screen
	'''  and the max height and width, the video will addatp to keep the ratio
	Method SetPosition:Void(x:Int, y:Int, w:Int, h:Int)
	Method SetPosition:Void(x:Int, y:Int)
	Method SetWidth:Void(w:Int)
	Method SetHeight:Void(h:Int)
	''' rotation
	Method Rotate:Void(angle:Int)
	Method IsRotated:Bool()

	''' show the video component
	Method Show:Void()

	''' hides the video component
	Method Hide:Void()

	''' control the video playing
	Method Play:Void()
	Method Pause:Void()
	Method Stop:Void()
	Method IsPlaying:Bool()

	''' set video url, could be local or web
	''' for web assign internet permissions to the project
	''' @see : http://developer.android.com/guide/appendix/media-formats.html
	Method SetUrl:Void(url:String)

End

#Else

''' temporal class for debugging with html5

Public
Class NativePlayer

	Method SetVirtualResolution:Void(w:Int, h:Int)
	End
	Method SetPosition:Void(x:Int, y:Int, w:Int, h:Int)
	End
	Method SetPosition:Void(x:Int, y:Int)
	End
	Method SetWidth:Void(w:Int)
	End
	Method SetHeight:Void(h:Int)
	End
	Method Rotate:Void(angle:Int)
	End
	Method IsRotated:Bool()
		Return False
	End
	Method Show:Void()
	End
	Method Hide:Void()
	End
	Method Play:Void()
	End
	Method Pause:Void()
	End
	Method Stop:Void()
	End
	Method IsPlaying:Bool()
		Return False
	End
	Method SetUrl:Void(url:String)
	End

End

#End

