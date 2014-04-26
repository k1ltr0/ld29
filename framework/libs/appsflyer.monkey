

#If TARGET="android"

Import "native/appsflyer.android.java"

#Rem

follow the guide
http://support.appsflyer.com/attachments/token/ut987ra4l7ppwa5/?name=AF-Android-Integration-Guide-v1.3.16.0v2.pdf

#End


#ANDROID_MANIFEST_APPLICATION+="
        <receiver
            android:name=~qcom.appsflyer.MultipleInstallBroadcastReceiver~q
            android:exported=~qtrue~q >
            <intent-filter>
                <action android:name=~qcom.android.vending.INSTALL_REFERRER~q />
            </intent-filter>
        </receiver>
"

#LIBS+="${CD}/native/AF-Android-SDK-v1.3.16.0.jar"


Extern

    Class lpAppsFlyer

        Function SendTracking:Void( appid:String )

    End

Public

#Else


Class lpAppsFlyer

    Function SendTracking:Void( appid:String )
        ''' not implemented
    End
        
End

#End