Strict

Import mojo

Import lp2.angelfont.angelfont

Class SimpleInput
	Private
	Global count:Int = 0
	
	Field cursorPos:Int = 0

	
	Public
	Const cursorWidth:Int = 2
	
	Field text:String	
	Field font:AngelFont
	
	Field x:Int = 0
	Field y:Int = 0
	
	Field height:Int
	Field heightOffset:Int

	Method New(txt:String, x:Int=0,y:Int=0)
		Self.text = txt
		Self.x = x
		Self.y = y
		Self.font = AngelFont.GetCurrent()
		Self.height = Self.font.height
		Self.heightOffset = Self.font.heightOffset
		Self.cursorPos = txt.Length
	End Method
	
	Method Draw:Void()
		Draw(x,y)
	End Method

	Method Draw:Void(x:Int,y:Int)
		font.DrawText(text,x,y)
		If count > 3 DrawRect x+font.TextWidth(text[..cursorPos]),y+heightOffset,cursorWidth,height
	End Method
	
	Method Update:String()
		count = (count+1) Mod 7
		Local asc:Int = GetChar()
		If asc > 31 And asc < 127
			text = text[0..cursorPos]+String.FromChar(asc)+text[cursorPos..text.Length]
			cursorPos += 1
		Else
			Select asc
				Case 8
					If cursorPos > 0	'And text.Length > 0
						text = text[0..cursorPos-1]+text[cursorPos..text.Length]
						cursorPos -= 1
					Endif
				Case 13
					
'					Case KEY_LEFT, 65573
				Case 65573
					cursorPos -= 1
					If cursorPos < 0 cursorPos = 0
'					Case KEY_RIGHT, 65575
				Case 65575
					cursorPos += 1
					If cursorPos > text.Length cursorPos = text.Length
			End
		Endif
		Return text
	End
	
End Class

















