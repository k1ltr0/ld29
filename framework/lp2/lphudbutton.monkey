Import lp2.lpimage
Import lp2.lpscenemngr
Import lp2.angelfont.angelfont

''' define a padding for the ui
Const TOP_MARGIN:Int = 10
Const SIDE_MARGIN:Int = 20

''' interface for click litening from HudButton
Interface iHudButton
	
	''' must be implemented by user
	Method OnClick:Void(button:HudButton)

End


''' button with two states
Class ToggleButton Extends HudButton

Private

	Field enabled:Bool = True

	Field eimage:Image
	Field dimage:Image

Public

	''' construct a new double state button
	Method New(imgEnabled:String, imgDisabled:String, snd:String = "" )
		Super.New( imgEnabled, snd )
		Self.eimage = Self._img
		Self.dimage = lpLoadImage(imgDisabled)
	End

	Method IsEnabled:Bool()
		Return Self.enabled
	End
	
	Method SetEnable:Bool( b:Bool )
		''' modify the flag
		Self.enabled = b
		
		''' change image to render
		If (Self.enabled)
			Self._img = Self.eimage
		Else
			Self._img = Self.dimage
		EndIf
		
	End

	''' change the state from one to the opposite
	Method Toggle:Void()
		Self.SetEnable( Not( Self.IsEnabled ) )
	End

	''' overrriden method for detect click events
	Method OnClick:Void()
		Self.Toggle()
	End
	

End


Class HudButton Extends lpImage

Private

	''' saves the state of y
	Field ystate:Int

	''' mouse proyection
	Field mx:Int = 0
	Field my:Int = 0

	''' tween for button animation
	Field theTween:lpTween

	''' define the click listener
	Field listener:iHudButton

	''' loading the sound
	Field sound:Sound
	
	Field muted:Bool

	''' text constrains
	Field defaultFont:AngelFont
	Field defaultText:String

	Field textHHeight:Float
	
	Field currentScale:Vector2 = New Vector2
	Field currentTranslation:Vector2 = New Vector2
	
	'''correccion para ajustar texto
	Field topPadding:Int = 0
	Field leftPadding:Int = 0

	''' unique identifier
	Field id:Int = 0

	Field show_background:Bool = True

	''' mouse gesture
	Field begin_gesture:Bool = False

