Strict

'Import lp.all
Import lp2.color
Import lp2.particlesystem.particle
Import lp2.idrawable
Import lp2.lprectangle
Import lp2.lpimage
'Import lp2.lpResources

' Clase que genera un emisor de particulas
Class ParticleEmitter Implements iDrawable
Private
	Field _tail:Stack<Particle>
	Field _unused:Stack<Particle>

	Field _counter:Float = 0.0

	Field _imgURI:String

	Field _maxAllocations:Int = 0

	''' updater enabled
	Field _updaterEnabled:Bool = False
	Field _updater:iParticleUpdater

	Field autoEmit:Bool = False
	
	Method _addParticle:Void()
	
		Local c:Color 
			
		If (ColorStack.Length() > 0) Then
			c = ColorStack.Get(Rnd(0,ColorStack.Length()))
		Else
			c = Self.BaseColor
		End

		Local positionX:Int = 0
		Local positionY:Int = 0

		If (self.EmitterType = ParticleEmitter.TYPE_CIRCLE)
			positionX = Rnd(Position.X-Radius/2, Position.X+Radius/2)
			positionY = Rnd(Position.Y-Radius/2, Position.Y+Radius/2)
		Else
			positionX = Rnd(Position.X, Position.X+Position.Width)
			positionY = Rnd(Position.Y, Position.Y+Position.Height)
		EndIf

		_unused.Push(
					New Particle(
						positionX, 
						positionY,
						Rnd(minParticleRadius, maxParticleRadius),
						c,
						LifeTime,
						Force.X,
						Force.Y,
						AlphaChannel,
						Self,
						New Vector2(Rnd(xminVelocity, xmaxVelocity),Rnd(yminVelocity, ymaxVelocity)),
						ColorType,
						ParticleType,
						DrawableImage))
	End

	Method _recycle:Void()

		If (_unused.Length() > 0)
			Local c:Color 
			
			If (ColorStack.Length() > 0) Then
				c = ColorStack.Get(Rnd(0,ColorStack.Length()))
			Else
				c = Self.BaseColor
			End

			Local positionX:Int = 0
			Local positionY:Int = 0

			If (self.EmitterType = ParticleEmitter.TYPE_CIRCLE)
				positionX = Rnd(Position.X-Radius/2, Position.X+Radius/2)
				positionY = Rnd(Position.Y-Radius/2, Position.Y+Radius/2)
			Else
				positionX = Rnd(Position.X, Position.X+Position.Width)
				positionY = Rnd(Position.Y, Position.Y+Position.Height)
			EndIf
			
			Local p : Particle = _unused.Get(0)

			p.Position.X = positionX
			p.Position.Y = positionY

			p.Radius = Rnd(minParticleRadius, maxParticleRadius)
			p.color = c
			'p.Velocity = New Vector2(Rnd(xminVelocity, xmaxVelocity),Rnd(yminVelocity, ymaxVelocity))
			p.Velocity.X = Rnd(xminVelocity, xmaxVelocity)
			p.Velocity.Y = Rnd(yminVelocity, ymaxVelocity)
			p.DrawableImage = DrawableImage
			p.LifeTime = LifeTime
			p.type = ParticleType
			p.Forcex = Force.X
			p.Forcey = Force.Y
			p.InitAlpha = AlphaChannel
			p.ColorType = Self.ColorType
			p.ParentEmitter = Self
			p.RotationSpeed = Rnd( Self.RotationSpeedMin, Self.RotationSpeedMax )
			p.FadeInOut = Self.FadeInOut
			
			If (p.DrawableImage <> Null) Then
				p._scale = (p.Radius*2)/p.DrawableImage.Position.Width
			End

			'''here with the other option
			If ( _updaterEnabled ) Self._updater.SetParticle ( p )

			p._life = p.LifeTime

			_tail.Push(p)
			_unused.Remove(0)
		EndIf
	End
	

