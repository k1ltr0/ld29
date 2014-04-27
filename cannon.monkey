Import imports

Class Bullet Implements iDrawable

	Const SPEED:Int = 20

	Field rotation:Float = 0
	Field position:Vector2

	Field fired:Bool = False

	Method New()
		position = New Vector2()
		position.X = 0
		position.Y = DeviceHeight()
	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)
		If (fired)
			position.X += SPEED * Sin( rotation )
			position.Y += SPEED * Cos( rotation )
		EndIf
	End

	Method Render:Void()
		DrawCircle( position.X, position.Y, 10)
	End

	Method Shot:Void()
		fired = True
	End

End


Class Cannon Implements iDrawable

	Field rotation:Float = 130.0
	Field position:lpRectangle

	Const ROTATE_SPEED:Float = 20.0

	Field bullet_stack:Stack<Bullet>

	Field index:Int = 0

	Method New()
		Self.position = New lpRectangle(0,DeviceHeight(),50,100)
		Self.bullet_stack = New Stack<Bullet>()

		For Local i:= 0 Until 10
			Local b:= New Bullet()

			Self.bullet_stack.Push(b)
		Next
		
	End

	Method Shot:Void()
		Self.bullet_stack.Get(index).position.X = 0
		Self.bullet_stack.Get(index).position.Y = DeviceHeight()

		Self.bullet_stack.Get(index).rotation = Self.rotation
		Self.bullet_stack.Get(index).Shot()

		index += 1
		If (index >= 10)
			index = 0
		EndIf
		
	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)
		Local delta_secs:Float = Float(delta) / 1000.0
		
		If (KeyDown(KEY_D))
			rotation -= ROTATE_SPEED * delta_secs
		ElseIf(KeyDown(KEY_A))
			rotation += ROTATE_SPEED * delta_secs
		EndIf

		If (KeyHit(KEY_SPACE))
			Self.Shot()
		EndIf
		


		For Local b:=Eachin bullet_stack
			b.Update(delta)
		Next
		
	End

	Method Render:Void()
		PushMatrix()
			Translate(Self.position.X , Self.position.Y) 
			Rotate( rotation )
			DrawRect(-Self.position.Width/2,0,Self.position.Width,Self.position.Height)
		PopMatrix()

		For Local b:=Eachin bullet_stack
			b.Render()
		Next
		
	End

End