
#If TARGET="android" Or TARGET="ios"

Import "native/MobileAppTracking.${TARGET}.${LANG}"

#If TARGET="android"

#Rem
follow the attached tutorial
#End

#LIBS+="${CD}/native/MobileAppTracking.android/MobileAppTracker.jar"

#ANDROID_MANIFEST_APPLICATION+="<receiver android:name=~qcom.mobileapptracker.Tracker~q android:exported=~qTrue~q><intent-filter><action android:name=~qcom.android.vending.INSTALL_REFERRER~q /></intent-filter></receiver><uses-permission android:name=~qandroid.permission.INTERNET~q /><uses-permission android:name=~qandroid.permission.ACCESS_NETWORK_STATE~q />"


#Elseif TARGET="ios"

#Rem
follow the attached tutorial
#End

#LIBS+="CoreTelephony.framework"
#LIBS+="SystemConfiguration.framework"
#LIBS+="MobileCoreServices.framework"
#LIBS+="iAd.framework"
#LIBS+="AdSupport.framework"
#LIBS+="${CD}/native/analytics.ios/GoogleAnalytics/Library/GAILogger.h"
#LIBS+="${CD}/native/analytics.ios/libGoogleAnalyticsServices.a"

#LIBS+="CoreData.framework"
#LIBS+="SystemConfiguration.framework"
'''#LIBS+="libz.dylib" ''' must be added manually


#End

Extern 

Class lpBaseMobileAppTracking
    Method Initialize:Void( advertiserId:String, conversionKey:String )
    Method IsInitialized:Bool()
    Method TrackInstall:Void()
    Method SendView:Void( viewName:String, value:Float, currency:String )
End

Public
#End


Class lpMobileAppTracking 

Private

#If TARGET="android" Or TARGET="ios"
    Global _analytics:lpBaseMobileAppTracking
#End

Public

    Function Initialize:Void( advertiserId:String, conversionKey:String )
        #If TARGET="android" Or TARGET="ios"
            _analytics = New lpBaseMobileAppTracking()
            _analytics.Initialize( advertiserId, conversionKey )
        #End 
    End
    
    Function TrackInstall:Void()
    	#If TARGET="android" Or TARGET="ios"
            _analytics.TrackInstall()
        #End 
    End
    
    Function IsInitialized:Bool()
        #If TARGET="android" Or TARGET="ios"
            Return _analytics.IsInitialized( )
        #Else
            Return False
        #End
    End
    
    #rem
    	examples:
    	
    		SendView("registration"); for user registration
    		SendView("purchase",1.99, "USD"); in app purchase
    		SendView("open"); unique opened session
    #end
    
    Function SendView:Void( viewName:String, value:Float = 0.0, currency:String = "" )
        #If TARGET="android" Or TARGET="ios"
            _analytics.SendView( viewName, value, currency )
        #End 
    End

End

