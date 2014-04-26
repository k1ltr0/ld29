Import lp2.idrawable
Import lp2.color
Import lp2.lprectangle
Import lp2.angelfont.angelfont

Import "native/eurostyle_30.fnt"
Import "native/eurostyle_30.png"
Import "native/eurostyle_14.fnt"
Import "native/eurostyle_14.png"
Import "native/eurostyle_14_black.fnt"
Import "native/eurostyle_14_black.png"

#TEXT_FILES+="|*.fnt"

Import frectangle

Class fItem Implements iDrawable

	Field TAG:Int = 0
		
Private

	Global default_font:AngelFont
	Global default_black_font:AngelFont

	Field border:Border = New Border(0,0,100,100)
	Field padding:Padding
	Field margin:Margin
	Field position:lpRectangle = New lpRectangle(0,0,100,100)
	Field background_color:Color = New Color(215, 212, 212)
	Field focus:Bool = False
	Field children:List<fItem>
	Field current_translate:Vector2
	Field apply_scissor:Bool = True

	Field mx:Float
	Field my:Float

Public
	Method New()
		Self.border = New Border(0,0,100,100)
		Self.position = New lpRectangle(0,0,100,100)
		Self.current_translate = Vector2.Zero()
	End

	Method Create:Void()
		''' TODO:insert code here
	End

	Method Update:Void(delta:Int)
		If (Not(Self.children))
			Return
		EndIf
		
		For Local c:=Eachin Self.children
			c.Update(delta)
		Next

		Self.PosUpdate(delta)
	End

	Method PosUpdate:Void(delta:Int)
		'' TODO: Insert code here
	End

	Method Render:Void()
		PushMatrix()

			''' saving auxiliar data
			Local aux_alpha:Float = GetAlpha()
			Local aux_scissor:Float[] = GetScissor()

			'''apply correction to mouse position

			Local s:String
			For Local a:=Eachin GetMatrix()
				s = s + "," + a
			Next			
			Self.GetCurrentTranslate().X = GetMatrix()[4]
			Self.GetCurrentTranslate().Y = GetMatrix()[5]

			''' drawing background
			SetAlpha(Self.GetBackground().a * aux_alpha)
			SetColor(Self.GetBackground().r,Self.GetBackground().g,Self.GetBackground().b)
			DrawRect(Self.GetPosition().X, Self.GetPosition().Y, Self.GetPosition().Width, Self.GetPosition().Height)
			SetColor(255,255,255)
			SetAlpha(aux_alpha)

			''' drawing the border
			Local bcolor:Color = Self.GetBorder().GetColor()
			Self.GetBorder().Draw(bcolor.r,bcolor.g,bcolor.b)
			

			''' apply sccissor
			If (apply_scissor)
				SetScissor(GetMatrix()[4]+Self.GetPosition().X+1,
					GetMatrix()[5]+Self.GetPosition().Y+1,
					Self.GetPosition().Width-2,
					Self.GetPosition().Height-2)
			EndIf

			''' moving item to new position
			Translate(Self.GetPosition().X, Self.GetPosition().Y)

			''' drawing all children
			For Local c:=Eachin Self.GetChildren()
				c.Render()
			Next

			Self.PosRender()

			SetScissor(aux_scissor[0],aux_scissor[1],aux_scissor[2],aux_scissor[3])


		PopMatrix()
	End

	''' allows to draw objets over all children
	Method PosRender:Void()
		''' TODO: insert code here
	End

	Method GetPosition:lpRectangle()
		Return Self.position
	End

	Method GetBorder:Border()

		Self.border.X = Self.position.X
		Self.border.Y = Self.position.Y
		Self.border.Width = Self.position.Width
		Self.border.Height = Self.position.Height

		Return Self.border
	End

	Method GetChildren:List<fItem>()
		If (Not(Self.children))
			Self.children = New List<fItem>()
		EndIf
		
		Return Self.children
	End

	Method GetBackground:Color()
		Return background_color
	End

	Method GetCurrentTranslate:Vector2()
		Return current_translate
	End

	Method EnableScissor:Void(t:Bool = True)
		Self.apply_scissor = t
	End

	Function GetDefaultFont:AngelFont()
		If (Not(fItem.default_font))
			''' loading default font
			fItem.default_font = New AngelFont()
			fItem.default_font.LoadFntFont("eurostyle_14")
		EndIf
		
		Return fItem.default_font
	End

	Function GetDefaultBlackFont:AngelFont()
		If (Not(fItem.default_black_font))
			''' loading default font
			fItem.default_black_font = New AngelFont()
			fItem.default_black_font.LoadFntFont("eurostyle_14_black")
		EndIf
		
		Return fItem.default_black_font
	End
	

End
