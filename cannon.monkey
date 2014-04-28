Import imports

Class Bullet Implements iDrawable

	Const SPEED:Int = 20

	Field rotation:Float = 0
	Field position:Vector2

	Field the_planet:Planet

	Field radius:Float = 10.0


	Const STATE_FIRED:Int = 0
	Const STATE_IDLE:Int = 1
	Const STATE_EXPLODE:Int = 2

	Field state:Int = STATE_IDLE

	Field animation:lpAnimatedSprite

	Method New(planet:Planet)
		position = New Vector2()
		position.X = DeviceWidth()/2
		position.Y = DeviceHeight()

		Self.the_planet = planet

		Self.animation = New lpAnimatedSprite( "bullet.png", Vector2.Zero(), 211, 31, 6 )
		Self.animation.AddSequence( "shot", [0] )
		Self.animation.AddSequence( "explode", [0,1,2,3,4,5] )

		Self.animation.PlaySequence( "shot" )
	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)

		Self.animation.Update(delta)

		Select state
			Case STATE_FIRED
				position.X += SPEED * Sin( rotation )
				position.Y += SPEED * Cos( rotation )

				Local max:Float = Self.radius + Self.the_planet.radius

				Local ca:Float = Pow( Self.position.X - Self.the_planet.position.X, 2 )
				Local co:Float = Pow( Self.position.Y - Self.the_planet.position.Y, 2 )

				Local d:Float = Sqrt( ca + co )

				If ( d <= max )
					Self.the_planet.HitByBullet(Self, 1)
					Self.state = STATE_EXPLODE
					Self.animation.PlaySequence("explode", 24)
				EndIf
			Case STATE_IDLE
			Case STATE_EXPLODE
				'state = STATE_IDLE

				If (Self.animation.IsLastFrame())
					Self.animation.PlaySequence("shot")
					state = STATE_IDLE

					'''reset position
					position.X = DeviceWidth()/2
					position.Y = DeviceHeight()
				EndIf
		End

		Self.animation.Position.X = position.X - Self.animation.Position.Width * 0.45
		Self.animation.Position.Y = position.Y - Self.animation.Position.Height * 0.7
		
	End

	Method Render:Void()
		'DrawCircle( Self.position.X, Self.position.Y, Self.radius)
		Self.animation.Render()
	End

	Method Shot:Void()
		state = STATE_FIRED
	End

End


Class Cannon Implements iDrawable

	Field rotation:Float = 180.0
	Field position:lpRectangle

	Const ROTATE_SPEED:Float = 20.0

	Field bullet_stack:Stack<Bullet>

	Field index:Int = 0

	Field the_planet:Planet 

	Field cannon_animation:lpAnimatedSprite

	Field shot:Bool = False

	Field shot_sound:Sound
	Field channel:Int = 6

	Method New(planet:Planet)
		Self.position = New lpRectangle(DeviceWidth()/2,DeviceHeight()+20,50,100)
		Self.bullet_stack = New Stack<Bullet>()

		Self.the_planet = planet

		For Local i:= 0 Until 10
			Local b:= New Bullet(Self.the_planet)

			Self.bullet_stack.Push(b)
		Next

		Self.cannon_animation = New lpAnimatedSprite("weapon.png", Vector2.Zero(), 100, 135, 5)
		Self.cannon_animation.AddSequence("idle", [0])
		Self.cannon_animation.AddSequence("shot", [0,1,2,3,4])

		Self.cannon_animation.PlaySequence("idle")
		Self.cannon_animation.SetPivot(Self.cannon_animation.Position.Width / 2, 
										Self.cannon_animation.Position.Height * 0.56)

		Self.cannon_animation.Position.X = -65

		Self.cannon_animation.SetRotation( 180 )

		Self.shot_sound = LoadSound("shot.mp3")
	End

	Method Shot:Void()
		If (Self.shot)
			Return 
		EndIf
		
		PlaySound(Self.shot_sound, channel)
		channel += 1

		If (channel >= 10)
			channel = 6
		EndIf

		''' shake camera
		GameScene.GetInstance().Shake(30, 5)
		

		Self.bullet_stack.Get(index).position.X = DeviceWidth()/2
		Self.bullet_stack.Get(index).position.Y = DeviceHeight() + 20

		Self.bullet_stack.Get(index).rotation = Self.rotation
		Self.bullet_stack.Get(index).Shot()

		index += 1
		If (index >= 10)
			index = 0
		EndIf

		Self.cannon_animation.PlaySequence("shot", 40)
		Self.shot = True
		
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

		If (Self.shot)
			If (Self.cannon_animation.IsLastFrame())
				Self.shot = False

				Self.cannon_animation.PlaySequence("idle")
			EndIf
		EndIf

		''' update animation
		Self.cannon_animation.Update(delta)
	End

	Method Render:Void()

		For Local b:=Eachin bullet_stack
			b.Render()
		Next

		PushMatrix()
			Translate(Self.position.X , Self.position.Y) 
			Rotate( rotation )

			Self.cannon_animation.Render()
		PopMatrix()
		
	End

End