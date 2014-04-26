Import fitem
Import lp2.angelfont.angelfont

Class fLabel Extends fItem

Private
	
	Field text:String
	Field font:AngelFont
	Field align:Int = ALIGN_LEFT

Public
	Const ALIGN_LEFT:Int = 0
	Const ALIGN_CENTER:Int = 1
	Const ALIGN_RIGHT:Int = 2

	Method New(text:String)
		Super.New()
		Self.SetText(text)
	End

	Method SetText:Void(text:String)
		Self.text = text
	End

	Method GetText:String()
		Return Self.text
	End

	Method SetFont:Void(font:AngelFont)
		Self.font = font
	End

	Method Render:Void()
		Self.GetFont().DrawText(Self.text, Self.GetPosition().X, Self.GetPosition().Y - Self.font.TextHeight(Self.text)/2, Self.align)
	End

	Method SetAlign:Void(a:Int)
		Self.align = Clamp(a, ALIGN_LEFT, ALIGN_RIGHT)
	End

	Method GetFont:AngelFont()
		If (Not(Self.font))
			Self.font = fItem.GetDefaultFont()
		EndIf

		Return Self.font
	End
	

End