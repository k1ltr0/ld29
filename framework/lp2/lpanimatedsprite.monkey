Strict

Import lpimage
Import lprectangle
Import lpanimation
Import lpresources


' Show an animated object on the screen, extends the LPImage
Class lpAnimatedSprite Extends lpImage Implements ilpAnimation
	
Private

	Field _currentIndex			: Int
	Field _maxIndex				: Int
	Field _elapsedTime			: Int
	Field _sequences			: StringMap<IntStack>
	Field _currentSequence		: IntStack
	Field _lastSequenceName		: String
	Field _currentSequenceName	: String
	Field _frameTime			: Int
	Field _margin				: Float
	Field _looped				: Bool
	
	Method _initialize:Void(img:Image, position:Vector2, frames:Int, margin:Float = 0)
		Self._init(img, position)

		Self.Position.Radius = Self._img.Width() / 2
		
		Self._margin = margin
				
		Self._maxIndex = frames
		
		Self._currentIndex = 0
		Self.Pause = True
		Self._sequences = New StringMap<IntStack>()
	End

Public

	Field Pause:Bool
	
	Method New(image:String, position:Vector2, tileW:Float, tileH:Float, frames:Int, margin:Float = 0)
	
		Local img:Image = lpLoadImage( image, tileW, tileH, frames)
		
		Self._initialize( img, position, margin, frames )
	End
	
	Method New(img:Image, position:Vector2, frames:Int, margin:Float = 0)
		Self._initialize( img, position, margin, frames )
	End
	' add an animation sequence
	' @param 	name:String, name of the animation, must be unique
	' @param	seq:Int[], number vector with the numbers of each tile in the animation
	Method AddSequence:Void(name:String, seq:Int[])
		
		If (name <> _currentSequenceName) Then
		

			Local stack:IntStack = New IntStack()
			
			For Local i:Int = Eachin seq
				stack.Push(i)
			Next
			
			Self._sequences.Set(name, stack)
			
			' _currentSequenceName = name
			
		Endif
		
	End
	
	' same as PlaySequence, but this put Pause false
	Method ForcePlay:Void(name:String,  frameTime:Int = 100, looped:Bool = True)
		Self.Pause = False
		PlaySequence(name,  frameTime, looped)
	End
	
	' Search an animation sequence by the @name and play it
	' @param	name:String, name of an animation sequence
	Method PlaySequence:Void(name:String,  frameTime:Int = 100, looped:Bool = True)
	
		If ( _currentSequenceName <> name ) Then

			Self._currentSequence = Self._sequences.Get(name)
			Self._maxIndex = Self._currentSequence.Length()
			Self.Pause = False
			Self._frameTime = frameTime
			
			Self._currentSequenceName = name
			Self._lastSequenceName = name
			
			Self._currentIndex = 0
			
			Self._looped = looped
			
		Endif
	End
	
	' stop the playing sequence and back to the first frame
	Method Stop:Void()
		Self._currentIndex = 0
		Self.Pause = True
		#rem
		used in old version of lp framework
		If ( _srcPosition <> Null And _currentSequence <> Null) Then
			Self._srcPosition = _tiles.Get(Self._currentSequence.Get(_currentIndex))	
		End
		#end
	End

	' @param delta is the time in milliseconds from the last currentization
	Method Update:Void(delta:Int)
				
		If (Not(Pause)) Then
			_elapsedTime = delta + _elapsedTime
			
			If (_elapsedTime > Self._frameTime) Then
			
				If (Not(Pause)) Then
					If (Self.IsLastFrame()) Then
						Self._currentIndex = 0
					Else
						Self._currentIndex = Self._currentIndex + 1
					Endif
				Endif

				_elapsedTime = 0
	
			Endif
		Endif
		
		If ( Not( Self._looped ) ) Then
			If( Self.IsLastFrame() ) Then
				Self.Pause = True
				Self._currentIndex = _maxIndex
			End
		End
		
	End
	
	Method Render:Void()
		
		If ( Not(Self.isDestroyed) ) Then
		
			Local flipCorrection: Float = 0
			
			PushMatrix()
				
				flipCorrection = Self.Position.Width
				
				If (_rotated) Then
					flipCorrection = 0
					Translate(correctPosition.X + _rotationPivot.X, correctPosition.Y + _rotationPivot.Y)					
					Self._img.SetHandle(correctPosition.X + _rotationPivot.X, correctPosition.Y + _rotationPivot.Y)
				End
				
				If (_flipped) Then
					DrawImage( Self._img, Self.Position.X + flipCorrection, Self.Position.Y, _angle, -_scalex, _scaley, _currentSequence.Get(_currentIndex))
				Else
					DrawImage( Self._img, Self.Position.X, Self.Position.Y, _angle, _scalex, _scaley, _currentSequence.Get(_currentIndex))
				End
				
			PopMatrix()
		End
	End
	
	Method IsLastFrame:Bool()
		If ( _maxIndex - 1 = _currentIndex ) Then
			Return True
		End
		
		Return False
	End
	
End