Public

	Global TYPE_CIRCLE:Int = 0
	Global TYPE_SQUARE:Int = 1
	
	Global COLOR_RANDOM:Int = 0
	Global COLOR_LINEAL:Int = 1
	' alpha minimo
	Field AlphaChannel:Float = 1.0
	' delta tiempo que demora el emisor en crear nuevas particulas, en milisegundos
	Field SpanTime:int = 100
	' cantidad de particulas que se crear�n cada vez que se cumpla particles.SpanTime
	Field SpanAmount: Float = 10
	' Radio en el que se generar�n las particulas
	Field Radius : Float = 25
	' tamano minimo de cada particula
	Field minParticleRadius:Float = 5
	' tamano maximo de cada particula
	Field maxParticleRadius:Float = 15
	
	Field ColorType:Int = ParticleEmitter.COLOR_RANDOM

	' rangos de velocidad de movimiento de las particulas
	Field yminVelocity:Float = 0
	Field ymaxVelocity:Float = 0	
	Field xminVelocity:Float = 0
	Field xmaxVelocity:Float = 0
	
	' tiempo de vida de la particula
	Field LifeTime : Float = 500
	
	' en html5 no funcionan bien las particulas con imagenes, asi que se usan cuadrados o circulos
	' porspuesto, tambi�n se puede usar cuadrados o circulos en otras plataformas.
	' Pero los cuadrdados son mas baratos que los circulos
	Field DrawableImage: lpImage
	
	' color base de las particulas
	Field BaseColor:Color
	'Field Position:Vector2
	Field ParticleType:Int = Particle.TYPE_CIRCLE
	Field ColorStack:Stack<Color>
	
	' agrego una fuerza a las particulas
	Field Force:Vector2
	
	
	''' Field Emit:Bool = True @deprecated
	Field Position:lpRectangle

	Field EmitterType:Int = ParticleEmitter.TYPE_CIRCLE

	''' according to monkey blendeing this must be AlphaBlend  or AdditiveBlend
	Field blend:Int = AdditiveBlend

	''' speed rotation: degrees over seconds
	Field RotationSpeedMin:Float = 0
	Field RotationSpeedMax:Float = 0

	Field FadeInOut:Bool = False
	
	' Constructor por defecto
	' @param img uri con la imagen que se usar� para las particulas
	Method New(img:Image = Null, PRELOADED:Int = 0)
		DrawableImage 	= Null

		Self.SetMaxAllocations(PRELOADED)
		Self.Create()
	End

	' Create
	Method Create:Void()
		Position 		= New lpRectangle(0,0,0,0)
		Self.BaseColor 	= Color.White()
		_tail 			= New Stack<Particle>()
		_unused 		= New Stack<Particle>()
		ColorStack 		= New Stack<Color>()
		Force 			= Vector2.Zero()
	End

	Method DisableUpdater:Void()
		_updaterEnabled = False
	End

	Method SetUpdater:Void( updater:iParticleUpdater )
		_updaterEnabled = True
		_updater = updater
	End
	
	Method GetMaxAllocations:Int()
		Return Self._maxAllocations
	End

	Method SetMaxAllocations:Void(maxAllocation:Int)

		'' max disponible allocations
		self._maxAllocations = maxAllocation
		If (maxAllocation <= 0)
			Return
		EndIf

		_unused.Clear()
		_tail.Clear()

		'' adding necesary particles
		For Local i:Int=0 Until self._maxAllocations
			_addParticle()
		Next

	End


	'' enable or disable autoEmit flag
	'' @param	a:Bool must be true to enable autoEmit
	Method SetAutoEmit:Void ( a:Bool )
		autoEmit = a
	End

	'' query to the status of autoEmit flag
	'' @Return 		Bool true if the autoEmit flag is enabled
	Method IsAutoEmitEnabled:Bool ()
		Return autoEmit
	End

	' emiit particles with :
	' @param	amount:Int amount of particles to emit
	Method Emit:Void ( amount:Int = -1 )
		If (amount = -1) amount = self.SpanAmount
			
		For Local i:=0 Until amount
			_recycle()
		Next
	End

	' Update
	' @param delta delta de tiempo en milisegundos
	Method Update:Void(delta:Int)

		''' validate that the maxAllocation ammount to be more than 0
		If (_maxAllocations <= 0)
			Error ( "you must use SetMaxAllocations() to set allocation number" )
			Return;
		EndIf

		If ( Self.autoEmit ) Then
			_counter += delta

			If _counter >= SpanTime Then
				Self.Emit ()
				_counter = 0
			End
		End
		
		For Local i:= 0 Until _tail.Length()
			
			Local current_particle:Particle = _tail.Get(i)
			current_particle.Update(delta)
			
			If ( _updaterEnabled ) _updater.Update( current_particle, delta )
			
			If (_tail.Get(i).LifeTime <= 0) Then

				_unused.Push(current_particle)
				_tail.Remove(i)

				i -= 1
			End
		Next

	End

	' Render
	Method Render:Void()

		'Super.Render()
		PushMatrix()
			SetBlend ( blend )
			SetColor(Self.BaseColor.r,Self.BaseColor.g,Self.BaseColor.b)
			
			For Local t:= Eachin _tail
				t.Render()
			Next
			SetBlend ( AlphaBlend )
			SetAlpha(1.0)
		PopMatrix()
		SetColor(255,255,255)
	End


