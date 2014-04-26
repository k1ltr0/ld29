
#If TARGET="android"

Import "native/lpadcolony.${TARGET}.${LANG}"

#LIBS+="${CD}/native/adcolony.jar"


#ANDROID_MANIFEST_APPLICATION+="<activity android:name=~qcom.jirbo.adcolony.AdColonyOverlay~q
          android:configChanges=~qkeyboardHidden|orientation|screenSize~q
          android:theme=~q@android:style/Theme.Translucent.NoTitleBar.Fullscreen~q />
        <activity android:name=~qcom.jirbo.adcolony.AdColonyFullscreen~q
          android:configChanges=~qkeyboardHidden|orientation|screenSize~q
          android:theme=~q@android:style/Theme.Black.NoTitleBar.Fullscreen~q />
        <activity android:name=~qcom.jirbo.adcolony.AdColonyBrowser~q 
          android:configChanges=~qkeyboardHidden|orientation|screenSize~q
          android:theme=~q@android:style/Theme.Black.NoTitleBar.Fullscreen~q />"
          
          
Extern

Class lpAdColonyBase
	
	Method Init:Void(app_id:String, zone_id:String[])
	Method IsAvailable:Bool(zone_id:String)
  	Method ShowV4VC:Void(zone_id:String)
  	Method ShowVideo:Void(zone_id:String)

End

#Else

Class lpAdColonyBase
	
	Method Init:Void(app_id:String, zone_id:String[])
	End
	
	Method IsAvailable:Bool(zone_id:String)
	End
	
  	Method ShowV4VC:Void(zone_id:String)
  	End
  	
  	Method ShowVideo:Void(zone_id:String)
  	End

End

#End



