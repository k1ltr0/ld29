Import mojo

Class lpTween

Private
	Field _initialValue:Float = 0.0
	Field _endValue:Float = 0.0
	Field _currentValue:Float = 0.0

	Field _running:Bool = False
	Field _beginTime:Float = 0.0
	Field _time:Float = 0
	
	Field _function:Int = LINEAR
	Field _easing:Int = EASEIN

Public

	Const LINEAR:Int = 0
	Const QUAD:Int = 1
	Const CUBIC:Int = 2
	Const BACK:Int = 3
	
	Const EASEIN:Int = 0
	Const EASEOUT:Int = 1
	Const EASEINOUT:Int = 2
	
	
	Function CreateLinear:lpTween(initValue:Float, endValue:Float, time:Float)
		Return New lpTween(LINEAR, initValue, endValue, time)
	End
	
	Function CreateQuad:lpTween(easing:Int, initValue:Float, endValue:Float, time:Float)		
		Return New lpTween(QUAD, initValue, endValue, time, easing)
	End
	
	Function CreateCubic:lpTween(easing:Int, initValue:Float, endValue:Float, time:Float)		
		Return New lpTween(CUBIC, initValue, endValue, time, easing)
	End
	
	Function CreateBack:lpTween(easing:Int, initValue:Float, endValue:Float, time:Float)
		Return New lpTween(BACK, initValue, endValue, time, easing)
	End

	Method New(funct:Int,initValue:Float,endValue:Float,time:Float, easing:Int=EASEIN)
		_function = funct
		_initialValue = initValue
		_currentValue = initValue
		_endValue = endValue
		_time = time
		_easing = easing
	End
	
	Method SetEasing:Void(e:Int)
		Self._easing = e
	End
	
	Method Start:Void()
		Self._beginTime = Millisecs()
		Self._running = True
		Self._currentValue = _initialValue
	End
	
	Method SetInitialValue:Void(v:Float)
		Self._initialValue = v
		Self._currentValue = v
	End
	
	Method SetEndValue:Void(v:Float)
		Self._endValue = v
	End
	
	Method SetValues:Void(v1:Float,v2:Float)
		Self.SetInitialValue(v1)
		Self.SetEndValue(v2)
	End
	
	Method SetTime:Void(t:Float) 
		Self._time = t
	End
	
	Method Update:Void()
		
		Local currentTime:Float = 0

		If (Self._running) Then

			currentTime = Millisecs()-Self._beginTime

			Select _function
			Case LINEAR
				Self.LinearUpdate(currentTime, Self._initialValue, _endValue - _initialValue, Self._time)
			Case QUAD
				Self.QuadUpdate(_easing, currentTime, Self._initialValue, _endValue - _initialValue, Self._time)
			Case CUBIC
				Self.CubicUpdate(_easing, currentTime, Self._initialValue, _endValue - _initialValue, Self._time)
			Case BACK
				Self.BackUpdate(_easing, currentTime, Self._initialValue, _endValue - _initialValue, Self._time)
			End
		End
		
		If (currentTime >= _time) Then
			_currentValue = _endValue
			Self._running = False
		End
	End
		
	Method LinearUpdate:Void(t:Float, b:Float, c:Float, d:Float)
		_currentValue =  c*t/d + b;
	End
	
	Method QuadUpdate:Void(easing:Int, t:Float, b:Float, c:Float, d:Float)
		Select easing
		Case EASEIN
			t /= d;
			_currentValue = c*t*t + b;
		Case EASEOUT
			t /= d;
			_currentValue = -c * t*(t-2) + b;
		Case EASEINOUT
			t /= d/2;
			If (t < 1) _currentValue = c/2*t*t + b;
			t-=1;
			_currentValue = -c/2 * (t*(t-2) - 1) + b;
		End
	End 
	
	
	Method CubicUpdate:Void(easing:Int, t:Float, b:Float, c:Float, d:Float)
		Select easing
		Case EASEIN
			t /= d;
			_currentValue = c*t*t*t + b;
		Case EASEOUT
			t /= d;
			t-=1;
			_currentValue = c*(t*t*t + 1) + b;
		Case EASEINOUT
			t /= d/2;
			If (t < 1) _currentValue = c/2*t*t*t + b;
			t -= 2;
			_currentValue = c/2*(t*t*t + 2) + b;
		End
	End 
	
	Method BackUpdate:Void(easing:Int, t:Float, b:Float, c:Float, d:Float)
		Select easing
		Case EASEIN
			Local s:Float = 1.70158;
			t/=d
			_currentValue = c*(t)*t*((s+1)*t - s) + b;
		Case EASEOUT
			Local s:Float = 1.70158;
			t=t/d-1
			_currentValue = c*((t)*t*((s+1)*t + s) + 1) + b;
		Case EASEINOUT
			Local s:Float = 1.70158; 
			s*=(1.525)
			If (t < 1) Then
				t/=d/2
				_currentValue = c/2*(t*t*(((s)+1)*t - s)) + b;
			Else 
				t-=2
				_currentValue = c/2*((t)*t*(((s)+1)*t + s) + 2) + b;
			End
		End
	End 
	
	Method IsRunning:Bool()
		Return _running
	End
	
	Method GetCurrentValue:Float()
		Return _currentValue
	End
End