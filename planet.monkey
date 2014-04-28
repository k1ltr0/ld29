Import imports


Class Tentacle Implements iDrawable

	Field animation:lpAnimatedSprite

	Method New(n:Int)
		Self.animation = New lpAnimatedSprite("tentacle.png", Vector2.Zero(), 200, 161, 15)
		Self.animation.AddSequence("hit", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])
		Self.animation.PlaySequence("hit", 50)

		Self.animation.AddSequence("idle", [0])

		Self.animation.Position.X = 100 * Sin(n*45) - 15
		Self.animation.Position.Y = 100 * Cos(n*45) - 150

		Self.animation.SetPivot(13, 150)
		Self.animation.SetRotation( ( n - 3 ) * 45 )
	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)
		Self.animation.Update(delta)

		If ( Self.animation.GetCurrentSequenceName() = "hit" And Self.animation.IsLastFrame() )
			Self.animation.PlaySequence("idle")
		EndIf
		
	End

	Method Render:Void()
		Self.animation.Render()
	End

	Method Hit:Void()
		Self.animation.PlaySequence("hit", 20)
	End

End


Class Planet Implements iDrawable

	Field rotation:Float = 0
	Field radius:Float = 115

	Field idle_animation:lpAnimatedSprite
	Field position:Vector2

	Field hit_sound:Sound
	Field channel:Int = 0

	Field tentacles:Stack<Tentacle>

	''' time control for attack
	Field max_time:Int = 3000
	Field timer:Int = 0

	Method New()
		idle_animation = New lpAnimatedSprite("planet.png", New Vector2(0,0), 230, 230, 20)

		idle_animation.Position.X -= idle_animation.Position.Width / 2
		idle_animation.Position.Y -= idle_animation.Position.Height / 2


		idle_animation.AddSequence("rage", [10,11,12,13,14,15,16,17,18,19])
		idle_animation.AddSequence("idle", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
											1,2,3,4,5,0,1,2,3,4,5,0,0,0,0,0,0,
											0,1,2,3,4,5,0,0,0])

		idle_animation.PlaySequence("idle", 50)

		hit_sound = LoadSound("planet_hit.mp3")

		Self.position = New Vector2( DeviceWidth() * 0.5, DeviceHeight()*0.3 )

		''' init tentacles
		Self.tentacles = New Stack<Tentacle>

		For Local i:=0 Until 8
			Local t:= New Tentacle(i)

			Self.tentacles.Push(t)
		Next
		
	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)
		Local delta_secs:Float = Float(delta) / 1000.0
		
		If (KeyDown(KEY_LEFT))
			rotation -= 360 * delta_secs
		ElseIf(KeyDown(KEY_RIGHT))
			rotation += 360 * delta_secs
		EndIf

		''' animations updates
		idle_animation.Update(delta)

		For Local t:=Eachin Self.tentacles
			t.Update(delta)
		Next

		''' time control
		If ( max_time <= timer )
			Self.tentacles.Get(Rnd(0,8)).Hit()
			Self.PlayAngry()
			timer = 0
			max_time = Rnd(2000,5000)
		EndIf

		If ( idle_animation.IsLastFrame() And idle_animation.GetCurrentSequenceName() = "rage" )
			Self.idle_animation.PlaySequence("idle", 50)
		EndIf
		

		timer += delta
	End

	Method Render:Void()
		PushMatrix()
			Translate( Self.position.X, Self.position.Y ) 
			Rotate( rotation )
			DrawCircle(0,0, Self.radius)

			idle_animation.Render()

			''' tentacles
			For Local t:=Eachin Self.tentacles
				t.Render()
			Next
		PopMatrix()
	End

	Method HitByBullet:Void(bullet:Bullet)

		''' play sound
		PlaySound(hit_sound, channel)
		channel += 1
		If (channel >= 5)
			channel = 0
		EndIf

		''' shake camera
		GameScene.GetInstance().Shake(100, 5)
	End

	Method PlayAngry:Void()
		Self.idle_animation.PlaySequence("rage", 50)
	End

End