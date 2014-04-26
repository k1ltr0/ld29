Import lp2.lprectangle

Class LpDragDrop

	Public

		Method GetBounds:lpRectangle()
		End
		Method Held:Void()
		End
		Method Move:Void(x:Int,y:Int)
		End
		Method Drop:Void()
		End
		Method Update:Void(delta:Int)
			If MouseDown()
				If Self.GetBounds().IsPointInside(MouseX(),MouseY())
			End
		End
		
End