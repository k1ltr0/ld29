#Rem

this is an implementation of push notification using the server pushbots.com.
if you don't know what are you doing here, please, FUCK YOU!!

@see http://developer.android.com/google/gcm/gs.html
@see https://pushbots.com/developer


IMPORTANT:
	for android target, copy manually the folder android_push, and set ass source folder....
	right click -> buld path -> set as source folder.
	
	Also add the following line to manifest "application" as property:
	
	android:name="com.loadingplay.MyApplication" 

#End


''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''
'''''''''common implementation '''''''''
''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''
#If (TARGET<>"ios" And TARGET<>"android") Or CONFIG="debug"


' this is the common implementation, that only used for 
' documentation purpouses and for support "unsupported" targets
Class lpPushBots

	'' initialize a session on pushbots.com
	'' @param sender_id:String you can get this at http://developer.android.com/google/gcm/gs.html
	'' @param pusbots_application_id:String you can get this at https://pushbots.com/developer
	Function Init:Void(sender_id:String, pusbots_application_id:String)
		' nothing here
	End

End

#Else


''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''
'''''''''Android implementation'''''''''
''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''

Import "native/lppushbots.${TARGET}.${LANG}"

#If TARGET="android"

#Rem

You may add manually the following lines to main activity in manifest application:

of course, replacing ${ANDROID_APP_PACKAGE}, with your own package

<intent-filter>
    <action android:name="${ANDROID_APP_PACKAGE}.MESSAGE" />
    <category android:name="android.intent.category.DEFAULT" />
</intent-filter>


#End

#LIBS+="${CD}/native/Pushbots131beta.jar"

#Else



#End

Extern 

Class lpPushBots
	
	Function Init:Void(sender_id:String , pushbots_application_id:String)

End

Public

#End



#If TARGET="android"

''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''
'''''''''Android configurations'''''''''
''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''

#ANDROID_MANIFEST_MAIN+="
<!-- GCM connects to Google Services. -->
<uses-permission android:name=~qandroid.permission.INTERNET~q />
<uses-permission android:name=~qandroid.permission.ACCESS_NETWORK_STATE~q/>
<!-- GCM requires a Google account. -->
<uses-permission android:name=~qandroid.permission.GET_ACCOUNTS~q />
<uses-permission android:name=~qandroid.permission.WAKE_LOCK~q />
<uses-permission android:name=~qandroid.permission.DISABLE_KEYGUARD~q/>
<uses-permission android:name=~qandroid.permission.READ_PHONE_STATE~q />
 
<permission android:name=~q${ANDROID_APP_PACKAGE}.permission.C2D_MESSAGE~q
    android:protectionLevel=~qsignature~q />
<uses-permission android:name=~q${ANDROID_APP_PACKAGE}.permission.C2D_MESSAGE~q />
     
<!-- This app has permission To register And receive data message. -->
<uses-permission android:name=~qcom.google.android.c2dm.permission.RECEIVE~q />"


#ANDROID_MANIFEST_APPLICATION+="
<receiver android:name=~qcom.loadingplay.MyPushReceiver~q />
<receiver android:name=~q${ANDROID_APP_PACKAGE}.MyPushBotsReceiver~q></receiver>
<activity android:name=~qcom.pushbots.push.PBMsg~q/>
<activity android:name=~qcom.pushbots.push.PBListener~q/>
<receiver
android:name=~qcom.google.android.gcm.GCMBroadcastReceiver~q
android:permission=~qcom.google.android.c2dm.permission.SEND~q >
    <intent-filter>
        <!-- Receives the actual messages. -->
        <action android:name=~qcom.google.android.c2dm.intent.RECEIVE~q />
        <!-- Receives the registration id. -->
        <action android:name=~qcom.google.android.c2dm.intent.REGISTRATION~q />
        <category android:name=~q${ANDROID_APP_PACKAGE}~q />
    </intent-filter>
</receiver>
<receiver android:name=~qcom.pushbots.push.MsgReceiver~q />
<service android:name=~qcom.pushbots.push.GCMIntentService~q />
<service android:name=~qorg.openudid.OpenUDID_service~q >
    <intent-filter>
        <action android:name=~qorg.openudid.GETUDID~q />
    </intent-filter>
</service>"

#End



