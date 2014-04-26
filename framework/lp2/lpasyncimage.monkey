Import lp2.lpimage

Class lpAsyncImage Extends lpImage Implements IOnLoadImageComplete

	Field temp_position:Vector2
	Field is_loaded:Bool = False

	Method New(url:String, position:Vector2)
		temp_position = position
		LoadImageAsync( url, , , Self )
		Self._init(lpLoadImage("aabb.png"), Self.temp_position)
	End

	Method OnLoadImageComplete:Void( image:Image, path:String, source:IAsyncEventSource )
		Self._init(image, Self.temp_position)
		Self.is_loaded = True
	End

	Method Render:Void()
		If (is_loaded)
			Super.Render()
		EndIf
	End

End
