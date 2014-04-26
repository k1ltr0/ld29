Strict

'Import lp.all
Import lp2.color
Import lp2.particlesystem.particleemitter
Import lp2.lpimage


'' interface for particle setter.
Interface iParticleUpdater

	'' configure an particle
	'' @param particle:Particle 	current particle
	Method SetParticle:Void ( particle:Particle )

	'' update a particle
	'' @param particle:Particle 	current particle
	'' @param delta:Int 			Delta time in millisecs
	Method Update:Void( particle:Particle, delta:Int )
End

' Clase privada, no usar.
Class Particle Implements iDrawable
	
	Const TYPE_CIRCLE:Int = 0
	Const TYPE_SQUARE:Int = 1
	
	Field ColorType:Int = ParticleEmitter.COLOR_RANDOM
	
	Field ParentEmitter:ParticleEmitter
	
	'Field correctPosition : Rectangle = New Rectangle(0,0,0,0)

	Field Radius : Float
	
	Field Forcex: Float = 0
	Field Forcey: Float = 0
	
	Field Velocity:Vector2 = Vector2.Zero()
	
	Field Angle:Float = 0
	Field RotationSpeed:Float = 0
	Field FadeInOut:Bool = True
	Field InitAlpha:Float = 1.0
	Field LifeTime: Float = 0
	Field DrawableImage:lpImage
	
	Field _alpha: Float = 1.0
	Field _life : Float
	Field _scale:Float = 1.0
	
	Field color:Color
	
	Field type:Int = 0
	
	Field Position:lpRectangle

	Method New(x:Float, y:Float, rad:Float, c:Color, lt:Float, forcex:Float, forcey:Float, alpha:Float, parent: ParticleEmitter, vel:Vector2 = Vector2.Zero(), colorT:Int = ParticleEmitter.COLOR_RANDOM, t:Int = TYPE_CIRCLE, img:lpImage = Null)
		Self.Position = New lpRectangle(0,0,0,0)
		Self.Position.X = x
		Self.Position.Y = y
		Self.Radius = rad
		Self.Velocity = vel
		Self.color = c
		Self.LifeTime = lt
		Self._life = lt
		
		Self.type = t
		
		Self.DrawableImage = img
		Self.InitAlpha = alpha
		
		Self.Forcex = forcex
		Self.Forcey = forcey
		
		If (Self.DrawableImage <> Null) Then
			Self._scale = (rad*2)/Self.DrawableImage.Position.Width
		End
		
		Self.ColorType = colorT
		Self.ParentEmitter = parent

		'Print "Particle Allocation"
	End
	
	Method Create:Void()
	End
	
	
	Method Update:Void(delta:Int)
		Local deltaSecs:Float = Float(delta) / 1000.0
		
		Self.Position.X += Velocity.X * deltaSecs
		Self.Position.Y += Velocity.Y * deltaSecs
		
		Velocity.X += Forcex * deltaSecs
		Velocity.Y += Forcey * deltaSecs
		
		If ( Forcex <> 0 ) Then Forcex -= Forcex * deltaSecs
		If ( Forcey <> 0 ) Then Forcey -= Forcey * deltaSecs
		
		Self.LifeTime -= delta
		
		If ( Not ( Self.FadeInOut ) )
			Self._alpha = Self.InitAlpha * ( Self.LifeTime / Self._life )
		Else
			Local hlife:Float = Self._life * 0.5
			If ( Self.LifeTime > hlife )
				Self._alpha = ((_life * InitAlpha) / LifeTime) - Self.InitAlpha
			Else
				Self._alpha = Self.InitAlpha * ( Self.LifeTime / hlife )
			End
		End

		'''Self._alpha = Clamp( Self._alpha, 0.0, Self.InitAlpha )

		If ( RotationSpeed <> 0 )
			Self.Angle += RotationSpeed * deltaSecs
		End
	End

	Method Render:Void()
		PushMatrix()
			If (Self.ColorType = ParticleEmitter.COLOR_RANDOM) Then
				SetColor(color.r,color.g,color.b)
			Else
				Local colorIndex:Int = Self.LifeTime / ( Self._life / Self.ParentEmitter.ColorStack.Length() )
				
				colorIndex = Max(0, Min(colorIndex, ParentEmitter.ColorStack.Length() - 1))
				
				Local col:= ParentEmitter.ColorStack.Get(colorIndex)
				SetColor(col.r,col.g,col.b)
			End
			
			SetAlpha(_alpha)
			
			If (Self.DrawableImage = Null) Then
				If ( type = Particle.TYPE_CIRCLE )
					DrawCircle(Position.X, Position.Y, Radius)
				Else
					DrawRect(Position.X-Radius, Position.Y-Radius, Radius * 2, Radius * 2)
				End
			Else
				''' DrawImage(Self.DrawableImage, (Position.X-Radius)/_scale, (Position.Y-Radius)/_scale, Self.Angle, _scale, _scale )
				Scale ( _scale, _scale )
				Self.DrawableImage.SetRotation ( Self.Angle )
				Self.DrawableImage.Position.X = (Position.X-Radius)/_scale
				Self.DrawableImage.Position.Y = (Position.Y-Radius)/_scale
				Self.DrawableImage.Render ()
			End

			SetAlpha(1.0)
		PopMatrix()
	End
End
