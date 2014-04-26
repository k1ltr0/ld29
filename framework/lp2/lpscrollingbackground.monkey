Strict

Import idrawable
Import lpimage
#Rem
Class lpScrollingBackground Implements iDrawable

Private
	
	Field position:Vector2
	Field position_aux:Vector2

	Field img:Image

	Field camera:lpCamera
Public

	Method New(image:String, camera:lpCamera)

		Self.img = lpLoadImage(image)

		Self.position_aux = New Vector2(Self.img.Width(),0)
		Self.position = New Vector2(0,0)

		Self.camera = camera
	End

	Method Create:Void()
		
	End
	
	
	' @param deltaTime is the time in milliseconds from the last actualization
	Method Update:Void(delta:Int)
				
		'If ( Self.Independent Or Factor > 0 )
		
			If position.X + Self.img.Width() < Self.camera.ViewPort.X + Self.camera.ViewPort.Width - 100
				position_aux.X = position.X + Self.img.Width()
			Endif
			If position_aux.X + Self.img.Width() < Self.camera.ViewPort.X + Self.camera.ViewPort.Width - 100
				position.X = position_aux.X + Self.img.Width()
			Endif
		'Else
		''
		''	If position.X > -2
		''		position_aux.X = position.X - Self.img.Width
		''	Endif
		''	If position_aux.X > -2
		''		position.X = position_aux.X - Self.img.Width
		''	Endif
		'End
		
	End
	
	Method Render:Void()
		
		DrawImage Self.img, position.X, position.Y
		DrawImage Self.img, position_aux.X, position_aux.Y
		
	End

End Class

#End

Class lpScrollingBackground Implements iDrawable

Private

	Field images:lpImage[]
	Field camera:lpCamera
Public

	Method New( image_name:String, camera:lpCamera )
		
		'' the camera
		Self.camera = camera
		Self.images = [New lpImage(image_name, New Vector2()),
					New lpImage(image_name, New Vector2()),
					New lpImage(image_name, New Vector2()),
					New lpImage(image_name, New Vector2())]


		Self.images[0].Position.X = Self.camera.ViewPort.X
		Self.images[1].Position.X = Self.images[0].Position.X + Self.images[0].Position.Width

	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)

		For Local i:=Eachin images
			i.Update(delta)
		Next

		If (Self.images[0].Position.X + Self.images[0].Position.Width <= Self.camera.ViewPort.X)
			Self.images[0].Position.X = Self.images[1].Position.X + Self.images[1].Position.Width
		EndIf
		If (Self.images[1].Position.X + Self.images[1].Position.Width <= Self.camera.ViewPort.X)
			Self.images[1].Position.X = Self.images[0].Position.X + Self.images[0].Position.Width
		EndIf
		
		

		#Rem
		If Self.images[0].Position.X > -2
			Self.images[1].Position.X = Self.images[0].Position.X - Self.images[0].Position.Width
		Endif
		If Self.images[1].Position.X > -2
			Self.images[0].Position.X = Self.images[1].Position.X - Self.images[0].Position.Width
		Endif
		#End
	End

	Method Render:Void()
		For Local i:=Eachin images
			'i.Render()
		Next
		
	End

End

