Strict


Class Color

	Field r: Float
	Field g: Float
	Field b: Float
	Field a: FLoat

	Method New()
		Self.r = 0
		Self.g = 0
		Self.b = 0
		Self.a = 1.0
	End
	
	' 0 to 255
	Method New( r:Float, g:Float, b:Float, a:Float=1.0 )
		Self.r = r
		Self.g = g
		Self.b = b
		Self.a = a
	End
	
	' 0 to 255
	Method SetR:Void( r: Float )
		Self.r = r
	End
	
	' 0 to 255
	Method SetG:Void( g: Float )
		Self.g = g
	End
	' 0 to 255
	Method SetB:Void( b: Float )
		Self.b = b
	End
	' 0 to 1.0
	Method SetA:Void( a: Float )
		Self.a = a
	End
	' 0 to 255
	Method SetRGB:Void( r:Float, g:Float, b:Float )
		Self.r = r
		Self.g = g
		Self.b = b
	End

	' 0 to 255 and 0 to 1.0
	Method SetRGBA:Void( r:Float, g:Float, b:Float, a:Float )
		Self.r = r
		Self.g = g
		Self.b = b
		Self.a = a
	End

	''' return the aritmethic average between R, G, & B
	Method GetAverage:Int()
		Local acum:Int = Self.r+Self.g+Self.b
		Return acum / 3
	End
	
	' colors
	Function Black:Color()
		Return New Color()
	End
	
	Function White:Color()
		Return New Color( 255, 255, 255 )
	End
	
	Function Blue:Color()
		Return New Color(0,0,255)
	End
	
	Function Red:Color()
		Return New Color(255,0,0)
	End
	
	Function Green:Color()
		Return New Color(0,255,0)
	End
	
	Function BlueSky:Color()
		Return New Color( 130, 207, 255 )
	End
	
	Function Gray:Color()
		Return New Color(84,84,84)
	End

End
