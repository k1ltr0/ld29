Import lp2.lprectangle
Import lp2.idrawable
Import lp2.color

Class Thickness

Private 

	Field left:Int = 1
	Field top:Int = 1
	Field right:Int = 1
	Field bottom:Int = 1

Public

End

Class fRectangle Extends lpRectangle

Private

	Field thickness:Thickness = New Thickness()

Public

	Method New(x:Int,y:Int,w:Int,h:Int)
		Super.New(x,y,w,h)
	End

	Method SetThickness:Void(t:Int)

		Self.thickness.left = t
		Self.thickness.top = t
		Self.thickness.right = t
		Self.thickness.bottom = t
	End

End


Class fDrawableRectangle Extends fRectangle Implements iDrawable

Private

	Field color:Color

Public
	Method New(x:Int,y:Int,w:Int,h:Int)
		Super.New(x,y,w,h)
	End

	Method Create:Void()
		''' TODO:insert code here
	End

	Method Update:Void(delta:Int)
		''' TODO:insert code here
	End

	Method Render:Void()
		''' TODO:insert code here
	End

	Method GetColor:Color()
		If (Not(color))
			Self.color = Color.White()
		End
		
		Return color
	End

End


Class Border Extends fDrawableRectangle
	
	Method New(x:Int,y:Int,w:Int,h:Int)
		Super.New(x,y,w,h)
	End

	Method Draw:Void(r:int = 255, g:int = 0, b:int = 0)

		If (thickness.left > 0)
			SetColor r, g, b

			DrawLine X,Y,X+Width,Y
			DrawLine X+Width,Y,X+Width,Y+Height
			DrawLine X+Width,Y+Height,X,Y+Height
			DrawLine X,Y+Height,X,Y

			SetColor 255,255,255
		EndIf
		
	End

End

Class Margin Extends fRectangle
End

Class Padding Extends fRectangle
End

