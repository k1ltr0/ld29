Strict

Import vector2
Import lppoly

' basic structure with the values of a rectangle
Class lpRectangle
Private
	Field _poly: 	lpPoly 
Public 
	Field X:		Float
	Field Y:		Float
	Field Width:	Float
	Field Height:	Float
	Field pos:		Vector2 = New Vector2()
	
	' for radius collisions
	Field Radius:	Float
	
	Method New()
		Self.X = 0
		Self.Y = 0
		Self.Width = 0
		Self.Height = 0
		
		Self._poly = New lpPoly([0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0])
	End

	Method New(avoidpoly:Bool)
		Self.X = 0
		Self.Y = 0
		Self.Width = 0
		Self.Height = 0
	End
	

	Method New(x:Float, y:Float, width:Float, height:Float)
		Self.X		= x
		Self.Y 		= y
		Self.Width 	= width
		Self.Height = height
		
		Self.pos	= Vector2.Zero()
		Self.Radius = Self.Width / 2
		
		Self._poly = New lpPoly([0.0,0.0,0.0,0.0,0.0,0.0,0.0,0])
	End
	
	Method GetPoly:lpPoly()
		
		_poly._vertices.Get(0).X = Self.X
		_poly._vertices.Get(0).Y = Self.Y
		
		_poly._vertices.Get(1).X = Self.X+Self.Width
		_poly._vertices.Get(1).Y = Self.Y
		
		_poly._vertices.Get(2).X = Self.X+Self.Width
		_poly._vertices.Get(2).Y = Self.Y+Self.Height
		
		_poly._vertices.Get(3).X = Self.X
		_poly._vertices.Get(3).Y = Self.Y+Self.Height
		
		Return Self._poly
	End
	
	' Get the center of the rectangle in x axis
	' @return float		x
	Method CenterX:Float()
		return X + Width / 2
	End

	' Get the center of the rectangle in y axis
	' @return float		y
	Method CenterY:Float()
		return Y + Height / 2
	End

	' Get the radial collision of two objects
	' @param	other:Rectangle		other object position
	' @return	Bool				true if the distance betwen two objects is less than the sum of the radius
	Method GetRadialCollision:Bool( other:Rectangle )

		Local distance:Float = Sqrt( Pow( Self.CenterX() - other.CenterX(), 2 ) + Pow( Self.CenterY() - other.CenterY(), 2 ) )

		If ( distance < Self.Radius + other.Radius ) Then
			return True
		EndIf
			
		return False
	End
	
	' return true when a point is inside this rectagle
	' @param	point:Vector2	vector with the x and y position of the point
	' @Return	Bool			true if the point is inside the rectangle
	Method IsPointInside:Bool( point:Vector2 )
		
		Local val:Bool = False
		
		If ( point.X > X AND point.X < X + Width ) Then
			If ( point.Y > Y AND point.Y < Y + Height ) Then
				val = True
			EndIf
		EndIf
		
		return val
	End
	
	Method IsPointInside:Bool( x: Float, y:Float )
		pos.X = x
		pos.Y = y
		Return Self.IsPointInside( pos )
	End
	
	Method RadialPointInside:Bool(x: Float, y: Float)
		Local d:Float = Sqrt(Pow(Self.X+Self.Width/2 - x,2) + Pow(Self.Y+Self.Height/2 - y,2))
		
		If (d <= Self.Radius) Then
			Return True
		End
		
		Return False
	End
	
	
	Method Copy:Void( other:Rectangle )
		other.X 		= Self.X
		other.Y 		= Self.Y
		other.Width 	= Self.Width
		other.Height 	= Self.Height
	End

	Method Duplicate:lpRectangle()
		Return new lpRectangle( self.X, self.Y, self.Width, self.Height )
	End
	

	''' usar solo para debug
	Method Draw:Void(r:int = 255, g:int = 0, b:int = 0)

		SetColor r, g, b

		DrawLine X,Y,X+Width,Y
		DrawLine X+Width,Y,X+Width,Y+Height
		DrawLine X+Width,Y+Height,X,Y+Height
		DrawLine X,Y+Height,X,Y

		SetColor 255,255,255
	End

	Method Contains:Bool( other:lpRectangle )

		If (other.X < self.X)
			Return False
		EndIf

		If (other.Y < self.Y)
			Return False
		EndIf
		
		If (other.X + other.Width > self.X + self.Width)
			Return False
		EndIf
		
		If (other.Y + other.Height > self.Y + self.Height)
			Return False
		EndIf
		
		Return True
	End


	Method Intersects:Bool( other:lpRectangle )

		If ( self.X + Self.Width < other.X Or
			self.Y + Self.Height < other.Y Or
			self.X > other.X + other.Width Or
			Self.Y > other.Y + other.Height )
			Return False
		EndIf

		Return True

	End
	
	Function SatCollision:Bool(r1:lpRectangle, r2:lpRectangle, direction:Vector2)

		Local horizontalOverlap		: Float
		Local horizontalDirection	: Float
		Local verticalOverlap		: Float
		Local verticalDirection		: Float
		
		Local r1hw: Float = r1.Width / 2
		Local r2hw: Float = r2.Width / 2
		Local r1hh: Float = r1.Height / 2
		Local r2hh: Float = r2.Height / 2

		direction.X = 0
		direction.Y = 0
		
		horizontalOverlap = r1hw + r2hw - Abs( (r1.X + r1hw) - (r2.X + r2hw) )
		
		If ( horizontalOverlap <= 0 )
			Return False
		End
		
		verticalOverlap = r1hh + r2hh - Abs( (r1.Y + r1hh) - (r2.Y + r2hh) )
		
		If ( verticalOverlap <= 0 )
			Return False
		End
		
		If ( horizontalOverlap < verticalOverlap )
			horizontalDirection = Sgn( (r1.X + r1hw) - (r2.X + r2hw) )
			direction.X += (horizontalOverlap * horizontalDirection) * -1
		Else
			verticalDirection = Sgn( (r1.Y + r1hh) - (r2.Y + r2hh) )
			direction.Y += (verticalOverlap * verticalDirection) * -1
		EndIf
	
		Return True

	End

	Function SatCollisionTest:Bool(r1:lpRectangle, r2:lpRectangle)
		Local horizontalOverlap	: Float
		Local verticalOverlap	: Float
		
		Local r1hw: Float = r1.Width / 2
		Local r2hw: Float = r2.Width / 2
		Local r1hh: Float = r1.Height / 2
		Local r2hh: Float = r2.Height / 2

		horizontalOverlap = r1hw + r2hw - Abs( (r1.X + r1hw) - (r2.X + r2hw) )
		
		If ( horizontalOverlap <= 0 )
			Return False
		End
		
		verticalOverlap = r1hh + r2hh - Abs( (r1.Y + r1hh) - (r2.Y + r2hh) )
		
		If ( verticalOverlap <= 0 )
			Return False
		End
	
		Return True
	End

End Class
