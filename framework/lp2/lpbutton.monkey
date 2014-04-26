Strict

Import lpanimatedsprite

Interface iClickListener
	Method onClick:Void( objId:Int )
End

Class lpButton Extends lpAnimatedSprite

Private
	Field _id: Int
	Field _pressed : Bool = False
	
	Field _clickListener : iClickListener

Public
	Method New( _img: String, _position : Vector2, _tw: Float, _th:Float, _id: Int)
		Super.New(_img, _position, _tw, _th, 2)
		
		Self.AddSequence("normal", [0])
		Self.AddSequence("pressed", [1])
		Self.PlaySequence("normal")
		Self._id = _id
	End
	
	Method Update:Void(delta:Int)
		Super.Update(delta)
				
		If ( TouchDown() And Self.Position.IsPointInside( MouseX(), MouseY() ) ) Then
			Self.PlaySequence("pressed")
			_pressed = True
		End
		
		If (_pressed) Then
			If (Not(TouchDown())) Then
				Self.PlaySequence("normal")
				_pressed = False
				If ( Self.Position.IsPointInside( MouseX(), MouseY() ) ) Then
					' Self.animationState = END_ANIMATION
					If ( _clickListener <> null ) Then
						_clickListener.onClick(Self._id)
					End
				End
			End
		End
	End
	
	Method getId : Int ()
		Return Self._id
	End
	
	Method SetClickListener:Void( clickListener: iClickListener )
		Self._clickListener = clickListener
	End
	
End
