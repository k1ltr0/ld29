Import "native/lpapp.${TARGET}.${LANG}"


Extern
	#If TARGET="android" Then
		Function Finish:Void()="LpApp.Finish"
		
	#Else If TARGET="html5"
		Function Finish:Void()="Finish"
        Function LaunchBrowser:Void ( address:String, windowName:String )="lpLaunchBrowser"

	#Else If TARGET="xna"
        Function Finish:Void()="LpApp.Finish"

	#Else If TARGET="flash"
        Function Finish:Void()="LpApp.Finish"

	#Else If TARGET="glfw"
        Function Finish:Void()="LpApp::Finish"

	#Else If TARGET="ios"
        Function Finish:Void()="LpApp::Finish"
	#Endif
Public