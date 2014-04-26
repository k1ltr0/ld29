Import fitem
Import flabel
Import lp2.lpimage ''' used for image button

Interface ifButton

	Method OnStateChange:Void(button:fButton, state:Int)
	Method OnClick:Void(button:fButton)

#Rem
copy this for easy implementation

	Method OnStateChange:Void(button:fButton, state:Int)
		''' TODO: insert code here
	End

	Method OnClick:Void(button:fButton)
		''' TODO: insert code here
	End

#End


End

Class fButton Extends fItem

Private

	Field state:Int
	Field label:fLabel
	Field event_listeners:List<ifButton>
	Field current_scale:Vector2 = New Vector2(1.0,1.0)

	Field normal_background:Color = New Color(55,55,55)
	Field over_background:Color = New Color(119,119,119)
	Field pressed_background:Color = New Color(10,10,10)

	Field button_id:Int = 0

	Field is_showing:Bool = True

	Method ChangeState:Void()
		If (event_listeners)
			For Local l:=Eachin event_listeners
				l.OnStateChange(Self, Self.state)
			Next
		EndIf
	End

	Method PerformClick:Void()
		If (event_listeners)
			For Local l:=Eachin event_listeners
				l.OnClick(Self)
			Next
		EndIf
	End

Public

	Const STATE_NORMAL:Int = 0
	Const STATE_OVER:Int = 1
	Const STATE_PRESSED:Int = 2

	Method New(x:Int, y:Int, width:Int, height:Int)
		Self.GetPosition().X = x
		Self.GetPosition().Y = y
		Self.GetPosition().Width = width
		Self.GetPosition().Height = height

		Self.GetBorder().X = 0
		Self.GetBorder().Y = 0
		Self.GetBorder().Width = width
		Self.GetBorder().Height = height

		Self.GetBorder().GetColor().SetRGB(0,0,255)

		Self.EnableScissor(False)
 	End

 	Method Update:Void(delta:Int)
 		Super.Update(delta)

 		If (Not(is_showing)) Return
 		

 		Select state
 			Case STATE_NORMAL

 				If Self.GetPosition().IsPointInside((MouseX() - Self.GetCurrentTranslate().X) / Self.current_scale.X, (MouseY() - Self.GetCurrentTranslate().Y) /  Self.current_scale.Y)
 					Self.state = STATE_OVER
 					Self.ChangeState()
 				End

 				Self.GetBackground().r = normal_background.r
 				Self.GetBackground().g = normal_background.g
 				Self.GetBackground().b = normal_background.b
 			Case STATE_OVER

 				If Not(Self.GetPosition().IsPointInside((MouseX() - Self.GetCurrentTranslate().X) / Self.current_scale.X, (MouseY() - Self.GetCurrentTranslate().Y) /  Self.current_scale.Y))
 					Self.state = STATE_NORMAL
 					Self.ChangeState()
 				ElseIf (MouseDown())
 					Self.state = STATE_PRESSED
 					Self.ChangeState()
 				End

 				Self.GetBackground().r = over_background.r
 				Self.GetBackground().g = over_background.g
 				Self.GetBackground().b = over_background.b
 			Case STATE_PRESSED

 				If (Not(MouseDown()))
 					Self.state = STATE_OVER
 					Self.ChangeState()
 					Self.PerformClick()
 				EndIf
 				

 				Self.GetBackground().r = pressed_background.r
 				Self.GetBackground().g = pressed_background.g
 				Self.GetBackground().b = pressed_background.b
 		End Select
 	End

 	Method Render:Void()
 		If (Not(is_showing)) Return
 		Super.Render()

 		Self.current_scale.X = GetMatrix()[0]
 		Self.current_scale.Y = GetMatrix()[3]
 	End

 	Method GetCurrentScale:Vector2()
 		Return Self.current_scale
 	End
 	
	Method SetText:Void(text:String)
		Self.label = Self.GetLabel()

		Self.label.SetText(text)
		Self.label.GetPosition().X = Self.GetPosition().Width/2
		Self.label.GetPosition().Y = Self.GetPosition().Height/2
	End

	Method GetText:String()
		Return Self.GetLabel().GetText()
	End

	Method AddListener:Void(listener:ifButton)
		If (Not(event_listeners))
			event_listeners = New List<ifButton>
		End

		event_listeners.AddLast( listener )
	End

	Method GetLabel:fLabel()
		If (Not(Self.label))
			Self.label = New fLabel()
			Self.GetChildren().AddLast(Self.label)
			Self.label.SetAlign(fLabel.ALIGN_CENTER)

			If (Self.GetBackground().GetAverage() > 127)
				Self.label.SetFont(fItem.GetDefaultBlackFont())
			End
		End

		Return Self.label
	End

	Method SetButtonId:Void(id:Int)
		Self.button_id = id
	End

	Method GetButtonId:Int()
		Return Self.button_id
	End

	Method GetNormalStateBackground:Color()
		Return Self.normal_background
	End

	Method GetOverStateBackground:Color()
		Return Self.over_background
	End

	Method GetPressedStateBackground:Color()
		Return Self.pressed_background
	End
	

	Method Show:Void(b:Bool)
		is_showing = b
	End

End


Class fToggleButton Extends fButton

Private

	Field pressed:Bool = False

End

Class fRadioButton Extends fToggleButton
End

Class fCheckButton Extends fRadioButton
End


Class fImageButton Extends fButton

Private
	Field image:lpImage
	
Public
	Method New(x:Int, y:Int, width:Int, height:Int)
		Super.New(x, y, width, height)
	End

	Method PosRender:Void()
		If (Self.image)
			Self.image.Render()
		End
	End

	Method SetImage:Void(img:String)
		Self.image = New lpImage(img, Vector2.Zero())
	End

	Method SetImage(img:lpImage)
		Self.image = img
	End

	Method GetImage:lpImage()
		Return Self.image
	End

End
