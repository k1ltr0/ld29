Import lp2.lpscenemngr
Import lp2.form.fpanel
Import lp2.form.fbutton

''' must be added *.fnt for loading angelfonts
#TEXT_FILES="*.txt|.xml|*.json|*.fnt"

Class FormScene Extends lpScene Implements ifButton

	Field loading_step:Int = 0

	Field font:AngelFont
	
	Method OnStateChange:Void(button:fButton, state:Int)
		Print state
	End

	Method OnClick:Void(button:fButton)
		Print "click"
	End
	
	Method Loading:Int(delta:Int)

		If (loading_step = 0)

			Self.font = New AngelFont()
			Self.font.LoadFntFont("eurostyle_14")
		
			''' loading ui elements ''''
			Local panel:fVerticalList = New fVerticalList(40,40,300,fPanel.AUTO)
			Local down_panel_1:fDownPanel = New fDownPanel(0,0,300,100)
			Local down_panel_2:fDownPanel = New fDownPanel(0,200,300,100)
			Local down_panel_3:fDownPanel = New fDownPanel(0,200,300,100)
			Local test_button:fButton = New fButton(20,30,200,50)
			Local test_button_1:fButton = New fButton(20,40,200,50)

			test_button.AddListener(Self)
			test_button.SetText("este es un test")
			test_button.GetLabel().SetFont(Self.font)

			test_button_1.AddListener(Self)
			test_button_1.SetText("otro texto")
			test_button_1.TAG = 1
			test_button_1.GetLabel().SetFont(Self.font)

			down_panel_1.GetChildren().AddLast( test_button )
			down_panel_2.GetChildren().AddLast( test_button_1 )

			panel.GetChildren().AddLast( down_panel_1 )
			panel.GetChildren().AddLast( down_panel_2 )
			panel.GetChildren().AddLast( down_panel_3 )

			Self.AddGui(panel)
		End

		loading_step -= 1

		Return loading_step
	End

End

Class MyGame Extends lpSceneMngr

	Method Create:Void()
		SetScene(0)
		SetUpdateRate(60)
	End

	Method Update:Void(delta:Int)
		Super.Update(delta)
	End

	Method GetScene:lpScene(id:Int)
		Return new FormScene
	End

End


Function Main:Int()
	New MyGame
	Return 0
End
