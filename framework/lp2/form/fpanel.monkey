Import fitem
Import ftopbar
Import mojo
Import lp2.lptween

Class fPanel Extends fItem

Private 

	Field focus_index:Int = -1
	'Field top_bar:fTopBar
	Field enabled_auto_height:Bool = False

Public 

	Global AUTO:Int = -1

	Method New(x:Int, y:Int, width:Int, height:Int)
		Self.GetBorder().X = 0
		Self.GetBorder().Y = 0
		Self.GetBorder().Width = width
		Self.GetBorder().Height = height

		Self.GetBorder().GetColor().SetRGB(255,255,255)
		
		'Self.EnableScissor()

		Self.GetPosition().X = x
		Self.GetPosition().Y = y
		Self.GetPosition().Width = width
		Self.GetPosition().Height = height

		If (height = fPanel.AUTO)
			Self.enabled_auto_height = True
		EndIf
		
 	End

	Method Update:Void(delta:Int)
		Super.Update(delta)	

		If (Self.enabled_auto_height)
			Local h:Int = 0

			For Local c:=Eachin Self.GetChildren()
				If ( c.GetPosition().Y + c.GetPosition().Height > h)
					h = c.GetPosition().Y + c.GetPosition().Height
				EndIf
			Next

			Self.GetPosition().Height = h
		EndIf
		
	End

	Method Render:Void()
		Super.Render()
	End

End


Class fDownPanel Extends fPanel Implements ifTopBar

	Const STATE_SHOW:Int = 0
	Const STATE_HIDE:Int = 1
	Const STATE_SHOWING:Int = 2
	Const STATE_HIDING:Int = 3

Private

	Field top_bar:fTopBar
	Field state:Int = STATE_SHOW

	Field initial_height:Int = 0

	Field animation_max_time:Int = 100

	Field tween:lpTween
Public
	Method New(x:Int, y:Int, width:Int, height:Int)
		Super.New(x, y, width, height)

		Self.top_bar = New fTopBar(Self)
		Self.top_bar.SetListener(Self)
		'Self.GetChildren().AddLast(Self.top_bar)

		Self.GetPosition().Height += Self.top_bar.GetPosition().Height
		Self.initial_height = Self.GetPosition().Height

		Self.tween = lpTween.CreateLinear(Self.GetPosition().Height, Self.top_bar.GetPosition().Height, Self.animation_max_time)
	End

	''' allows to draw objets over all children
	Method PosRender:Void()
		Self.top_bar.Render()
	End

	Method Update:Void(delta:Int)
		If (Self.state = STATE_SHOW)
			Super.Update(delta)
		EndIf

		Self.top_bar.Update(delta)
		Self.tween.Update()

		''' finit states machine
		Select Self.state
			Case STATE_SHOW
			Case STATE_HIDE
			Case STATE_SHOWING
				Self.GetPosition().Height = tween.GetCurrentValue()
				If (Not(Self.tween.IsRunning()))
					Self.state = STATE_SHOW
				EndIf
			Case STATE_HIDING
				Self.GetPosition().Height = tween.GetCurrentValue()
				If (Not(Self.tween.IsRunning()))
					Self.state = STATE_HIDE
				EndIf
				
		End
	End

	Method GetTopBar:fTopBar()
		Return Self.top_bar
	End
	

	Method OnClick:Void(bar:fTopBar)
		If (Self.state = STATE_SHOW)
			Self.state = STATE_HIDING
			Self.initial_height = Self.GetPosition().Height
			Self.tween.SetValues(Self.GetPosition().Height, Self.top_bar.GetPosition().Height)
			Self.tween.Start()
		ElseIf(Self.state = STATE_HIDE)
			Self.state = STATE_SHOWING
			Self.tween.SetValues(Self.top_bar.GetPosition().Height, Self.initial_height)
			Self.tween.Start()
		End
	End

End

Class fRadioGroup Extends fPanel

Private 
	Field selected_index:Int = -1

End

Class fVerticalList Extends fPanel
	Method New(x:Int, y:Int, width:Int, height:Int)
		Super.New(x,y,width,height)
	End

	Method Update:Void(delta:Int)

		Local d:FLoat = 0

		For Local c:=Eachin Self.GetChildren()
			c.Update(delta)

			c.GetPosition().X = 0
			c.GetPosition().Y = d

			d += c.GetPosition().Height
		Next
		
		Super.Update(delta)
		
	End
	
End
