
Import reflection

Import mojo

Import angelfont
Import simpleinput
Import simpletextbox

Class AngelFontExample Extends App

	Field font:AngelFont
	
	Field inp:SimpleInput
	
	Field textBoxText:String
	
	Method OnCreate()
		SetUpdateRate 30
		
		EnableKeyboard
		
		font = New AngelFont()

		font.italicSkew = 0.15
		font.LoadFont("angel3")
		'font.LoadFont("angel_verdana")

		inp = New SimpleInput("simple input")
		
'		textBoxText = LoadString("simpletextboxtext.txt")
		textBoxText = LoadString("simpletextboxhtml.txt")
		
	End

	Method OnUpdate()
		
		inp.Update()
	End
	
	Method OnRender()
		
		Cls 50,50,50
		
		font.DrawText("Testing angel fonts", DeviceWidth/2,5, AngelFont.ALIGN_CENTER)
		'font.DrawHTML("Testing angel fonts <i>Italic</i> <b>Bold <i>Both</i></b>", 5,5)		
		
		'SetColor 255,255,50
		inp.Draw(5,45)
		
'		SimpleTextBox.Draw(textBoxText,5,75,630)
'		SimpleTextBox.Draw(textBoxText,DeviceWidth()/2,75,630, AngelFont.ALIGN_CENTER)

		PushMatrix()
			Scale 0.75,0.75
'			SimpleTextBox.Draw(textBoxText,DeviceWidth(),180,1260, AngelFont.ALIGN_CENTER)
			SimpleTextBox.DrawHTML(textBoxText,426,180,832, AngelFont.ALIGN_CENTER)
		PopMatrix()

	End

	
End

Function Main()
	New AngelFontExample
End









