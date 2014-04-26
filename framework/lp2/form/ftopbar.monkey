Import fitem
Import flabel
Import fbutton

Interface ifTopBar

	Method OnClick:Void(bar:fTopBar)
#Rem
'copy this for fast implementation

	Method OnClick:Void(bar:fTopBar)
		'' TODO: insert code here
	End

#End
End

Class fTopBar Extends fItem Implements ifButton

Private 

	Field button:fButton
	Field label:fLabel
	Field parent:fItem

	Field button_font:AngelFont
	Field title_font:AngelFont

	Field title:String = "TITLE"

	Field event_listener:ifTopBar

Public

	Method New(parent:fItem)
		Self.GetPosition().Height = 24
		Self.GetPosition().Width = parent.GetPosition().Width
		Self.parent = parent

		Self.button = New fButton(Self.GetPosition().Width-24, 2, 20, 20)
		Self.button.GetLabel().SetFont(Self.GetButtonFont())
		Self.button.SetText("-")
		Self.button.GetLabel().GetPosition().Y -= 10
		Self.button.GetBorder().GetColor().SetRGB(55,55,55)
		Self.button.AddListener(Self)


		Self.label = New fLabel()
		Self.label.SetText(Self.title)
		Self.label.GetPosition().X = 4
		Self.label.GetPosition().Y = Self.GetPosition().Height/2-Self.GetTitleFont().TextHeight(Self.title)/2 + 4
		Self.label.SetFont(Self.GetTitleFont())

		Self.GetChildren().AddLast(Self.button)
		Self.GetChildren().AddLast(Self.label)

		Self.GetBackground().SetRGB(55,55,55)
	End

	Method GetButtonFont:AngelFont()
		If (Not(Self.button_font))
			'' loading default font
			Self.button_font = New AngelFont()
			Self.button_font.LoadFntFont("eurostyle_30")
		EndIf
		
		Return Self.button_font
	End

	Method GetTitleFont:AngelFont()
		If (Not(Self.title_font))
			''' loading default font
			Self.title_font = fItem.GetDefaultFont()
		EndIf
		
		Return Self.title_font
	End

	Method SetTitle:Void(t:String)
		Self.title = t
		Self.label.SetText(Self.title)
	End

	Method SetListener:Void(l:ifTopBar)
		Self.event_listener = l
	End

	Method OnStateChange:Void(button:fButton, state:Int)
	End

	Method OnClick:Void(button:fButton)
		If (Self.event_listener)
			Self.event_listener.OnClick(Self)
		End
	End

End