'''' Json generation
Private
	Method AddNumber:String(tag_name:String, tag_value:Float, add_comma:Bool )
        Local out_json:String = ""
        out_json += "~q" + tag_name + "~q:" + tag_value
        If (add_comma)
            out_json+=","
        EndIf
        
        Return out_json
    End

Public


	#Rem
	JSON Sample
	{
    "max_allocations": 10,
    "auto_emmit": 1,
    "aplha_cannel": 1,
    "span_time": 100,
    "span_amount": 5,
    "radius": 20,
    "min_particle_radius": 5,
    "max_particle_radius": 15,
    "y_min_velocity": 0,
    "y_max_velocity": 0,
    "x_min_velocity": 0,
    "x_max_velocity": 0,
    "life_time": 1000,
    "color_type": 0,
    "blending": 1,
    "use_image": 0,
    "position": {
        "x": 480,
        "y": 320,
        "width": 0,
        "height": 0
    },
    "color_stack": [
        {
            "r": 222,
            "g": 184,
            "b": 135
        },
        {
            "r": 255,
            "g": 165,
            "b": 79
        },
        {
            "r": 238,
            "g": 154,
            "b": 73
        },
        {
            "r": 238,
            "g": 118,
            "b": 33
        },
        {
            "r": 255,
            "g": 127,
            "b": 36
        }
    ],
    "particle_type": 0
}
	#End
	
	Method LoadFromJson:Void(json_string:String)
		Local json_object:JSONObject = JSONObject(JSONData.ReadJSON(json_string))
		Local json_position:JSONObject = JSONObject(json_object.GetItem("position"))
		Local json_color_stack:JSONArray = JSONArray(json_object.GetItem("color_stack"))

		Self.SetMaxAllocations(json_object.GetItem("max_allocations"))

		If json_object.GetItem("auto_emmit") = 1
			Self.SetAutoEmit(True)
		Else
			Self.SetAutoEmit(False)
		End

		If (json_object.GetItem("fade_inout") = 1)
			Self.FadeInOut = True
		Else
			Self.FadeInOut = False
		EndIf
		

		Self.AlphaChannel = json_object.GetItem("aplha_cannel")
		Self.SpanTime = json_object.GetItem("span_time")
		Self.SpanAmount = json_object.GetItem("span_amount")
		Self.Radius = json_object.GetItem("radius")
		Self.minParticleRadius = json_object.GetItem("min_particle_radius")
		Self.maxParticleRadius = json_object.GetItem("max_particle_radius")
		Self.yminVelocity = json_object.GetItem("y_min_velocity")
		Self.ymaxVelocity = json_object.GetItem("x_min_velocity")
		Self.xminVelocity = json_object.GetItem("x_min_velocity")
		Self.xmaxVelocity = json_object.GetItem("x_max_velocity")

		Self.LifeTime = json_object.GetItem("life_time")
		Self.ColorType = json_object.GetItem("color_type")
		Self.BaseColor = Color.White()

		Self.Position.X = json_position.GetItem("x")
		Self.Position.Y = json_position.GetItem("y")
		Self.Position.Width = json_position.GetItem("width")
		Self.Position.Height = json_position.GetItem("height")

		Self.ParticleType = json_object.GetItem("particle_type")
		'Self.FadeInOut = json_object.GetItem("fade_inout")

		Self.blend = json_object.GetItem("blending")

		For Local json_color:=Eachin json_color_stack.values
			Local json_color_obj:JSONObject = JSONObject(json_color)
			Self.ColorStack.Push(new Color(json_color_obj.GetItem("r"),
										json_color_obj.GetItem("g"),
										json_color_obj.GetItem("b")))
		Next
		
	End

	'' return the current config as json file
    '' @return String as json formatted string
    Method GetJsonString:String()
        #Rem
        Json string sample

        s{
            "aaa": "aaaa",
            "un_numero": 1
        }
        #End
        
        Local base_boolean:Int = 0
        Local out:String = "{" '' open json class

        ''' adding every config
        out += Self.AddNumber("max_allocations", Self.GetMaxAllocations(), True)

        ''' SetAutoEmit
        If Self.IsAutoEmitEnabled() base_boolean = 1
        out += Self.AddNumber( "auto_emmit", base_boolean, True)

        out += Self.AddNumber( "aplha_cannel", Self.AlphaChannel, True)
        out += Self.AddNumber( "span_time", Self.SpanTime, True)
        out += Self.AddNumber( "span_amount", Self.SpanAmount, True)
        out += Self.AddNumber( "radius", Self.Radius, True)
        out += Self.AddNumber( "min_particle_radius", Self.minParticleRadius, True)
        out += Self.AddNumber( "max_particle_radius", Self.maxParticleRadius, True)
        out += Self.AddNumber( "y_min_velocity", Self.yminVelocity, True)
        out += Self.AddNumber( "y_max_velocity", Self.ymaxVelocity, True)
        out += Self.AddNumber( "x_min_velocity", Self.xminVelocity, True)
        out += Self.AddNumber( "x_max_velocity", Self.xmaxVelocity, True)
        out += Self.AddNumber( "life_time", Self.LifeTime, True)
        out += Self.AddNumber( "color_type", Self.ColorType, True)
        out += Self.AddNumber( "blending", Self.blend, True )

        If (Self.FadeInOut)
        	out += Self.AddNumber( "fade_inout", 1, True )
        Else
        	out += Self.AddNumber( "fade_inout", 0, True )
        EndIf

        ''' use image
        If (Self.DrawableImage = Null) base_boolean = 0
        out += Self.AddNumber( "use_image", base_boolean, True )

        ''' position
        out += "~qposition~q:"
        out += "{ ~qx~q:"
        out += Self.Position.X+",~qy~q:"
        out += Self.Position.Y+", ~qwidth~q:"
        out += Self.Position.Width+", ~qheight~q:"
        out += Self.Position.Height+"}"
        out += ","


        ''' color stack
        out += "~qcolor_stack~q:["
        For Local color:=Eachin Self.ColorStack
            If Self.ColorStack.Get(0) <> color
                out += ","
            End

            out += "{~qr~q:"+color.r+", ~qg~q:"+color.g+", ~qb~q:"+color.b+"}"
        Next
        out +="],"
        

        out += Self.AddNumber( "particle_type", Self.ParticleType, False)

        ''' color stack
        out += "}" '' close json class tag

        Return out

    End
	
End
