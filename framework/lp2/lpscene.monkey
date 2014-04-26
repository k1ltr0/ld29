Strict 

Import idrawable
Import lpcamera

Class lpScene Implements iDrawable
Private
	Field _loadingState:Int = 1
	Field _cameras:Stack<lpCamera> = New Stack<lpCamera>()
	
	' los objetos en esta capa serán afectados por las camaras
	Field _children:List<iDrawable> = New List<iDrawable>()
	
	' los objetos en esta capa no son afectados por las camaras
	Field _gui:List<iDrawable> = New List<iDrawable>()
	
	Field _pause:Bool = False
	Field _pausegui:Bool = False

	Field _autocreate:Bool = False
	
Public

	Method RequestAutoCreate:Void( t:Bool )
		_autocreate = t
	End

	Method AutoCreate:Bool()
		Return _autocreate
	End
	

	Method Create:Void() End
	
	Method Update:Void(delta:Int)
	
		If (Not(_pause)) Then
			For Local layer:= Eachin Self._children
				layer.Update(delta)
			Next
		End
		
		If (Not(_pausegui)) Then
			For Local gui:= Eachin Self._gui
				gui.Update(delta)
			Next
		End
	End
	Method Render:Void() 
		For Local layer:= Eachin Self._children
			layer.Render()
		Next
	End
	
	Method Suspend:Void()
	End

	Method Back:Int()
		Return 0
	End
	
	' cuando retorna 0 la escena sale del estado cargando
	Method Loading:Int(delta:Int)
		Return 0
	End
	
	Method LoadingRender:Void()
	End 

	Method GetLoadingState:Int()
		Return _loadingState
	End
	
	Method SetLoadingState:Void(state:Int)
		Self._loadingState = state
	End
	
	Method AddCamera:Void(camera:lpCamera)
		_cameras.Push(camera)
	End
	
	Method GetCameras:Stack<lpCamera>()
		Return _cameras
	End
	
	Method GetChildren:List<iDrawable>()
		Return _children
	End
	
	Method GetGui:List<iDrawable>()
		Return _gui
	End
	
	Method AddChild:Void(layer:iDrawable, create:Bool = false)
		Self._children.AddLast(layer)
		
		If (create)
			layer.Create()
		EndIf
		
	End
	
	Method AddGui:Void(g:iDrawable, create:Bool = false)
		Self._gui.AddLast(g)

		If (create)
			g.Create()
		EndIf
		
	End
	
	Method Pause:Void(p:Bool)
		_pause = p
	End
	
	Method PauseGui:Void(p:Bool)
		_pausegui = p
	End
End