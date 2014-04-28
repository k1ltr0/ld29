Import imports


Class Tentacle Implements iDrawable

	Field animation:lpAnimatedSprite
	Field static_animation:lpAnimatedSprite

	Field nth:Int = 0
	Field weak_position:Vector2

	Const STATE_IDLE:Int = 0
	Const STATE_WEAK:Int = 1

	Field state:Int = STATE_IDLE

	Method New(n:Int)

		Self.nth = n

		Self.static_animation = New lpAnimatedSprite("tentacle_static.png", Vector2.Zero(), 194, 60, 6)
		Self.static_animation.AddSequence("a", [0,1,2,3,4,5])
		Self.static_animation.PlaySequence("a")

		Self.animation = New lpAnimatedSprite("tentacle.png", Vector2.Zero(), 200, 161, 15)
		Self.animation.AddSequence("hit", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])
		Self.animation.AddSequence("idle", [0])

		Self.animation.PlaySequence("idle")

		Self.weak_position = New Vector2( 110 * Sin(nth * 45), 110 * Cos(nth * 45) )

		Self.animation.Position.X = 100 * Sin(nth*45) - 15
		Self.animation.Position.Y = 100 * Cos(nth*45) - 150

		Self.static_animation.Position.X = 105 * Sin(nth*45) - 10
		Self.static_animation.Position.Y = 105 * Cos(nth*45) - 35

		Self.animation.SetPivot(13, 150)
		Self.animation.SetRotation( ( n - 3 ) * 45 )

		Self.static_animation.SetPivot(11, 35)
		Self.static_animation.SetRotation( ( n - 2 ) * 45 )
	End

	Method Create:Void()
	End

	Method Update:Void(delta:Int)

		If (state = STATE_WEAK)
			Self.static_animation.Update(delta)
		EndIf
		
		Self.animation.Update(delta)

		If (state <> STATE_WEAK)
			If ( Self.animation.GetCurrentSequenceName() = "hit" And Self.animation.IsLastFrame() )
				state = STATE_WEAK
				Self.animation.PlaySequence("idle")
			EndIf
		EndIf
		

		''' recalculate positions
		Self.animation.Position.X = (Planet._instance.radius - 15) * Sin(nth*45) - 15
		Self.animation.Position.Y = (Planet._instance.radius - 15) * Cos(nth*45) - 150

		Self.static_animation.Position.X = (Planet._instance.radius - 10) * Sin(nth*45) - 10
		Self.static_animation.Position.Y = (Planet._instance.radius - 10) * Cos(nth*45) - 35
	End

	Method Render:Void()
		Self.animation.Render()
		If (state = STATE_WEAK)
			Self.static_animation.Render()
		EndIf

		If (state = STATE_WEAK)
			'DrawCircle(Self.weak_position.X, Self.weak_position.Y, 20)
		EndIf
	End

	Method Hit:Void()
		Self.animation.PlaySequence("hit", 20)
	End

	Method HitBy:Void()
		state = STATE_IDLE

		Planet._instance.radius -= 40
	End

End


Class Planet Implements iDrawable

	Field rotation:Float = 0
	Field radius:Float = 115
	Field current_scale:Float = 1.0

	Field velo1:Int = 0
	Field velo2:Int = 0
	Field timer2:Float = 0
	Field upp: Int=1 

	Field end_animation:lpAnimatedSprite
	Field idle_animation:lpAnimatedSprite
	Field position:Vector2

	Field bear_sound:Sound
	Field hit_sound:Sound
	Field channel:Int = 0

	Field tentacles:Stack<Tentacle>

	''' time control for attack
	Field max_rnd:Int = 3000
	Field max_time:Int = 3000
	Field timer:Int = 0

	Field max_time_pain:Int = 500
	Field timer_pain:Int = 0

	Field feeling_pain:Bool = False

	Global _instance:Planet

	Field lose:Bool = False


	Method New()
		Planet._instance = Self

		end_animation = New lpAnimatedSprite("end.png", Vector2.Zero(), 230,230, 10)
		end_animation.AddSequence("idle", [0,1,2,3,4,5,6,7,8,9])
		end_animation.Position.X = DeviceWidth() / 2 - end_animation.Position.Width / 2
		end_animation.Position.Y = DeviceHeight() / 2 - end_animation.Position.Height / 2
		end_animation.PlaySequence("idle")

		idle_animation = New lpAnimatedSprite("planet.png", New Vector2(0,0), 230, 230, 20)

		idle_animation.Position.X -= idle_animation.Position.Width / 2
		idle_animation.Position.Y -= idle_animation.Position.Height / 2


		idle_animation.AddSequence("rage", [10,11,12,13,14,15,16,17,18,19])
		idle_animation.AddSequence("idle", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
											1,2,3,4,5,0,1,2,3,4,5,0,0,0,0,0,0,
											0,1,2,3,4,5,0,0,0])

		idle_animation.PlaySequence("idle", 50)

		hit_sound = LoadSound("planet_hit.mp3")
		bear_sound = LoadSound("alien.mp3")

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

		If (Self.lose)
			end_animation.Update(delta)

			If (KeyHit(KEY_SPACE) Or MouseHit())
				BeneathTheSurface.GetInstance().SetScene(1)
			EndIf
			
			Return
		EndIf
		


		'''' rotation
		If(30 <= timer2)	
			'If (KeyDown(KEY_LEFT))
				If( KeyHit(KEY_LEFT))
					timer2=0
					upp = 1
				End
					
			
				'rotation -= Clamp(-5+ 5.0/1000*timer2,-5.0,5.0)
					
					
			'Elseif(KeyDown(KEY_RIGHT))
				If( KeyHit(KEY_RIGHT))
					timer2=0
					upp = 2
				End
				
				'rotation -= Clamp(+5 - 5.0/1000*timer2,-5.0,5.0)
			
			'Endif
	  
	  
	  		If(Not(KeyDown(KEY_LEFT)) And Not(KeyDown(KEY_RIGHT)) And upp = 1 )
				rotation -=  Clamp(-5+ 5.0/1000*timer2,-5.0,5.0)
			Elseif(Not(KeyDown(KEY_LEFT)) And Not(KeyDown(KEY_RIGHT)) And upp = 2 )
				rotation -= Clamp(+5 - 5.0/1000*timer2,-5.0,5.0)
			End		
	  		
	  	End	
	  	''' end rotation
		
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
			If (Self.tentacles.Get(Rnd(0,8)).state <> Tentacle.STATE_WEAK)
				Self.tentacles.Get(Rnd(0,8)).Hit()
				Self.PlayAngry()

				Self.radius += 40
			EndIf

			timer = 0
			max_time = Rnd(500,max_rnd)
			max_rnd -= 5
		EndIf

		If ( idle_animation.IsLastFrame() And idle_animation.GetCurrentSequenceName() = "rage" )
			Self.idle_animation.PlaySequence("idle", 50)
		EndIf

		If ( Self.feeling_pain )

			Self.timer_pain += delta

			If (Self.timer_pain >= max_time_pain)
				Self.timer_pain = 0
				Self.feeling_pain = False
			EndIf
		End

		timer2 += delta
		timer += delta


		If (Self.radius >= 315)
			Self.lose = True
			GameScene._instance.Lose()
			idle_animation.PlaySequence("rage", 30)
			idle_animation.SetScale(1.0)

			idle_animation.Position.X = DeviceWidth() / 2 - idle_animation.Position.Width / 2
			idle_animation.Position.Y = DeviceHeight() / 2 - idle_animation.Position.Height / 2
		EndIf
		
	End

	Method Render:Void()

		If (Self.lose)

			SetColor 0,0,0
			DrawRect(0,0,DeviceWidth(),DeviceHeight())
			SetColor 255,255,255

			end_animation.Render()

			Return
		EndIf
		

		current_scale = Self.radius / 115

		idle_animation.Position.X = -115 * (current_scale)
		idle_animation.Position.Y = -115 * (current_scale)
		idle_animation.SetScale(current_scale)

		PushMatrix()
			If (Self.feeling_pain)
				If ( Int(Self.timer_pain * 0.01) Mod 2 = 0 )
					SetColor(255,0,0)
				EndIf
			End
				
			Translate( Self.position.X, Self.position.Y ) 
			Rotate( rotation )
			DrawCircle(0,0, Self.radius)

			idle_animation.Render()

			''' tentacles
			For Local t:=Eachin Self.tentacles
				t.Render()
			Next

			SetColor(255,255,255)
		PopMatrix()
	End

	Method HitByBullet:Void(bullet:Bullet, nth:Int)

		If (Self.tentacles.Get(nth).state <> Tentacle.STATE_IDLE)
			Self.tentacles.Get(nth).HitBy()

			PlaySound( Self.bear_sound )

			Self.feeling_pain = True
		Else
			''' play sound
			PlaySound(hit_sound, channel)
			channel += 1
			If (channel >= 5)
				channel = 0
			EndIf
		End

		''' shake camera
		GameScene.GetInstance().Shake(100, 5)
	End

	Method PlayAngry:Void()
		Self.idle_animation.PlaySequence("rage", 50)
	End

End