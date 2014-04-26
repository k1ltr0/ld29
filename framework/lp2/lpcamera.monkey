Strict

Import mojo
Import lprectangle
Import idrawable

Class lpCamera Implements iDrawable

Private

	Field _zoom:Float = 1.0
	Field _firstViewPort:lpRectangle

	Method _init:Void(px:Float,py:Float,pw:Float,ph:Float,vx:Float,vy:Float,vw:Float,vh:Float)
		Self.Position = New lpRectangle(px,py,pw,ph)
		Self.ViewPort = New lpRectangle(vx,vy,vw,vh)
		Self._firstViewPort = New lpRectangle(vx,vy,vw,vh)
	End

Public

	Field Position:lpRectangle
	Field ViewPort:lpRectangle
	
	Method New(px:Float = 0,py:Float = 0,pw:Float = DeviceWidth(),ph:Float = DeviceHeight(),vx:Float = 0,vy:Float = 0,vw:Float = DeviceWidth(),vh:Float = DeviceHeight())
		Self._init(px,py,pw,ph,vx,vy,vw,vh)
	End
	
	Method SetZoom:Void(v:Float)
		Self._zoom = v
		
		Self.ViewPort.Width = _firstViewPort.Width/Self._zoom
		Self.ViewPort.Height = _firstViewPort.Height/Self._zoom
	End
	
	Method GetZoom:Float()
		Return _zoom
	End
	
	Method SetViewSize:Void(width:Int, height:Int)	
		ViewPort.Width = width
		ViewPort.Height= height
	End
	
	Method Create:Void () End
	Method Render:Void () End
	Method Update:Void (delta:Int ) End 
	
	
	Method SmoothFollowX:Void(target_x:Float, correction_x:Float, delta_time:Int, lerp:Float = 0.2)
		
		''' this line produces a little camera shake 
		'''' Self.camera.ViewPort.X -= goal * lerp
		target_x = Self.ViewPort.X - target_x + correction_x
		
		If (Abs(target_x * lerp) < 50 )
			lerp = Clamp ( 10.0 / Abs(target_x * lerp), 0.2, 1.0 )
		Endif

		Self.ViewPort.X -= target_x * lerp

	End
	
	Method SmoothFollowY:Void(target_y:Float, correction_y:Float, delta_time:Int, lerp:Float = 0.2)
		
		''' this line produces a little camera shake 
		'''' Self.camera.ViewPort.X -= goal * lerp
		target_y = Self.ViewPort.Y - target_y + correction_y
		
		If (Abs(target_y * lerp) < 50 )
			lerp = Clamp ( 10.0 / Abs(target_y * lerp), 0.2, 1.0 )
		Endif

		Self.ViewPort.Y -= target_y * lerp

	End
	
	Method SmoothFollow:Void(target_x:Float,target_y:Float,correction_x:Float, correction_y:Float, delta:Int, lerp:Float = 0.2)
		Self.SmoothFollowX(target_x, target_x, delta, lerp)
		Self.SmoothFollowY(tart_y, target_y, delta, lerp)
	End
End