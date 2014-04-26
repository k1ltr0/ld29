Strict


Class lpColor

	Field r: Float
	Field g: Float
	Field b: Float

	Method New()
		Self.r = 0
		Self.g = 0
		Self.b = 0
	End
	
	' 0 to 255
	Method New( r:Float, g:Float, b:Float )
		Self.r = r
		Self.g = g
		Self.b = b
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
	' 0 to 255
	Method SetRGB:Void( r:Float, g:Float, b:Float )
		Self.r = r
		Self.g = g
		Self.b = b
	End
	
	' colors
	Function Black:lpColor()
		Return New lpColor()
	End
	
	Function White:lpColor()
		Return New lpColor( 255, 255, 255 )
	End
	
	Function Blue:lpColor()
		Return New lpColor(0,0,255)
	End
	
	Function Red:lpColor()
		Return New lpColor(255,0,0)
	End
	
	Function Green:lpColor()
		Return New lpColor(0,255,0)
	End
	
	Function BlueSky:lpColor()
		Return New lpColor( 130, 207, 255 )
	End
	
	Function Gray:lpColor()
		Return New lpColor(84,84,84)
	End
End
