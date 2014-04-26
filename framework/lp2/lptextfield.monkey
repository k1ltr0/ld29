Import lp2.idrawable
Import lp2.angelfont.angelfont
Import lp2.lprectangle
Import lp2.lpimage
Import lp2.lppopup

''' interface for click litening from HudButton
Interface iTextField

    Method OnChange:Void( textField:TextField )
    Method OnEnterPress:Void( textField:TextField )
    'Method OnKeyDown:Void( textField:TextField, keycode:Int )

End


Class lpTextFieldPopup Extends lpPopup

Private

    Field initial_position_x:Int = 0
    Field initial_position_y:Int = 0

    Field vx_size:Float
    Field vy_size:Float

    Field fx:Float
    Field fy:Float

    Field text_field:TextField

    Field is_showing:Bool = False

Public

    ''' instantiate a popup that must be used only on android
    ''' @param tf:TextField the text field that would be manipulated
    Method New(tf:TextField, vx_size:Float, vy_size:Float)
        Super.New()
        Self.text_field = tf

        Self.initial_position_x = Self.text_field.Position.X
        Self.initial_position_y = Self.text_field.Position.Y

        Self.vx_size = vx_size
        Self.vy_size = vy_size

        Self.fx = DeviceWidth() / Self.vx_size
        Self.fy = DeviceHeight()/ Self.vy_size
    End
    
    ''' methods that must be implemented by the user
    Method Create:Void() 
    End

    Method Update:Void(delta:Int) 
        Self.text_field.Update(delta)
    End

    Method Render:Void() 
        PushMatrix()
            Scale(Self.fx, Self.fy)
            ''' render the text field
            Self.text_field.Render()
        PopMatrix()
    End

    Method Show:Void()
        Super.Show()

        Self.fx = DeviceWidth() / Self.vx_size
        Self.fy = DeviceHeight()/ Self.vy_size

        Self.initial_position_x = Self.text_field.Position.X
        Self.initial_position_y = Self.text_field.Position.Y

        Self.text_field.Position.Y = 20
        Self.text_field.Position.X = Self.vx_size / 2 - Self.text_field.Position.Width / 2

        Self.is_showing = True
    End
    
    Method Hide:Void()
        Super.Hide()
        Self.text_field.Position.X = Self.initial_position_x
        Self.text_field.Position.Y = Self.initial_position_y

        Self.is_showing = False
    End

    Method IsShowing:Bool()
        Return Self.is_showing
    End
    

End


Class TextField Implements iDrawable

Private 

    Field id:Int
    Field font:AngelFont

    Field password_enabled:Bool = False
    Field password_skin:String
    Field text:String

    '' cursor
    Global count:Int = 0
    Field cursorPos:Int = 0

    Field showCursor:Bool = True
    Field cursorTimer:Int = 0

    Const CURSOR_TIME:Int = 500
    Const cursorWidth:Int = 2
    
    Field cursorHeight:Int
    Field heightOffset:Int

    Field padding_x:Int = 5
    Field padding_y:Int = 5
    Field padding_w:Int = 5
    Field padding_h:Int = 5

    Field focusOwner:Bool = False
    Field requestFocus:Bool = False

    Field performClick:Bool = False

    Field background_image:lpImage
    Field place_holder:String

    ''' listener
    Field listener:iTextField

    Field popup:lpTextFieldPopup

    Field border_color:Color = New Color(127,127,127)
    Field selected_color:Color = New Color(0,0,255)

    Field text_color:Color = New Color(255,255,255)

