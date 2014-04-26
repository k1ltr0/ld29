

''''' Revmob implementation ''''
#If TARGET="android" Or TARGET="ios"
Import "native/lprevmob.${TARGET}.${LANG}"

Extern

Class lpRevmobBase

	Method Init:Void(app_id:String)

	''' create a link for "more games" button
	Method CreateAdLink:Void()
	Method LinkOpen:Void()

	''' show full screen ad
	Method CreateFullScreen:Void()
	Method ShowFullScreen:Void()

	''' testing mode

	'' enables the testing mode, 
	'' WARING: never run without testing mode if it'snt published
	'' @param f:Bool enables or disables the testing mode
	'' @param with_ads:Int indicates if the testing mode 
	''						must show the ad or don't show it
	Method SetTestingMode:Void(f:Bool, with_ads:Int)

End

#Else
''' implemented for others targets
Class lpRevmobBase

	Method Init:Void(app_id:String)End
	Method CreateAdLink:Void()End
	Method LinkOpen:Void()End
	Method CreateFullScreen:Void()End
	Method ShowFullScreen:Void()End
	Method SetTestingMode:Void(f:Bool, with_ads:Int)End

End
#End

Public

Class lpRevmob Extends lpRevmobBase
	Const WITH_ADS:Int = 0
	Const WITHOUT_ADS:Int = 1
	
End



#If TARGET="android"
''' config the manifest and libs
#LIBS+="${CD}/native/revmob-6.4.1.jar"

#ANDROID_MANIFEST_MAIN+="
	<uses-permission android:name=~qandroid.permission.ACCESS_WIFI_STATE~q/>
	<uses-permission android:name=~qandroid.permission.READ_PHONE_STATE~q/>
	<!-- Strongly recommended -->
	<uses-permission android:name=~qandroid.permission.ACCESS_NETWORK_STATE~q/>"

#ANDROID_MANIFEST_APPLICATION+="
	<activity android:name=~qcom.revmob.ads.fullscreen.FullscreenActivity~q
              android:theme=~q@android:style/Theme.Translucent~q
              android:configChanges=~qkeyboardHidden|orientation~q>
    </activity>"
#Elseif TARGET="ios"
#LIBS+="SystemConfiguration.framework"
#LIBS+="StoreKit.framework"
#LIBS+="AdSupport.framework"

'this doesn't work in current version of monkey, maybe will be implemented soon
'must import manually RevMobAds.framework
'Import "native/RevMobAds.framework"
#End