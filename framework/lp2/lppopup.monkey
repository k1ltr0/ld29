Import lp2.color
Import lp2.idrawable
Import lp2.lpscenemngr
Import angelfont.angelfont
Import lp2.lphudbutton

''''''' lpPopup '''''''''''
Class lpPopup Implements iDrawable

Private 

    Field clearColor:Color = Color.Black()
    Field backgroundAlpha:Float = 0.5

Public

    Method New()
        'Self.Create()
    End

    ''' set the background color by default is black
    ''' @param r:Int in rgb color definitio the red value, between 0 and 255
    ''' @param g:Int in rgb color definitio the green value, between 0 and 255
    ''' @param b:Int in rgb color definitio the red value, between 0 and 255
    Method SetClearColor:Void( r:Int, g:Int, b:Int )
        Self.clearColor.r = r
        Self.clearColor.g = g
        Self.clearColor.b = b
    End

    ''' changes the background opacity
    Method SetBackgroundAlpha:Void( v:Float )
        Self.backgroundAlpha = v
    End

    ''' @return the current alpha channel
    Method GetBakgroundAlpha:Float()
        Return Self.backgroundAlpha
    End

    ''' methods that must be implemented by the user
    Method Create:Void() Abstract
    Method Update:Void(delta:Int) Abstract
    Method Render:Void() Abstract


    ''' sets and show the current popup on the framework
    Method Show:Void()
        lpSceneMngr.GetInstance().ShowPopup(Self)
    End

    ''' hides the current popup on the framework
    Method Hide:Void()
        lpSceneMngr.GetInstance().HidePopup()
    End

End


''''''' lpDefaultPopup '''''''''''

Class lpDefaultPopup Extends lpPopup

Private

    Field text:String
    Field font:AngelFont

Public

    ''' constructor that allow to show a centered text
    Method New( t:String, f:AngelFont = Null )
        Self.text = t
        Self.font = f
    End

    ''' implement the framework methods
    Method Create:Void()
    End
    
    Method Update:Void(delta:Int)
        ''' hide the current popup
        If ( MouseHit() )
            lpHidePopup()
        End
    End

    Method Render:Void() 
        ''' if the font is setted, then show a centered text
        If ( Self.font <> Null )
            font.DrawText( Self.text, (DeviceWidth()/GetMatrix()[0])/2, (DeviceHeight()/GetMatrix()[3])/2-font.TextHeight(Self.text), AngelFont.ALIGN_CENTER )
        End
    End
End


#rem

popup as used in memorice

Class lpMemoricePopup Extends lpPopup Implements iHudButton

	Private

	    Field close:HudButton
	    Field price:HudButton
	    Field background:lpImage
	    Field booster:lpImage
		Field screenWidth:Float
		Field screenHeight:Float
		Field vpx:Float
		Field vpy:Float
	    Field theTween:lpTween
	    Field soundButton:String
		Field r:Bool = True
		Field scale_value:Float = 0.0
		Field descripcion:String = ""
		Field font:AngelFont
		
	Public
	
		Global idBooster:Int

		Const CLOCK_BOOSTER:Int = 1
		Const MOVES_BOOSTER:Int = 2
	

    ''' constructor that allow to show a centered text
    Method New(id_booster:Int, width:Float = 640, height:Float = 960, sound:String, fuente:AngelFont)
    	idBooster = id_booster
    	screenWidth = width
    	screenHeight = height
    	soundButton = sound
    	font = fuente
    	Self.Create()
    End

    ''' implement the framework methods
    Method Create:Void()
    
    	close = New HudButton("close.png", soundButton)
    	price = New HudButton("boton_sin_sombra.png", soundButton)
    	background = New lpImage("fondo_popup_compra.png", New Vector2(0,0))
    	r = True
    	
    	Select Self.idBooster
    		Case CLOCK_BOOSTER
		    	booster = New lpImage("big_clock.png", New Vector2(0,0))
		    	descripcion = "Detiene el tiempo por 5 segundos"
		    Case MOVES_BOOSTER
		    	booster = New lpImage("big_moves.png", New Vector2(0,0))
		    	descripcion = "Agrega 3 movimientos"
		End Select
		
		background.Position.X = -background.Position.Width
		background.Position.Y = screenHeight / 2 - background.Position.Height / 2
		
		booster.Position.Y = background.Position.Y + 50
		booster.Position.X = (background.Position.X + background.Position.Width) / 2 - booster.Position.Width / 2 '+ booster.Position.Width / 8
		
		close.Position.Y = background.Position.Y - close.Position.Height / 4
		close.SetListener(Self)
		
		price.Position.Y = 630
		price.SetFont(font)
		price.SetText("1.99")
		price.SetLeftPadding(-30)
		price.SetTopPadding(-5)
		
		vpx = Float(DeviceWidth())/screenWidth
		vpy = Float(DeviceHeight())/screenHeight
		
		theTween = lpTween.CreateBack(lpTween.EASEOUT, -background.Position.Width, screenWidth / 2 - background.Position.Width / 2, 500)
		
    End
    
    Method Update:Void(delta:Int)     	
        close.Update(delta)
        price.Update(delta)
    End

    Method Render:Void()
    
    	If ( r )
    		theTween.Start()
    		r = False
    	End       
        
        theTween.Update()
        
        background.Position.X = theTween.GetCurrentValue()
    	close.Position.X = background.Position.X + background.Position.Width - close.Position.Width + close.Position.Width / 4
    	booster.Position.X = (background.Position.X + background.Position.Width) / 2 - booster.Position.Width / 2 + booster.Position.Width / 10
		price.Position.X = background.Position.X + background.Position.Width / 2 - price.Position.Width / 2	
        
    	PushMatrix
    	Scale vpx, vpy
    		background.Render()
			close.Render()
			booster.Render()
			font.DrawMultilineText(descripcion, 300, theTween.GetCurrentValue() + background.Position.Width / 2, screenHeight / 2, screenWidth, AngelFont.ALIGN_CENTER)
			price.Render()
		PopMatrix
    End
    
    Method OnClick:Void(button:HudButton)
    	lpHidePopup()
    End
End

#end