Public

    Field Position:lpRectangle

    Method New( theFont:AngelFont, defaultText:String = "" )
        Self.font = theFont
        Self.cursorHeight = Self.font.height
        Self.text = defaultText

        Self.Position = New lpRectangle( 0,0,200,Self.cursorHeight+(padding_y+padding_h) )
        Self.Create()
    End

    Method New( theFont:AngelFont, x:Float, y:Float, w:Float, h:Float, defaultText:String = "" )
        Self.font = theFont
        Self.cursorHeight = Self.font.height
        Self.text = defaultText

        Self.Position = New lpRectangle ( x, y, w+padding_x+padding_w, h+padding_y+padding_h )
        Self.Create()
    End

    Method Create:Void()
        #If TARGET="android" Or TARGET="ios"
            Local camera:lpCamera = lpSceneMngr.GetInstance().GetCurrentCamera()
            Self.popup = New lpTextFieldPopup(Self, camera.ViewPort.Width, camera.ViewPort.Height)
            Self.popup.SetBackgroundAlpha(0.8)
        #End
    End

    Method Update:Void( delta:Int )

        If ( requestFocus )
            requestFocus = False
            Self.focusOwner = True
        End

        If ( focusOwner )
            ''' timer
            cursorTimer += delta
            Local asc:Int = GetChar()

            If ( cursorTimer >= CURSOR_TIME )
                cursorTimer = 0
                showCursor = Not(showCursor)
            End

            ''' recalc enter event
            If (KeyHit( KEY_ENTER ) Or asc = 13)
                #If TARGET="android"
                    Self.popup.Hide()
                    DisableKeyboard()
                    Self.focusOwner = False
                #End
                If ( Self.listener ) Self.listener.OnEnterPress( Self )
            EndIf
            
            ''' update listener OnKeyDown event
            'If ( GetChar() <> 0 )
            '    If ( Self.listener ) Self.listener.OnKeyDown( Self, GetChar() )
            'End

            ''' update the cursor and streaming reading
            If Self.Validate( asc )
                text = text[0..cursorPos]+String.FromChar(asc)+text[cursorPos..text.Length]
                cursorPos += 1

                ''' perform change listener
                If (Self.listener) Self.listener.OnChange( Self )
            Else
                Select asc
                    Case 8
                        If cursorPos > 0    'And text.Length > 0
                            text = text[0..cursorPos-1]+text[cursorPos..text.Length]
                            cursorPos -= 1

                            ''' perform change listener
                            If (Self.listener) Self.listener.OnChange( Self )
                        Endif
                    Case 13
                        'Case KEY_LEFT, 65573
                    Case 65573
                        cursorPos -= 1
                        If cursorPos < 0 cursorPos = 0
                        'Case KEY_RIGHT, 65575
                    Case 65575
                        cursorPos += 1
                        If cursorPos > text.Length cursorPos = text.Length
                End
            Endif
        Endif

        If (MouseHit())
            performClick = True
        EndIf
        
    End

    Method Validate:Bool( asc:Int )
        Return asc > 31 And asc < 127
    End

    Method Render:Void()

        ''' saves the current matrix
        PushMatrix ()

        ''' detect the cursor position
        If (Self.focusOwner = True And MouseDown())
            Local mx:Float = MouseX() / GetMatrix()[0]
            Local my:Float = MouseY() / GetMatrix()[3]

            If ( Self.Position.IsPointInside( mx, my ) )
                Local str:Int[]
                Local cnt:Int = 0
                Local sbuilder:String = ""

                If (password_enabled)
                    str = password_skin.ToChars()
                Else
                    str = Self.text.ToChars()
                EndIf


                For Local chr:= EachIn str
                    sbuilder += String.FromChar(chr)

                    If (mx <= Self.Position.X + padding_x + Self.font.TextWidth(sbuilder) )
                        cursorPos = cnt
                        Continue
                    End
                    cnt += 1

                    cursorPos = cnt
                Next
            End
        End

        ''' recalc the focus state
        If ( performClick )

            Local mx:Float = MouseX() / GetMatrix()[0]
            Local my:Float = MouseY() / GetMatrix()[3]

            If ( Self.Position.IsPointInside( mx, my ) )
                Self.focusOwner = True

                Local str:Int[]
                Local cnt:Int = 0
                Local sbuilder:String = ""

                If (password_enabled)
                    str = password_skin.ToChars()
                Else
                    str = Self.text.ToChars()
                EndIf


                For Local chr:= EachIn str
                    sbuilder += String.FromChar(chr)

                    If (mx <= Self.Position.X + padding_x + Self.font.TextWidth(sbuilder) )
                        cursorPos = cnt
                        Continue
                    End
                    cnt += 1

                    cursorPos = cnt
                Next
                
                ''' code only for android and ios
                #If TARGET="android" Or TARGET="ios"
                If (Not(Self.popup.IsShowing()))
                    Self.popup.Show()
                End
                EnableKeyboard()
                #End
            Else
                Self.focusOwner = False
                #If TARGET="android" Or TARGET="ios"
                If (Self.popup.IsShowing())
                    Self.popup.Hide()
                   DisableKeyboard()
                End
                #End
            End

            performClick = False
        EndIf

        If (Not(background_image))
            '''  drawing background
            SetColor 255,255,255
            DrawRect ( Self.Position.X, Self.Position.Y, Self.Position.Width, Self.Position.Height )
        Else
            ''' setting background to fill the field
            Local sx:Float = Self.Position.Width / Self.background_image.Position.Width
            Local sy:Float = Self.Position.Height / Self.background_image.Position.Height

            Self.background_image.SetScale(sx, sy)

            Self.background_image.Position.X = Self.Position.X
            Self.background_image.Position.Y = Self.Position.Y
            Self.background_image.Render()
        EndIf

        ''' drawing border
        Local aux_alpha:Float = GetAlpha()
        If (focusOwner)
            SetAlpha(Self.selected_color.a)
            Self.Position.Draw( Self.selected_color.r,Self.selected_color.g, Self.selected_color.b )
        Else
            SetAlpha(Self.border_color.a)
            Self.Position.Draw( Self.border_color.r,Self.border_color.g, Self.border_color.b )
        EndIf
        SetAlpha(aux_alpha)

        ''' drawing text
        SetScissor( (Self.Position.X+padding_x) * GetMatrix()[0], (Self.Position.Y+padding_y) * GetMatrix()[3], (Self.Position.Width-padding_w*2) * GetMatrix()[0], (Self.Position.Height-padding_h*2) * GetMatrix()[3] )

        If (Self.text.Length() <= 0)
            SetAlpha(0.3)
            Self.font.DrawItalic ( Self.place_holder, Self.Position.X + padding_x, Self.Position.Y + padding_y )
            SetAlpha(1.0)
        EndIf

        If ( Position.X + padding_x + font.TextWidth(text[..cursorPos]) >= Self.Position.X + Self.Position.Width-(padding_w+padding_x) )
            Translate( (Self.Position.X + Self.Position.Width-(padding_w+padding_x)) - (Position.X + padding_x + font.TextWidth(text[..cursorPos])), 0 )
        EndIf
        

        SetColor ( text_color.r, text_color.g, text_color.b )

        If (Self.password_enabled)

            Self.password_skin = ""

            For Local i:=0 Until Self.text.Length()
                Self.password_skin += "*"
            Next
            
            Self.font.DrawText ( Self.password_skin, Self.Position.X + padding_x, Self.Position.Y + padding_y )
        Else
            Self.font.DrawText ( Self.text, Self.Position.X + padding_x, Self.Position.Y + padding_y )
        EndIf
        

        ''' drwing cursor
        If Self.showCursor And focusOwner
            SetColor 0,0,0
            
            If (password_enabled)
                DrawRect Position.X + padding_x + font.TextWidth(password_skin[..cursorPos]),Position.Y + padding_y + heightOffset,cursorWidth,cursorHeight
            Else
                DrawRect Position.X + padding_x + font.TextWidth(text[..cursorPos]),Position.Y + padding_y + heightOffset,cursorWidth,cursorHeight
            EndIf
        End

        SetScissor ( 0,0,DeviceWidth(),DeviceHeight() )

        ''' reset the color
        SetColor 255,255,255

        ''' rescue the old matrix
        PopMatrix()
    End

    Method SetId:Void( id:Int )
        Self.id = id
    End

    Method GetId:Int()
        Return Self.id
    End

    Method SetText: Void ( t:String )
        Self.text = t
    End

    Method GetText:String ()
        Return Self.text
    End    

    Method SetListener:Void( l:iTextField )
        Self.listener = l
    End
    
    Method GetListener:iTextField ()
        Return Self.listener
    End

    Method SetFocus:Void( b:Bool )
        Self.requestFocus = b

        If (Not(b))
            focusOwner = False
        EndIf
        
    End

    ''' add a background image, replacing the plain color background and the border
    ''' @param bg:lpImage   image to laod as background
    Method SetBackgroundImage:Void(bg:lpImage)
        Self.background_image = bg
        Self.selected_color.a = 0.0
        Self.border_color.a = 0.0
    End

    ''' add a background image, replacing the plain color background and the border
    ''' @param bg:STring   path to image to laod as background
    Method SetBackgroundImage:Void(bg:String)
        Self.background_image = New lpImage(bg, New Vector2(Self.Position.X, Self.Position.Y))
        Self.selected_color.a = 0.0
        Self.border_color.a = 0.0
    End

    ''' set the padding for scissor algorithm
    ''' @param p:Int padding in pixels will be apply to every edge
    Method SetPadding:Void(p:Int)
        Self.padding_x = p
        Self.padding_y = p
        Self.padding_w = p
        Self.padding_h = p
    End

    ''' set the padding for scissor algorithm
    ''' @param left:Int
    ''' @param top:Int
    ''' @param right:Int
    ''' @param bottom:Int
    Method SetPadding:Void(left:Int, top:Int, right:Int, bottom:Int)
        Self.padding_x = left
        Self.padding_y = top
        Self.padding_w = right
        Self.padding_h = bottom
    End

    ''' set a place holder text, to show while the text is empty
    ''' @param s:String     string to set as place holder
    Method SetPlaceHolder:Void(s:String)
        Self.place_holder = s
    End
    
    ''' enables or diseable password
    ''' @param b:Bool   if this is true, then the text field will show only "*"
    Method SetPasswordEnabled:Void(b:Bool = True)
        Self.password_enabled = b
    End
    
    Method GetBorderColor:Color()
        Return Self.border_color
    End

    Method GetSelectedColor:Color()
        Return Self.selected_color
    End

    Method SetTextColor:Void(r:Float, g:Float, b:Float)
        text_color.r = r
        text_color.g = g
        text_color.b = b
    End

    Method MoveCursorTo:Void(cursor_position:Int)
        If (cursor_position = -1)
            cursorPos = Self.text.Length()
        Elseif(cursor_position > Self.text.Length())
            cursorPos = Self.text.Length()
        Elseif(cursor_position > 0 And cursor_position < Self.text.Length())
            cursorPos = cursor_position
        End
    End

