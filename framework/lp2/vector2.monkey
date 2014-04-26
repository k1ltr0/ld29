Strict

' Basic structure of a 2 dimmensions vector
Class Vector2

	' x and y position
	Field X:Float
	Field Y:Float

	Method New(x:Float, y:Float)
		Self.X = x
		Self.Y = y
	End
	
	' suma por escalar
	Method Add:Void(num:Float)
		Self.X += num
		Self.Y += num
	End
	
	' suma por Vector
	Method Add:Void(vect:Vector2)
		Self.X += vect.X
		Self.Y += vect.Y
	End
	
	Method Multiply:Vector2( vect:Vector2 )
		Self.X *= vect.X
		Self.Y *= vect.Y
		
		Return Self
	End
	
	' crea una copia del vector
	' @param vect:Vector2 parametro por referencia, donde se guardar la copia
	Method CreateCopy:Void( vect:Vector2 )
		vect.X = Self.X
		vect.Y = Self.Y
	End
	
	Field did:Bool = False
	
	Method MoveTo:Void( tx: Float, ty: Float, vel:Float )
		Local d: Float = Float( Sqrt( Pow( Float(X) - Float(tx), 2 ) + Pow( Float(Y) - Float(ty), 2 ) ) )
		
		If( d < vel) Then
			X = tx
			Y = ty
			Self.did = True
			Return
		End
	
		Local m:Float = ATan2(ty - Y , tx - X )
		Local a: Float = (m * -1.0) - 90.0
		
		vel = vel*-1

		X += vel * Sin(a)
		Y += vel * Cos(a)
		Self.did = False
	End
	
	Method Perp:Vector2()
		Local vect:Vector2 = New Vector2(-Y, X)
		Return vect
	End
	
	Method Dot:Float(axis:Vector2)
		Return X*axis.X + Y*axis.Y
	End
	
	' create a zero by zero vector
	' @return 	vector2, 0,0
	Function Zero:Vector2()
		Return New Vector2(0,0)
	End
	
	Function Distance:Float(a:Vector2, b:Vector2)
		Return Sqrt(Pow(b.X - a.X, 2) + Pow(b.Y - a.Y, 2))
	End
	
End Class