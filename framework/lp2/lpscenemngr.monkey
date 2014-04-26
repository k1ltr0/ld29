Strict

Import mojo
Import idrawable
Import lpscene
Import lpcolor
Import lptween
Import lpresources
Import lppopup

Global DELTA:=60

Global LONENTERLOADING:Int = 0
Global LONLOADING:Int = 1
Global LONENTERSCENE:Int = 2
Global LONPLAYING:Int = 3

Class lpSceneMngr Extends App Implements iDrawable

	Private
		
		Field _loadingState:Int = LONENTERLOADING
		Field _loadingTween:lpTween

		Field _currentScene:lpScene
		Field _deltaTime:Int
		Field _timeLastUpdate:Int
		Field _clsColor:lpColor = lpColor.Black()
		Field _currentCamera:lpCamera
		Field _lastSceneId:Int = 0

		''' popupfield
		Field _currentPopup:lpPopup
		Field _showPopup:Bool
	
		Global _instance:lpSceneMngr
	Public
		Method OnCreate:Int()
			_instance = Self
			_loadingTween = lpTween.CreateLinear ( 0.0, 1.0, 300 )
			Local defCamera:lpCamera = New lpCamera()
			Self._currentCamera = defCamera
			
			Self.Create()

			If (_currentScene = Null) Then
				Error("Debes crear una escena, implementa 'Method GetScene:lpScene(id:Int)'")
			End
			
			If (0 >= _currentScene.GetCameras().Length()) Then
				'Print("auto camera")
				_currentScene.AddCamera(defCamera)
			EndIf		

			If (_currentScene.AutoCreate())
				Self.PostCreate()
			EndIf

			'SetUpdateRate (DELTA)
			Return 0
		End

		Method OnUpdate:Int()
			_deltaTime = Millisecs() - _timeLastUpdate
			_timeLastUpdate = Millisecs()

			If ( _loadingState = LONLOADING )
				_currentScene.SetLoadingState ( _currentScene.Loading( _deltaTime ) )
			End

			If ( _loadingState = LONPLAYING )

				''' if the popup is active, then must update the popup but don't the scene
				If ( _showPopup )
					_currentPopup.Update( _deltaTime )
				Else
					_currentScene.Update ( _deltaTime )
					Self.Update ( _deltaTime )
				End

				UpdateAsyncEvents()
			EndIf

			''' reset the values from lp class
			lpResetValues()

			Return 0
		End
		
		Method OnLoading:Int()
			
			'_currentScene.LoadingRender()
			
			Return 0
		End 

		Method OnBack:Int()
			Return _currentScene.Back()
		End
		
		Method OnSuspend:Int()
			_currentScene.Suspend()
			
			Return 0
		End
		
		Method OnRender:Int()
			Cls _clsColor.r ,_clsColor.g ,_clsColor.b


			'''' Loading ''''

			If (_loadingState = LONENTERLOADING)

				If ( Not (_loadingTween.IsRunning () ) )
					_loadingTween.Start()
				EndIf

				_loadingTween.Update()
				SetAlpha ( _loadingTween.GetCurrentValue() )
				_currentScene.LoadingRender()

				If (_loadingTween.GetCurrentValue() = 1.0)
					_loadingState = LONLOADING
				EndIf

				Return 0

			EndIf

			If (_loadingState = LONLOADING)

				If (_currentScene.GetLoadingState() <= 0)
					_loadingState = LONENTERSCENE
					_loadingTween.SetValues( 1.0, 0.0 )
				EndIf

				lpLoadToVideoMemory ()
				_currentScene.LoadingRender()

				Return 0
			EndIf

			If (_loadingState = LONENTERSCENE)

				If ( Not (_loadingTween.IsRunning () ) )
					_loadingTween.Start()
				EndIf

				_loadingTween.Update()
				SetAlpha ( _loadingTween.GetCurrentValue() )
				_currentScene.LoadingRender()

				If (_loadingTween.GetCurrentValue() = 0.0)
					_loadingState = LONPLAYING
				EndIf

				Return 0

			EndIf
			

			'''' Loading ''''
			
			For Local c:= Eachin _currentScene.GetCameras()
				PushMatrix()
				
					_currentCamera = c

					If (c.Position.Width <> c.ViewPort.Width Or c.Position.Height <> c.ViewPort.Height) Then
						'1.0052356020942408
						
						Scale(
							(c.Position.Width / c.ViewPort.Width),
							(c.Position.Height / c.ViewPort.Height))
														
						Translate(
							-( c.ViewPort.X*GetMatrix()[0] - c.Position.X) / GetMatrix()[0], 
							-( c.ViewPort.Y*GetMatrix()[3] - c.Position.Y) / GetMatrix()[3])
					Else
						Translate(
							-( c.ViewPort.X - c.Position.X) / GetMatrix()[0], 
							-( c.ViewPort.Y - c.Position.Y) / GetMatrix()[3])
					End
					
					SetScissor(c.Position.X, c.Position.Y, c.Position.Width, c.Position.Height)

					_currentScene.Render()
					Self.Render()

				PopMatrix()
			End
			
			For Local gui:= Eachin _currentScene.GetGui() 
				PushMatrix()
					SetScissor(0,0,DeviceWidth(),DeviceHeight()) 'TODO:Must eval if this is working propert
					gui.Render()
				PopMatrix()
			Next

			''' drawing the current popup
			If (_showPopup)
				PushMatrix()
					SetAlpha _currentPopup.GetBakgroundAlpha()
					SetColor 0,0,0
					DrawRect ( 0,0,DeviceWidth()*3,DeviceHeight()/GetMatrix()[3] )
					SetColor 255,255,255
					SetAlpha 1.0
					_currentPopup.Render()
				PopMatrix()
			EndIf
			

			Return 0
		End

		Method SetLoadingScreen:Void( loadingScreen:lpLoadingScreen )

			self._loadingScreen = loadingScreen
			
		End
		
		Method SetScene:Void(id:Int)

			If (_lastSceneId <> id)
				'Print "lpFreeMemory"
				lpFreeMemory()
			EndIf

			_lastSceneId = id

			_loadingState = LONENTERLOADING
			_loadingTween.SetValues ( 0.0, 1.0 )
			_loadingTween.Start ()

			_currentScene = GetScene(id)
			
			Local defCamera:lpCamera = New lpCamera()
			Self._currentCamera = defCamera
			
			_currentScene.Create()
			
			If (0 >= _currentScene.GetCameras().Length()) Then
				'Print("auto camera")
				_currentScene.AddCamera(defCamera)
			End
		End		
		
		Method GetCurrentCamera:lpCamera()
			Return _currentCamera
		End

		' metodos heredables
		
		''' abstract must be implemented by user, must return the current scen
		''' @param	id:Int  unique identifier for each scene
		''' @return lpScene current scene to show on top of screen
		Method GetScene:lpScene(id:Int) Abstract
		
		Method PostCreate:Void()
			For Local l:= Eachin  _currentScene.GetChildren()
				l.Create()
			Next
			
			For Local l:= Eachin  _currentScene.GetGui()
				l.Create()
			Next
		End
		
		Method SetClsColor:Void(r:Int,g:Int,b:Int)
			_clsColor = New lpColor(r,g,b)
		End
		
		' metodos que se pueden sobreescribir
		Method Create:Void() End
		Method Update:Void(delta:Int) End
		Method Render:Void() End

		' metodo que se debe implementar para la logica de las escenas
		Method GetCurrentScene:lpScene() Abstract


		''' sets the current popup field
		''' @param p:lpPopup  the pop up will be setted
		Method SetPopup:Void( p:lpPopup )
			Self._currentPopup = p
		End

		''' show the current popup, if this is'nt setted, will instantiate a default popup
		''' @param p:lpPopup = Null   if this value is null then will shoe the popup setted with @see SetPopup
		Method ShowPopup:Void( p:lpPopup = Null )
			If (p <> Null)
				Self.SetPopup( p )
			EndIf
			Self._showPopup = True
		End


		''' hide the current showing popup
		Method HidePopup:Void()
			Self._showPopup = False
		End
		

		' acceso global del singleton
		Function GetInstance:lpSceneMngr()
			Return _instance
		End
End