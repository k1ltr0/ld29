Strict

Import mojo
Import lp2.vector2
Import lp2.lprectangle

Class lpCollisionInfo
	Field LengthSquared:Float = 0.0
	Field overlap:Bool = False
	Field mtd:Vector2 = New Vector2(0,0)
End

Class lpPoly

Private 

	Field aabb:lpRectangle
	Field other_point_inside:lpPoly
	Field pos:Vector2

	Method _init:Void(vertices:Float[])
		If (vertices.Length() Mod 2<>0) Then
			Error("lpoly.new: vertices:int[] no puede ser impar")
		End
		
		_vertices = New Stack<Vector2>()
		
		For Local i:= 0 Until vertices.Length Step 2
			_vertices.Push(New Vector2(Float(vertices[i]), Float(vertices[i+1])))
		Next

		aabb = new lpRectangle(false)
	End
Public 

	Field _vertices:Stack<Vector2>
	Field info:lpCollisionInfo = New lpCollisionInfo
	
	Method New(vertices:Float[])
		Self._init(vertices)
	End
	
	Method New(vertices:Int[])
		Local v:Float[vertices.Length()]
		
		For Local i:= 0 Until vertices.Length()
			v[i] = Float(vertices[i])
		Next 
		
		Self._init(v)
	End
	
	'' @Deprecated
	Method Render:Void()

		SetColor(0,0,0)		
		For Local i:= 0 Until _vertices.Length()-1
			DrawLine(_vertices.Get(i).X, _vertices.Get(i).Y, _vertices.Get(i+1).X, _vertices.Get(i+1).Y)
		Next
		
		DrawLine(_vertices.Get(0).X, _vertices.Get(0).Y, _vertices.Get(_vertices.Length()-1).X, _vertices.Get(_vertices.Length()-1).Y)
		SetColor(255,255,255)
	End

	'' @Deprecated
	Method Draw:Void(r#, g#, b#)

		SetColor(r,g,b)
		For Local i:= 0 Until _vertices.Length()-1
			DrawLine(_vertices.Get(i).X, _vertices.Get(i).Y, _vertices.Get(i+1).X, _vertices.Get(i+1).Y)
		Next
		
		DrawLine(_vertices.Get(0).X, _vertices.Get(0).Y, _vertices.Get(_vertices.Length()-1).X, _vertices.Get(_vertices.Length()-1).Y)
		SetColor(255,255,255)
	End

	' Indicate if a point is inside the instanced polygon
	' @param	point:Vector2	vector with the x and y position of the point
	' @Return	Bool			true if the point is inside the rectangle
	Method IsPointInside:Bool( point:Vector2 )
		
		Local val:Bool = False
		If (other_point_inside = Null)
			other_point_inside = New lpPoly([point.X,point.Y,
											point.X+1,point.Y,
											point.X+1,point.Y+1,
											point.X, point.Y+1])
		Else
			other_point_inside._vertices.Get(0).X = point.X
			other_point_inside._vertices.Get(0).Y = point.Y
			other_point_inside._vertices.Get(1).X = point.X+1
			other_point_inside._vertices.Get(1).Y = point.Y
			other_point_inside._vertices.Get(2).X = point.X+1
			other_point_inside._vertices.Get(2).Y = point.Y+1
			other_point_inside._vertices.Get(3).X = point.X
			other_point_inside._vertices.Get(3).Y = point.Y+1
		EndIf

		val = Self.SatCollisionTest(other_point_inside)

		Return val
	End
	
	Method IsPointInside:Bool( x: Float, y:Float )

		If (pos = Null)
			pos = New Vector2(x,y)
		Else
			pos.X = x
			pos.Y = y
		EndIf

		Return Self.IsPointInside( pos )
	End
	
	Method SatCollisionTest:Bool(other:lpPoly)
   
   		Local j:= _vertices.Length() -1
   		
   		For Local i:= 0 Until _vertices.Length()
   			
   			Local v0:= _vertices.Get(j)
   			Local v1:= _vertices.Get(i)
   			Local edge:Vector2 = New Vector2(0,0)
   			
   			edge.X = v1.X - v0.X
   			edge.Y = v1.Y - v0.Y
   			
   			Local axis:Vector2 = edge.Perp()
   			
   			If (separatedByAxis(axis, other)) Then
   				Return False
   			End

   			j = i
   		Next
   		
   		
   		j = other._vertices.Length()-1
   		
   		For Local i:= 0 Until other._vertices.Length()
   			
   			Local v0:= other._vertices.Get(j)
   			Local v1:= other._vertices.Get(i)
   			Local edge2:Vector2 = New Vector2(0,0)
   			
   			edge2.X = v1.X - v0.X
   			edge2.Y = v1.Y - v0.Y
   			
   			Local axis:Vector2 = edge2.Perp()
   			
   			If (separatedByAxis(axis, other)) Then
   				Return False
   			End

   			j = i
   		Next
		
		Return True
	End
	
	Method SatCollision:lpCollisionInfo(other:lpPoly)
		info.LengthSquared = -1
		
		Local j:= _vertices.Length() -1
   		
   		For Local i:= 0 Until _vertices.Length()
   			
   			Local v0:= _vertices.Get(j)
   			Local v1:= _vertices.Get(i)
   			Local edge:Vector2 = New Vector2(0,0)
   			
   			edge.X = v1.X - v0.X
   			edge.Y = v1.Y - v0.Y
   			
   			Local axis:Vector2 = edge.Perp()
   			
   			If (separatedByAxis(axis, other)) Then
   				info.overlap = False
   				Return info
   			End

   			j = i
   		Next
   		
   		
   		j = other._vertices.Length()-1
   		
   		For Local i:= 0 Until other._vertices.Length()
   			
   			Local v0:= other._vertices.Get(j)
   			Local v1:= other._vertices.Get(i)
   			Local edge2:Vector2 = New Vector2(0,0)
   			
   			edge2.X = v1.X - v0.X
   			edge2.Y = v1.Y - v0.Y
   			
   			Local axis:Vector2 = edge2.Perp()
   			
   			If (separatedByAxis(axis, other)) Then
   				info.overlap = False
   				Return info
   			End

   			j = i
   		Next
        
		info.overlap = True
		
		Return info
	End	
	
	Field min:Float
	Field max:Float 
	
	Method calculateInterval:Void(axis:Vector2)
		min = Float(_vertices.Get(0).Dot(axis))
		max = Float(_vertices.Get(0).Dot(axis))
		
		For Local i:= 1 Until _vertices.Length()
			Local d:Float = Float(_vertices.Get(i).Dot(axis))
			
			If (d<min) Then
				min = d
			Else If (d>max) Then
				max = d
			End
		Next
	End

	Method intervalsSeparated:Bool(min:Float, maxa:Float, minb:Float, maxb:Float)
		If (mina>maxb) Or (minb > maxa) Then
			Return True
		End
		
		Return False
	End
	
	Field mina:Float
	Field maxa:Float
	
	Field minb:Float
	Field maxb:Float
	
	Method separatedByAxis:Bool(axis:Vector2, poly:lpPoly)
		calculateInterval(axis)
		mina = min
		maxa = max;
		poly.calculateInterval(axis)
		minb = poly.min
		maxb = poly.max
		
		Local d0:Float = maxb-mina
		Local d1:Float = minb-maxa
		
		If (d0 < 0.0 Or d1 > 0.0) Then
			Return True
		End
		
		Local overlap:Float = 0
		
		If (d0 < -d1) Then
			overlap = d0
		Else
			overlap = d1
		End
		
		Local axis_length_squared:Float = axis.Dot(axis)
		
		If (Not(axis_length_squared > 0.00001)) Then
			Error("axis_length_squared: no puede ser menor a 0.00001")
		End
		
		Local sep:Vector2 = New Vector2(0,0)
		
		sep.X = axis.X * (overlap/axis_length_squared)
		sep.Y = axis.Y * (overlap/axis_length_squared)
		
		Local sep_length_squared:Float = sep.Dot(sep)
		
		If (sep_length_squared < info.LengthSquared Or info.LengthSquared < 0.0) Then
			info.LengthSquared = sep_length_squared
			info.mtd = sep
		End
		
		Return False
		'Return intervalsSeparated(mina, maxa, minb, maxb)
	End
	
	Method Rotate:Void(rot:Float, pivot:Vector2 = New Vector2(0,0))
		For Local i:= 0 Until _vertices.Length()
			Local Xo:Float = _vertices.Get(i).X
			
			_vertices.Get(i).X = pivot.X + ((Xo - pivot.X) * Cos(rot) - (_vertices.Get(i).Y - pivot.Y) * Sin(rot));
			_vertices.Get(i).Y = pivot.Y + ((Xo - pivot.X) * Sin(rot) + (_vertices.Get(i).Y - pivot.Y) * Cos(rot));

		Next
	End

	Method GetAABB:lpRectangle()

		Local farX#, farY#
		aabb.X = _vertices.Get(0).X ''' origen
		aabb.Y = _vertices.Get(0).Y

		farX = _vertices.Get( 0 ).X
		farY = _vertices.Get( 0 ).Y

		For Local v:=Eachin _vertices

			''' calc the with and Height
			If (v.X > farX)
				farX = v.X
			EndIf

			If (v.Y > farY)
				farY = v.Y
			EndIf

			''' calc teh origin position
			If (v.X < aabb.X)
				aabb.X = v.X
			EndIf

			If (v.Y < aabb.Y)
				aabb.Y = v.Y
			EndIf
			
		Next

		aabb.Width = farX - aabb.X
		aabb.Height = farY - aabb.Y

		Return aabb
	End
	

End