Public

	''' state machine
	Const STATE_READY:Int = 0
	Const STATE_ANIMATE:Int = 1
	Const STATE_ANIMATE_REVERSE:Int = 2
	Const STATE_END:Int = 3

	Field state:Int

	'''''''''''''''''''''''''
	''' initilize methods '''
	'''''''''''''''''''''''''

	'' default constructor, initialize an hudbutton with a sound associated
    '' @param resource:String image to show as button background
    '' @param snd:String sound that will be played when the user click the button
	Method New(resource:String, snd:String = "")
		Super.New( lpLoadImage(resource), New Vector2(TOP_MARGIN,TOP_MARGIN) )
		Self.sound = lpLoadSound ( snd )
	End

	''' initialize an hudbutton with text to display
	''' WARNING: the text will not be displayed until the font been setted
	Method New( resource:String, font:AngelFont, text:String, snd:String = "", left_padding:Int = 0 , top_padding:Int = 0 )
		Super.New(lpLoadImage(resource), New Vector2(TOP_MARGIN, TOP_MARGIN))
		Self.sound = lpLoadSound ( snd )
		
		Self.topPadding = top_padding
		Self.leftPadding = left_padding

		''' setting font and text
		Self.SetFont ( font )
		Self.SetText ( text )
	End

	Method Create:Void()

		''' scale for screent fitting
		''' Self.SetScale( 0.5 )

		''' initialize the tween
		theTween = lpTween.CreateCubic( lpTween.EASEOUT, 0, 10, 100 )
	End

	Method Render:Void()

		''  if the bakground is locked then don't show it
		If (Self.show_background)
			Super.Render()
		EndIf

		If ( Self.defaultFont ) 
			Self.defaultFont.DrawText( Self.defaultText, Self.Position.X + Self.Position.Width / 2 + leftPadding, (Self.Position.Y + Self.Position.Height / 2) - Self.textHHeight + topPadding, AngelFont.ALIGN_CENTER )
		End
		
		''' code for scale correction
		Self.currentScale.X = GetMatrix()[0]
		Self.currentScale.Y = GetMatrix()[3]

		Self.currentTranslation.X = GetMatrix()[4]
		Self.currentTranslation.Y = GetMatrix()[5]

	End

	Method Update:Void(delta:Int)
		Super.Update(delta)

		''' state machine update
		Select state
		Case STATE_READY
			''' detect mouse click
			If (MouseHit())

				mx = MouseX() / Self.currentScale.X
				my = MouseY() / Self.currentScale.Y

				''' getmatrix, for apply the current translation
				If (Self.Position.IsPointInside( mx - Self.currentTranslation.X / Self.currentScale.X, my - Self.currentTranslation.Y / Self.currentScale.Y ))
					begin_gesture = True
					
				Endif
			Endif

			If (begin_gesture)

				mx = MouseX() / Self.currentScale.X
				my = MouseY() / Self.currentScale.Y

				If (Not(MouseDown()))
					begin_gesture = False
					
					If (Self.Position.IsPointInside( mx - Self.currentTranslation.X / Self.currentScale.X, my - Self.currentTranslation.Y / Self.currentScale.Y ))

						Self.state = STATE_ANIMATE
						theTween.Start()
						ystate = Self.Position.Y
						
						''' playing the sound
						If ( Self.sound And Not Self.muted) 
							PlaySound ( Self.sound )
						Endif
						
						'Joystick.enabled = false
						'SaveTheCat.GetInstance ().SetScene ( 1 )
					End
				End
			End
		Case STATE_ANIMATE
			''' animate the button corresponding to tween
			theTween.Update()
			Self.Position.Y = ystate + theTween.GetCurrentValue()
			
			If (Not ( theTween.IsRunning() ))
				Self.state = STATE_ANIMATE_REVERSE
			Endif
			
		Case STATE_ANIMATE_REVERSE
			''' reset the y position
			Self.Position.Y = ystate
			Self.state = STATE_END
		Case STATE_END
			''' execute internal listener for the inheritance
			Self.OnClick()
			
			''' execute listener here
			If (listener <> Null)
				listener.OnClick(Self)
			Endif
			
			''' once the listener executed then the state machine is ready
			Self.state = STATE_READY
		End Select
		
	End

	''' override if you create your own button
	Method OnClick:Void()
	End

	''' add a click listener
	Method SetListener:Void( l:iHudButton )
		listener = l
	End

	''''''''''''''''''''''''''''''''
	'''' text drawing functions ''''
	''''''''''''''''''''''''''''''''

	''' change the current font
	Method SetFont:Void ( font:AngelFont )
		Self.defaultFont = font

		If ( defaultFont )
			Self.textHHeight = Self.defaultFont.TextHeight( Self.defaultText ) / 2
		End
	End

	''' change the current text
	Method SetText:Void ( text:String )
		Self.defaultText = text

		If ( defaultFont )
			Self.textHHeight = Self.defaultFont.TextHeight( Self.defaultText ) / 2
		End
	End

	''' returns the currently used font
	Method GetCurrentFont:AngelFont()
		Return Self.defaultFont
	End

	''' return the current text width
	Method GetCurrentText:String()
		Return Self.defaultText
	End

	''' set the id
	Method SetId:Void ( i:Int )
		Self.id = i
	End

	''' return the current id
	Method GetId:Int()
		Return Self.id
	End
	
	Method SetTopPadding:Void(top:Int)
		Self.topPadding = top
	End
	
	Method SetLeftPadding:Void(left:Int)
		Self.leftPadding = left
	End
	
	Method SetMuted:Void(silence:Bool)
		Self.muted = silence
	End

	'' show or hides the current bakgroudn image
	'' @param show:Bool enable or disable the background
	Method ShowBackground:Void( show:Bool )
		Self.show_background = show
	End

	'' indicates if the background is curretly unlocked
	'' @return Bool, true if the background is visible
	Method IsBackgroundVisible:Bool()
		Return Self.show_background
	End
End