End


'''  a field that only accept numbers
Class NumericField Extends TextField

Private

    Field number:Float
    Field stepSize:Float = 1.0

    Field lastx:Int = 0
    Field moving:Bool = False

Public

    Method New( theFont:AngelFont, defaultText:String = "" )
        Super.New ( theFont, defaultText )
    End

    Method Update:Void(delta:Int)
        Super.Update( delta )

        If ( Self.focusOwner  )
            If (KeyHit(KEY_UP))
                Self.StepUp()
            Elseif (KeyHit(KEY_DOWN))
                Self.StepDown()
            End
        End

        ''' moving event
        If (moving)
            If (Not(MouseDown()))
                moving = False
            EndIf
            
            Local n:Int = lastx - MouseX()

            If (n < 0)
                Self.StepUp()
            Elseif(n>0)
                Self.StepDown()
            End

            lastx = MouseX()
        EndIf
        
    End

    Method Render:Void()
        Super.Render()

        If (Self.focusOwner)
            If ( MouseDown() And Self.Position.IsPointInside( MouseX()/GetMatrix()[0], MouseY() / GetMatrix()[3] ) )
                Self.moving = True
            End
        EndIf        
        
    End

    Method Validate:Bool( asc:Int )
        Return asc > 44 And asc < 58
    End

    Method SetNumber:Void( n:Float )
        Self.text = "" + n
        Self.number = n
    End

    Method GetNumber:Float ()
        Self.number = Float ( Self.text )
        Return Self.number
    End

    Method SetStep:Void( s:Float ) 
        Self.stepSize = s
    End

    Method GetStep:Float()
        Return Self.stepSize
    End

    Method StepUp:Void()
        ''' intel processors have a bug adding float numbers multiplying the entire ecuation by
        ''' an int casted to float it could be resolved
        Local p:Float = 1.0 / Self.stepSize
        Self.text = "" + (Self.GetNumber () * p + Self.stepSize * p) / p

        If (Self.listener) Self.listener.OnChange( Self )
    End

    Method StepDown:Void()
        ''' intel processors have a bug adding float numbers multiplying the entire ecuation by
        ''' an int casted to float it could be resolved
        Local p:Float = 1.0 / Self.stepSize
        Self.text = "" + (Self.GetNumber () * p - Self.stepSize * p) / p

        If (Self.listener) Self.listener.OnChange( Self )
    End


End
