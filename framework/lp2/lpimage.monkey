Strict

Import vector2
Import lprectangle
Import idrawable
Import lpcamera
Import lppoly
Import lpresources

Class DiscardProcess 'Extends Thread
	Field img:Image
	Method New( i : Image)
		img = i
	End
#If TARGET<>"glfw"
	Method Process:Void()
		Print("ejecuta thread")
		img.Discard()
	End
#EndIf
End

' Show a image on the screen
Class lpImage Implements iDrawable
	
	Method _init:Void( img:Image, position:Vector2, margin:Float = 0 )
		Self._img = img

		If (Self._img)
			Self.Position = New lpRectangle(
						position.X,
						position.Y,
						_img.Width() - margin,
						_img.Height() - margin)

			DiscardThread = New DiscardProcess( Self._img )

			Self.Create()

		EndIf
	End


	Field _img:Image
	Field _scaled:Bool = False
	Field _scalex: Float = 1.0
	Field _scaley: Float = 1.0
	Field _flipped:Bool = False
	Field _angle:Float
	Field _rotated:Bool = False
	Field _rotationPivot:Vector2 = Vector2.Zero()
	Field _polyPosition:lpPoly
	Field did : Bool = False ' only for moveTo
	Field Debug: Bool = False
	Field isDestroyed: Bool = False
	Field DiscardThread:DiscardProcess
	Field Position:lpRectangle
	Field correctPosition:lpRectangle = New lpRectangle(0,0,0,0)

	' Rectangle with the position of the structure
	'Field Position:Rectangle

	Method New( image:String, position:Vector2, l:Int = 0 )
		Local img:Image = lpLoadImage( image )
		Self._init( img, position )
		
	End
	
	Method New( image:Image, position:Vector2 )
	
		Self._init( image, position )
		
	End
	
	Method New( image:String, position:Vector2, margin : Float )

		Local img:Image = lpLoadImage( image )
		Self._init( img, position, margin )
		
	End
	
	Method New( image:Image, position:Vector2, margin : Float )
	
		Self._init( image, position, margin )
		
	End


	'' copy constructor, it's used to create a copy from the other object
	'' @param other:lpImage will be copied in the new instance
	Method New(other:lpImage)

		Self._img = other._img
		Self._scaled = other._scaled
		Self._scalex = other._scalex
		Self._scaley = other._scaley
		Self._flipped = other._flipped
		Self._angle = other._angle
		Self._rotated = other._rotated
		Self._rotationPivot.X = other._rotationPivot.X
		Self._rotationPivot.Y = other._rotationPivot.Y
		Self.did = other.did
		Self.Debug = other.Debug
		Self.isDestroyed = other.isDestroyed
		
		Self.Position = New lpRectangle()
		Self.Position.X = other.Position.X
		Self.Position.Y = other.Position.Y
		Self.Position.Width = other.Position.Width
		Self.Position.Height = other.Position.Height

		Self.correctPosition = New lpRectangle()
		Self.correctPosition.X = other.correctPosition.X
		Self.correctPosition.Y = other.correctPosition.Y
		Self.correctPosition.Width = other.correctPosition.Width
		Self.correctPosition.Height = other.correctPosition.Height


	End
	
	
	Method Create:Void()
	End
	
	' must be implemented by the user
	' @param deltaTime is the time in milliseconds from the last actualization
	Method Update:Void(delta:Int)
	End
	
	Method Render:Void()
		If ( Not(Self.isDestroyed) ) Then
			
			Local flipCorrection: Float = 0
			
			PushMatrix()
				flipCorrection = Self.Position.Width
				
				If (_rotated) Then
					flipCorrection = 0
					Translate(correctPosition.X + _rotationPivot.X, correctPosition.Y + _rotationPivot.Y)
					Self._img.SetHandle(correctPosition.X + _rotationPivot.X, correctPosition.Y + _rotationPivot.Y)
				End
				
				If (_flipped) Then
					DrawImage( Self._img, Self.Position.X + flipCorrection, Self.Position.Y, _angle, -_scalex, _scaley)
				Else
					DrawImage( Self._img, Self.Position.X, Self.Position.Y, _angle, _scalex, _scaley)
				End

			PopMatrix()
		End

	End

	Method SetScale: Void( sclx: Float, scly: Float )
		_scalex = sclx
		_scaley = scly
		_scaled = True
	End

	Method SetScale:Void( scl:Float )
		Self.SetScale( scl,scl )
	End
	
	Method GetScale:Vector2()
		Return New Vector2(_scalex, _scaley)
	End

	Method MoveForward:Void( vel:Float )
		vel = vel * -1
		Self.Position.X += vel * Sin( _angle )
		Self.Position.Y += vel * Cos( _angle )
	End
	
	Method MoveTo:Void( tx: Float, ty: Float, vel:Float )
		If (Self.did) Then Return 
		Local d: Float = Float( Sqrt( Pow( Float(Position.X) - Float(tx), 2 ) + Pow( Float(Position.Y) - Float(ty), 2 ) ) )
		
		If( d < vel) Then
			Self.Position.X = Int(tx)
			Self.Position.Y = Int(ty)
			Self.did = True
			Return
		End
	
		Local m:Float = ATan2(ty - Position.CenterY() , tx - Position.CenterX() )
		Local a: Float = (m * -1.0) - 90.0
		
		vel = vel*-1

		Self.Position.X += vel * Sin(a)
		Self.Position.Y += vel * Cos(a)
		Self.did = False
	End
	
		' Rotate the image to the position x, y
	' @param 	x:Int	x position to see
	' @param 	y:Int 	y position to see
	Method LookAt:Void( x:Int, y:Int )
		
		Local m:Float = ATan2(y - Position.CenterY() , x - Position.CenterX() )
		Self.SetRotation((m * -1.0) - 90.0)
		
	End
	
	' Set the rotation angle
	' @param	angle, angle to rotate the image
	Method SetRotation:Void(angle:Float)
		_angle = angle
		_rotated = True 
	End
	
	Method Flip:Void()
		_flipped = Not(_flipped)
	End
	
	Method Flip:Void(flip:Bool)
		_flipped = Not(flip)
	End
	
	Method SetPivot:Void(x:Float, y:Float)
		Self.SetPivot(New Vector2(x, y))
	End
	
	Method SetPivot:Void( pivot:Vector2 )
		_rotationPivot = pivot
	End
	
	Method Angle:Float()
		Return _angle
	End
	
	Method GetImage:Image()	
		Return Self._img
	End
	

	Method GetPoly:lpPoly()
		Local v:Int = 1
		Local flipCorrection: Float = 0
		
		If (_flipped) Then
			v = -1
			flipCorrection = Self.Position.Width
		End
	
		Local left	:Int = Position.X+flipCorrection
		Local right	:Int = Position.X+Position.Width*_scalex*v+flipCorrection
		Local top	:Int = Position.Y
		Local bottom:Int = Position.Y+Position.Height*_scaley

		If (_polyPosition = Null )  Then
			_polyPosition = New lpPoly([
				left,top,
				right,top,
				right,bottom,
				left,bottom])
		Else
			_polyPosition._vertices.Get(0).X = left
			_polyPosition._vertices.Get(0).Y = top

			_polyPosition._vertices.Get(1).X = right
			_polyPosition._vertices.Get(1).Y = top

			_polyPosition._vertices.Get(2).X = right
			_polyPosition._vertices.Get(2).Y = bottom

			_polyPosition._vertices.Get(3).X = left
			_polyPosition._vertices.Get(3).Y = bottom

		End
		
		_polyPosition.Rotate(-Self._angle, New Vector2(Self.Position.X, Self.Position.Y))
		
		Return _polyPosition
	End
	
	Method EditRender:Void()
		SetColor(0,0,0)
				
		Local pos:lpRectangle = Self.Position
		
		'X = (X * cos Ø) - (Y * sin Ø)
		'Y = (X * sin Ø) + (Y * cos Ø)
		
		'' apply rotation
		GetPoly().Render()

		SetColor(255,255,255)
	End

	Method Discard:Void()
		Self.isDestroyed = True
		Self.DiscardThread.Run(1)
	End
	
	Method GetType:String()
		Return "lpImage"
	End

	''' copy all the fields from this element to another one, 
	''' @return a new instance of this object identically to the current instance
	Method CreateCopy:lpImage()

		Local rtnimg:lpImage = New lpImage()

		rtnimg._img = Self._img
		rtnimg._scaled = Self._scaled
		rtnimg._scalex = Self._scalex
		rtnimg._scaley = Self._scaley
		rtnimg._flipped = Self._flipped
		rtnimg._angle = Self._angle
		rtnimg._rotated = Self._rotated
		rtnimg._rotationPivot.X = Self._rotationPivot.X
		rtnimg._rotationPivot.Y = Self._rotationPivot.Y
		rtnimg.did = Self.did
		rtnimg.Debug = Self.Debug
		rtnimg.isDestroyed = Self.isDestroyed
		
		rtnimg.Position = New lpRectangle()
		rtnimg.Position.X = Self.Position.X
		rtnimg.Position.Y = Self.Position.Y
		rtnimg.Position.Width = Self.Position.Width
		rtnimg.Position.Height = Self.Position.Height

		rtnimg.correctPosition = New lpRectangle()
		rtnimg.correctPosition.X = Self.correctPosition.X
		rtnimg.correctPosition.Y = Self.correctPosition.Y
		rtnimg.correctPosition.Width = Self.correctPosition.Width
		rtnimg.correctPosition.Height = Self.correctPosition.Height


		Return rtnimg

	End
	

End Class
